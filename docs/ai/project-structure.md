<!-- AI Reference: Project Structure for eVisit UI -->
<!-- Source of truth. Referenced by CLAUDE.md -->

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
