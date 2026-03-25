<!-- AI Reference: State Location Decision Tree for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: ev-store/, ev-hooks/, ev-api/ -->

# State Location Decision Tree

Where should your state live? Follow this tree to find the right answer.

---

## Decision Tree

```
START: What kind of state is it?

[A] Data from the server (API responses)?
    --> RTK Query endpoint (ev-api/core/<domain>/)
    Examples: visit list, user profile, practice settings, form submissions

[B] Form field values, validation, dirty state?
    --> React Hook Form (useForm + useController)
    Examples: patient intake form, settings editor, registration form

[C] Authentication token?
    --> Redux slice: auth (ev-store/slices/auth.ts)

[D] UI state that persists across route changes?
    --> Redux slice (ev-store/slices/)
    Examples: selected visit, sidebar state, unsaved changes flag

[E] App-wide UI concern with provider pattern?
    --> React Context (ev-hooks/<name>.tsx)
    Examples: current user, layout breakpoints, toast messages

[F] Component-specific UI state?
    --> useState / useReducer (local state)
    Examples: dropdown open, hover state, local toggle

[G] Derived/computed data?
    --> useMemo (compute from existing state)
    Examples: filtered list, formatted date, aggregated counts
```

---

## Detailed Decision Matrix

### RTK Query -- Server data

| Characteristic                             | Fits RTK Query?  |
| ------------------------------------------ | ---------------- |
| Data comes from an API endpoint            | Yes              |
| Needs caching and automatic refetching     | Yes              |
| Shared across multiple components          | Yes (via cache)  |
| Needs optimistic updates                   | Yes (via thunks) |
| Needs real-time invalidation               | Yes (via tags)   |
| Data is user-specific or practice-specific | Yes              |

```tsx
// Reading
const { data, isLoading, error } = useGetVisitsQuery({ status: 'active' });

// Mutating
const [updateVisit] = useUpdateVisitMutation();
await updateVisit({ id: '1', status: 'completed' }).unwrap();
```

**Cache invalidation:** Use `Tags` enum. When a mutation invalidates a tag, all queries providing that tag refetch automatically.

---

### React Hook Form -- Form state

| Characteristic                     | Fits RHF?                                   |
| ---------------------------------- | ------------------------------------------- |
| User is editing a form             | Yes                                         |
| Need field-level validation        | Yes                                         |
| Need dirty/touched tracking        | Yes                                         |
| Form submission to an API          | Yes (combine with RTK Query mutation)       |
| Need to persist form across routes | No (use localStorage + useFormLocalStorage) |

```tsx
const {
  control,
  handleSubmit,
  formState: { isDirty, errors },
} = useForm({
  resolver: yupResolver(schema),
  defaultValues: { name: '' },
});
```

---

### Redux Slice -- Global UI state

| Characteristic                            | Fits Redux Slice? |
| ----------------------------------------- | ----------------- |
| UI state needed across different routes   | Yes               |
| State should survive route changes        | Yes               |
| Multiple distant components read/write it | Yes               |
| Not server data (not an API response)     | Yes               |
| Needs to be inspected via Redux DevTools  | Yes               |

**Existing slices and when to use each:**

| Slice                | When to Use                                       |
| -------------------- | ------------------------------------------------- |
| `auth`               | Storing/reading auth token after sign-in          |
| `selectedVisit`      | Tracking which visit is selected in waiting room  |
| `selectedPatient`    | Tracking which patient is selected                |
| `selectedRole`       | Tracking selected role in admin                   |
| `sidebar`            | Opening/closing sidebar, changing sidebar tab     |
| `drawer`             | Opening/closing drawer panel                      |
| `unsavedChanges`     | Blocking navigation when form has unsaved changes |
| `personalFilterView` | Active personal filter view in waiting room       |
| `waitingRoom`        | Waiting room UI state (sorting, grouping)         |
| `notifications`      | Managing notification state                       |
| `globalError`        | Storing global error for toast display            |
| `outboundDialIntent` | Tracking outbound call intent                     |
| `totalVisits`        | Total visit count for display                     |
| `timezoneNag`        | Whether timezone mismatch nag has been shown      |
| `testOverlay`        | Dev/test overlay visibility                       |

```tsx
import { clearSelectedVisit, setSelectedVisit } from 'ev-store/actions';
import { useAppDispatch, useAppSelector } from 'ev-store/redux';

// Read
const selectedVisit = useAppSelector(state => state.selectedVisit);

// Write
dispatch(setSelectedVisit(visitId));
```

