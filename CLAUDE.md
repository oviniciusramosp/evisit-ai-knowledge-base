# Project Knowledge Base — eVisit UI

## 1. Project Overview

eVisit UI is a telehealth/telemedicine web application frontend built with React and TypeScript. It powers the eVisit platform, which enables virtual healthcare visits between providers (doctors, nurses, healthcare staff) and patients. The application runs on Create React App (react-scripts 5) and uses React 17.

The platform serves multiple user roles through distinct sub-applications:

- **Provider App** (`app-provider`) — The main provider-facing interface with waiting room, patient management, scheduling, visit history, check-in, dashboard, and account management.
- **Patient App** (`app-patient`) — Patient-facing portal for scheduling visits, managing health records, insurance, pharmacy, payments, and viewing upcoming/past visits.
- **Admin App** (`app-admin`) — Administrative console for practice settings, user management, custom forms, and system configuration.
- **Video App** (`app-video`) — Twilio-powered video visit interface with telemetry, device management, and post-visit surveys.
- **Login App** (`app-login`) — Authentication flows including login, password reset, account unlock, MFA, and biometrics.
- **Registration App** (`app-registration`) — New patient registration flows.
- **Onboarding App** (`app-onboarding`) — First-time user onboarding with personal information and password setup.
- **Front Door App** (`app-frontdoor`) — Public-facing front door for specific customer handles.
- **QTC App** (`app-qtc`) — Quality, Training, and Compliance dashboard and scheduling.

The application supports 16 languages, has a React Native WebView bridge for mobile native embedding, and targets Node.js >= 22.

---

## 2. Technology Stack

### Core

| Technology          | Version/Details                                    |
| ------------------- | -------------------------------------------------- |
| React               | 17.x (with `react-dom@17`, uses `ReactDOM.render`) |
| TypeScript          | 5.9+ (strict mode enabled)                         |
| React Scripts (CRA) | 5.0.1                                              |
| React Router        | 6.27 (`react-router-dom`)                          |
| Node.js             | >= 22 (see `.nvmrc`)                               |
| Package Manager     | Yarn (with `yarn.lock`)                            |

### State Management

| Technology          | Purpose                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Redux Toolkit (RTK) | Global state via `createSlice`                                                                                                 |
| RTK Query           | API data fetching, caching, and mutations (`createApi` with `fetchBaseQuery`)                                                  |
| React Hook Form     | Form state management with Yup validation (`@hookform/resolvers`)                                                              |
| React Context       | Provider-based contexts for alerts, dialogs, analytics, layout, mobile, toast, environment, common data, filters, custom forms |

### UI / Styling

| Technology           | Purpose                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| MUI (Material UI) v5 | Component library (with `@mui/x-data-grid-pro`, `@mui/x-date-pickers-pro`, `@mui/x-tree-view`) |
| styled-components v5 | CSS-in-JS (always import from `styled-components/macro`)                                       |
| Font Awesome Pro     | Icons (duotone, light, solid variants — bundled locally in `@fortawesome/`)                    |
| classnames           | Conditional CSS class application                                                              |
| tippy.js             | Tooltips                                                                                       |
| Inter font           | Primary typeface                                                                               |

### API & Realtime

| Technology                   | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| RTK Query (`fetchBaseQuery`) | REST API calls to eVisit backend (V2/V3/V4/Sch endpoints) |
| Pusher.js                    | Real-time event subscriptions (WebSockets)                |
| SignalR (no-jquery)          | Additional real-time communication                        |
| MSW (Mock Service Worker) v1 | API mocking for tests                                     |

### Video

| Technology               | Purpose                                                 |
| ------------------------ | ------------------------------------------------------- |
| Twilio Video             | Video call functionality                                |
| @twilio/video-processors | Video background processing (blur, virtual backgrounds) |

### Internationalization

| Technology                   | Purpose                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| i18next + react-i18next      | Translation framework                                                    |
| i18next-resources-to-backend | Lazy-loading locale JSON files                                           |
| Lokalise                     | External translation management (upload/PR scripts in `bin/`)            |
| 16 locales                   | en, es, fr, ar, bn, hi, ht_HT, ko, pl, ru, sq, ur, yue, zh_CN, zh_TW, zu |

### Testing

| Technology               | Purpose                                         |
| ------------------------ | ----------------------------------------------- |
| Jest (via react-scripts) | Test runner (TZ=UTC, 15s timeout)               |
| React Testing Library    | Component testing (`@testing-library/react@12`) |
| MSW v1                   | API mocking (`setupServer`)                     |
| jest-axe                 | Accessibility testing                           |
| fishery                  | Test data factories                             |
| jest-canvas-mock         | Canvas API mocking                              |
| @googlemaps/jest-mocks   | Google Maps mocking                             |

### Build & Quality

| Technology  | Purpose                                                        |
| ----------- | -------------------------------------------------------------- |
| ESLint      | Linting (extends react-app, sonarjs, i18next plugin)           |
| Prettier    | Code formatting (with `@trivago/prettier-plugin-sort-imports`) |
| Husky       | Git hooks (pre-commit)                                         |
| lint-staged | Pre-commit linting on staged files                             |
| Storybook 8 | Component documentation and design system gallery              |
| Chromatic   | Visual regression testing                                      |
| Airbrake    | Error monitoring                                               |
| FullStory   | Session recording/analytics                                    |
| Web Vitals  | Performance monitoring                                         |

### Other Notable Libraries

- **Luxon** — Date/time handling (preferred over Moment)
- **lodash** — Utility functions
- **FullCalendar** — Calendar/scheduling UI
- **TipTap** — Rich text editor
- **TinyMCE** — Additional rich text editing
- **react-beautiful-dnd** — Drag and drop
- **reactflow** — Flow/node diagram visualization
- **lottie-react** — Animations
- **Fuse.js** — Fuzzy search
- **howler** — Audio playback
- **notistack** — Snackbar/toast notifications
- **Docuseal** — Signature capture
- **Yup** — Schema validation
- **query-string** — URL query parameter handling

---

## 3. Project Structure

