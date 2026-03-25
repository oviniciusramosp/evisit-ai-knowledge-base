<!-- AI Reference: State Management for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: src/ev-store/ and src/ev-hooks/ -->

# State Management

Three layers: **RTK Query** (server state), **Redux slices** (global UI state), **React Context** (provider-scoped UI state).

---

## Layer 1: RTK Query (Server State)

All API data fetching, caching, and mutations. This is the primary data layer.

- Defined in `src/ev-api/core/<domain>/`
- Single `createApi` instance in `src/ev-api/api.ts` with injected endpoints
- Cache invalidation via Tags enum
- Automatic refetching, polling, and optimistic updates

**When to use:** Any data from the server -- user data, visits, practices, forms, settings.

```tsx
// Reading server data
const { data: visits, isLoading } = useGetVisitsQuery({ status: 'active' });

// Mutating server data
const [createVisit, { isLoading: isCreating }] = useCreateVisitMutation();
await createVisit(params).unwrap();
```

**5 separate API instances** are in the Redux store:

| Instance        | Reducer Path    | Purpose                       |
| --------------- | --------------- | ----------------------------- |
| `api`           | `api`           | Main API (all core endpoints) |
| `oldEvaultApi`  | `oldEvaultApi`  | Old eVault encrypted storage  |
| `cloudfrontApi` | `cloudfrontApi` | CloudFront alerts             |
| `stripeApi`     | `stripeApi`     | Stripe payments               |
| `googleMapsApi` | `googleMapsApi` | Google Maps                   |

---

## Layer 2: Redux Slices (Global UI State)

For UI state that persists across route changes or needs to be accessed from distant parts of the component tree.

Located in `src/ev-store/slices/`:

| Slice                | File                      | Purpose                                       |
| -------------------- | ------------------------- | --------------------------------------------- |
| `auth`               | `auth.ts`                 | Auth token, sign-in state                     |
| `sidebar`            | `sidebar.ts`              | Sidebar open/close, selected tab              |
| `drawer`             | `drawer.ts`               | Drawer panel state                            |
| `selectedVisit`      | `selected-visit.ts`       | Currently selected visit in waiting room      |
| `selectedPatient`    | `selected-patient.ts`     | Currently selected patient                    |
| `selectedRole`       | `selected-role.ts`        | Currently selected role                       |
| `unsavedChanges`     | `unsaved-changes.ts`      | Unsaved form changes flag, pending navigation |
| `personalFilterView` | `personal-filter-view.ts` | Active personal filter view                   |
| `waitingRoom`        | `waiting-room.ts`         | Waiting room UI state                         |
| `notifications`      | `notifications.ts`        | Notification state                            |
| `globalError`        | `global-error.ts`         | Global error state                            |
| `outboundDialIntent` | `outbound-dial-intent.ts` | Outbound call intent                          |
| `totalVisits`        | `total-visits.ts`         | Total visit count                             |
| `timezoneNag`        | `timezone-nag.ts`         | Timezone mismatch notification                |
| `testOverlay`        | `test-overlay.ts`         | Dev/test overlay state                        |

### Accessing slices

```tsx
// CORRECT: Use typed hooks
// WRONG: Never import directly from react-redux
import { useSelector } from 'react-redux';

import { setHasUnsavedChanges } from 'ev-store/actions';
import { useAppDispatch, useAppSelector } from 'ev-store/redux';

const hasChanges = useAppSelector(
  state => state.unsavedChanges.hasUnsavedChanges,
);
const dispatch = useAppDispatch();
dispatch(setHasUnsavedChanges(true));

// ESLint error
```

### All actions re-exported

All slice actions are re-exported from `src/ev-store/actions.ts` for easy import:

```tsx
import {
  setHasUnsavedChanges,
  setPendingNavigationRoute,
} from 'ev-store/actions';
```

---

## Layer 3: React Context (Provider-Scoped UI State)

For app-wide concerns that need a React provider pattern. Defined in `src/ev-hooks/` and `src/Providers.tsx`.

### Provider Hierarchy

```
EnvironmentProvider          -- ev-hooks/environment.tsx
  ReduxProvider              -- ev-store/redux.tsx
    BrowserRouter            -- react-router-dom
      ErrorBoundary          -- ErrorBoundary.tsx
        LayoutProvider       -- ev-hooks/layout.tsx
          FiltersMenuProvider -- ev-hooks/filtersMenu.tsx
            ThemeProvider    -- @mui/material (ev-theme)
              ToastProvider  -- ev-hooks/toast.tsx
                MobileProvider -- ev-hooks/mobile.tsx
                  CommonDataProvider -- ev-hooks/commonData.tsx (requires auth)
                    RealtimeProvider -- ev-api/realtime
                      AnalyticsProvider -- ev-hooks/analytics/
                        AlertProvider -- ev-hooks/alert.tsx
                          CustomFormsProvider -- ev-hooks/customForms.tsx
                            DialogProvider -- ev-hooks/dialog.tsx
```

