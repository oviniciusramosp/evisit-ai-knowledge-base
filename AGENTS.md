# AGENTS.md — eVisit UI (OpenAI Codex)

> Condensed project rules for AI code generation. For full details see `CLAUDE.md` and `docs/ai/`.

## Project Overview

eVisit UI is a React 17 + TypeScript telehealth frontend (Create React App). It has 9 sub-apps (`app-provider`, `app-patient`, `app-admin`, `app-video`, `app-login`, `app-registration`, `app-onboarding`, `app-frontdoor`, `app-qtc`). Node >= 22, Yarn, strict TypeScript.

## Technology Stack

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Framework        | React 17 (`ReactDOM.render`, no React 18 features)      |
| Language         | TypeScript 5.9+ (strict mode)                           |
| Build            | Create React App (react-scripts 5)                      |
| Routing          | React Router 6.27 (`react-router-dom`)                  |
| State (server)   | RTK Query (`createApi` + `fetchBaseQuery`)               |
| State (client)   | Redux Toolkit (`createSlice`)                           |
| State (forms)    | React Hook Form + Yup (`@hookform/resolvers`)           |
| State (context)  | React Context (alerts, dialogs, toast, layout, mobile)  |
| UI library       | MUI v5 (`@mui/material`, `@mui/x-data-grid-pro`)       |
| CSS-in-JS        | styled-components v5 (import from `styled-components/macro`) |
| Icons            | Font Awesome Pro (duotone, light, solid)                |
| i18n             | i18next + react-i18next (16 locales)                    |
| Dates            | Luxon (`DateTime`) — not Moment, not native Date        |
| Testing          | Jest + React Testing Library + MSW v1 + jest-axe        |
| Storybook        | Storybook 8                                             |

### Version Constraints (Do NOT Use)

- React 18 APIs (`createRoot`, `useId`, automatic batching)
- MSW v2 APIs (use v1 handler format: `rest.get(url, (req, res, ctx) => ...)`)
- styled-components v6 APIs
- MUI v6 APIs

## Import Restrictions (ESLint Enforced)

| DO NOT import from                              | Use instead                                    |
| ----------------------------------------------- | ---------------------------------------------- |
| `render` from `@testing-library/react`          | `render` from `ev-test/test-utils`             |
| `useDispatch`/`useSelector` from `react-redux`  | `useAppDispatch`/`useAppSelector` from `ev-store/redux` |
| `useTranslation`/`Trans` from `react-i18next`   | `useTranslation`/`Trans` from `ev-i18n`        |
| `useNavigate` from `react-router-dom`           | `useAppNavigate` from `ev-hooks/navigate`      |
| `styled-components` (bare)                      | `styled-components/macro`                      |
| `@mui/material` (barrel import)                 | Individual: `import Grid from '@mui/material/Grid'` |
| `@mui/material/Typography`                      | `ev-components/Text`                           |
| `btoa`/`atob` globals                           | `ev-utils/base64.ts`                           |

**Note:** `baseUrl` in tsconfig is `src/`, so `import X from 'ev-api/api'` resolves to `src/ev-api/api.ts`.

## Component Patterns

### Arrow Functions Only

```tsx
// CORRECT
const MyComponent = ({ id, label }: MyComponentProps) => {
  return <div data-testid={id}>{label}</div>;
};

// WRONG — never use function declarations or React.FC
```

Banned: `React.FC`, `React.FunctionComponent`, `React.PropsWithChildren`.