```
evisit-ui/
├── .claude/                    # Claude Code settings
├── .github/                    # GitHub config (CODEOWNERS, dependabot, PR template, workflows)
├── .husky/                     # Git hooks (pre-commit runs check-types, lint, extract:check)
├── .storybook/                 # Storybook configuration (main.js, preview)
├── @fortawesome/               # Locally bundled Font Awesome Pro packages
├── bin/                        # CLI scripts (i18n extract, pseudo, spellcheck, lokalise, setup)
├── docs/                       # Project documentation
├── inf/                        # Infrastructure configuration
├── public/                     # Static assets, MSW worker, index.html
├── src/
│   ├── index.tsx               # App entry point (ReactDOM.render)
│   ├── Main.tsx                # Root routing component with lazy-loaded sub-apps
│   ├── Providers.tsx           # CoreProviders and AppProviders wrapper HOCs
│   ├── ErrorBoundary.tsx       # Global error boundary
│   ├── global-styles.ts        # Global styled-components styles
│   ├── setupTests.ts           # Jest global setup (MSW server, mocks, factories)
│   │
│   ├── app-admin/              # Admin sub-application
│   │   ├── Pages/              # Admin pages (Forms, Users, etc.)
│   │   ├── Settings/           # Admin settings (Practices, Video, Interpreter, Devices)
│   │   ├── components/         # Admin-specific components
│   │   ├── hooks/              # Admin hooks
│   │   └── paths.ts            # Admin route paths
│   │
│   ├── app-frontdoor/          # Public front door sub-application
│   ├── app-login/              # Login/auth sub-application
│   │   ├── LoginContent/       # Login flows (ForgotPassword, MFA, AccountLocked, etc.)
│   │   └── hooks/              # Login-specific hooks
│   │
│   ├── app-onboarding/         # First-time user onboarding
│   ├── app-patient/            # Patient sub-application
│   │   ├── Home/               # Patient home/dashboard
│   │   ├── Insurance/          # Insurance management
│   │   ├── HealthRecords/      # Health records
│   │   ├── UpcomingVisits/     # Upcoming visit management
│   │   ├── VisitHistory/       # Past visits
│   │   ├── MyAccount/          # Patient account settings
│   │   ├── Payments/           # Payment management
│   │   ├── ProviderSelect/     # Provider selection flow
│   │   ├── hooks/              # Patient-specific hooks
│   │   └── patient-common/     # Shared patient components
│   │
│   ├── app-provider/           # Provider sub-application
│   │   ├── Dashboard/          # Provider dashboard
│   │   ├── WaitingRoom/        # Virtual waiting room
│   │   ├── Patients/           # Patient management
│   │   ├── Scheduling/         # Appointment scheduling
│   │   ├── MyAccount/          # Provider account (Biography, Availability, Reports)
│   │   ├── CheckIn/            # Patient check-in
│   │   ├── VisitHistory/       # Visit history
│   │   ├── hooks/              # Provider-specific hooks
│   │   └── provider-common/    # Shared provider components
│   │
│   ├── app-qtc/                # QTC (Quality/Training/Compliance) sub-application
│   ├── app-registration/       # Patient registration flows
│   ├── app-video/              # Video visit sub-application
│   │   ├── api/                # Video-specific API (media quality stats)
│   │   ├── components/         # Video UI components
│   │   ├── hooks/              # Video hooks (telemetry, etc.)
│   │   └── services/           # Video services (MQS)
│   │
│   ├── ev-api/                 # API layer (RTK Query)
│   │   ├── api.ts              # Base API configuration (fetchBaseQuery, Tags enum)
│   │   ├── core/               # Core API endpoints organized by domain
│   │   │   ├── admin/          # Admin endpoints
│   │   │   ├── current-user/   # Current user CRUD
│   │   │   ├── patients/       # Patient endpoints
│   │   │   ├── providers/      # Provider endpoints
│   │   │   ├── scheduling/     # Scheduling endpoints
│   │   │   ├── visits/         # Visit lifecycle endpoints
│   │   │   ├── custom-forms/   # Custom forms endpoints
│   │   │   └── ...             # Many more domain modules
│   │   ├── cloudfront/         # CloudFront-specific API
│   │   ├── evault/             # eVault encryption API
│   │   ├── google-maps/        # Google Maps API
│   │   ├── pusher/             # Pusher real-time
│   │   ├── stripe/             # Stripe payments API
│   │   ├── thunks/             # RTK async thunks (optimistic updates)
│   │   └── common/             # Shared transformers, response types
│   │
│   ├── ev-common/              # Shared feature components used across apps
│   │   ├── Sidebar/            # Visit/patient sidebar
│   │   ├── CreateVisit/        # Visit creation flow
│   │   ├── CancelVisit/        # Visit cancellation
│   │   ├── Insurance/          # Insurance components
│   │   ├── HealthRecords/      # Health records components
│   │   ├── Scheduling/         # Scheduling components
│   │   ├── Settings/           # Settings components
│   │   └── ...                 # Many more shared components
│   │
│   ├── ev-components/          # ~70 reusable UI components (design system building blocks)
│   │   ├── Button/             # Button component
│   │   ├── Input/              # Text input
│   │   ├── Dialog/             # Dialog/modal
│   │   ├── Dropdown/           # Dropdown select
│   │   ├── DataGrid/           # Data grid (MUI X)
│   │   ├── Calendar/           # Calendar
│   │   ├── Text/               # Typography styles
│   │   ├── Avatar/             # User avatar
│   │   ├── Badge/              # Badge
│   │   ├── Banner/             # Banner notifications
│   │   ├── Tabs/               # Tab navigation
│   │   ├── Toast/              # Toast notifications
│   │   ├── Sidebar/            # Sidebar layout
│   │   ├── Drawer/             # Drawer panel
│   │   └── ...                 # Checkbox, RadioButtons, Toggle, Tag, etc.
│   │
│   ├── ev-config/              # Environment configuration (config.ts with env vars)
│   ├── ev-design-system/       # Storybook design system gallery and documentation
│   ├── ev-font/                # Custom fonts (Inter)
│   ├── ev-hooks/               # Shared custom React hooks
│   │   ├── navigate.tsx        # useAppNavigate (wraps useNavigate with unsaved changes)
│   │   ├── alert.tsx           # Alert context/provider
│   │   ├── dialog.tsx          # Dialog context/provider
│   │   ├── toast.tsx           # Toast context/provider
│   │   ├── layout.tsx          # Layout/responsive context
│   │   ├── mobile.tsx          # Mobile detection context
│   │   ├── commonData.tsx      # Current user, practice, primary user context
│   │   ├── analytics/          # Analytics tracking hooks
│   │   ├── environment.tsx     # Environment context/provider
│   │   └── ...                 # 30+ custom hooks
│   │
│   ├── ev-i18n/                # Internationalization setup
│   │   ├── i18n.ts             # i18next initialization
│   │   ├── index.ts            # Re-exports useTranslation, Trans, nt
│   │   └── locales/            # Translation JSON files per language
│   │
│   ├── ev-static/              # Static assets
│   ├── ev-store/               # Redux store
│   │   ├── store.ts            # Store configuration (configureStore)
│   │   ├── redux.tsx           # useAppDispatch, useAppSelector, ReduxProvider
│   │   ├── actions.ts          # Re-exports all slice actions
│   │   └── slices/             # Redux slices (auth, sidebar, drawer, etc.)
│   │
│   ├── ev-test/                # Test utilities
│   │   ├── test-utils.tsx      # Custom render, server, waitForRequest, factories
│   │   ├── request-handlers/   # MSW request handlers per API domain
│   │   ├── test-mocks/         # Factory-built test data (fishery)
│   │   └── polyfills/          # Test polyfills (MediaStream, etc.)
│   │
│   ├── ev-theme/               # MUI theme configuration
│   │   ├── theme.ts            # createTheme with custom palette, typography, breakpoints
│   │   ├── styles/             # EVColors, palette, typography, breakpoints
│   │   └── components/         # MUI component style overrides
│   │
│   ├── ev-types/               # TypeScript type definitions
│   │   ├── index.ts            # Re-exports all types
│   │   ├── account.ts, address.ts, visit.ts, ...
│   │   └── environments.ts     # Environment enum
│   │
│   ├── ev-utils/               # Utility functions
│   │   ├── formatters.ts       # Input formatters (phone, credit card, etc.)
│   │   ├── date-time.ts        # Date/time utilities (Luxon-based)
│   │   ├── browser.ts          # Browser detection utilities
│   │   ├── form.ts             # Form utility functions
│   │   └── ...                 # 30+ utility modules
│   │
│   └── processors/             # Video processors (Gaussian blur, virtual background)
```

### Folder Naming Conventions

- **`app-*`** — Top-level sub-applications, lazy-loaded from `Main.tsx`
- **`ev-*`** — Shared libraries/modules (prefixed with `ev-` for "eVisit")
  - `ev-api` — API layer
  - `ev-components` — Reusable UI components
  - `ev-common` — Shared feature-level components
  - `ev-hooks` — Custom React hooks
  - `ev-store` — Redux store and slices
  - `ev-types` — TypeScript type definitions
  - `ev-utils` — Utility functions
  - `ev-theme` — MUI theme and styling
  - `ev-config` — Environment config
  - `ev-i18n` — Internationalization
  - `ev-test` — Testing utilities
  - `ev-assets` — Static assets
  - `ev-font` — Fonts
  - `ev-static` — Static files
  - `ev-design-system` — Storybook design system gallery

