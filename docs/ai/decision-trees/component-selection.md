# Component Selection Decision Tree

> **For AI Tools** — Follow this flowchart BEFORE creating any new UI component. Always prefer existing components.

---

## Step 1: Do You Need a New Component?

```
START: "I need a UI element for X"
  │
  ├─ Search docs/ai/component-catalog.md for keyword match
  │
  ├─ EXACT MATCH found?
  │   └─ YES → Use it. STOP.
  │
  ├─ PARTIAL MATCH found? (existing component does 80%+ of what you need)
  │   └─ YES → Can it be extended with < 50 lines of changes?
  │       ├─ YES → Extend the existing component with new prop/variant. STOP.
  │       └─ NO → Proceed to Step 2.
  │
  └─ NO MATCH → Proceed to Step 2.
```

## Step 2: Where Should the New Component Live?

```
Is this component used by ONLY ONE sub-app?
  ├─ YES → Create in that sub-app's components/ directory
  │        (e.g., app-provider/components/MyComponent/)
  │
  └─ NO → Is this a FEATURE-LEVEL component (specific business logic)?
      ├─ YES → Create in ev-common/
      │        (e.g., ev-common/MyFeature/MyComponent/)
      │
      └─ NO → Is this a GENERIC UI PRIMITIVE (reusable across any context)?
          ├─ YES → Create in ev-components/
          │        (requires: full story, tests, a11y test, catalog entry)
          │
          └─ NO → Create in the consuming module's local directory
```

---

## Common Needs → Existing Components

### "I need a button"

→ `ev-components/Button` with `ButtonTypes` enum

- Primary action: `variant={ButtonTypes.Primary}`
- Secondary action: `variant={ButtonTypes.Secondary}`
- Text-only: `variant={ButtonTypes.Tertiary}`
- Icon + text: `startIcon={faIcon}` or `endIcon={faIcon}`
- Icon only: `icon={faIcon}` + `ariaLabel="description"`
- Loading state: `busy={true}` + `busyText="Loading..."`
- With menu: Use `ev-components/MenuButton` instead

### "I need a text input"

→ `ev-components/Input`

- With formatter: `format={maskPhoneFormatter}` (from `ev-utils/formatters`)
- Password: `type="password"`
- Search: `type="search"` + `icon={faSearch}`
- Textarea: `multiline={true}` + `rows={4}`
- With React Hook Form: `control={control}` prop

### "I need a dropdown/select"

→ `ev-components/Dropdown`

- Single select: default
- Multi select: `multiple={true}`
- Searchable: `searchable={true}`
- Mobile drawer: `drawer={true}` + `drawerTitle="Select"`
- With custom values: `freeSolo={true}`

### "I need a date picker"

→ Single date: `ev-components/DateInput`
→ Date range: `ev-components/DateRange`
→ Date + time: `ev-components/DateTimeInput`
→ Time only: `ev-components/TimeInput`

### "I need a modal/dialog"

→ Simple confirmation: `ev-components/Dialog` with `title`, `onAccept`, `onReject`
→ Complex form: `ev-components/Dialog` with `children` containing form elements
→ Stacked modals: `ev-components/TieredModal`
→ Side panel: `ev-components/Drawer` or `ev-components/ContextPanel`

### "I need tabs"

→ Content tabs: `ev-components/Tabs` with `TabVariant.Underlined`
→ Contained tabs: `ev-components/Tabs` with `TabVariant.Contained`
→ Toggle between 2 options: `ev-components/BooleanButtons`
→ Selectable chip group: `ev-components/SelectorChip`
→ Tab-style selector: `ev-components/SelectorTab`

### "I need a notification"

→ Temporary toast: `useToast()` hook from `ev-hooks/toast`
→ Page banner: `ev-components/Banner`
→ Bottom snackbar: `ev-components/Snackbar`

### "I need a data table"

