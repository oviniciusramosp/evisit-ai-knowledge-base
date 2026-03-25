<!-- AI Reference: Routing Architecture for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: src/Main.tsx and app-*/paths.ts files -->

# Routing Architecture

Stack: React Router 6 (`react-router-dom`), lazy loading via `React.lazy`, `URL_PREFIX` from `ev-config/config`.

---

## Top-Level Structure (Main.tsx)

All sub-apps are lazy-loaded from `src/Main.tsx`. The `Main` component is wrapped with `CoreProviders` via `withCoreProviders(Main)`.

```
URL_PREFIX = (configured per environment, typically empty or '/app')

Routes:
  /login/*                              --> LoginApp
  /app_admin/*                          --> AdminApp
  /qtc/*                                --> QtcApp
  /onboarding/*                         --> OnboardingApp
  /frontdoor/:customerHandle/:frontDoorName --> FrontDoorApp
  /callback/:visitId                    --> CallbackApp
  /provider/*                           --> UserApp (resolves to ProviderApp)
  /patient/register                     --> RegistrationApp
  /patient/*                            --> UserApp (resolves to PatientApp)
  /video/*                              --> VideoApp
  /                                     --> Root (redirect via useActiveSessionRedirect)
```

### UserApp Router Logic

The `UserApp` component in `Main.tsx` determines whether to show `ProviderApp` or `PatientApp` based on the current user's role:

1. Fetches current user via `useGetCurrentUserQuery()`
2. If user is a patient entering `/provider/*` --> redirects to `/patient/home`
3. If user is a provider entering `/patient/*` --> redirects to `/provider/patients`
4. If not authenticated --> redirects to `/login/login`

---

## Sub-App Paths

### Admin App (`app-admin/paths.ts`)

Root: `URL_PREFIX + '/app_admin'` (exported as `ADMIN_ROOT`)

| Path Enum                               | Route                  |
| --------------------------------------- | ---------------------- |
| `AdminPaths.Settings`                   | `settings`             |
| `AdminPaths.Customize`                  | `customize`            |
| `AdminPaths.Workflows`                  | `workflows`            |
| `AdminPaths.Users`                      | `physicians`           |
| `AdminPaths.Roles`                      | `roles`                |
| `AdminPaths.PagesForms`                 | `forms`                |
| `AdminPaths.PagesFormEditor`            | `form_editor`          |
| `AdminPaths.PagesDocuments`             | `documents`            |
| `AdminPaths.PagesDocumentEditor`        | `document_editor`      |
| `AdminPaths.PagesFrontDoorBuilder`      | `front_door_builder`   |
| `AdminPaths.PagesJourneyBuilderList`    | `journey_builder`      |
| `AdminPaths.PagesJourneyBuilder`        | `journeys/:id/builder` |
| `AdminPaths.PagesClinical`              | `clinical`             |
| `AdminPaths.PagesClinicalQueue`         | `queue`                |
| `AdminPaths.PagesClinicalEmbeddedQueue` | `embedded_queue`       |
| `AdminPaths.PagesClinicalScheduling`    | `scheduling`           |
| `AdminPaths.PagesPatient`               | `patient`              |
| `AdminPaths.PagesPatientNavigationMenu` | `navigation_menu`      |
| `AdminPaths.PagesMessages`              | `messages`             |
| `AdminPaths.ConnectedDevices`           | `connected_devices`    |
| `AdminPaths.VideoBackground`            | `video_background`     |
| `AdminPaths.InterpreterServices`        | `interpreter_services` |
| `AdminPaths.TelephonyServices`          | `telephony_services`   |

### Provider App (`app-provider/paths.ts`)

Root: `URL_PREFIX + '/provider'` (exported as `PROVIDER_ROOT`)

| Path Enum                         | Route                 |
| --------------------------------- | --------------------- |
| `ProviderPaths.WaitingRoom`       | `waiting_room`        |
| `ProviderPaths.Patients`          | `patients`            |
| `ProviderPaths.VisitHistory`      | `visit_history`       |
| `ProviderPaths.Scheduling`        | `scheduling`          |
| `ProviderPaths.CheckIn`           | `check_in`            |
| `ProviderPaths.MyAccount`         | `my_account`          |
| `ProviderPaths.UserAvatar`        | `user_avatar`         |
| `ProviderPaths.SwitchPractice`    | `switch_practice`     |
| `ProviderPaths.BulkUserProvision` | `bulk_user_provision` |
| `ProviderPaths.ReportRun`         | `report_run`          |
| `ProviderPaths.Availability`      | `availability`        |
| `ProviderPaths.PersonalInfo`      | `personal_info`       |

### Patient App (`app-patient/paths.ts`)