---

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

---

## 6. Product Context & Features

### Domain Terminology

| Term                            | Definition                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| **Visit**                       | A telehealth encounter between a provider and patient (can be video, phone, or async) |
| **Provider**                    | Healthcare professional (doctor, nurse, staff)                                        |
| **Patient**                     | Person seeking healthcare                                                             |
| **Practice**                    | Healthcare organization/clinic                                                        |
| **Customer**                    | The organization that owns/operates practices                                         |
| **Waiting Room**                | Virtual queue where patients wait for providers                                       |
| **Front Door**                  | Public-facing entry point for a specific customer                                     |
| **Check-In**                    | Patient pre-visit verification process                                                |
| **Express Room**                | Quick/immediate visit option                                                          |
| **Calendar Blocks**             | Provider availability time blocks                                                     |
| **Visit Types**                 | Categories of visits (e.g., general, follow-up, urgent)                               |
| **Visit Statuses**              | Lifecycle states of a visit                                                           |
| **Custom Forms**                | Dynamic forms for data collection (intake, charts, etc.)                              |
| **Custom Actions**              | Configurable actions for visit management                                             |
| **Custom Columns**              | Configurable data grid columns                                                        |
| **Personal Filter Views (PFV)** | Saved filter/view configurations for waiting room and grids                           |
| **Segments**                    | Waiting room queue segments/categories                                                |
| **Charting**                    | Provider documentation during/after a visit                                           |
| **eVault**                      | Encrypted document storage service                                                    |
| **eData**                       | Electronic data service                                                               |
| **QTC**                         | Quality, Training, and Compliance module                                              |
| **CDX**                         | Clinical Document Exchange                                                            |
| **Mimic**                       | Environment impersonation/proxy feature                                               |
| **Biometrics**                  | Biometric authentication (fingerprint, face)                                          |
| **DoseSpot**                    | E-prescribing integration                                                             |
| **Journey**                     | Multi-step guided workflows                                                           |

### Main User Flows

**Patient Flow:**

1. Registration / Login (with MFA, biometrics support)
2. Select dependent (if applicable)
3. Select visit type
4. Select provider and time slot
5. Fill health records / insurance / intake forms
6. Make payment
7. Enter waiting room / check in
8. Join video visit
9. Post-visit survey
10. View visit history

**Provider Flow:**

1. Login
2. View waiting room / dashboard
3. Manage availability / calendar blocks
4. Accept / initiate visits
5. Conduct video visits with charting
6. Prescribe medications (DoseSpot)
7. Complete / co-sign visits
8. View reports and visit history
9. Manage account, biography, settings

**Admin Flow:**

1. Manage practice settings
2. Configure visit types, statuses, custom actions, custom columns
3. Manage users and roles
4. Configure custom forms
5. Manage video backgrounds
6. Configure interpreter services
7. Manage practice devices

### Realtime Features

- **Pusher** — Waiting room updates, visit status changes, chat messages, notifications.
- **SignalR** — Additional real-time communication channels.
- **Auto-logout** — Session management with keepalive and timeout.
- **Unsaved changes detection** — Warns users when navigating away from unsaved forms.

### Mobile Support

- Responsive design with 3 breakpoints: desktop (1280px+), tablet (900px), mobile (500px).
- React Native WebView bridge (`window.ReactNativeWebView`) for native mobile app embedding.
- Mobile-specific components (MobileDrawer, MobileHeader, MobileBar).
- Touch-friendly interactions (use-long-press, tap highlight removal).

---

## 7. Accessibility Guidelines for Claude

### 7.1 Core Principles

This project targets **WCAG 2.1 Level AA** compliance. As a telehealth platform serving patients — including elderly users, people with disabilities, and individuals under medical stress — accessibility is not optional. Every interface Claude builds must be perceivable, operable, understandable, and robust (the four POUR principles).

Key guiding rules:

- **Semantic HTML first** — Use correct HTML elements before reaching for ARIA. A `<button>` is always better than a `<div role="button">`.
- **No information conveyed by color alone** — Always pair color with text, icons, or patterns (critical for visit status indicators, error states, and alerts).
- **Keyboard-first design** — Every interactive element must be operable with keyboard alone. Many providers use keyboard shortcuts heavily during video visits.
- **Screen reader coherence** — The UI must make sense when read linearly. Labels, headings, and landmark regions must tell a complete story.
- **Telehealth context matters** — Patients may be anxious, in pain, or cognitively impaired. Providers may be multitasking during video calls. Simplicity and clarity are accessibility features.

### 7.2 Actions Claude Must Take When Building New Interfaces

Claude **must** follow this checklist for every new component, page, or feature:

#### Semantic Structure