### forwardRef Pattern

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { ... });
Button.displayName = 'Button';
```

### Props and Exports

- Define props as `type` (PascalCase) or use enums for variants.
- Every component folder has `index.ts` with barrel exports.
- All interactive elements require `data-testid`.

### JSX Conventions

- Sort props alphabetically, shorthand last: `<Button disabled id="x" label="Y" open />`
- No curly braces for string props: `id="x"` not `id={"x"}`
- Boolean shorthand: `<Dialog open />` not `<Dialog open={true} />`

## Styling Rules

- Import styled-components from `styled-components/macro`.
- Use `EVColors` from `ev-theme/styles` for all colors. Never hardcode hex values.
- Transient props use `$` prefix: `$isMobile`, `$color`.
- Use `sx` prop for one-off MUI adjustments.
- Use `ev-components/Text` instead of MUI Typography.

### Design Tokens

| Token Category | Source                           | Usage                                    |
| -------------- | -------------------------------- | ---------------------------------------- |
| Colors         | `EVColors` from `ev-theme/styles` | `EVColors.cerulean`, `EVColors.cobalt`  |
| Typography     | `Text.*` from `ev-components/Text` | `Text.Title`, `Text.Body`, `Text.Caption` |
| Breakpoints    | `useLayout()` from `ev-hooks/layout` | `isMobile`, `isTablet`, `isDesktop`    |
| Focus ring     | Standard pattern                 | `box-shadow: 0 0 0 2px ${EVColors.cobalt}, 0 0 0 4px ${EVColors.selectedHover}` |

See `docs/ai/design-tokens.md` for the full token reference.

## Internationalization (i18n)

- **All user-visible strings must use `t()`** from `useTranslation()` (enforced by ESLint `i18next/no-literal-string`).
- Import `useTranslation` and `Trans` from `ev-i18n`, not `react-i18next`.
- Use `nt()` (identity function) for strings that need to satisfy the lint rule but are not dynamically translated (tests, stories, static keys).
- Flat key format: `keySeparator: false`, `nsSeparator: false`.
- Never use `i18n.t()` globally; always use the hook.

## State Management

- **RTK Query** for all API calls. Endpoints in `ev-api/core/<domain>/` follow a 5-file pattern: `index.ts`, `params.ts`, `responses.ts`, `transformers.ts`, endpoint file.
- **Base paths**: `Base.V2`, `Base.V3`, `Base.V4`, `Base.Sch`.
- **Tags enum** for cache invalidation.
- **Redux slices** (`createSlice`) for UI state only. Actions re-exported from `ev-store/actions.ts`.
- **React Context** for alerts, dialogs, toasts, layout, mobile, environment, common data.

## Testing Patterns

- Use `render` from `ev-test/test-utils` (wraps with providers).
- Use `test()` not `it()` (`jest/consistent-test-it`).
- Use MSW v1 for API mocking. Handlers in `ev-test/request-handlers/`.
- Use `fishery` factories for test data (`ev-test/test-mocks/api-response/`).
- Use `waitForRequest()` to assert API calls.
- Use `validateAccessibility()` for a11y testing (jest-axe).
- Use `nt()` for strings in tests.
- Use `screen.findBy*` (async) for elements appearing after render.
- Custom render supports: `route`, `layout` (`desktop`/`tablet`/`mobile`), `searchParams`, `commonData`.
- Coverage thresholds: 70% branches, 75% functions, 80% lines/statements.
- `jest.setTimeout` is 15000ms. `asyncUtilTimeout` is 5000ms.

### Required Test Template

```tsx
import { render, validateAccessibility } from 'ev-test/test-utils';

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  await validateAccessibility(container);
});
```

### Responsive Testing

```tsx
test('renders mobile layout', () => {
  render(<MyComponent />, { layout: 'mobile' });
  // assert mobile-specific elements
});
```

## Accessibility (WCAG 2.1 AA)

- Semantic HTML first (use `<button>`, `<a>`, `<ul>`, not `<div>` with roles).
- Correct heading hierarchy (one `h1` per page, no skipped levels).
- All interactive elements need accessible names (`label`, `aria-label`, or `aria-labelledby`).
- `aria-live="polite"` for non-urgent updates, `aria-live="assertive"` for urgent.
- `aria-expanded` on toggles, `aria-current="page"` on active nav.
- Visible focus indicators using the standard focus ring pattern.
- Minimum contrast: 4.5:1 normal text, 3:1 large text and UI components.
- No information by color alone — always pair with text or icons.
- Minimum 44x44px touch targets on mobile.
- Include `validateAccessibility()` test for every new component.

## Responsive Design

Breakpoints: mobile (<= 744px), tablet (745-1024px), desktop (> 1024px).

- Use `useLayout()` from `ev-hooks/layout` for all responsive logic.
- Use MUI Grid with custom breakpoints: `desktop`, `tablet`, `mobile`.
- Buttons: `fullWidth={isMobile}` on mobile.
- DataGrid is desktop-only; provide card/list view for mobile.
- Sidebars become drawers on mobile.
- Test at both `mobile` and `desktop` layouts.

## Coding Rules Summary

1. Arrow functions only for components.
2. `const` by default (`prefer-const`).
3. No `console.log` — only `console.warn`/`console.error`.
4. No `any` types — use `unknown` with type guards.
5. Strict equality (`===`) always.
6. Max cyclomatic complexity: 15.
7. Luxon for dates, lodash for utilities.
8. `data-testid` on all interactive elements.

## Project Structure (Key Directories)

```
src/
  app-*/           Sub-applications (lazy-loaded from Main.tsx)
  ev-api/          RTK Query API layer (core/<domain>/ pattern)
  ev-components/   ~70 reusable UI components (design system)
  ev-common/       Shared feature-level components
  ev-hooks/        Custom React hooks (30+)
  ev-store/        Redux store, slices, typed dispatch/selector
  ev-types/        TypeScript type definitions
  ev-utils/        Utility functions (30+ modules)
  ev-theme/        MUI theme, EVColors, typography, breakpoints
  ev-i18n/         i18next setup, useTranslation, nt()
  ev-test/         Test utilities, MSW handlers, factories
  ev-config/       Environment configuration