### Context providers and their hooks

| Provider              | Hook                                                          | Purpose                                                |
| --------------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| `LayoutProvider`      | `useLayout()`                                                 | Responsive breakpoints (`isMobile`, `isDesktop`, etc.) |
| `MobileProvider`      | `useMobile()`                                                 | Mobile bar title management                            |
| `EnvironmentProvider` | `useEnvironment()`                                            | Current environment (local/test/production)            |
| `CommonDataProvider`  | `useCommonData()`, `useCurrentUser()`, `useCurrentPractice()` | Authenticated user, practice, dependent selection      |
| `DialogProvider`      | `useDialog()`                                                 | Show/dismiss standard and custom dialogs               |
| `ToastProvider`       | `useToast()`                                                  | Show toast notifications                               |
| `AlertProvider`       | (internal)                                                    | System alert banners from CloudFront                   |
| `AnalyticsProvider`   | `useAnalytics()`                                              | Event tracking (FullStory, etc.)                       |
| `FiltersMenuProvider` | `useFiltersMenu()`                                            | Filter menu state                                      |
| `CustomFormsProvider` | `useCustomForms()`                                            | Custom forms data                                      |
| `RealtimeProvider`    | (internal)                                                    | Pusher real-time subscriptions                         |

---

## Decision Tree: Where Should State Live?

```
Is the data from the server?
  YES --> RTK Query (ev-api endpoint)
  NO  --> Continue...

Is it form field state?
  YES --> React Hook Form (useForm/useController)
  NO  --> Continue...

Does it need to persist across route changes?
  YES --> Redux slice (ev-store/slices/)
  NO  --> Continue...

Is it shared across distant components (not parent-child)?
  YES --> Is there already a Context provider for this?
    YES --> Use the existing Context hook
    NO  --> Does it represent app-wide UI concern?
      YES --> Create a new Context provider in ev-hooks/
      NO  --> Redux slice (simpler for cross-cutting concerns)
  NO  --> Continue...

Is it only used within one component or parent-child tree?
  YES --> useState / useReducer (local component state)
  NO  --> Consider Redux slice or Context
```

### Quick Reference Table

| State Type             | Location                       | Example                                      |
| ---------------------- | ------------------------------ | -------------------------------------------- |
| API response data      | RTK Query                      | Visit list, user profile, practice settings  |
| API loading/error      | RTK Query                      | `isLoading`, `error`, `isFetching`           |
| Form field values      | React Hook Form                | Input values, validation errors, dirty state |
| Auth token             | Redux slice (`auth`)           | JWT token from sign-in                       |
| Selected visit         | Redux slice (`selectedVisit`)  | Which visit is selected in waiting room      |
| Unsaved changes flag   | Redux slice (`unsavedChanges`) | Navigation blocking                          |
| Sidebar open/closed    | Redux slice (`sidebar`)        | Sidebar panel state                          |
| Current viewport       | Context (`LayoutProvider`)     | `isMobile`, `isDesktop`                      |
| Current user/practice  | Context (`CommonDataProvider`) | Logged-in user, active practice              |
| Dialog visibility      | Context (`DialogProvider`)     | Showing confirmation dialog                  |
| Toast messages         | Context (`ToastProvider`)      | Success/error toasts                         |
| Mobile bar title       | Context (`MobileProvider`)     | Title in mobile header                       |
| Component-local toggle | `useState`                     | Dropdown open, hover state                   |
| Derived/computed data  | `useMemo`                      | Filtered list, formatted date                |

---

## Store Configuration

From `src/ev-store/store.ts`:

```tsx
export const store = configureStore({
  reducer: {
    ...slices,                    // All UI slices
    [api.reducerPath]: api.reducer,
    [oldEvaultApi.reducerPath]: oldEvaultApi.reducer,
    [cloudfrontApi.reducerPath]: cloudfrontApi.reducer,
    [stripeApi.reducerPath]: stripeApi.reducer,
    [googleMapsApi.reducerPath]: googleMapsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({...}).concat(middlewares),
});
```

Middleware stack: `errorLogger`, all API middlewares, plus `redux-logger` in local env.

---

## Anti-Patterns

| Anti-Pattern                                             | Correct Approach                                            |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| Storing API data in Redux slices                         | Use RTK Query -- it handles caching                         |
| Using `useState` for data shared across routes           | Use Redux slice                                             |
| Creating a Context for a single component's state        | Use `useState`                                              |
| Importing `useSelector`/`useDispatch` from `react-redux` | Use `useAppSelector`/`useAppDispatch` from `ev-store/redux` |
| Duplicating API data in multiple slices                  | Use RTK Query tags for cache sharing                        |
| Putting form state in Redux                              | Use React Hook Form                                         |