1. **Use correct heading hierarchy** (`h1` > `h2` > `h3`). Never skip heading levels. Each page must have exactly one `h1`. Use `Text.Title`, `Text.Subtitle`, etc. from `ev-components/Text` with the appropriate semantic element.
2. **Use landmark regions** — Wrap major sections in `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, or use `role="region"` with `aria-label` for custom sections.
3. **Use semantic elements** — `<button>` for actions, `<a>` for navigation, `<ul>`/`<ol>` for lists, `<table>` for tabular data. Never use `<div>` or `<span>` as interactive elements.
4. **Use `<section>` with `aria-label`** for distinct content regions (e.g., waiting room segments, visit history sections).

#### ARIA Attributes

5. **Always provide accessible names** — Every interactive element needs an accessible name. Use visible `label`, `aria-label`, or `aria-labelledby`. The project's `Input` component already enforces this via the `AccessibleLabelProps` discriminated union — follow this pattern:
   ```tsx
   // Input requires one of: label, ariaLabel, or labelledBy
   <Input id="search" ariaLabel={t('Search patients')} />
   ```
6. **Use `aria-describedby`** for supplementary instructions or error messages on form fields:
   ```tsx
   <Input
     id="phone"
     ariaDescribedBy="phone-hint"
     label={t('Phone Number')}
   />
   <Text.Caption id="phone-hint">{t('Format: (555) 123-4567')}</Text.Caption>
   ```
7. **Use `aria-live` regions** for dynamic content updates:
   - `aria-live="polite"` for non-urgent updates (waiting room count changes, status updates).
   - `aria-live="assertive"` for urgent messages (video call disconnection, error alerts).
   - The project already uses `role="alert"` in `Snackbar` and `role="status"` in `LoadingIndicator` — follow these patterns.
8. **Use `aria-busy="true"`** on containers whose content is loading. The `Button` component already does this — apply the same pattern to page sections and data grids.
9. **Use `aria-expanded`** on toggles that show/hide content (dropdowns, accordions, drawers).
10. **Use `aria-current="page"`** for the active navigation link in sidebars and tab bars.

#### Keyboard Navigation

11. **Ensure logical tab order** — Follow the visual reading order. Never use positive `tabIndex` values (only `0` or `-1`).
12. **Implement focus management** for modals, drawers, and route changes:
    - Trap focus inside open Dialogs and Drawers (MUI does this by default — do not disable it).
    - Return focus to the trigger element when a Dialog/Drawer closes (the `Dialog` component already manages this via `cancelButtonRef`).
    - On route changes or page loads, move focus to the main content area or the primary heading.
13. **Support keyboard shortcuts** for common actions where appropriate:
    - `Escape` to close Dialogs, Drawers, and Dropdowns (MUI handles this — do not disable it).
    - `Enter`/`Space` to activate buttons and select options.
    - Arrow keys for navigation within composite widgets (tabs, menus, data grids).
14. **Visible focus indicators** — The project uses a standard focus style (`box-shadow: 0px 0px 0px 2px ${EVColors.cobalt}, 0px 0px 0px 4px ${EVColors.selectedHover}`). Never remove or override `&:focus-visible` styles. Apply the same pattern to custom interactive elements:
    ```tsx
    const StyledCard = styled.div`
      &:focus-visible {
        box-shadow:
          0px 0px 0px 2px ${EVColors.cobalt},
          0px 0px 0px 4px ${EVColors.selectedHover};
        outline: none;
      }
    `;
    ```

#### Color and Contrast

15. **Maintain minimum contrast ratios** — 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold), 3:1 for UI components and graphical objects. Use `EVColors` from `ev-theme/styles` — the theme colors are designed to meet these ratios on white backgrounds.
16. **Never use color as the sole indicator** — Visit statuses, form errors, success/warning states must include text labels or icons alongside color. Use the `Banner` component pattern for status messaging which combines color, icon, and text.
17. **Support high contrast mode** — Use semantic color tokens from `EVColors.surface.*`, `EVColors.text.*`, `EVColors.border.*`, and `EVColors.icon.*` rather than raw color names. These tokens are designed for consistent contrast.

#### Forms and Error Handling

18. **Associate labels with inputs** — Every form field must have a visible label or `aria-label`. Use `label` prop on `Input`, `Dropdown`, and other form components.
19. **Mark required fields** — Use the `required` prop. The `Input` component automatically adds `aria-required` and a visual asterisk. Never use `DO_NOT_USE_removeAsterisk` on new code.
20. **Display inline error messages** — Use the built-in `error` state and `helperText` from React Hook Form + `useController`. Error messages appear next to the field with an icon (`faCircleExclamation`), not just as a toast.
21. **Provide error summaries** — For multi-field forms (registration, insurance, intake), provide an error summary at the top of the form when submission fails. Use `aria-live="polite"` for the summary.
22. **Use descriptive error messages** — Not "Invalid input" but "Phone number must be 10 digits". All error messages must be translated via `t()`.

#### Images and Media

23. **Provide alt text for all images** — Decorative images get `alt=""`, informational images get descriptive alt text. Avatar components displaying user photos should include the user's name.
24. **Video call accessibility** — Video visit interfaces must include:
    - Text labels for all video controls (mute, camera, screen share, end call).
    - Status announcements for call state changes (`aria-live` region for "Connecting...", "Connected", "Disconnected").
    - Captions/transcript support when available.
    - Keyboard-operable controls for all video actions.

#### Data Tables and Grids

25. **Use MUI DataGrid's built-in accessibility** — The `@mui/x-data-grid-pro` provides keyboard navigation and ARIA attributes. Do not override its accessibility features.
26. **Provide accessible column headers** — Every column must have a clear `headerName`. Use `aria-sort` on sortable columns.
27. **Announce dynamic updates** — When the grid data changes (e.g., waiting room refreshes), use `aria-live` to announce the change count.

### 7.3 Testing Accessibility

#### Automated Testing with jest-axe

The project has a built-in `validateAccessibility` utility. **Claude must include an accessibility test in every new test file:**

```tsx
import { render, validateAccessibility } from 'ev-test/test-utils';

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  await validateAccessibility(container);
});
```

This runs the axe-core engine against the rendered DOM and fails on any WCAG 2.1 AA violations. Include this test for:

- Every new `ev-components/*` component.
- Every new page or major feature section.
- Form states: empty, filled, error, disabled, and loading states should all be tested.

#### Manual Verification Checklist

When building a new feature, Claude should document in its response that it has considered:

1. **Keyboard-only navigation** — Can you reach and activate every interactive element with Tab, Enter, Space, Escape, and Arrow keys?
2. **Screen reader flow** — Does the content make sense when read linearly? Are labels, headings, and regions present?
3. **Focus management** — After opening/closing a dialog or navigating, does focus go to the right place?
4. **Color independence** — Remove all color: is the information still conveyed?
5. **Zoom at 200%** — Does the layout remain usable at 200% browser zoom?

#### Tools to Recommend

- **axe DevTools** (browser extension) — For manual auditing during development.
- **Lighthouse Accessibility audit** — For overall page-level scoring.
- **NVDA / VoiceOver** — For screen reader testing (VoiceOver on macOS, NVDA on Windows).
- **Storybook a11y addon** — The project uses Storybook 8; check accessibility in component stories.

---

## 8. Responsive Design Guidelines for Claude

### 8.1 Core Principles

This project follows a **desktop-first approach with explicit breakpoints** for tablet and mobile. The application is embedded in a React Native WebView for mobile native apps, so responsive behavior must work correctly in both browser and WebView contexts.

#### Breakpoint System

The project defines custom breakpoints in `ev-static/breakpoints.ts`:

| Breakpoint                    | Width    | Description                                      |
| ----------------------------- | -------- | ------------------------------------------------ |
| `BreakPoints.MobileSmall`     | 384px    | Small mobile screens                             |
| `BreakPoints.Mobile`          | 744px    | Mobile threshold (width <= 744px)                |
| `BreakPoints.MobileLandscape` | 932px    | Mobile landscape detection (with height < width) |
| `BreakPoints.Tablet`          | 1024px   | Tablet threshold (745px - 1024px)                |
| Desktop                       | > 1024px | Default desktop layout                           |

The MUI theme overrides the default breakpoints in `ev-theme/styles/Breakpoints.ts`:

```tsx
// MUI custom breakpoints (applied as "up from" thresholds)
{
  mobile: 0,        // 0px and up
  tablet: 744,      // 744px and up (maps to BreakPoints.Mobile)
  desktop: 1024,    // 1024px and up (maps to BreakPoints.Tablet)
}
```

**Important:** MUI breakpoints work as "minimum width and up," so `tablet` means "from 744px up" (i.e., tablet and larger). The custom `useLayout()` hook provides boolean flags that are simpler to reason about.

#### The `useLayout()` Hook — Primary Responsive Mechanism

The project's standard pattern for responsive behavior is the `useLayout()` hook from `ev-hooks/layout`. **Always use this hook** instead of CSS media queries for layout-dependent logic:

```tsx
import useLayout from 'ev-hooks/layout';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, isMobileLandscape, isLargeMobile } =
    useLayout();

  return (
    <Wrapper>
      {isDesktop && <Sidebar />}
      <Content $fullWidth={!isDesktop}>
        {isMobile ? <MobileHeader /> : <DesktopHeader />}
        {/* ... */}
      </Content>
    </Wrapper>
  );
};
```

The hook also exposes `width`, `height`, `hideHeader`, `hideTopbar`, and `isEmbedded` for advanced layout control.

### 8.2 Actions Claude Must Take When Building New Interfaces

Claude **must** follow this checklist for every new component, page, or feature:

#### Layout and Structure

1. **Use `useLayout()` for layout decisions** — Do not use `window.innerWidth` directly or create custom resize listeners. The `LayoutProvider` already handles resize events (including iOS Chrome and React Native WebView quirks).
2. **Design for all three breakpoints** — Every new page/feature must work at desktop (> 1024px), tablet (745px - 1024px), and mobile (<= 744px). Provide explicit mobile and tablet layouts, not just "it fits."
3. **Use MUI Grid with custom breakpoints** for layout grids:

   ```tsx
   import Grid from '@mui/material/Grid';

   <Grid container spacing={2}>
     <Grid item desktop={6} mobile={12} tablet={8}>
       <PatientInfo />
     </Grid>
     <Grid item desktop={6} mobile={12} tablet={4}>
       <VisitDetails />
     </Grid>
   </Grid>;
   ```

4. **Use MUI Stack** for simple flex layouts with consistent spacing:
   ```tsx
   <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
     <Button id="accept" label={t('Accept')} />
     <Button id="reject" label={t('Reject')} variant={ButtonTypes.Secondary} />
   </Stack>
   ```
5. **Avoid fixed widths** — Use `max-width`, `min-width`, `width: 100%`, or `calc()` for fluid layouts. Pixel widths are acceptable only for icons, avatars, and design system tokens.

#### Responsive Components

6. **Buttons must be full-width on mobile** — Follow the `Dialog` component pattern where buttons get `fullWidth={isMobile}`:
   ```tsx
   <Button fullWidth={isMobile} id="submit" label={t('Submit')} />
   ```
7. **Dialogs must adapt to viewport** — The `Dialog` component already uses `width: isMobile ? 'calc(100vw - 48px)' : 560` — follow this pattern for any custom dialogs or modals.
8. **Data grids must have mobile alternatives** — `MUI DataGrid` is not usable on mobile. Provide a card/list view for mobile breakpoints:
   ```tsx
   {
     isDesktop || isTablet ? (
       <DataGrid columns={columns} rows={rows} />
     ) : (
       <MobileCardList items={rows} />
     );
   }
   ```
9. **Sidebars become drawers on mobile** — Desktop sidebars should convert to full-screen drawers or bottom sheets on mobile. Use `MobileDrawer` patterns from the existing codebase.
10. **Tab navigation adapts** — Use scrollable tabs on mobile instead of wrapping. MUI Tabs supports `variant="scrollable"` and `scrollButtons="auto"`.

#### Touch and Interaction

11. **Minimum touch target size: 44x44px** — All tappable elements on mobile must meet this minimum (WCAG 2.5.8 Target Size). Buttons, links, icons, and form controls must have adequate hit areas. The project's `ButtonSize.Large` is appropriate for mobile touch targets.
12. **Avoid hover-dependent interactions on mobile** — Tooltips, hover previews, and hover menus have no equivalent on touch. Provide tap or long-press alternatives. The project uses `use-long-press` for long-press interactions.
13. **Handle virtual keyboard** — Forms on mobile must account for the virtual keyboard pushing content up. Ensure submit buttons remain visible when the keyboard is open.

#### Typography and Content

14. **Use relative font sizes** — The project's `TypographyTheme` defines the type scale. Never use hardcoded pixel values for font sizes in component styles. Let the theme handle sizing.
15. **Truncate long text responsibly** — Use `text-overflow: ellipsis` with a tooltip for the full text on desktop. On mobile, consider allowing text to wrap instead:
    ```tsx
    const Title = styled(Text.Body)`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: ${p => (p.$isMobile ? 'normal' : 'nowrap')};
    `;
    ```
16. **Ensure readability** — Line length should not exceed 75 characters for body text. On wide screens, constrain content width with `max-width`.

#### Images and Media

17. **Use responsive images** — Set `max-width: 100%` and `height: auto` on images. For the video visit interface, the video container must resize fluidly.
18. **Handle landscape and portrait** — The `isMobileLandscape` flag from `useLayout()` detects landscape orientation on mobile devices. The video visit UI should adapt its layout for landscape mode (side-by-side participant views).

#### Telehealth-Specific Responsive Considerations

19. **Video visit layout** — The video interface must support:
    - Full-screen video on mobile with overlay controls.
    - Side-by-side participant views on desktop.
    - Landscape mode optimization on mobile.
    - Minimal UI during active calls with expandable controls.
20. **Waiting room adaptability** — The waiting room (provider view) shows a data grid on desktop but must use a card-based list on mobile with clear patient status indicators.
21. **Form flows (intake, registration, insurance)** — Multi-step forms should use a single-column layout on mobile with step indicators that adapt from horizontal (desktop) to vertical or minimal (mobile).
22. **Navigation** — Desktop uses the sidebar navigation. Mobile uses a bottom bar or hamburger menu with the `MobileBar` and `MobileHeader` components from the project.

### 8.3 Responsive Patterns in This Project

#### Pattern 1: Conditional Rendering with `useLayout()`

The most common responsive pattern in this codebase. Components render different structures based on viewport:

```tsx
import useLayout from 'ev-hooks/layout';