---

### React Context -- App-wide UI concerns

| Characteristic                                   | Fits Context? |
| ------------------------------------------------ | ------------- |
| Provides a capability (dialog, toast, analytics) | Yes           |
| Wraps the component tree as a Provider           | Yes           |
| Needs React lifecycle (useEffect, refs)          | Yes           |
| Has a small consumer API (1-3 methods)           | Yes           |
| Rarely changes (< once per second)               | Yes           |

**Existing contexts:**

| Context     | Hook                                       | When to Use                                     |
| ----------- | ------------------------------------------ | ----------------------------------------------- |
| Layout      | `useLayout()`                              | Checking viewport size for responsive rendering |
| CommonData  | `useCurrentUser()`, `useCurrentPractice()` | Accessing authenticated user/practice data      |
| Dialog      | `useDialog()`                              | Showing confirmation dialogs                    |
| Toast       | `useToast()`                               | Showing success/error notifications             |
| Mobile      | `useMobile()`                              | Managing mobile bar title                       |
| Environment | `useEnvironment()`                         | Checking current environment                    |
| Analytics   | `useAnalytics()`                           | Tracking user events                            |
| FiltersMenu | `useFiltersMenu()`                         | Managing filter menu state                      |
| CustomForms | `useCustomForms()`                         | Accessing custom forms data                     |

---

### Local State (useState) -- Component-specific

| Characteristic                               | Fits Local State? |
| -------------------------------------------- | ----------------- |
| Only this component needs it                 | Yes               |
| Parent-child prop drilling is <= 2 levels    | Yes               |
| Resets when component unmounts (OK)          | Yes               |
| Does NOT need to survive route changes       | Yes               |
| Rapidly changing (mouse position, animation) | Yes               |

```tsx
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

---

### useMemo -- Derived/computed data

| Characteristic                        | Fits useMemo? |
| ------------------------------------- | ------------- |
| Computed from existing state or props | Yes           |
| Expensive to recompute                | Yes           |
| No side effects                       | Yes           |
| Result should be referentially stable | Yes           |

```tsx
const filteredVisits = useMemo(
  () => visits.filter(v => v.status === selectedStatus),
  [visits, selectedStatus],
);
```

---

## Common Scenarios

| Scenario                             | State Location                               |
| ------------------------------------ | -------------------------------------------- |
| List of visits from API              | RTK Query (`useGetVisitsQuery`)              |
| Which visit is selected in the list  | Redux slice (`selectedVisit`)                |
| Visit details for the selected visit | RTK Query (`useGetVisitByIdQuery`)           |
| Search input text in the list        | `useState` (local)                           |
| Debounced search query               | `useDebounceValue` (local)                   |
| Filtered visit list                  | `useMemo` (derived)                          |
| Editing visit notes form             | React Hook Form                              |
| Whether the form has unsaved changes | Redux slice (`unsavedChanges`)               |
| Toast after saving                   | Context (`useToast`)                         |
| "Are you sure?" confirmation         | Context (`useDialog`)                        |
| Current viewport (mobile/desktop)    | Context (`useLayout`)                        |
| Dropdown open/closed in a cell       | `useState` (local)                           |
| User's auth token                    | Redux slice (`auth`)                         |
| Current practice data                | Context (`useCurrentPractice`) via RTK Query |
| Sidebar expanded/collapsed           | Redux slice (`sidebar`)                      |

---

## Anti-Patterns

| Anti-Pattern                              | Why It's Wrong                          | Correct Approach                           |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------ |
| Storing API data in a Redux slice         | Duplicates RTK Query cache, goes stale  | Use RTK Query endpoint                     |
| Using Redux for form field values         | Overkill, poor performance on keystroke | Use React Hook Form                        |
| Using Context for rapidly changing data   | Causes full subtree re-renders          | Use `useState` or Redux                    |
| Prop drilling > 2 levels for shared state | Tight coupling, hard to refactor        | Use Context or Redux                       |
| `useState` for state needed across routes | Lost on navigation                      | Use Redux slice                            |
| Creating new Context for single component | Unnecessary complexity                  | Use `useState`                             |
| Using `useSelector` from `react-redux`    | Loses type safety                       | Use `useAppSelector` from `ev-store/redux` |
