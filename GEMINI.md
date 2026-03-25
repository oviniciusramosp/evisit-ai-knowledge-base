# eVisit UI - Gemini Rules

> This file is the Google Gemini equivalent of CLAUDE.md. For the full knowledge base, see CLAUDE.md and docs/ai/.

## 1. Project Overview

eVisit UI is a React 17 + TypeScript telehealth frontend built on Create React App (react-scripts 5). It serves multiple sub-apps: provider, patient, admin, video, login, registration, onboarding, front door, and QTC. Node.js >= 22, Yarn package manager.

**Key constraint: React 17** -- do not use React 18 features (createRoot, useId, automatic batching).

---

## 2. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 17, TypeScript 5.9+ (strict) | CRA 5, baseUrl is `src` |
| Routing | React Router 6.27 | `react-router-dom` |
| State (server) | RTK Query | `createApi` + `fetchBaseQuery` |
| State (client) | Redux Toolkit `createSlice` | `configureStore` |
| Forms | React Hook Form + Yup | `@hookform/resolvers` |
| UI Library | MUI v5 | `@mui/x-data-grid-pro`, `@mui/x-date-pickers-pro` |
| CSS-in-JS | styled-components v5 | **Always import from `styled-components/macro`** |
| Icons | Font Awesome Pro (local) | duotone, light, solid |
| i18n | i18next + react-i18next | 16 locales, flat keys |
| Testing | Jest + React Testing Library 12 + MSW v1 | jest-axe, fishery factories |
| Dates | Luxon (`DateTime`) | Never use native Date or Moment |
| Realtime | Pusher.js, SignalR | WebSocket events |
| Video | Twilio Video | With `@twilio/video-processors` |
| Storybook | Storybook 8 | Chromatic for visual regression |

**Version warnings:**
- MSW **v1** -- do not use v2 APIs. Handler format: `rest.get(url, (req, res, ctx) => ...)`
- styled-components **v5** -- do not use v6 APIs. Transient props use `$` prefix.
- MUI **v5** -- do not use MUI v6 APIs.

---

## 3. Restricted Imports

| DO NOT import | Instead use |
|---|---|
| `render` from `@testing-library/react` | `render` from `ev-test/test-utils` |
| `useDispatch`, `useSelector` from `react-redux` | `useAppDispatch`, `useAppSelector` from `ev-store/redux` |
| `useTranslation`, `Trans` from `react-i18next` | `useTranslation`, `Trans` from `ev-i18n` |
| `useNavigate` from `react-router-dom` | `useAppNavigate` from `ev-hooks/navigate` |
| `styled-components` (bare) | `styled-components/macro` |
| `@mui/material` (barrel) | Individual imports (e.g., `@mui/material/Grid`) |
| `@mui/material/Typography` | `ev-components/Text` |
| `btoa`/`atob` globals | `ev-utils/base64.ts` |

---

## 4. Component Patterns

### Arrow Functions Only

```tsx
// CORRECT
const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  return <div>...</div>;
};

// WRONG - never use function declarations or React.FC
```

**Banned types:** `React.FC`, `React.FunctionComponent`, `React.PropsWithChildren`.