const WaitingRoom = () => {
  const { isMobile, isTablet, isDesktop } = useLayout();

  return (
    <Wrapper>
      {isDesktop && <WaitingRoomSidebar />}
      {isMobile ? <MobileWaitingRoomList /> : <WaitingRoomDataGrid />}
    </Wrapper>
  );
};
```

#### Pattern 2: Responsive Styled Components with Transient Props

Pass layout flags as transient props (prefixed with `$`) to styled-components:

```tsx
const Container = styled.div<{ $isMobile: boolean }>`
  padding: ${p => (p.$isMobile ? '16px' : '24px')};
  flex-direction: ${p => (p.$isMobile ? 'column' : 'row')};
  gap: ${p => (p.$isMobile ? '12px' : '24px')};
`;

// Usage
const { isMobile } = useLayout();
<Container $isMobile={isMobile}>{children}</Container>;
```

#### Pattern 3: MUI `sx` Prop with Theme Breakpoints

Use for one-off responsive adjustments on MUI components:

```tsx
<Stack
  sx={{
    flexDirection: { mobile: 'column', tablet: 'row', desktop: 'row' },
    gap: { mobile: 1, tablet: 2, desktop: 3 },
    padding: { mobile: '16px', desktop: '24px' },
  }}
>
  {children}
</Stack>
```

#### Pattern 4: Full-Width Mobile Dialogs

Dialogs adapt their width and button layout based on viewport:

```tsx
<Dialog
  width={isMobile ? 'calc(100vw - 48px)' : 560}
  // Buttons become full-width and centered on mobile
  // Button variant changes to Secondary on mobile
/>
```

#### Pattern 5: Test Rendering at Different Layouts

The custom `render` utility from `ev-test/test-utils` supports a `layout` option for testing responsive behavior:

```tsx
test('renders mobile layout', () => {
  render(<MyComponent />, { layout: 'mobile' });
  expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
  expect(screen.queryByTestId('desktop-sidebar')).not.toBeInTheDocument();
});

test('renders desktop layout', () => {
  render(<MyComponent />, { layout: 'desktop' });
  expect(screen.getByTestId('desktop-sidebar')).toBeInTheDocument();
});
```

**Always write responsive tests** — at minimum, test the mobile and desktop layouts for any new page or component that has responsive behavior.

#### Pattern 6: React Native WebView Considerations

When the app runs inside React Native WebView (`isReactNative()` from `ev-config/config`), the `LayoutProvider` uses `document.body.clientWidth` instead of `window.innerWidth` due to iOS Chrome bugs. Additionally:

- The `isEmbedded` flag from `useLayout()` indicates the app is embedded in a native shell.
- URL search params `layout`, `hide`, and `embedded` allow the native shell to override layout behavior.
- Mobile-specific components (`MobileBar`, `MobileHeader`, `MobileDrawer`) integrate with the native navigation via `useMobile()` hook.

---

## 9. Versioning Guidelines

### 9.1 When Claude Should Proactively Suggest Versioning

This project uses a **calendar-based release versioning** scheme (e.g., `release-2026.1.5`, `release-2025.5.6.1`). The `package.json` version field is fixed at `0.1.0` and is not used for release tracking. Versioning is managed through **release branches** and **Git tags**, not through package version bumps.

Claude should proactively raise the topic of versioning when:

- **A new feature is merged to `staging`** that is intended for a specific release cycle. Ask the developer which release branch the work targets.
- **A breaking change is introduced** (API contract changes, removed components, changed props, removed Redux slices, renamed exports). Flag that this may require a dedicated release or a patch release.
- **A hotfix or patch is needed** for a production issue. Suggest creating a branch from the appropriate release branch (e.g., `release-2026.1.5` becomes `release-2026.1.5.1` for a patch).
- **A significant dependency upgrade** is performed (React, MUI, RTK, Twilio, i18next major versions). These should be coordinated with a release cycle.
- **Multiple features have accumulated on `staging`** without a release cut. Remind the developer to coordinate with the team on the next release.

### 9.2 Versioning Strategy

**Release branch naming format:** `release-YYYY.Q.N[.P]`

| Segment         | Meaning                                    | Example       |
| --------------- | ------------------------------------------ | ------------- |
| `YYYY`          | Calendar year                              | `2026`        |
| `Q`             | Release cycle number within the year       | `1`, `2`, `5` |
| `N`             | Sequential release number within the cycle | `1`, `2`, `3` |
| `.P` (optional) | Patch number for hotfixes on a release     | `.1`, `.2`    |

**Examples from the repository:**

- `release-2026.1.5` — Year 2026, cycle 1, release 5
- `release-2025.5.6.1` — Year 2025, cycle 5, release 6, patch 1

**Branch flow:**

1. Feature branches (`CU-#_description`) are created from `staging`.
2. PRs are merged into `staging` (the main development branch).
3. Release branches are cut from `staging` when a release is prepared.
4. Hotfixes branch from the release branch and merge back into both the release branch and `staging`.

