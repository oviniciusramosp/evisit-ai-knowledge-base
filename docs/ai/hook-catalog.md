<!-- AI Reference: Hook Catalog for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: src/ev-hooks/ directory -->

# Hook Catalog

All custom hooks live in `src/ev-hooks/`. Import using the `ev-hooks/` prefix (e.g., `import useLayout from 'ev-hooks/layout'`).

---

## Provider / Context Hooks

| Hook                         | File              | Purpose                                                      | Key Returns                                                                                                                   |
| ---------------------------- | ----------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `useLayout`                  | `layout.tsx`      | Responsive breakpoint detection                              | `{ isMobile, isTablet, isDesktop, isMobileLandscape, isLargeMobile, width, height, hideHeader, hideTopbar, isEmbedded }`      |
| `useCommonData`              | `commonData.tsx`  | Access current user, practice, primary user                  | `{ primaryUser, currentUser, currentPractice, selectUser, updatePractice, isFetchingCurrentPractice, isFetchingPrimaryUser }` |
| `usePrimaryUser`             | `commonData.tsx`  | Get primary (logged-in) user (throws if missing)             | `User`                                                                                                                        |
| `useCurrentUser`             | `commonData.tsx`  | Get current user (may be dependent)                          | `User`                                                                                                                        |
| `useCurrentPractice`         | `commonData.tsx`  | Get current practice (throws if missing)                     | `Practice`                                                                                                                    |
| `useNullablePrimaryUser`     | `commonData.tsx`  | Get primary user (nullable, safe for unauthenticated pages)  | `{ primaryUser: User \| undefined, fetchingPrimaryUser: boolean }`                                                            |
| `useNullableCurrentUser`     | `commonData.tsx`  | Get current user (nullable)                                  | `User \| undefined`                                                                                                           |
| `useNullableCurrentPractice` | `commonData.tsx`  | Get current practice (nullable)                              | `Practice \| undefined`                                                                                                       |
| `useEvault`                  | `commonData.tsx`  | Access eVault encrypted storage for current user             | `{ evaultRecord, vaultId, vaultToken, isLoadingEvaultRecord }`                                                                |
| `useEvaultEndpoint`          | `commonData.tsx`  | Get correct evault API (old vs new) based on practice config | evault API object                                                                                                             |
| `useMobile`                  | `mobile.tsx`      | Mobile bar title management                                  | `{ mobileBarTitle, setMobileBarTitle }`                                                                                       |
| `useEnvironment`             | `environment.tsx` | Current environment (local, test, production)                | `Environments` enum value                                                                                                     |
| `useDialog`                  | `dialog.tsx`      | Open/close standard and custom dialogs                       | `{ openDialog, openCustomDialog, closeDialog, setDialogBusy }`                                                                |
| `useToast`                   | `toast.tsx`       | Show toast notifications                                     | `setToast(message, type?, id?, options?)`                                                                                     |

## Navigation Hooks

| Hook                           | File           | Purpose                                                             | Key Returns                                             |
| ------------------------------ | -------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| `useAppNavigate`               | `navigate.tsx` | Navigate with unsaved-changes guard and practice param preservation | `(target: string \| number, params?, replace?) => void` |
| `useParamsString`              | `navigate.tsx` | Get current search params as string                                 | `string` (e.g., `?practice=demo`)                       |
| `useUpdatePracticeSearchParam` | `navigate.tsx` | Update practice search param                                        | `(value: string) => void`                               |

## Analytics Hooks

| Hook           | File                  | Purpose                                             | Key Returns                |
| -------------- | --------------------- | --------------------------------------------------- | -------------------------- |
| `useAnalytics` | `analytics/index.tsx` | Access analytics tracking methods (FullStory, etc.) | `Analytics` methods object |

## Form / Data Hooks

| Hook                  | File                  | Purpose                           | Key Returns                 |
| --------------------- | --------------------- | --------------------------------- | --------------------------- |
| `useDebounce`         | `debounce.tsx`        | Debounce a callback function      | debounced function (lodash) |
| `useDebounceValue`    | `debounce.tsx`        | Debounce a value (default 500ms)  | debounced value of type `T` |
| `useFormLocalStorage` | `FormLocalStorage.ts` | Persist form data to localStorage | read/write helpers          |
| `useStoredState`      | `storedState.ts`      | useState backed by localStorage   | `[value, setValue]`         |

## Real-time / Events Hooks