### forwardRef Pattern

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { ... });
Button.displayName = 'Button';
```

### Barrel Exports

Every component folder has an `index.ts`:
```tsx
export * from './MyComponent';
export { default } from './MyComponent';
```

### Props and data-testid

- Define props as separate `type` or use enums for variants.
- All interactive elements **must** have a `data-testid` attribute.

### JSX Conventions (ESLint enforced)

- Sort props alphabetically, shorthand last: `<Button disabled id="x" label="Y" open />`
- No curly braces for string props: `<Button id="x" />` not `<Button id={"x"} />`
- Boolean shorthand: `<Dialog open />` not `<Dialog open={true} />`

---

## 5. Import Order (Prettier enforced)

1. External libraries (`react`, `lodash`)
2. `@fullcalendar/*`
3. `@mui/*`
4. `@fortawesome/*`
5. `ev-*` packages (bare, e.g., `ev-store`)
6. `ev-*` deep imports (e.g., `ev-store/redux`)
7. `app-*` imports
8. Relative imports (`./`, `../`)

---

## 6. Styling Rules

- **Use `styled-components/macro`** for CSS-in-JS (never bare `styled-components`).
- **Use `EVColors`** from `ev-theme/styles` for all colors. Never hardcode hex values.
- **Use `ev-components/Text`** instead of `@mui/material/Typography`.
- Transient props use `$` prefix: `$isMobile`, `$color`.
- MUI `sx` prop is acceptable for inline MUI component styles.
- Use MUI theme custom breakpoints: `mobile: 0`, `tablet: 744`, `desktop: 1024`.

### Design Tokens

| Token | Source | Usage |
|---|---|---|
| Colors | `EVColors` from `ev-theme/styles` | All color values (cerulean, asphalt, cobalt, etc.) |
| Typography | `Text.*` from `ev-components/Text` | Title, Subtitle, Body, Caption, etc. |
| Breakpoints | `BreakPoints` from `ev-static/breakpoints` | Mobile: 744px, Tablet: 1024px |
| Focus style | `box-shadow: 0px 0px 0px 2px ${EVColors.cobalt}, 0px 0px 0px 4px ${EVColors.selectedHover}` | All focus-visible states |

For full token reference, see `docs/ai/design-tokens.md`.

---

## 7. Internationalization (i18n)

- **All user-visible strings MUST be wrapped with `t()`** from `useTranslation()` (from `ev-i18n`).
- ESLint rule `i18next/no-literal-string` enforces this.
- **`nt()`** -- "no-translate" identity wrapper for strings in tests/stories that satisfy the ESLint rule.
- Never use `i18n.t()` globally -- always use the hook.
- Flat key format (`keySeparator: false`, `nsSeparator: false`).

---

## 8. State Management

### RTK Query (server state)

```tsx
const withEndpoint = api.injectEndpoints({
  endpoints: builder => ({
    getItem: builder.query<ResponseType, ParamsType>({
      query: params => ({ url: `${Base.V3}/endpoint`, method: 'GET' }),
      transformResponse: transformFn,
      providesTags: [Tags.SomeTag],
    }),
  }),
});
```

- API organized by domain in `ev-api/core/<domain>/` with files: `index.ts`, `params.ts`, `responses.ts`, `transformers.ts`.
- Base paths: `Base.V2`, `Base.V3`, `Base.V4`, `Base.Sch`.
- Auth token sent via `Secure-Authentication-Token` header.
- Tag-based cache invalidation via `Tags` enum.

### Redux Slices (UI state)

- Use `createSlice` from Redux Toolkit.
- All actions re-exported from `ev-store/actions.ts`.
- Use `useAppDispatch` and `useAppSelector` from `ev-store/redux`.

### React Context

Used for: alert, dialog, toast, analytics, layout, mobile, environment, common data (current user/practice).

---

## 9. Testing Patterns

- **Use `test()` not `it()`** (enforced by `jest/consistent-test-it`).
- **Use `render` from `ev-test/test-utils`** -- wraps with all providers.
- **Use MSW v1** for API mocking. Handlers in `ev-test/request-handlers/`.
- **Use `fishery` factories** for test data in `ev-test/test-mocks/api-response/`.
- **Use `waitForRequest()`** to assert API calls.
- **Use `validateAccessibility()`** for a11y testing (jest-axe).
- **Use `screen.findBy*`** (async) for elements after render; `screen.getBy*` for immediate.
- Jest timeout: 15000ms. `asyncUtilTimeout`: 5000ms.
- RTK Query cache reset between tests via `store.dispatch(api.util.resetApiState())`.
- Coverage thresholds: 70% branches, 75% functions, 80% lines/statements.

### Custom render options

```tsx
render(<Component />, {
  layout: 'mobile' | 'tablet' | 'desktop',
  route: '/some/path',
  searchParams: { key: 'value' },
  commonData: { /* current user/practice overrides */ },
});
```

### Required test for every new component

```tsx
test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  await validateAccessibility(container);
});
```

---

## 10. Accessibility (WCAG 2.1 AA)

- Semantic HTML first (button, a, ul/ol, table).
- Heading hierarchy: one `h1` per page, never skip levels.
- All interactive elements need accessible names (`label`, `aria-label`, `aria-labelledby`).
- Use `aria-live="polite"` for non-urgent updates, `"assertive"` for urgent.
- Focus trapping in modals/drawers (MUI default -- do not disable).
- Visible focus indicators using the project's standard focus style.
- Minimum contrast: 4.5:1 normal text, 3:1 large text/UI.
- Never use color as sole indicator -- always pair with text/icons.
- Minimum touch target: 44x44px on mobile.
- `data-testid` on all interactive elements.

---

## 11. Responsive Design

Use `useLayout()` hook from `ev-hooks/layout` for all layout decisions:

```tsx
const { isMobile, isTablet, isDesktop } = useLayout();
```

| Breakpoint | Width | Flag |
|---|---|---|
| Mobile | <= 744px | `isMobile` |
| Tablet | 745px - 1024px | `isTablet` |
| Desktop | > 1024px | `isDesktop` |

Key patterns:
- Buttons: `fullWidth={isMobile}` on mobile.
- DataGrid: provide card/list alternative on mobile.
- Sidebars become drawers on mobile.
- Use MUI Grid with custom breakpoints: `desktop`, `tablet`, `mobile`.
- Pass layout flags as transient props: `$isMobile`.

---

## 12. Coding Rules Summary

1. Arrow functions only for components.
2. Import from wrapper modules (see restricted imports table).
3. Tree-shake MUI: `import Grid from '@mui/material/Grid'`.
4. Wrap all user-facing strings with `t()`.
5. Add `data-testid` to all interactive elements.
6. Use `EVColors` for colors, never hardcode hex.
7. Use Luxon `DateTime` for dates.
8. `const` by default (`prefer-const`).
9. No `console.log` -- only `console.warn`/`console.error`.
10. No `any` types -- use `unknown` with type guards.
11. Use `===` always (`eqeqeq` is an error).
12. Max cyclomatic complexity: 15.
13. Max ~300 lines per file.

---

## 13. Project Structure

```
src/
  app-{admin,patient,provider,video,login,...}/  # Sub-applications
  ev-api/         # RTK Query API layer (core/<domain>/)
  ev-components/  # ~70 reusable UI components
  ev-common/      # Shared feature components
  ev-hooks/       # Custom React hooks (30+)
  ev-store/       # Redux store, slices, actions
  ev-types/       # TypeScript type definitions
  ev-utils/       # Utility functions (30+)
  ev-theme/       # MUI theme, EVColors, typography
  ev-i18n/        # i18next setup, locales
  ev-test/        # Test utilities, MSW handlers, factories
  ev-config/      # Environment configuration
  ev-design-system/ # Storybook gallery