**Dependency version updates** are handled by Dependabot, which targets `staging` with daily checks and uses the `Yarn` commit prefix (e.g., `Yarn(deps): Bump twilio-video from 2.33.0 to 2.34.0`).

### 9.3 Version Bump Checklist

Since this project does not use semantic versioning in `package.json`, there is no version bump step. Instead, when a release is being prepared, Claude should verify:

- [ ] All intended feature branches have been merged to `staging`.
- [ ] CI passes on `staging` (type checks, linting, prettier, Storybook build).
- [ ] Tests pass on `staging` (test suite via `tests-pull-request.yml`).
- [ ] Translation updates are current (Lokalise PRs merged).
- [ ] No unresolved Dependabot security PRs for production dependencies.
- [ ] The release branch name follows the `release-YYYY.Q.N` convention.
- [ ] If this is a patch release, the branch name appends `.P` to the base release (e.g., `release-2026.1.5.1`).

---

## 10. Commit Guidelines

### 10.1 Commit Message Convention

This project uses a **ClickUp task ID prefix** convention, not strict Conventional Commits. Based on the repository history, commit messages follow these patterns:

**Pattern 1 — Feature/fix work (most common):**

```
CU-<taskId>: <Short description of the change>
```

Examples from the repo:

- `CU-86b738cnw: Refactor: unify empty state overlays`
- `CU-86b7takgr: Add ScheduleNode`
- `CU-86b82ejbb: fixes showing correct default pfv when switching practices`
- `CU-86b7xvxx5: fixes chat disabled button logic`

**Pattern 2 — ClickUp ID with dash separator (also common):**

```
CU-<taskId> - <Short description of the change>
```

Examples from the repo:

- `CU-86b82bc4d - Service Line - Form statuses fail to update in default queue`
- `CU-86b81ueqw - Remove feature_flag_reset_video_connection`
- `CU-86b7c07d2 - [FE] Disable Groups and Providers when Unavailable`

**Pattern 3 — Dependency bumps (Dependabot automated):**

```
Yarn(deps): Bump <package> from <old> to <new>
Yarn(deps-dev): Bump <package> from <old> to <new>
```

**Pattern 4 — Translation updates (Lokalise automated):**

```
Lokalise: updates
Translations update
```

**Pattern 5 — Standalone improvements (no ClickUp task):**

```
<Action verb> <description> (CU-<taskId>) (#<PR number>)
```

Examples from the repo:

- `Improve VisitCanceled tests (CU-86b83949q) (#8965)`
- `Remove unused video redux selectors (CU-86b83583w) (#8960)`
- `Minor video code simplification (CU-86b7zvuwn) (#8916)`

### 10.2 When Claude Should Proactively Suggest Commits

Claude should suggest creating a commit when:

- **A logical unit of work is complete** — A component is finished, a bug fix is applied, a test suite is written. Do not wait until multiple unrelated changes accumulate.
- **Before switching contexts** — If the developer is about to work on a different task, feature, or file area, suggest committing the current work first.
- **After completing tests** — Tests for a feature should be committed together with (or immediately after) the feature code, not left unstaged.
- **After a refactor is stable** — Refactoring changes should be committed separately from feature changes so they can be reviewed independently.
- **After resolving a merge conflict** — Commit immediately after conflict resolution to avoid losing the resolution.
- **When the working tree has many changed files** — If more than 5-8 files have been modified, suggest committing to keep change sets reviewable and the PR checklist item of ~200 lines satisfied.

Claude should **not** suggest committing when:

- The code does not compile (`yarn check-types` would fail).
- Linting errors are present (`yarn lint` would fail).
- The change is incomplete and would leave the app in a broken state.
- Only auto-generated files have changed (e.g., `yarn.lock` alone without `package.json` changes).

### 10.3 Commit Title and Description Templates

**Feature (new functionality):**

```
CU-<taskId>: Add <feature name>

- Implement <component/hook/endpoint>
- Add unit tests for <feature>
- Update translations for new user-facing strings
```

**Bug fix:**

```
CU-<taskId>: Fix <concise description of the bug>

- Root cause: <brief explanation>
- Solution: <what was changed>
- Add regression test
```

**Refactor:**

```
CU-<taskId>: Refactor: <what was restructured>

- Extract <component/hook/utility> from <original location>
- No functional changes
- Update affected tests
```

**Test improvement:**

```
Improve <ComponentName> tests (CU-<taskId>)

- Add tests for <specific scenarios>
- Increase coverage for <area>
```

**Chore / cleanup:**

```
CU-<taskId>: Remove <unused code/feature flag/deprecated pattern>

- Clean up <what was removed>
- No user-facing changes
```

**Documentation (rare, only when explicitly requested):**

```
CU-<taskId>: Document <what was documented>
```

### 10.4 Branch Naming Convention

**Primary format:** `CU-<taskId>_<description-with-dashes>`

| Component   | Rule                                               | Example                      |
| ----------- | -------------------------------------------------- | ---------------------------- |
| Prefix      | Always `CU-` followed by the ClickUp task ID       | `CU-86b738cnw`               |
| Separator   | Underscore `_` between the task ID and description | `_`                          |
| Description | Kebab-case summary of the work                     | `unify-empty-state-overlays` |

**Examples from the repository:**

- `CU-86b813qag_practice-and-group-availabilities-distinguish-bulk`
- `CU-86b7vmbwe_Audio-to-Video-Permission-Denied-notification-is-not-presenting`
- `CU-86b738cnw_Refactor-unify-empty-state-overlays`
- `CU-86b82ejbb_Custom-Views-Issues-when-switching-between-practices`

**Special branch types:**

- **Dependabot:** `dependabot/npm_and_yarn/staging/<package-name>-<version>`
- **Lokalise (translations):** `lokalise-YYYY-MM-DD_HH-MM-SS`
- **Release:** `release-YYYY.Q.N[.P]`
- **Hotfix:** `CU-<taskId>_hotfix` or `hotfix-<description>`
- **Patch:** `CU-<taskId>_patch` or `<description>-patch`
- **Candidate release:** `CU-<taskId>-candidate-release-YYYY.Q.N`

**What Claude should do:**

- When creating a branch, always ask for the ClickUp task ID if not provided.
- Format the branch name as `CU-<taskId>_<short-kebab-description>`.
- Keep the description concise (under 60 characters).
- Never include spaces or special characters other than dashes and underscores.

