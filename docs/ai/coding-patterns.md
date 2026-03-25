<!-- AI Reference: Coding Patterns & Conventions for eVisit UI -->
<!-- Source of truth. Referenced by CLAUDE.md -->

## 4. Code Patterns & Conventions

### Component Patterns

- **Arrow function components** — Always use arrow functions, never `function` declarations or `React.FC`:

  ```tsx
  const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
    return <div>...</div>;
  };
  ```

- **No `React.FC`, `React.FunctionComponent`, or `React.PropsWithChildren`** — These are banned by ESLint.

- **`forwardRef` pattern** — Used for components that need ref forwarding (e.g., `Button`):

  ```tsx
  const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { ... });
  Button.displayName = 'Button';
  ```

- **Barrel exports** — Each component folder has an `index.ts` that re-exports:

  ```tsx
  export * from './MyComponent';
  export { default } from './MyComponent';
  ```

- **Props types** — Define as separate `type` or use enums for variants:

  ```tsx
  export type ButtonProps = { id: string; variant?: ButtonTypes; ... };
  export enum ButtonTypes { Primary = 'contained', Secondary = 'outlined', ... }
  ```

- **`data-testid`** — All interactive elements must have a `data-testid` attribute (usually set from an `id` prop).

### Import Conventions (Enforced by Prettier + ESLint)

Import order (automated by `@trivago/prettier-plugin-sort-imports`):

1. External libraries (`react`, `lodash`, etc.)
2. `@fullcalendar/*`
3. `@mui/*`
4. `@fortawesome/*`
5. `ev-*` packages (bare module name, e.g., `ev-store`)
6. `ev-*` deep imports (e.g., `ev-store/redux`)
7. `app-*` imports
8. Relative imports (`./`, `../`)

**Restricted imports (enforced by ESLint):**

| DO NOT import                                   | Instead use                                              |
| ----------------------------------------------- | -------------------------------------------------------- |
| `render` from `@testing-library/react`          | `render` from `ev-test/test-utils`                       |
| `useDispatch`, `useSelector` from `react-redux` | `useAppDispatch`, `useAppSelector` from `ev-store/redux` |
| `useTranslation`, `Trans` from `react-i18next`  | `useTranslation`, `Trans` from `ev-i18n`                 |
| `useNavigate` from `react-router-dom`           | `useAppNavigate` from `ev-hooks/navigate`                |
| `styled-components` (bare)                      | `styled-components/macro`                                |
| `@mui/material` (barrel)                        | Individual imports (e.g., `@mui/material/Grid`)          |
| `@mui/material/Typography`                      | `ev-components/Text`                                     |
| `btoa`/`atob` globals                           | `ev-utils/base64.ts`                                     |

### Styling Patterns

- **styled-components/macro** — Primary CSS-in-JS approach:
  ```tsx
  import styled from 'styled-components/macro';

  const Wrapper = styled.div`
    padding: 16px;
    color: ${EVColors.cerulean};
  `;
  ```
- **MUI `sx` prop** — Used inline for MUI components.
- **`EVColors`** — Use theme colors from `ev-theme/styles` (e.g., `EVColors.cerulean`, `EVColors.asphalt`, `EVColors.cobalt`).
- **`classnames`** — For conditional class application.
- **MUI Theme** — Custom MUI theme in `ev-theme/theme.ts` with custom palette, typography (Inter font), and component overrides.

### State Management Patterns

- **RTK Query for server state** — All API calls go through RTK Query endpoints defined in `ev-api/core/`:
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
- **API is organized by domain** — Each domain (visits, users, patients, scheduling) is in its own folder under `ev-api/core/` with separate files: `index.ts`, `params.ts`, `responses.ts`, `transformers.ts`, and the main endpoint file.
- **Multiple API instances** — The app uses separate `createApi` instances: `api` (main), `oldEvaultApi`, `cloudfrontApi`, `stripeApi`, `googleMapsApi`.
- **RTK `createSlice` for UI state** — Redux slices for auth, sidebar, drawer, selected visit/patient, waiting room, personal filter views, notifications, unsaved changes, etc.
- **Actions re-exported** — All slice actions are re-exported from `ev-store/actions.ts` for easy import.
- **React Context for app-wide concerns** — Contexts for alert, dialog, toast, analytics, layout, mobile, environment, common data (current user/practice).

### API Patterns

- **Base paths as enum**: `Base.V2`, `Base.V3`, `Base.V4`, `Base.Sch`.
- **Auth token**: Set via `Secure-Authentication-Token` header from Redux auth state.
- **Backend proxy**: Optional `x-target-host` header from `BACKEND_PROXY` env var.
- **Tag-based cache invalidation**: Comprehensive `Tags` enum for RTK Query cache management.
- **Transformers**: Response data is transformed via `transformResponse` functions in each API module.
- **Optimistic updates**: Implemented via RTK thunks in `ev-api/thunks/`.

### Form Patterns

- **React Hook Form** — Used with `useController` for controlled inputs.
- **Yup validation** — Via `@hookform/resolvers`.
- **`useValidationSchema`** — Custom hook from `ev-common/Form` for form validation context.
- **Input formatting** — Formatters in `ev-utils/formatters.ts` (phone, credit card, numeric, time, etc.).

### Internationalization (i18n)

- **All user-visible strings MUST be translated** — Enforced by `i18next/no-literal-string` ESLint rule.
- **Use `useTranslation` from `ev-i18n`** (NOT from `react-i18next` directly).
- **`nt()` function** — "no-translate" wrapper (identity function) used for strings that are translation keys but don't need dynamic translation (e.g., in tests, stories). This satisfies the ESLint rule.
- **Never use `i18n.t()` globally** — Always use the `useTranslation()` hook.
- **Flat key format** — `keySeparator: false`, `nsSeparator: false` means translation keys are flat strings (no nesting).