| Hook                                  | File                                  | Purpose                                     | Key Returns           |
| ------------------------------------- | ------------------------------------- | ------------------------------------------- | --------------------- |
| `useEvents`                           | `events.ts`                           | Attach window event listeners declaratively | void (side-effect)    |
| `useChatNotifications`                | `chatNotifications.tsx`               | Chat notification management                | notification state    |
| `useCustomFormNotifications`          | `customFormNotifications.ts`          | Custom form change notifications            | notification handlers |
| `useWatchPracticeUpdates`             | `watchPracticeUpdates.ts`             | Listen for Pusher practice updates          | void (side-effect)    |
| `useWatchProviderAvailabilityChanges` | `watchProviderAvailabilityChanges.ts` | Listen for provider availability changes    | void (side-effect)    |
| `useKeepalive`                        | `keepalive.ts`                        | Session keepalive pings                     | void (side-effect)    |
| `useKeepaliveEvents`                  | `keepaliveEvents.ts`                  | Keepalive event coordination                | void (side-effect)    |
| `useUserLiveStatus`                   | `userLiveStatus.ts`                   | Track user online/offline status            | live status data      |

## Browser / Device Hooks

| Hook                           | File                           | Purpose                               | Key Returns         |
| ------------------------------ | ------------------------------ | ------------------------------------- | ------------------- |
| `useBrowserCheck`              | `browserCheck.ts`              | Browser compatibility detection       | boolean             |
| `useBrowserCompatibilityCheck` | `browserCompatibilityCheck.ts` | Practice-specific browser checks      | boolean             |
| `useVisibilityChange`          | `visibilityChange.ts`          | Page visibility (tab focus/blur)      | boolean             |
| `useNativeAppState`            | `nativeAppState.tsx`           | React Native WebView bridge state     | app state           |
| `useScript`                    | `script.ts`                    | Dynamically load external scripts     | `{ loaded, error }` |
| `useLink`                      | `link.ts`                      | Dynamically load external stylesheets | `{ loaded, error }` |

## UI / Interaction Hooks

| Hook                | File                 | Purpose                                   | Key Returns                                    |
| ------------------- | -------------------- | ----------------------------------------- | ---------------------------------------------- |
| `useDocumentTitle`  | `documentTitle.tsx`  | Set document.title                        | void                                           |
| `useFavicon`        | `favicon.tsx`        | Set page favicon                          | void                                           |
| `useMenu`           | `menu.ts`            | Anchor-based menu open/close              | `{ anchorEl, open, handleClick, handleClose }` |
| `useInfiniteScroll` | `infiniteScroll.tsx` | Infinite scroll with IntersectionObserver | `{ ref, hasMore }`                             |
| `usePrevious`       | `previous.tsx`       | Track previous value of a variable        | previous value of type `T`                     |
| `useThrottle`       | `throttle.ts`        | Throttle a callback function              | throttled function                             |
| `useIsMounted`      | `isMounted.ts`       | Check if component is still mounted       | `() => boolean`                                |
| `useInterval`       | `interval.ts`        | setInterval as a hook                     | void (side-effect)                             |
| `useSidebarTabs`    | `sidebarTabs.ts`     | Manage sidebar tab selection              | tab state and handlers                         |
| `useFiltersMenu`    | `filtersMenu.tsx`    | Manage filter menu open/close state       | filter menu context                            |

## Feature-Specific Hooks

| Hook                             | File                              | Purpose                                      | Key Returns                  |
| -------------------------------- | --------------------------------- | -------------------------------------------- | ---------------------------- |
| `useAutoLogout`                  | `autoLogout.tsx`                  | Session timeout and auto-logout              | void (side-effect)           |
| `useActiveSessionRedirect`       | `activeSessionRedirect.ts`        | Redirect if user has active session          | void (side-effect)           |
| `useActiveVisitCheck`            | `activeVisitCheck.ts`             | Check for active visits on login             | void (side-effect)           |
| `useTokenAuth`                   | `tokenAuth.tsx`                   | Handle token-based authentication from URL   | `{ isSigningIn }`            |
| `useSignOut`                     | `signOut.ts`                      | Sign out the current user                    | sign out handler             |
| `useVideoState`                  | `videoState.ts`                   | Video call state management                  | video state                  |
| `useVisitActions`                | `visitActions.ts`                 | Visit lifecycle actions (join, cancel, etc.) | action handlers              |
| `useVisitNotes`                  | `visitNotes.ts`                   | Visit notes CRUD                             | notes state and handlers     |
| `useVisitStarter`                | `visitStarter.ts`                 | Start a new visit flow                       | start visit handler          |
| `useCreateExpressRoom`           | `createExpressRoom.ts`            | Create an express room visit                 | create handler               |
| `useCustomActions`               | `customActions.ts`                | Practice custom actions                      | custom action list           |
| `useCustomForms`                 | `customForms.tsx`                 | Custom forms context/provider                | custom forms data            |
| `useJourney`                     | `journey.tsx`                     | Multi-step journey state                     | journey state and navigation |
| `useJourneyTrigger`              | `journeyTrigger.ts`               | Trigger journey flows                        | trigger handler              |
| `usePharmacy`                    | `pharmacy.tsx`                    | Pharmacy search state                        | pharmacy context             |
| `useServedLocations`             | `servedLocations.ts`              | Practice served locations                    | locations data               |
| `useMultiPracticeAvailability`   | `multiPracticeAvailability.ts`    | Multi-practice provider availability         | availability data            |
| `useGeocoder`                    | `geocoder.ts`                     | Google geocoding                             | geocode handler              |
| `useGridLocaleText`              | `gridLocaleText.ts`               | MUI DataGrid locale strings                  | locale text object           |
| `useErrorToast`                  | `errorToast.ts`                   | Show error toasts from RTK Query errors      | error toast handler          |
| `useCustomFormNotificationToast` | `customFormNotificationToast.tsx` | Custom form notification toasts              | void (side-effect)           |
| `useSelectors`                   | `selectors.ts`                    | Common Redux selectors                       | selector values              |
| `useNavigationBlock`             | `navigationBlock.ts`              | Block navigation (unsaved changes)           | void (side-effect)           |
| `useVWO`                         | `vwo.ts`                          | Visual Website Optimizer A/B testing         | VWO state                    |
| `useAirbrakeTest`                | `airbrakeTest.ts`                 | Test Airbrake error reporting                | test handler                 |
| `useTriggerAirbrakeError`        | `triggerAirbrakeError.ts`         | Trigger Airbrake error manually              | trigger handler              |
| `useClearDialIntentOnLoad`       | `clearDialIntentOnLoad.ts`        | Clear outbound dial intent on page load      | void (side-effect)           |