---

## 11. Refactoring & Improvement Guidelines

### 11.1 When Claude Should Proactively Identify Improvements

Claude should flag potential improvements in these situations:

- **While implementing a feature** — If the surrounding code has issues that make the feature harder to implement or maintain, note them.
- **While reading existing code** for context — If patterns violate the project's established conventions (Section 4), flag them.
- **While writing tests** — If the code under test is hard to test due to tight coupling, excessive side effects, or poor separation of concerns, suggest refactoring.
- **During code review** — When reviewing a PR or diff, identify improvements beyond the immediate scope that could be follow-up tasks.
- **When a file exceeds ~300 lines** — Large files are a signal that the component or module may benefit from decomposition.
- **When a function exceeds cyclomatic complexity 15** — The ESLint rule already enforces this, but Claude should proactively simplify before the linter flags it.

Claude should **not** proactively refactor when:

- The change is outside the scope of the current task.
- The refactoring would cause a large diff that obscures the actual feature/fix work.
- The code is in a shared module (`ev-components`, `ev-hooks`, `ev-utils`) and the refactoring would require updating many consumers without tests to verify correctness.
- The developer has explicitly asked for a minimal change.

### 11.2 Areas to Watch For

#### Code Smells

- **Duplicated logic** — Same API transformation, validation rule, or UI pattern implemented in multiple places. Suggest extracting to `ev-utils`, `ev-hooks`, or `ev-common`.
- **Overly complex components** — Components that handle rendering, state management, API calls, and business logic all in one file. Suggest splitting into a container/presentation pattern or extracting custom hooks.
- **Prop drilling beyond 2 levels** — If a prop is passed through 3+ components unchanged, suggest using React Context or Redux.
- **Unused exports, variables, or imports** — Dead code increases maintenance burden. Flag for removal.
- **Any usage of `any` type** — TypeScript `any` defeats the purpose of the type system. Suggest `unknown` with type guards or proper typing.
- **Magic numbers and strings** — Suggest extracting to named constants or enums.
- **Inconsistent error handling** — Some API calls may silently fail. Ensure RTK Query errors are handled in the UI.

#### Performance Issues

- **Missing `useMemo` / `useCallback`** for expensive computations or functions passed as props to memoized children.
- **Unnecessary re-renders** — Components that re-render on every parent render when their props have not changed. Suggest `React.memo` where appropriate.
- **Large component trees rendered unconditionally** — Suggest lazy loading (`React.lazy`) for sub-apps and heavy components (already used in `Main.tsx`; ensure new heavy components follow the same pattern).
- **Unbounded lists** — Rendering hundreds of items without virtualization. The project uses `@mui/x-data-grid-pro` for grids; ensure custom lists also use virtualization when item counts can exceed ~50.
- **Redundant API calls** — RTK Query cache tags should prevent duplicate fetches. If a component triggers a fetch that another component already caches, suggest using the same cache tag.

#### Security Concerns

- **User input rendered as HTML** — Any use of `dangerouslySetInnerHTML` or TipTap/TinyMCE output must be sanitized (DOMPurify or equivalent).
- **Sensitive data in Redux store** — Ensure PII (patient health records, SSN, insurance details) is not persisted beyond the session. Check for accidental logging.
- **Authentication token handling** — The auth token is in the Redux store and sent via `Secure-Authentication-Token` header. Ensure no code logs or exposes this token.
- **URL parameters** — Never put sensitive data in URL query parameters (they appear in browser history and server logs). Use POST body or Redux state.

#### Accessibility Gaps

- **Missing `aria-label`** on icon-only buttons.
- **Missing `aria-live` regions** for dynamic content (waiting room updates, form submission results, toast notifications).
- **Missing keyboard handlers** on custom interactive elements.
- **Color-only status indicators** without text or icon alternatives.
- Refer to Section 7 for the complete accessibility checklist.

#### Test Coverage

- **Untested edge cases** — Error states, empty states, loading states, boundary values.
- **Missing accessibility tests** — Every new component should include `validateAccessibility()`.
- **Missing responsive tests** — Components with `useLayout()` should be tested at both `mobile` and `desktop` layouts.
- **Missing MSW handlers** — New API endpoints need corresponding handlers in `ev-test/request-handlers/`.

#### Dead Code and Outdated Patterns

- **Removed feature flags** — If a feature flag is fully rolled out, the flag check and the legacy code path should be removed (e.g., `CU-86b81ueqw - Remove feature_flag_reset_video_connection`).
- **Unused Redux selectors or slices** — If a slice or selector is no longer referenced, remove it (e.g., `Remove unused video redux selectors`).
- **Deprecated component usage** — If `ev-components` has a newer version of a component, flag the old usage for migration.
- **Direct imports from restricted modules** — Any import violating the restricted imports table in Section 4 must be corrected.

### 11.3 How Claude Should Suggest Improvements

When identifying an improvement, Claude should use this structured format:

```
**Improvement: <Short title>**
- Severity: Low | Medium | High | Critical
- Effort: Small (< 1 hour) | Medium (1-4 hours) | Large (4+ hours)
- Impact: <What improves — performance, maintainability, accessibility, security, test coverage>
- Description: <What the issue is and what the suggested change looks like>
- Location: <File path(s) and line numbers>
```

**Severity definitions:**

- **Critical** — Security vulnerability, data loss risk, or accessibility blocker. Must be fixed before merging.
- **High** — Bug, significant performance issue, or pattern that will cause problems at scale. Should be fixed in the current PR or as an immediate follow-up.
- **Medium** — Code smell, minor performance concern, or convention violation. Should be tracked as a follow-up task.
- **Low** — Stylistic improvement, minor cleanup, or optional enhancement. Nice to have but not urgent.

**Example:**

```
**Improvement: Extract duplicated visit status formatting logic**
- Severity: Medium
- Effort: Small (< 1 hour)
- Impact: Maintainability — reduces duplicated logic across 3 files
- Description: The visit status badge formatting logic is duplicated in
  `WaitingRoom/VisitCard.tsx`, `VisitHistory/VisitRow.tsx`, and
  `Sidebar/VisitHeader.tsx`. Extract to a shared utility in
  `ev-utils/visit-status.ts` or a `useVisitStatusDisplay` hook in `ev-hooks`.
- Location: src/app-provider/WaitingRoom/VisitCard.tsx:45-62,
  src/app-provider/VisitHistory/VisitRow.tsx:30-47,
  src/ev-common/Sidebar/VisitHeader.tsx:55-72
```

### 11.4 Refactoring Principles

1. **Tests first** — Before refactoring, ensure the code being changed has adequate test coverage. If it does not, write tests that capture the current behavior before making changes. The project's coverage thresholds (70% branches, 75% functions, 80% lines) are minimums, not goals.

2. **Small, incremental steps** — Each refactoring commit should be a single, reviewable change. Do not combine refactoring with feature work in the same commit. The PR template expects ~200 lines of change; large refactors should be broken into multiple PRs.

3. **Backwards compatible** — Refactoring should not change the external behavior of a module. If a component's props change, the old props should be supported during a transition period, or all consumers must be updated in the same PR.

4. **Follow the existing extraction patterns** — The project has clear conventions for where shared code lives:
   - Reusable UI components go in `ev-components/`.
   - Feature-level shared components go in `ev-common/`.
   - Custom hooks go in `ev-hooks/`.
   - Utility functions go in `ev-utils/`.
   - Types go in `ev-types/`.
   - API endpoints go in `ev-api/core/<domain>/`.

5. **Preserve `data-testid` attributes** — When renaming or restructuring components, ensure all existing `data-testid` values are preserved. QA automation depends on these identifiers.

