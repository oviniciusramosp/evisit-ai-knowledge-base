# eVisit UI -- AI Development Rules

> This file is loaded into every AI conversation. Keep it concise.
> Detailed documentation lives in `docs/ai/`. Reference those files for full patterns and examples.
> Source of truth chain: `CLAUDE.md` > `docs/ai/` > `.cursorrules` / `copilot-instructions.md`

---

## 1. Project Overview

eVisit UI is a telehealth/telemedicine web application frontend built with React 17 and TypeScript. It powers the eVisit platform for virtual healthcare visits between providers and patients. The application runs on Create React App (react-scripts 5) and targets Node.js >= 22.

The platform serves multiple user roles through distinct sub-applications:

- **Provider App** (`app-provider`) -- Waiting room, patient management, scheduling, dashboard, visit history, check-in
- **Patient App** (`app-patient`) -- Scheduling visits, health records, insurance, pharmacy, payments
- **Admin App** (`app-admin`) -- Practice settings, user management, custom forms, system configuration
- **Video App** (`app-video`) -- Twilio-powered video visits with telemetry and device management
- **Login App** (`app-login`) -- Authentication flows: login, password reset, MFA, biometrics
- **Registration App** (`app-registration`) -- New patient registration
- **Onboarding App** (`app-onboarding`) -- First-time user onboarding
- **Front Door App** (`app-frontdoor`) -- Public-facing entry point for specific customer handles
- **QTC App** (`app-qtc`) -- Quality, Training, and Compliance dashboard

The application supports 16 languages, has a React Native WebView bridge for mobile native embedding, and uses Yarn as its package manager. The `baseUrl` in `tsconfig.json` is `src` -- all absolute imports resolve from `src/`.

See `docs/ai/product-context.md` for domain terminology and user flows.
See `docs/ai/project-structure.md` for the full directory layout.

---

## 2. Technology Stack -- Critical Constraints

These version constraints are hard rules. AI must NEVER violate them.

- **React 17.x** -- NEVER use React 18 features (`createRoot`, `useId`, automatic batching, `useTransition`, `useDeferredValue`). Entry point uses `ReactDOM.render`.
- **TypeScript 5.9+** -- Strict mode enabled. NEVER use `any` type.
- **React Scripts (CRA) 5.0.1** -- Create React App, not Vite or Next.js.
- **React Router 6.27** -- `react-router-dom` v6 APIs only.
- **styled-components v5** -- NEVER use v6 APIs. ALWAYS import from `styled-components/macro`. Transient props use `$` prefix (e.g., `$color`).
- **MUI (Material UI) v5** -- NEVER use MUI v6 APIs. ALWAYS tree-shake: `import Grid from '@mui/material/Grid'` not `import { Grid } from '@mui/material'`.
- **MSW v1** -- NEVER use MSW v2 APIs. Handler format: `rest.get(url, (req, res, ctx) => ...)`.
- **Redux Toolkit (RTK) + RTK Query** -- Global state via `createSlice`, API via `createApi` with `fetchBaseQuery`.
- **React Hook Form + Yup** -- Form state with `@hookform/resolvers` for validation.
- **i18next + react-i18next** -- 16 locales, flat key format (`keySeparator: false`, `nsSeparator: false`).
- **Luxon** -- For all date/time operations. NEVER use native `Date` or Moment.
- **Font Awesome Pro** -- Icons bundled locally in `@fortawesome/` (duotone, light, solid).
- **MUI X packages** -- `@mui/x-data-grid-pro`, `@mui/x-date-pickers-pro`, `@mui/x-tree-view` may be at v6/v7.
- **Pusher.js + SignalR** -- Real-time event subscriptions.
- **Twilio Video** -- Video call functionality with `@twilio/video-processors`.
- **Jest (via react-scripts)** -- Test runner with TZ=UTC, 15s timeout, 5s asyncUtilTimeout.
- **React Testing Library v12** -- Component testing.
- **fishery** -- Test data factories.
- **Storybook 8** -- Component documentation and design system gallery.
- **Node.js >= 22** -- See `.nvmrc`.

---

## 3. Mandatory Rules

### Import Restrictions

| DO NOT import | Instead use |
|---|---|
| `render` from `@testing-library/react` | `render` from `ev-test/test-utils` |
| `useDispatch`, `useSelector` from `react-redux` | `useAppDispatch`, `useAppSelector` from `ev-store/redux` |
| `useTranslation`, `Trans` from `react-i18next` | `useTranslation`, `Trans` from `ev-i18n` |
| `useNavigate` from `react-router-dom` | `useAppNavigate` from `ev-hooks/navigate` |
| `styled-components` (bare) | `styled-components/macro` |
| `@mui/material` (barrel import) | Individual imports (e.g., `@mui/material/Grid`) |
| `@mui/material/Typography` | `ev-components/Text` |
| `btoa`/`atob` globals | `ev-utils/base64.ts` |