---

## Usage Examples (Top 10)

### useLayout -- Responsive rendering

```tsx
import useLayout from 'ev-hooks/layout';

const MyComponent = () => {
  const { isMobile, isDesktop } = useLayout();

  return isMobile ? <MobileView /> : <DesktopView />;
};
```

### useCommonData -- Access current user and practice

```tsx
import {
  useCommonData,
  useCurrentPractice,
  useCurrentUser,
} from 'ev-hooks/commonData';

const MyComponent = () => {
  const { currentUser, currentPractice } = useCommonData();
  // OR individually:
  const user = useCurrentUser(); // throws if undefined
  const practice = useCurrentPractice(); // throws if undefined
};
```

### useAppNavigate -- Navigate with unsaved-changes guard

```tsx
import { useAppNavigate } from 'ev-hooks/navigate';

const MyComponent = () => {
  const navigate = useAppNavigate();
  const handleClick = () => navigate('settings');
  // With replace: navigate('settings', null, true);
};
```

### useDialog -- Show confirmation dialogs

```tsx
import useDialog from 'ev-hooks/dialog';

const MyComponent = () => {
  const { openDialog, closeDialog } = useDialog();

  const handleDelete = () => {
    openDialog({
      title: t('Confirm Delete'),
      description: t('Are you sure?'),
      onAccept: () => {
        deleteItem();
        closeDialog();
      },
      acceptLabel: t('Delete'),
    });
  };
};
```

### useToast -- Show toast notifications

```tsx
import useToast from 'ev-hooks/toast';

const MyComponent = () => {
  const setToast = useToast();
  const handleSave = async () => {
    await saveData();
    setToast(t('Saved successfully'), 'success');
  };
};
```

### useDebounce -- Debounce a search callback

```tsx
import useDebounce from 'ev-hooks/debounce';

const SearchInput = () => {
  const handleSearch = useDebounce((query: string) => {
    fetchResults(query);
  }, 300);

  return <Input onChange={e => handleSearch(e.target.value)} />;
};
```

### useDebounceValue -- Debounce a value

```tsx
import { useDebounceValue } from 'ev-hooks/debounce';

const SearchResults = ({ query }: { query: string }) => {
  const debouncedQuery = useDebounceValue(query, 300);
  const { data } = useSearchQuery(debouncedQuery);
};
```

### useEnvironment -- Check current environment

```tsx
import { useEnvironment } from 'ev-hooks/environment';
import Environments from 'ev-types/environments';

const DebugPanel = () => {
  const env = useEnvironment();
  if (env === Environments.Production) return null;
  return <div>Debug info...</div>;
};
```

### useMobile -- Set mobile bar title

```tsx
import useMobile from 'ev-hooks/mobile';

const PatientPage = () => {
  const { setMobileBarTitle } = useMobile();
  useEffect(() => {
    setMobileBarTitle(t('Patient Details'));
  }, []);
};
```

### useMenu -- Anchor-based menu

```tsx
import useMenu from 'ev-hooks/menu';

const ActionsMenu = () => {
  const { anchorEl, open, handleClick, handleClose } = useMenu();

  return (
    <>
      <Button onClick={handleClick} label={t('Actions')} />
      <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
        <MenuItem onClick={handleAction}>{t('Edit')}</MenuItem>
      </Menu>
    </>
  );
};
```