→ Desktop: `ev-components/DataGrid` (MUI X Data Grid Pro)
→ Mobile: Create a card/list view — DataGrid is NOT suitable for mobile

### "I need a loading state"

→ Spinner: `ev-components/LoadingIndicator`
→ Button loading: `Button` with `busy={true}`
→ Skeleton: Use MUI `Skeleton` component

### "I need an icon"

→ `ev-components/Icon` with FontAwesome icons from `@fortawesome/`

- Decorative: `<Icon icon={faIcon} />` (auto aria-hidden)
- Meaningful: `<Icon ariaLabel="description" icon={faIcon} />`
- Clickable: `<Icon buttonBehavior={{ id: 'btn', onClick: fn, label: 'Click' }} icon={faIcon} />`

### "I need a tooltip"

→ `ev-components/Tooltip` wrapping the trigger element

- Light variant (default): `variant={TooltipVariant.Light}`
- Dark variant: `variant={TooltipVariant.Dark}`

### "I need navigation"

→ Side nav: `ev-components/Sidebar`
→ Text link: `ev-components/Link`
→ Active nav link: `ev-components/NavLink`
→ Route navigation: `useAppNavigate()` from `ev-hooks/navigate`

### "I need a form"

→ Use `react-hook-form` with `useController` for each field
→ Validation: Yup schemas via `@hookform/resolvers`
→ Form fields: `Input`, `Dropdown`, `Checkbox`, `RadioButtons`, `Toggle`, `DateInput`
→ Each field needs `control={control}` prop from `useForm()`

### "I need a checkbox or toggle"

→ Single on/off: `ev-components/Toggle`
→ Single checkbox with label: `ev-components/Checkbox`
→ Multiple checkboxes: Map over options with `Checkbox`
→ Hierarchical checkboxes: `ev-components/CheckboxesTree`
→ Radio selection (one of many): `ev-components/RadioButtons`

### "I need a user avatar"

→ `ev-components/Avatar`

- With image: `hasAvatar={true}` + `avatarSrc={url}`
- Initials only: `firstName="John"` + `lastName="Doe"`
- With badge: `badge="3"` or `badge={<Badge ... />}`

### "I need a tag/badge"

→ Count indicator: `ev-components/Badge`
→ Removable tag: `ev-components/Tag`
→ Star rating: `ev-components/StarRating`

### "I need a calendar"

→ `ev-components/Calendar` (FullCalendar wrapper)

### "I need a map"

→ `ev-components/GoogleMap`
→ Address input: `ev-components/GoogleMapsAutocomplete`

---

## Anti-Patterns (NEVER Do This)

| Instead of...                         | Use...                                                      |
| ------------------------------------- | ----------------------------------------------------------- |
| `<div onClick={...}>`                 | `<Button>` or `<Icon buttonBehavior={...}>`                 |
| `@mui/material/Typography`            | `ev-components/Text`                                        |
| `@mui/material/Dialog`                | `ev-components/Dialog`                                      |
| `@mui/material/Select`                | `ev-components/Dropdown`                                    |
| `@mui/material/TextField`             | `ev-components/Input`                                       |
| `@mui/material/Tabs`                  | `ev-components/Tabs`                                        |
| `@mui/material/Snackbar`              | `ev-components/Snackbar` or `useToast()`                    |
| Raw `<input>`                         | `ev-components/Input`                                       |
| CSS media queries                     | `useLayout()` hook                                          |
| `window.innerWidth`                   | `useLayout()` hook                                          |
| Raw hex colors                        | `EVColors` tokens                                           |
| `useNavigate()`                       | `useAppNavigate()` from `ev-hooks/navigate`                 |
| `useDispatch()`/`useSelector()`       | `useAppDispatch()`/`useAppSelector()` from `ev-store/redux` |
| `useTranslation()` from react-i18next | `useTranslation()` from `ev-i18n`                           |
| `styled-components`                   | `styled-components/macro`                                   |