### Naming Conventions

- **Files**: PascalCase for components (`Button.tsx`, `Dialog.tsx`), kebab-case for utilities/hooks (`date-time.ts`, `navigate.tsx`), kebab-case for Redux slices (`selected-visit.ts`).
- **Types**: PascalCase (enforced by ESLint `@typescript-eslint/naming-convention`).
- **Test files**: `*.test.tsx` or `*.test.ts` placed in `__tests__/` directories adjacent to the source.
- **Story files**: `*.stories.tsx` co-located with the component.
- **Enums**: PascalCase for enum names and members.
- **Event handlers**: Use `React.MouseEventHandler`, `React.ChangeEventHandler`, `React.FormEventHandler` (not the event types directly).

### React JSX Conventions (ESLint enforced)

- **Sort JSX props** alphabetically with shorthand last: `<Button disabled id="x" label="Y" open />`
- **No curly braces for string props**: `<Button id="x" />` not `<Button id={"x"} />`
- **Boolean shorthand**: `<Dialog open />` not `<Dialog open={true} />`
- **Prefer `test` over `it`** in test files (enforced by `jest/consistent-test-it`).

---

## 5. Best Practices for Claude

### Coding Style

1. **Always use arrow functions** for React components and callbacks. Never use `function` keyword for components.
2. **Import from the correct wrapper modules**:
   - `useAppDispatch` / `useAppSelector` from `ev-store/redux`
   - `useTranslation` / `Trans` from `ev-i18n`
   - `useAppNavigate` from `ev-hooks/navigate`
   - `render` from `ev-test/test-utils` (in tests)
   - `styled-components/macro` (not bare `styled-components`)
3. **Tree-shake MUI imports**: `import Grid from '@mui/material/Grid'` not `import { Grid } from '@mui/material'`.
4. **Use `ev-components/Text`** instead of `@mui/material/Typography`.
5. **Always wrap user-facing strings with `t()`** from `useTranslation()` or use `nt()` for static keys in non-component contexts.
6. **Add `data-testid` to interactive elements** — this is required by the PR checklist.
7. **Use `EVColors` from `ev-theme/styles`** for color values. Do not hardcode hex colors.
8. **Prefer `lodash`** for utility operations (the project uses it extensively with `import _ from 'lodash'`).
9. **Use Luxon (`DateTime`)** for all date/time operations, not native `Date` or Moment.
10. **Use `prefer-const`** — declare variables with `const` unless reassignment is needed.
11. **No `console.log`** — Only `console.warn` and `console.error` are allowed (CI fails on any console output).
12. **Strict TypeScript** — Avoid `any` types (warned). Use `unknown` with type guards.
13. **Use `===`** always (`eqeqeq` rule is an error).
14. **Max cyclomatic complexity: 15** — Keep functions simple.

### Testing Expectations

1. **All PRs must include unit tests** (per PR template).
2. **Use `render` from `ev-test/test-utils`** — it wraps components with necessary providers (Redux, Router, Theme, i18n).
3. **Use `test()` not `it()`** for test blocks.
4. **Custom render options** support `route`, `layout` (`desktop`/`tablet`/`mobile`), `searchParams`, `commonData` (for mocking current user/practice).
5. **Use MSW for API mocking** — handlers are in `ev-test/request-handlers/`. The server is set up globally in `setupTests.ts` with `onUnhandledRequest: 'error'`.
6. **Use `fishery` factories** for test data — factories are in `ev-test/test-mocks/api-response/`.
7. **Use `waitForRequest()` from `ev-test/test-utils`** to assert API calls were made.
8. **Use `validateAccessibility()` from `ev-test/test-utils`** for a11y testing (wraps jest-axe).
9. **Use `nt()` in tests** for strings that need to satisfy the i18n ESLint rule but are just test content.
10. **Use `screen.findBy*` (async)** for elements that appear after rendering; `screen.getBy*` only for immediately-present elements.
11. **Coverage thresholds**: Global: 70% branches, 75% functions, 80% lines/statements.

### PR Conventions

- **Branch naming**: `CU-#_description-with-dashes` (ClickUp task ID).
- **PR length**: ~200 lines of code changed maximum, or broken into many commits.
- **PR checklist**: test IDs, security review, cross-browser, mobile testing, a11y, performance.
- **Test instructions must go in the ClickUp task**, not just the PR.
- **Screen captures / videos for UX team** added to ClickUp.

### Key Warnings

- **The `baseUrl` in `tsconfig.json` is `src`** — all absolute imports resolve from `src/`. E.g., `import api from 'ev-api/api'` resolves to `src/ev-api/api.ts`.
- **React 17** — Do not use React 18 features (automatic batching, `createRoot`, `useId`, etc.).
- **MSW v1** — Do not use MSW v2 APIs. Handler format is `rest.get(url, (req, res, ctx) => ...)`.
- **styled-components v5** — Do not use v6 APIs. Transient props use `$` prefix (e.g., `$color`).
- **MUI v5** — Do not use MUI v6 APIs. Some MUI X packages are at v6/v7 (data-grid-pro, date-pickers-pro, tree-view).
- **jest.setTimeout is 15000ms** — Tests have 15 seconds. `asyncUtilTimeout` is 5000ms.
- **RTK Query cache is reset between tests** via `store.dispatch(api.util.resetApiState())` in `afterEach`.