6. **Update barrel exports** — When moving or renaming a file, update the `index.ts` barrel export in the directory. Ensure no consumer import path breaks.

7. **Run the full pre-commit check** — After any refactoring, run `yarn precommit` (which runs `check-types`, `lint-staged`, and `extract:check`) to verify nothing is broken. The CI pipeline (`ci-pull-request.yml`) will also run type checks, linting, prettier, and Storybook build.

8. **Verify translation extraction** — If refactoring moves or renames files containing translated strings, run `yarn extract:check` to ensure the i18n extraction still finds all keys.

9. **Document the rationale** — In the commit message and PR description, explain **why** the refactoring was done, not just what changed. Link to the ClickUp task if one exists.

---

## 12. AI Collaboration & Knowledge Base

### 12.1 Knowledge Base Architecture

This project maintains a multi-layer AI knowledge base:

1. **`CLAUDE.md`** (this file) — Primary source of truth for Claude Code. Comprehensive project rules, patterns, and conventions.
2. **`docs/ai/`** — AI-tool-agnostic documentation. Detailed references consumed by all AI tools (Claude Code, Cursor, Copilot, Codex).
3. **`.cursorrules`** — Condensed rules for Cursor/Composer (~350 lines).
4. **`.github/copilot-instructions.md`** — Instructions for GitHub Copilot.
5. **`.claude/skills/`** — Project-level Claude Code skills for specific workflows.

**Source of truth chain**: `CLAUDE.md` → `docs/ai/` → `.cursorrules` / `copilot-instructions.md`

When `CLAUDE.md` is updated, downstream files should be synced in the same PR.

### 12.2 Available Claude Skills

| Skill               | Command                | Purpose                                        |
| ------------------- | ---------------------- | ---------------------------------------------- |
| Component Lookup    | `/component-lookup`    | Search existing components before creating new |
| Design Tokens       | `/design-tokens`       | Enforce EVColors, Typography, Elevations usage |
| New Component       | `/new-component`       | Full checklist for ev-components/ creation     |
| New Feature Page    | `/new-feature-page`    | Route, layout, i18n, API, tests                |
| New API Endpoint    | `/new-api-endpoint`    | 5-file pattern, Tags, MSW handlers             |
| Storybook Story     | `/storybook-story`     | Dual-file pattern, Figma URL                   |
| Accessibility Audit | `/accessibility-audit` | WCAG 2.1 AA compliance checklist               |
| Fix Bug             | `/fix-bug`             | Investigate, test-first, regression test       |
| Refactor            | `/refactor`            | Backward compat, extraction patterns           |

### 12.3 AI Documentation Reference

| Document            | Location                                        | Contents                                          |
| ------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Component Catalog   | `docs/ai/component-catalog.md`                  | All 47+ components with props, enums, when-to-use |
| Design Tokens       | `docs/ai/design-tokens.md`                      | EVColors, Typography, Elevations, Breakpoints     |
| Component Selection | `docs/ai/decision-trees/component-selection.md` | "I need X" → "Use existing Y" flowchart           |
| README/Index        | `docs/ai/README.md`                             | Quick router to all documentation                 |

---

## 13. Component Quick Registry

Quick reference for all `ev-components/`. See `docs/ai/component-catalog.md` for full details.

| Component              | Import                                 | Primary Use                               |
| ---------------------- | -------------------------------------- | ----------------------------------------- |
| Avatar                 | `ev-components/Avatar`                 | User profile images, initials             |
| Badge                  | `ev-components/Badge`                  | Count indicators, status labels           |
| Banner                 | `ev-components/Banner`                 | Page-level alerts, info messages          |
| BasicAccordion         | `ev-components/BasicAccordion`         | Collapsible sections                      |
| BooleanButtons         | `ev-components/BooleanButtons`         | Yes/No toggle buttons                     |
| Button                 | `ev-components/Button`                 | Actions: submit, navigate, toggle, cancel |
| Calendar               | `ev-components/Calendar`               | Scheduling, events (FullCalendar)         |
| Carousel               | `ev-components/Carousel`               | Image/content carousel                    |
| Checkbox               | `ev-components/Checkbox`               | Single/multi checkboxes                   |
| CheckboxesTree         | `ev-components/CheckboxesTree`         | Hierarchical checkbox selection           |
| ComplexListItem        | `ev-components/ComplexListItem`        | Rich list items with metadata             |
| ContextPanel           | `ev-components/ContextPanel`           | Context-aware side panel                  |
| DataGrid               | `ev-components/DataGrid`               | Data tables (desktop only)                |
| DateInput              | `ev-components/DateInput`              | Date picker                               |
| DateRange              | `ev-components/DateRange`              | Date range selector                       |
| DateTimeInput          | `ev-components/DateTimeInput`          | Date + time picker                        |
| Dialog                 | `ev-components/Dialog`                 | Modal confirmations and forms             |
| Drawer                 | `ev-components/Drawer`                 | Side/bottom panels, option lists          |
| Dropdown               | `ev-components/Dropdown`               | Select/dropdown menus                     |
| DropdownChip           | `ev-components/DropdownChip`           | Dropdown as chip                          |
| FlowProgress           | `ev-components/FlowProgress`           | Multi-step progress indicator             |
| GoogleMap              | `ev-components/GoogleMap`              | Map display                               |
| GoogleMapsAutocomplete | `ev-components/GoogleMapsAutocomplete` | Address autocomplete                      |
| Icon                   | `ev-components/Icon`                   | FontAwesome icons                         |
| InlineEditableText     | `ev-components/InlineEditableText`     | Click-to-edit text                        |
| Input                  | `ev-components/Input`                  | Text entry with formatters                |
| Journey                | `ev-components/Journey`                | Multi-step wizard                         |
| LanguageSelector       | `ev-components/LanguageSelector`       | Language picker                           |
| Link                   | `ev-components/Link`                   | Navigation links                          |
| LoadingIndicator       | `ev-components/LoadingIndicator`       | Loading spinner                           |
| Menu                   | `ev-components/Menu`                   | Context menus                             |
| MenuButton             | `ev-components/MenuButton`             | Button + dropdown menu                    |
| Pagination             | `ev-components/Pagination`             | Page navigation controls                  |
| Popover                | `ev-components/Popover`                | Floating panels                           |
| RadioButtons           | `ev-components/RadioButtons`           | Radio button groups                       |
| SelectorChip           | `ev-components/SelectorChip`           | Selectable chip group                     |
| SelectorTab            | `ev-components/SelectorTab`            | Tab-style selector                        |
| Sidebar                | `ev-components/Sidebar`                | Side navigation                           |
| Snackbar               | `ev-components/Snackbar`               | Bottom notifications                      |
| StarRating             | `ev-components/StarRating`             | Star rating input                         |
| Tabs                   | `ev-components/Tabs`                   | Tab navigation                            |
| Tag                    | `ev-components/Tag`                    | Removable tags/chips                      |
| Text                   | `ev-components/Text`                   | Typography (replaces MUI Typography)      |
| TieredModal            | `ev-components/TieredModal`            | Stacked modal system                      |
| Tile                   | `ev-components/Tile`                   | Card/tile containers                      |
| TimeInput              | `ev-components/TimeInput`              | Time-only input                           |
| TimezoneDropdown       | `ev-components/TimezoneDropdown`       | Timezone selector                         |
| Toast                  | `ev-components/Toast`                  | Alert toasts (via useToast)               |
| Toggle                 | `ev-components/Toggle`                 | On/off switch                             |
| Tooltip                | `ev-components/Tooltip`                | Hover tooltips                            |
| VisitStatusSelector    | `ev-components/VisitStatusSelector`    | Visit status dropdown                     |