```

## Component Quick Registry

| Component              | Import                                 | Use For                       |
| ---------------------- | -------------------------------------- | ----------------------------- |
| Avatar                 | `ev-components/Avatar`                 | User images, initials         |
| Badge                  | `ev-components/Badge`                  | Counts, status labels         |
| Banner                 | `ev-components/Banner`                 | Page-level alerts             |
| BasicAccordion         | `ev-components/BasicAccordion`         | Collapsible sections          |
| BooleanButtons         | `ev-components/BooleanButtons`         | Yes/No toggles                |
| Button                 | `ev-components/Button`                 | Actions (submit, cancel)      |
| Calendar               | `ev-components/Calendar`               | Scheduling (FullCalendar)     |
| Checkbox               | `ev-components/Checkbox`               | Single/multi checkboxes       |
| CheckboxesTree         | `ev-components/CheckboxesTree`         | Hierarchical checkboxes       |
| ComplexListItem        | `ev-components/ComplexListItem`        | Rich list items               |
| DataGrid               | `ev-components/DataGrid`               | Data tables (desktop only)    |
| DateInput              | `ev-components/DateInput`              | Date picker                   |
| DateRange              | `ev-components/DateRange`              | Date range selector           |
| DateTimeInput          | `ev-components/DateTimeInput`          | Date + time picker            |
| Dialog                 | `ev-components/Dialog`                 | Modals, confirmations         |
| Drawer                 | `ev-components/Drawer`                 | Side/bottom panels            |
| Dropdown               | `ev-components/Dropdown`               | Select menus                  |
| DropdownChip           | `ev-components/DropdownChip`           | Dropdown as chip              |
| FlowProgress           | `ev-components/FlowProgress`           | Multi-step progress           |
| Icon                   | `ev-components/Icon`                   | FontAwesome icons             |
| InlineEditableText     | `ev-components/InlineEditableText`     | Click-to-edit text            |
| Input                  | `ev-components/Input`                  | Text entry with formatters    |
| Journey                | `ev-components/Journey`                | Multi-step wizard             |
| LanguageSelector       | `ev-components/LanguageSelector`       | Language picker                |
| Link                   | `ev-components/Link`                   | Navigation links              |
| LoadingIndicator       | `ev-components/LoadingIndicator`       | Loading spinner               |
| Menu                   | `ev-components/Menu`                   | Context menus                 |
| MenuButton             | `ev-components/MenuButton`             | Button + dropdown menu        |
| Pagination             | `ev-components/Pagination`             | Page navigation               |
| Popover                | `ev-components/Popover`                | Floating panels               |
| RadioButtons           | `ev-components/RadioButtons`           | Radio button groups           |
| SelectorChip           | `ev-components/SelectorChip`           | Selectable chip group         |
| SelectorTab            | `ev-components/SelectorTab`            | Tab-style selector            |
| Sidebar                | `ev-components/Sidebar`                | Side navigation               |
| Snackbar               | `ev-components/Snackbar`               | Bottom notifications          |
| StarRating             | `ev-components/StarRating`             | Star rating input             |
| Tabs                   | `ev-components/Tabs`                   | Tab navigation                |
| Tag                    | `ev-components/Tag`                    | Removable tags/chips          |
| Text                   | `ev-components/Text`                   | Typography (use over MUI)     |
| TieredModal            | `ev-components/TieredModal`            | Stacked modals                |
| Tile                   | `ev-components/Tile`                   | Card containers               |
| TimeInput              | `ev-components/TimeInput`              | Time-only input               |
| TimezoneDropdown       | `ev-components/TimezoneDropdown`       | Timezone selector             |
| Toast                  | `ev-components/Toast`                  | Alert toasts (via useToast)   |
| Toggle                 | `ev-components/Toggle`                 | On/off switch                 |
| Tooltip                | `ev-components/Tooltip`                | Hover tooltips                |
| VisitStatusSelector    | `ev-components/VisitStatusSelector`    | Visit status dropdown         |

## Naming Conventions

| Type         | Convention   | Examples                                    |
| ------------ | ------------ | ------------------------------------------- |
| Components   | PascalCase   | `Button.tsx`, `Dialog.tsx`                  |
| Utilities    | kebab-case   | `date-time.ts`, `navigate.tsx`              |
| Redux slices | kebab-case   | `selected-visit.ts`                         |
| Types/Enums  | PascalCase   | `ButtonTypes`, `VisitStatus`                |
| Test files   | `*.test.tsx`  | In `__tests__/` adjacent to source          |
| Stories      | `*.stories.tsx` | Co-located with component                 |

## Commit Messages

Format: `CU-<taskId>: <Short description>` or `CU-<taskId> - <Short description>`

Branch naming: `CU-<taskId>_<description-with-dashes>`

## Detailed Documentation

| Topic              | File                                    |
| ------------------ | --------------------------------------- |
| Component Catalog  | `docs/ai/component-catalog.md`          |
| Design Tokens      | `docs/ai/design-tokens.md`              |
| API Patterns       | `docs/ai/api-patterns.md`              |
| Hook Catalog       | `docs/ai/hook-catalog.md`              |
| Form Patterns      | `docs/ai/form-patterns.md`             |
| Testing Patterns   | `docs/ai/testing-patterns.md`          |
| i18n Guide         | `docs/ai/i18n-guide.md`               |
| State Management   | `docs/ai/state-management.md`          |
| Routing            | `docs/ai/routing-architecture.md`      |
| Storybook Guide    | `docs/ai/storybook-guide.md`          |
| Component Selection| `docs/ai/decision-trees/component-selection.md` |