```

---

## 14. Component Registry

| Component | Import | Primary Use |
|---|---|---|
| Avatar | `ev-components/Avatar` | User profile images, initials |
| Badge | `ev-components/Badge` | Count indicators, status labels |
| Banner | `ev-components/Banner` | Page-level alerts |
| BasicAccordion | `ev-components/BasicAccordion` | Collapsible sections |
| Button | `ev-components/Button` | Actions (submit, navigate, cancel) |
| Calendar | `ev-components/Calendar` | Scheduling (FullCalendar) |
| Checkbox | `ev-components/Checkbox` | Single/multi checkboxes |
| DataGrid | `ev-components/DataGrid` | Data tables (desktop only) |
| DateInput | `ev-components/DateInput` | Date picker |
| DateRange | `ev-components/DateRange` | Date range selector |
| DateTimeInput | `ev-components/DateTimeInput` | Date + time picker |
| Dialog | `ev-components/Dialog` | Modal confirmations/forms |
| Drawer | `ev-components/Drawer` | Side/bottom panels |
| Dropdown | `ev-components/Dropdown` | Select menus |
| Icon | `ev-components/Icon` | FontAwesome icons |
| Input | `ev-components/Input` | Text entry with formatters |
| Journey | `ev-components/Journey` | Multi-step wizard |
| Link | `ev-components/Link` | Navigation links |
| LoadingIndicator | `ev-components/LoadingIndicator` | Loading spinner |
| Menu | `ev-components/Menu` | Context menus |
| MenuButton | `ev-components/MenuButton` | Button + dropdown menu |
| Pagination | `ev-components/Pagination` | Page navigation |
| Popover | `ev-components/Popover` | Floating panels |
| RadioButtons | `ev-components/RadioButtons` | Radio groups |
| Sidebar | `ev-components/Sidebar` | Side navigation |
| Snackbar | `ev-components/Snackbar` | Bottom notifications |
| Tabs | `ev-components/Tabs` | Tab navigation |
| Tag | `ev-components/Tag` | Removable tags/chips |
| Text | `ev-components/Text` | Typography (replaces MUI Typography) |
| Tile | `ev-components/Tile` | Card containers |
| TimeInput | `ev-components/TimeInput` | Time-only input |
| Toast | `ev-components/Toast` | Alert toasts (via useToast) |
| Toggle | `ev-components/Toggle` | On/off switch |
| Tooltip | `ev-components/Tooltip` | Hover tooltips |

Full catalog with props/enums: `docs/ai/component-catalog.md`
Component selection flowchart: `docs/ai/decision-trees/component-selection.md`

---

## 15. Commit & Branch Conventions

**Commit format:** `CU-<taskId>: <Short description>`

**Branch format:** `CU-<taskId>_<description-with-dashes>`

**Release branches:** `release-YYYY.Q.N[.P]`

**Main development branch:** `staging`

---

## 16. Additional References

| Document | Path |
|---|---|
| Full knowledge base | `CLAUDE.md` |
| Component catalog | `docs/ai/component-catalog.md` |
| Design tokens | `docs/ai/design-tokens.md` |
| Component selection | `docs/ai/decision-trees/component-selection.md` |
| AI docs index | `docs/ai/README.md` |