### Import Order (Enforced by Prettier)

1. External libraries (`react`, `lodash`, etc.)
2. `@fullcalendar/*`
3. `@mui/*`
4. `@fortawesome/*`
5. `ev-*` packages (bare, e.g., `ev-store`)
6. `ev-*` deep imports (e.g., `ev-store/redux`)
7. `app-*` imports
8. Relative imports (`./`, `../`)

### Component Rules

- ALWAYS use arrow functions for components. NEVER use `function` keyword or `React.FC` or `React.FunctionComponent` or `React.PropsWithChildren`.
- ALWAYS add `data-testid` to all interactive elements (usually set from an `id` prop).
- ALWAYS wrap user-facing strings with `t()` from `useTranslation()` (imported from `ev-i18n`).
- ALWAYS use `EVColors` from `ev-theme/styles` for color values. NEVER hardcode hex colors.
- ALWAYS use `ev-components/Text` instead of `@mui/material/Typography`.
- ALWAYS use `useAppNavigate` from `ev-hooks/navigate` instead of `useNavigate`.
- ALWAYS use `useAppDispatch`/`useAppSelector` from `ev-store/redux`.
- ALWAYS use `const` unless reassignment is needed (`prefer-const`).
- ALWAYS use strict equality `===` (`eqeqeq` rule is an error).
- ALWAYS sort JSX props alphabetically with shorthand last.
- ALWAYS use boolean shorthand: `<Dialog open />` not `<Dialog open={true} />`.
- ALWAYS use string props without curly braces: `<Button id="x" />` not `<Button id={"x"} />`.
- NEVER use `console.log` -- only `console.warn` and `console.error` are allowed.
- NEVER use `any` type -- use `unknown` with type guards (warned by ESLint).
- Max cyclomatic complexity: 15.
- Each component folder must have an `index.ts` barrel export.
- Use `forwardRef` pattern for components needing ref forwarding, with `displayName` set.
- Define prop types as separate `type` or use enums for variants.

See `docs/ai/coding-patterns.md` for detailed examples and patterns.

### Testing Rules

- Every PR must include unit tests.
- ALWAYS use `render` from `ev-test/test-utils` (wraps with Redux, Router, Theme, i18n providers).
- ALWAYS use `test()` not `it()` in test files (enforced by `jest/consistent-test-it`).
- Every new component MUST include a `validateAccessibility(container)` test.
- Use MSW v1 for API mocking -- handlers in `ev-test/request-handlers/`.
- Use `fishery` factories for test data -- factories in `ev-test/test-mocks/api-response/`.
- Use `waitForRequest()` from `ev-test/test-utils` to assert API calls.
- Use `screen.findBy*` (async) for elements after rendering; `screen.getBy*` for immediately-present elements.
- Use `nt()` for strings that satisfy the i18n ESLint rule in tests.
- Custom render supports options: `route`, `layout` (`desktop`/`tablet`/`mobile`), `searchParams`, `commonData`.
- Coverage thresholds: 70% branches, 75% functions, 80% lines/statements.
- RTK Query cache is reset between tests via `store.dispatch(api.util.resetApiState())` in `afterEach`.

See `docs/ai/testing-patterns.md` for full testing patterns.

### i18n Rules

- All user-facing strings MUST use `t()` from `useTranslation()` (import from `ev-i18n`).
- Use `nt()` (identity function) for static keys in tests, stories, and non-component contexts.
- NEVER use `i18n.t()` globally -- always use the `useTranslation()` hook.
- Flat key format -- `keySeparator: false`, `nsSeparator: false` means no nested keys.
- Enforced by `i18next/no-literal-string` ESLint rule.

See `docs/ai/i18n-guide.md` for the full guide.

### Accessibility Rules