| Path Enum                           | Route                   |
| ----------------------------------- | ----------------------- |
| `PatientPaths.Home`                 | `home`                  |
| `PatientPaths.UpcomingVisits`       | `upcoming_visits`       |
| `PatientPaths.VisitHistory`         | `visit_history`         |
| `PatientPaths.MyAccount`            | `my_account`            |
| `PatientPaths.HealthRecords`        | `health_records`        |
| `PatientPaths.Insurance`            | `insurance`             |
| `PatientPaths.InsuranceForm`        | `insurance/form`        |
| `PatientPaths.AddInsurance`         | `insurance/add`         |
| `PatientPaths.ConfirmInsurance`     | `insurance/confirm`     |
| `PatientPaths.Payments`             | `payments`              |
| `PatientPaths.Register`             | `register`              |
| `PatientPaths.SelectPatient`        | `select_patient`        |
| `PatientPaths.SelectVisitType`      | `select_visit_type`     |
| `PatientPaths.SelectProvider`       | `select_provider`       |
| `PatientPaths.SelectDate`           | `select_date`           |
| `PatientPaths.ConfirmLocation`      | `confirm_location`      |
| `PatientPaths.ReviewDetails`        | `review_details`        |
| `PatientPaths.VisitInformation`     | `visit_information`     |
| `PatientPaths.PharmacySearch`       | `pharmacy_search`       |
| `PatientPaths.Intake`               | `intake`                |
| `PatientPaths.AddDependent`         | `add_dependent`         |
| `PatientPaths.DependentInformation` | `dependent_information` |
| `PatientPaths.SwitchPractice`       | `switch_practice`       |

### Login App (`app-login/paths.ts`)

| Path Enum                         | Route                    |
| --------------------------------- | ------------------------ |
| `LoginPaths.Login`                | `login`                  |
| `LoginPaths.ForgotPassword`       | `forgot_password`        |
| `LoginPaths.UpdatePassword`       | `update_password`        |
| `LoginPaths.AccountLocked`        | `account_locked`         |
| `LoginPaths.RequestUnlockCode`    | `request_unlock_code`    |
| `LoginPaths.VerifyUnlockCode`     | `verify_unlock_code`     |
| `LoginPaths.CreatePatientAccount` | `create_patient_account` |
| `LoginPaths.EnableBiometrics`     | `biometrics`             |

### QTC App

Root: Defined as `QTC_ROOT` in `app-qtc/constants.ts`.

---

## Navigation: useAppNavigate

**Always use `useAppNavigate`** from `ev-hooks/navigate` (NOT `useNavigate` from `react-router-dom`).

```tsx
import { useAppNavigate } from 'ev-hooks/navigate';

const navigate = useAppNavigate();

// Navigate to a relative path
navigate('settings');

// Navigate with custom search params
navigate('settings', new URLSearchParams({ tab: 'general' }));

// Navigate with replace (no history entry)
navigate('settings', null, true);

// Go back
navigate(-1);
```

### Unsaved Changes Guard

`useAppNavigate` checks for unsaved changes before navigating:

1. Checks `localStorage.getItem('unsavedChanges')`
2. Checks Redux `state.unsavedChanges.hasUnsavedChanges`
3. If unsaved changes exist:
   - Stores the pending route in Redux
   - Shows the unsaved changes dialog
   - Blocks navigation until user confirms or discards

### Admin Path Handling

When navigating within the admin app, `useAppNavigate` preserves the `customerId` search parameter and strips other params.

---

## URL Search Parameters

### Practice param

Every authenticated route includes `?practice=<handle>` to identify the current practice. Managed by `CommonDataProvider` and `useUpdatePracticeSearchParam`.

### Layout overrides (React Native WebView)

| Param                            | Purpose                          |
| -------------------------------- | -------------------------------- |
| `layout=mobile\|tablet\|desktop` | Force layout mode                |
| `hide=topbar,header`             | Hide UI elements                 |
| `embedded=true`                  | Mark as embedded in native shell |

### Other common params

| Param            | Purpose                     |
| ---------------- | --------------------------- |
| `customerId`     | Admin app customer context  |
| `selectedUserId` | Selected dependent user     |
| `segment`        | Waiting room segment filter |

---

## Lazy Loading Pattern

All sub-apps use `React.lazy` with a `Suspense` boundary:

```tsx
const AdminApp = lazy(() => import('./app-admin'));

<Suspense fallback={<div />}>
  <Routes>
    <Route element={<AdminApp />} path={`${ADMIN_ROOT}/*`} />
  </Routes>
</Suspense>;
```

Each sub-app's `index.ts` exports a default component that sets up the sub-app's internal routing.

---

## Mobile Routing Differences

- Mobile uses `MobileBar` and `MobileHeader` for navigation (bottom bar + hamburger)
- Some desktop sidebar routes become full-screen pages on mobile
- Drawers replace sidebars on mobile
- The `useMobile()` hook manages mobile bar title
- `useLayout().isMobile` drives conditional rendering

---

## Adding a New Route

1. Add path enum value to the appropriate `paths.ts` file
2. Create the page component in the sub-app folder
3. Add `<Route>` in the sub-app's internal router
4. Use `useAppNavigate` for programmatic navigation
5. Add `data-testid` to navigation elements
6. Test at both desktop and mobile layouts