- Target: WCAG 2.1 Level AA.
- Semantic HTML first, ARIA second. A `<button>` is always better than `<div role="button">`.
- No information conveyed by color alone -- always pair with text, icons, or patterns.
- Keyboard-first design -- every interactive element operable with keyboard alone.
- Minimum touch target: 44x44px on mobile.
- Correct heading hierarchy (`h1` > `h2` > `h3`), never skip levels, one `h1` per page.
- Use landmark regions: `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`.
- Every interactive element needs an accessible name (visible `label`, `aria-label`, or `aria-labelledby`).
- Use `aria-live="polite"` for non-urgent updates, `aria-live="assertive"` for urgent messages.
- Use `aria-expanded` on toggles, `aria-current="page"` on active nav links.
- Trap focus inside open Dialogs/Drawers. Return focus to trigger on close.
- Visible focus indicators using the project standard: `box-shadow: 0px 0px 0px 2px ${EVColors.cobalt}, 0px 0px 0px 4px ${EVColors.selectedHover}`.
- Minimum contrast ratios: 4.5:1 normal text, 3:1 large text, 3:1 UI components.
- Associate labels with inputs, mark required fields, display inline error messages.
- Provide alt text for all images -- decorative images get `alt=""`.

See `docs/ai/accessibility-guide.md` for the full checklist.

### Responsive Design Rules

- Use `useLayout()` from `ev-hooks/layout` for ALL responsive logic. NEVER use `window.innerWidth` directly.
- Three breakpoints: desktop (>1024px), tablet (745-1024px), mobile (<=744px).
- MUI custom breakpoints: `mobile: 0`, `tablet: 744`, `desktop: 1024`.
- Design for all three breakpoints. Every new page/feature must work at all sizes.
- Buttons MUST be full-width on mobile (`fullWidth={isMobile}`).
- DataGrid requires a mobile card/list alternative -- `MUI DataGrid` is not usable on mobile.
- Sidebars become drawers on mobile.
- Dialogs adapt: `width: isMobile ? 'calc(100vw - 48px)' : 560`.
- Avoid fixed widths -- use `max-width`, `min-width`, `width: 100%`, or `calc()`.
- Pass layout flags as transient props to styled-components: `$isMobile`.
- Avoid hover-dependent interactions on mobile -- provide tap/long-press alternatives.

See `docs/ai/responsive-guide.md` for full patterns and examples.

### Styling Patterns

- Primary: `styled-components/macro` with `EVColors` from `ev-theme/styles`.
- MUI `sx` prop for inline adjustments on MUI components.
- `classnames` for conditional CSS class application.
- MUI Theme in `ev-theme/theme.ts` with custom palette, typography (Inter font), breakpoints, and component overrides.

See `docs/ai/design-tokens.md` for the full token reference.

### API Patterns

- All API calls through RTK Query endpoints in `ev-api/core/<domain>/`.
- Each domain module has: `index.ts`, `params.ts`, `responses.ts`, `transformers.ts`, and endpoint file.
- Base paths: `Base.V2`, `Base.V3`, `Base.V4`, `Base.Sch`.
- Auth token: `Secure-Authentication-Token` header from Redux auth state.
- Tag-based cache invalidation via `Tags` enum.
- Response data transformed via `transformResponse` functions.
- Optimistic updates via RTK thunks in `ev-api/thunks/`.

See `docs/ai/api-patterns.md` for the full API guide.

### State Management Patterns

- RTK Query for server/API state.
- RTK `createSlice` for UI state (auth, sidebar, drawer, selected visit/patient, etc.).
- All slice actions re-exported from `ev-store/actions.ts`.
- React Context for app-wide concerns: alert, dialog, toast, analytics, layout, mobile, environment, common data.

See `docs/ai/state-management.md` for when to use which approach.

### Naming Conventions

- Files: PascalCase for components (`Button.tsx`), kebab-case for utilities/hooks (`date-time.ts`), kebab-case for Redux slices (`selected-visit.ts`).
- Types: PascalCase (enforced by ESLint).
- Test files: `*.test.tsx` or `*.test.ts` in `__tests__/` directories.
- Story files: `*.stories.tsx` co-located with the component.
- Enums: PascalCase for names and members.
- Event handlers: Use `React.MouseEventHandler`, `React.ChangeEventHandler`, `React.FormEventHandler`.

### Commit Convention

- Primary format: `CU-<taskId>: <Short description>` or `CU-<taskId> - <Short description>`
- Standalone: `<Action verb> <description> (CU-<taskId>) (#<PR>)`
- Dependency bumps: `Yarn(deps): Bump <package> from <old> to <new>`
- Branch naming: `CU-<taskId>_<description-with-dashes>`
- Release branches: `release-YYYY.Q.N[.P]`

See `docs/ai/versioning-commits-refactoring.md` for full guidelines.

---

## 4. AI Proactive Behaviors

These are behaviors the AI MUST perform proactively without being asked.

### Testing

- Create automated tests for every new component, hook, or feature.
- Include accessibility tests (`validateAccessibility`) for every new component.
- Include responsive tests (mobile + desktop layouts) for components using `useLayout()`.
- Add MSW handlers for any new API endpoint.
- Run existing tests after modifications to ensure no regressions.

### Commits

- Commit proactively after completing each logical unit of work.
- Write clear commit messages following: `CU-<taskId>: <Short description>` or standalone: `<Action verb> <description>`.
- Never batch unrelated changes in a single commit.
- Never commit when code does not compile or has linting errors.

### Versioning

- Suggest version considerations when: breaking changes, new features merged to staging, significant dependency upgrades.
- Follow the release branch convention: `release-YYYY.Q.N[.P]`.
- See `docs/ai/versioning-commits-refactoring.md` for full guidelines.

### Knowledge Base Maintenance

- When creating new components, patterns, or conventions, proactively update:
  - `docs/ai/component-catalog.md` if a new `ev-component` was created.
  - `docs/ai/hook-catalog.md` if a new shared hook was created.
  - `docs/ai/api-patterns.md` if a new API domain module was created.
  - The relevant `docs/ai/` file if a new pattern was established.
- Flag when documentation is outdated relative to code changes.

### Storybook

- Every new `ev-components/*` component MUST have a Storybook story.
- Follow the dual-file pattern: component-local story + design system gallery re-export.
- Update existing stories when component props change.
- See `docs/ai/storybook-guide.md` for the full pattern.

### Component Reuse

- ALWAYS search existing `ev-components/` before creating new components.
- The `/component-lookup` skill auto-activates for this purpose.
- Prefer IMPROVING an existing component over creating a new one when close but not exact.
- New components MUST be reusable, have barrel exports, stories, and tests.
- See `docs/ai/component-catalog.md` for the full registry.

### Design Token Compliance

- ALWAYS use `EVColors` for colors, `Text.*` for typography, `useLayout()` for breakpoints.
- The `/design-tokens` skill auto-activates when writing styles.
- NEVER hardcode hex values, pixel font sizes, or breakpoint numbers.
- See `docs/ai/design-tokens.md` for the full token reference.

### Refactoring

- Flag duplicated logic, overly complex components, prop drilling beyond 2 levels.
- Flag unused exports, `any` types, magic numbers, inconsistent error handling.
- Flag missing `useMemo`/`useCallback`, unnecessary re-renders, unbounded lists.
- Flag security concerns: unsanitized HTML, exposed tokens, sensitive data in URLs.
- Refactor in small incremental commits, tests first, backwards compatible.
- Follow extraction patterns: UI in `ev-components/`, features in `ev-common/`, hooks in `ev-hooks/`, utils in `ev-utils/`, types in `ev-types/`, API in `ev-api/core/`.
- See `docs/ai/versioning-commits-refactoring.md` for full refactoring guidelines.

---

## 5. Detailed Documentation Index

| Topic | File | When to read |
|---|---|---|
| Coding patterns and conventions | `docs/ai/coding-patterns.md` | Writing any code |
| Component catalog (47+ components) | `docs/ai/component-catalog.md` | Before creating UI |
| Design tokens (colors, typography) | `docs/ai/design-tokens.md` | Writing any styles |
| API patterns (RTK Query) | `docs/ai/api-patterns.md` | Adding API endpoints |
| Hook catalog (65+ hooks) | `docs/ai/hook-catalog.md` | Before creating hooks |
| Form patterns | `docs/ai/form-patterns.md` | Building forms |
| i18n guide | `docs/ai/i18n-guide.md` | Any translated strings |
| State management | `docs/ai/state-management.md` | Choosing state location |
| Storybook guide | `docs/ai/storybook-guide.md` | Writing stories |
| Testing patterns | `docs/ai/testing-patterns.md` | Writing tests |
| Routing architecture | `docs/ai/routing-architecture.md` | Adding routes or pages |
| Accessibility guide | `docs/ai/accessibility-guide.md` | Building any UI |
| Responsive guide | `docs/ai/responsive-guide.md` | Responsive layouts |
| Product context and domain | `docs/ai/product-context.md` | Understanding domain |
| Project structure | `docs/ai/project-structure.md` | Navigating codebase |
| Versioning, commits, refactoring | `docs/ai/versioning-commits-refactoring.md` | Commits and releases |
| Component selection decision tree | `docs/ai/decision-trees/component-selection.md` | "Which component?" |
| State location decision tree | `docs/ai/decision-trees/state-location.md` | "Where to put state?" |
| Styling approach decision tree | `docs/ai/decision-trees/styling-approach.md` | "How to style this?" |
| Recommended MCPs | `docs/ai/recommended-mcps.md` | MCP setup |

---

## 6. Component Quick Registry

Quick reference for all `ev-components/`. See `docs/ai/component-catalog.md` for full props and usage.

| Component | Import | Primary Use |
|---|---|---|
| Avatar | `ev-components/Avatar` | User profile images, initials |
| Badge | `ev-components/Badge` | Count indicators, status labels |
| Banner | `ev-components/Banner` | Page-level alerts, info messages |
| BasicAccordion | `ev-components/BasicAccordion` | Collapsible sections |
| BooleanButtons | `ev-components/BooleanButtons` | Yes/No toggle buttons |
| Button | `ev-components/Button` | Actions: submit, navigate, toggle, cancel |
| Calendar | `ev-components/Calendar` | Scheduling, events (FullCalendar) |
| Carousel | `ev-components/Carousel` | Image/content carousel |
| Checkbox | `ev-components/Checkbox` | Single/multi checkboxes |
| CheckboxesTree | `ev-components/CheckboxesTree` | Hierarchical checkbox selection |
| ComplexListItem | `ev-components/ComplexListItem` | Rich list items with metadata |
| ContextPanel | `ev-components/ContextPanel` | Context-aware side panel |
| DataGrid | `ev-components/DataGrid` | Data tables (desktop only) |
| DateInput | `ev-components/DateInput` | Date picker |
| DateRange | `ev-components/DateRange` | Date range selector |
| DateTimeInput | `ev-components/DateTimeInput` | Date + time picker |
| Dialog | `ev-components/Dialog` | Modal confirmations and forms |
| Drawer | `ev-components/Drawer` | Side/bottom panels, option lists |
| Dropdown | `ev-components/Dropdown` | Select/dropdown menus |
| DropdownChip | `ev-components/DropdownChip` | Dropdown as chip |
| FlowProgress | `ev-components/FlowProgress` | Multi-step progress indicator |
| GoogleMap | `ev-components/GoogleMap` | Map display |
| GoogleMapsAutocomplete | `ev-components/GoogleMapsAutocomplete` | Address autocomplete |
| Icon | `ev-components/Icon` | FontAwesome icons |
| InlineEditableText | `ev-components/InlineEditableText` | Click-to-edit text |
| Input | `ev-components/Input` | Text entry with formatters |
| Journey | `ev-components/Journey` | Multi-step wizard |
| LanguageSelector | `ev-components/LanguageSelector` | Language picker |
| Link | `ev-components/Link` | Navigation links |
| LoadingIndicator | `ev-components/LoadingIndicator` | Loading spinner |
| Menu | `ev-components/Menu` | Context menus |
| MenuButton | `ev-components/MenuButton` | Button + dropdown menu |
| Pagination | `ev-components/Pagination` | Page navigation controls |
| Popover | `ev-components/Popover` | Floating panels |
| RadioButtons | `ev-components/RadioButtons` | Radio button groups |
| SelectorChip | `ev-components/SelectorChip` | Selectable chip group |
| SelectorTab | `ev-components/SelectorTab` | Tab-style selector |
| Sidebar | `ev-components/Sidebar` | Side navigation |
| Snackbar | `ev-components/Snackbar` | Bottom notifications |
| StarRating | `ev-components/StarRating` | Star rating input |
| Tabs | `ev-components/Tabs` | Tab navigation |
| Tag | `ev-components/Tag` | Removable tags/chips |
| Text | `ev-components/Text` | Typography (replaces MUI Typography) |
| TieredModal | `ev-components/TieredModal` | Stacked modal system |
| Tile | `ev-components/Tile` | Card/tile containers |
| TimeInput | `ev-components/TimeInput` | Time-only input |
| TimezoneDropdown | `ev-components/TimezoneDropdown` | Timezone selector |
| Toast | `ev-components/Toast` | Alert toasts (via useToast) |
| Toggle | `ev-components/Toggle` | On/off switch |
| Tooltip | `ev-components/Tooltip` | Hover tooltips |
| VisitStatusSelector | `ev-components/VisitStatusSelector` | Visit status dropdown |

---

## 7. Available Skills

| Skill | Command | Auto-activates? |
|---|---|---|
| Component Lookup | `/component-lookup` | Yes -- when UI need described |
| Design Tokens | `/design-tokens` | Yes -- when writing styles |
| New Component | `/new-component` | No |
| New Feature Page | `/new-feature-page` | No |
| New API Endpoint | `/new-api-endpoint` | No |
| Storybook Story | `/storybook-story` | No |
| Accessibility Audit | `/accessibility-audit` | No |
| Fix Bug | `/fix-bug` | No |
| Refactor | `/refactor` | No |
