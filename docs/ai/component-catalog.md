# eVisit UI Component Catalog

> **For AI Tools** — This is the canonical reference for all reusable components. Always search this catalog before creating new components. If an existing component can serve your need (even with minor extension), prefer reuse over creation.
>
> Last updated: 2026-03-25

---

## Quick Lookup Table

| Need                    | Component              | Import                                 |
| ----------------------- | ---------------------- | -------------------------------------- |
| Clickable action        | Button                 | `ev-components/Button`                 |
| Text input              | Input                  | `ev-components/Input`                  |
| Modal/confirmation      | Dialog                 | `ev-components/Dialog`                 |
| Select/dropdown         | Dropdown               | `ev-components/Dropdown`               |
| Tab navigation          | Tabs                   | `ev-components/Tabs`                   |
| Status banner           | Banner                 | `ev-components/Banner`                 |
| Count/label badge       | Badge                  | `ev-components/Badge`                  |
| User avatar             | Avatar                 | `ev-components/Avatar`                 |
| Calendar/scheduling     | Calendar               | `ev-components/Calendar`               |
| Checkbox                | Checkbox               | `ev-components/Checkbox`               |
| Data table              | DataGrid               | `ev-components/DataGrid`               |
| Date picker             | DateInput              | `ev-components/DateInput`              |
| Date range picker       | DateRange              | `ev-components/DateRange`              |
| Date + time picker      | DateTimeInput          | `ev-components/DateTimeInput`          |
| Side/bottom panel       | Drawer                 | `ev-components/Drawer`                 |
| FontAwesome icon        | Icon                   | `ev-components/Icon`                   |
| Navigation link         | Link                   | `ev-components/Link`                   |
| Spinner/loading         | LoadingIndicator       | `ev-components/LoadingIndicator`       |
| Context menu            | Menu                   | `ev-components/Menu`                   |
| Button + menu           | MenuButton             | `ev-components/MenuButton`             |
| Page controls           | Pagination             | `ev-components/Pagination`             |
| Floating panel          | Popover                | `ev-components/Popover`                |
| Radio selection         | RadioButtons           | `ev-components/RadioButtons`           |
| Side navigation         | Sidebar                | `ev-components/Sidebar`                |
| Bottom notification     | Snackbar               | `ev-components/Snackbar`               |
| Alert toast             | Toast                  | `ev-components/Toast`                  |
| On/off switch           | Toggle                 | `ev-components/Toggle`                 |
| Hover tooltip           | Tooltip                | `ev-components/Tooltip`                |
| Typography              | Text                   | `ev-components/Text`                   |
| Tag/chip                | Tag                    | `ev-components/Tag`                    |
| Star rating             | StarRating             | `ev-components/StarRating`             |
| Image carousel          | Carousel               | `ev-components/Carousel`               |
| Collapsible section     | BasicAccordion         | `ev-components/BasicAccordion`         |
| Multi-step progress     | FlowProgress           | `ev-components/FlowProgress`           |
| Wizard/journey          | Journey                | `ev-components/Journey`                |
| Card container          | Tile                   | `ev-components/Tile`                   |
| Chip selector           | SelectorChip           | `ev-components/SelectorChip`           |
| Chip dropdown           | DropdownChip           | `ev-components/DropdownChip`           |
| Tab selector            | SelectorTab            | `ev-components/SelectorTab`            |
| Boolean toggle buttons  | BooleanButtons         | `ev-components/BooleanButtons`         |
| Hierarchical checkboxes | CheckboxesTree         | `ev-components/CheckboxesTree`         |
| Rich list item          | ComplexListItem        | `ev-components/ComplexListItem`        |
| Context side panel      | ContextPanel           | `ev-components/ContextPanel`           |
| Tiered modal stack      | TieredModal            | `ev-components/TieredModal`            |
| Inline editing          | InlineEditableText     | `ev-components/InlineEditableText`     |
| Google Map              | GoogleMap              | `ev-components/GoogleMap`              |
| Address autocomplete    | GoogleMapsAutocomplete | `ev-components/GoogleMapsAutocomplete` |
| Time input              | TimeInput              | `ev-components/TimeInput`              |
| Timezone selector       | TimezoneDropdown       | `ev-components/TimezoneDropdown`       |
| Language selector       | LanguageSelector       | `ev-components/LanguageSelector`       |
| File attachments        | Attachments            | `ev-components/Attachments`            |
| Visit status dropdown   | VisitStatusSelector    | `ev-components/VisitStatusSelector`    |

---

## Detailed Component Reference

### Button

**Import**: `import Button, { ButtonTypes, ButtonSize } from 'ev-components/Button'`

**Required props**: `id: string`

**Key props**:

- `variant?: ButtonTypes` — Primary (contained), Secondary (outlined), Special, Tertiary (text)
- `size?: ButtonSize` — Small, Medium (default), Large, ExtraLarge
- `label?: string` — Button text
- `disabled?: boolean` — Disabled state
- `busy?: boolean` — Loading state (shows spinner, sets aria-busy)
- `busyText?: string` — Text shown during loading
- `fullWidth?: boolean` — Full container width
- `startIcon?: IconDefinition` — Icon before label
- `endIcon?: IconDefinition` — Icon after label
- `icon?: IconDefinition` — Icon-only button
- `badge?: string` — Badge overlay
- `onClick?: React.MouseEventHandler<HTMLElement>`
- `href?: string` — Renders as anchor
- `target?: string` — Link target
- `hasToolTip?: boolean` — Enable tooltip
- `tooltipText?: string` — Tooltip content

**Exported enums**:

- `ButtonTypes`: Primary = 'contained', Secondary = 'outlined', Special = 'special', Tertiary = 'text'
- `ButtonSize`: Small = 'small', Medium = 'medium', Large = 'large', ExtraLarge = 'extraLarge'
- `OpenIndicatorType`: Angle = 'angle', Ellipsis = 'ellipsis'

**Uses forwardRef**: Yes (`HTMLAnchorElement | HTMLButtonElement`)

**Accessibility**: aria-label, aria-busy, aria-checked, aria-selected, visible focus ring

**Responsive**: Use `fullWidth={isMobile}` on mobile layouts

**When to use**: Any clickable action — submit, navigate, toggle, cancel, open menu
**When NOT to use**: Navigation links (use `Link`), icon-only without text (add `ariaLabel`)

---

### Input

**Import**: `import Input, { InputSize } from 'ev-components/Input'`

**Required props**: `id: string` + one of: `label`, `ariaLabel`, or `labelledBy` (AccessibleLabelProps)

**Key props**:

- `type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'time' | 'search'`
- `size?: InputSize` — Small, Medium (default), Large, ExtraLarge
- `placeholder?: string`
- `format?: (value: string) => string` — Input formatter (phone, credit card, etc.)
- `icon?: IconDefinition` — Leading icon
- `maxLength?: number`
- `required?: boolean` — Shows asterisk, sets aria-required
- `disabled?: boolean`
- `fullWidth?: boolean`
- `multiline?: boolean` — Textarea mode
- `rows?: number` — Textarea rows
- `startAdornment?: ReactNode` — Start adornment
- `endAdornment?: ReactNode` — End adornment
- `control?: Control<any>` — React Hook Form control
- `readOnly?: boolean`
- `helperText?: string` — Helper/error text below input

**Exported enums**: `InputSize`: Small, Medium, Large, ExtraLarge

**Uses forwardRef**: Yes (`HTMLInputElement`)

**Accessibility**: aria-label/aria-labelledby required (enforced by discriminated union), aria-required, aria-describedby, aria-invalid on error

**When to use**: Any text entry — name, email, phone, search, password, numbers
**When NOT to use**: Dropdown selection (use `Dropdown`), date selection (use `DateInput`), boolean (use `Toggle` or `Checkbox`)

**Formatters** (from `ev-utils/formatters`): `maskPhoneFormatter`, `phoneFormatter`, `creditCardFormatter`, `creditCardExpirationFormatter`, `numberFormatter`, `numericWithDecimalsFormatter`, `floatFormatter`, `alphanumericFormatter`, `timeFormatter`

---

### Dialog

**Import**: `import Dialog from 'ev-components/Dialog'`

**Required props**: `open: boolean`

**Key props**:

- `title?: string` — Dialog title
- `children?: ReactNode` — Dialog body content
- `onAccept?: () => void` — Accept/confirm callback
- `onReject?: () => void` — Reject/cancel callback
- `onClose?: () => void` — Close callback (X button, escape, backdrop)
- `acceptText?: string` — Accept button label
- `rejectText?: string` — Reject button label
- `acceptId?: string` — Accept button test ID
- `rejectId?: string` — Reject button test ID
- `icon?: IconDefinition` — Header icon
- `iconColor?: string` — Icon color (use EVColors)
- `width?: number | string` — Dialog width (default: responsive)
- `busy?: boolean` — Loading state on accept button
- `required?: boolean` — Hides close/reject buttons
- `hideReject?: boolean` — Hide reject button
- `hideAccept?: boolean` — Hide accept button
- `textAlign?: 'left' | 'center'`
- `scrollShadow?: boolean` — Shadow on scroll
- `divider?: boolean` — Divider between header and content

**Accessibility**: role="dialog", focus trap, aria-labelledby, Escape closes, focus returns on close

**Responsive**: Width adapts to `calc(100vw - 48px)` on mobile; buttons become full-width

**When to use**: Confirmations, forms that block interaction, critical actions, warnings
**When NOT to use**: Non-blocking info (use `Toast` or `Banner`), side content (use `Drawer`)

---

### Dropdown

**Import**: `import Dropdown from 'ev-components/Dropdown'`

**Required props**: `id: string`, `options: Option[]` + one of: `label`, `ariaLabel`, or `labelledBy`

**Key props**:

- `options: { value: string; label: string; disabled?: boolean }[]`
- `placeholder?: string`
- `initialValue?: string | string[]`
- `multiple?: boolean` — Multi-select
- `searchable?: boolean` — Filter options by typing
- `clearable?: boolean` — Show clear button
- `disabled?: boolean`
- `required?: boolean`
- `size?: InputSize`
- `control?: Control<any>` — React Hook Form
- `onSelect?: (selected: Option | Option[]) => void`
- `onChange?: (option: Option) => void`
- `onClear?: () => void`
- `drawer?: boolean` — Use drawer on mobile
- `drawerTitle?: string`
- `freeSolo?: boolean` — Allow custom values
- `helperText?: string`

**Accessibility**: aria-expanded, aria-haspopup="listbox", aria-selected on options, keyboard navigation (arrows)

**When to use**: Selection from a list of options, filters, settings
**When NOT to use**: Binary choice (use `Toggle`), 2-3 options (use `RadioButtons`), navigation (use `Tabs`)

---

### Tabs

**Import**: `import Tabs, { TabVariant, TabSize } from 'ev-components/Tabs'`

**Required props**:

- `tabList: { label: string; icon?: IconDefinition; id: string; disabled?: boolean }[]`
- `tabsLabel: string` — Accessible label for the tablist
- `tabsListId: string`

**Key props**:

- `defaultTabIndex?: number`
- `onSelect?: (index: number) => void`
- `onClick?: (index: number) => void`
- `onBeforeChange?: (index: number) => boolean` — Cancel tab change
- `size?: TabSize` — Small, Medium (default), Large
- `variant?: TabVariant` — Contained, Underlined (default), Icon
- `disabled?: boolean`

**Exported enums**:

- `TabVariant`: Contained, Underlined, Icon
- `TabSize`: Small, Medium, Large

**Accessibility**: role="tablist"/role="tab", aria-selected, aria-controls, keyboard navigation (arrows, Home/End)

**When to use**: Content sections on same page, settings categories, filter views
**When NOT to use**: Page navigation (use Router/Links), 2 options (use `Toggle` or `BooleanButtons`)

---

### Banner

**Import**: `import Banner, { BannerVariants } from 'ev-components/Banner'`

**Required props**: `id: string`, `title: string`, `description: string`

**Key props**:

- `variant?: BannerVariants` — informative (default), negative, warning, neutral, contextual
- `avatar?: { firstName?: string; lastName?: string; hasAvatar?: boolean; avatarSrc?: string }`
- `action?: { label: string; onClick: () => void; disabled?: boolean }`
- `handleClose?: () => void` — Dismissible
- `icon?: IconDefinition`

**Accessibility**: Icon + color + text (not color alone), close button with aria-label

**When to use**: Page-level alerts, status messages, info banners, warnings
**When NOT to use**: Temporary notifications (use `Toast`), inline field errors (use Input helperText)

---

### Badge

**Import**: `import Badge, { BadgeSize, BadgeColor } from 'ev-components/Badge'`

**Required props**: `id: string`

**Key props**:

- `content?: string | number` — Badge text/count
- `size?: BadgeSize` — Small, Medium (default), Large
- `color?: BadgeColor` — Brand (default), BrandContrast, Danger, Warning, Success, DecorativePink, Neutral
- `disabled?: boolean`
- `solid?: boolean`
- `icon?: IconDefinition`
- `invisible?: boolean`
- `animated?: boolean`

**When to use**: Notification counts, status indicators, labels
**When NOT to use**: Tags/chips (use `Tag`), action buttons (use `Button`)

---

### Avatar

**Import**: `import Avatar from 'ev-components/Avatar'`

**Key props**:

- `firstName?: string`, `lastName?: string` — Initials source
- `size?: number` — Pixel size (default: 48)
- `hasAvatar?: boolean` — Show image
- `avatarSrc?: string` — Image URL
- `background?: string` — Background color
- `badge?: string | ReactNode` — Badge overlay
- `onBadgeClick?: () => void`
- `label?: string`
- `icon?: IconDefinition`

**Accessibility**: alt text for images (includes user name), aria-label for icon avatars

**When to use**: User profile images, participant lists, comment threads
**When NOT to use**: Decorative icons (use `Icon`), status badges (use `Badge`)

---

### Text (Typography)

**Import**: `import Text from 'ev-components/Text'`

**Usage**: Access typography variants as sub-components:

```tsx
<Text.Headline1>Page Title</Text.Headline1>
<Text.Title>Section Title</Text.Title>
<Text.Body>Body text</Text.Body>
<Text.BodyBold>Bold body</Text.BodyBold>
<Text.Description>Secondary text</Text.Description>
<Text.Footnote>Small text</Text.Footnote>
<Text.Caption>Tiny text</Text.Caption>
```

**All variants**: Headline1-5, Title, Subtitle, Body, BodyBold, BodySemiBold, BodyItalic, BodyItalicBold, Description, DescriptionBold, DescriptionItalic, DescriptionItalicBold, Footnote, FootnoteBold, FootnoteItalic, FootnoteItalicBold, Caption, CaptionBold, CaptionItalic, CaptionItalicBold

**Key props** (all variants): `color?: string`, `margin?: string`, `padding?: string`, `className?: string`

**Accessibility**: Renders semantic HTML (h1-h6 for headlines, p/span for body)

**IMPORTANT**: ALWAYS use `Text` instead of `@mui/material/Typography`. This is enforced by ESLint.

---

### DataGrid

**Import**: `import DataGrid from 'ev-components/DataGrid'`

**Required props**: `rows: any[]`, `columns: GridColDef[]`, `label: string`

**Key props**:

- `page?: number`, `pageSize?: number`
- `onPageChange?: (page: number) => void`
- `onPageSizeChange?: (pageSize: number) => void`
- `loading?: boolean`
- `hideFooter?: boolean`
- `density?: 'compact' | 'standard' | 'comfortable'`
- `selectedRowId?: string | number`
- `striped?: boolean`

**Accessibility**: MUI DataGrid Pro built-in (role="grid", keyboard navigation, aria-sort)

**Responsive**: NOT suitable for mobile. On mobile, provide a card/list alternative:

```tsx
{isDesktop || isTablet ? <DataGrid ... /> : <MobileCardList ... />}
```

**When to use**: Tabular data with sorting, filtering, pagination
**When NOT to use**: Mobile layouts (use card list), simple lists (use Stack/map)

---

### Checkbox

**Import**: `import Checkbox, { CheckboxSize, CheckboxVariant } from 'ev-components/Checkbox'`

**Required props**: `id: string`

**Key props**: `label?: string`, `ariaLabel?: string`, `control?: Control`, `disabled?: boolean`, `initialValue?: boolean`, `onChange?: (checked: boolean) => void`, `size?: CheckboxSize`, `variant?: CheckboxVariant`, `showError?: boolean`

**Enums**: `CheckboxSize` (Small, Medium, Large, ExtraLarge), `CheckboxVariant` (Primary, Indeterminate)

---

### RadioButtons

**Import**: `import RadioButtons, { RadioButtonSize } from 'ev-components/RadioButtons'`

**Required props**: `id: string`, `options: { value: string; label: string; disabled?: boolean }[]`

**Key props**: `label?: string`, `labelledBy?: string`, `disabled?: boolean`, `control?: Control`, `required?: boolean`, `size?: RadioButtonSize`, `initialValue?: string`, `onChange?: (option: Option) => void`, `labelPlacement?: 'end' | 'start' | 'top' | 'bottom'`, `helperText?: string`

---

### Toggle

**Import**: `import Toggle, { ToggleSize } from 'ev-components/Toggle'`

**Required props**: `id: string`

**Key props**: `label?: string`, `ariaLabel?: string`, `control?: Control`, `disabled?: boolean`, `initialValue?: boolean`, `onChange?: (checked: boolean) => void`, `size?: ToggleSize`, `labelPlacement?: 'end' | 'start'`, `readonly?: boolean`, `tooltip?: string`

---

### Toast

**Import**: `import Toast, { ToastVariants } from 'ev-components/Toast'`

**Required props**: `id: string`, `title: string`, `variant: ToastVariants`

**Key props**: `customIcon?: JSX.Element`, `action?: { label: string; onClick: () => void }`, `dismiss?: { onClick: () => void }`

**Enums**: `ToastVariants`: informative, positive, negative, neutral, warning

**Usage**: Typically via `useToast()` hook from `ev-hooks/toast`:

```tsx
const { addToast } = useToast();
addToast({ id: 'success', title: t('Saved'), variant: ToastVariants.positive });
```

---

### Snackbar

**Import**: `import Snackbar, { SnackBarVariants } from 'ev-components/Snackbar'`

**Required props**: `id: string`, `message: string`

**Key props**: `variant?: SnackBarVariants` (default, success, error, warning), `closeButton?: boolean`, `autoHideDuration?: number`, `onClose?: () => void`

**Accessibility**: role="status" or role="alert", aria-live

---

### Tooltip

**Import**: `import Tooltip, { TooltipVariant } from 'ev-components/Tooltip'`

**Required props**: `id: string`, `text: string`, `children: ReactNode`

**Key props**: `variant?: TooltipVariant` (Light, Dark), `arrowPlacement?: PopperPlacementType` (default: 'top'), `maxWidth?: string | number`

**Accessibility**: role="tooltip", aria-describedby, appears on hover AND focus

---

### Drawer

**Import**: `import Drawer from 'ev-components/Drawer'`

**Required props**: `open: boolean`, `options: Option[]`

**Key props**: `onSelect: (option: Option) => void`, `onClose: () => void`, `title?: string`, `searchable?: boolean`, `loading?: boolean`, `selectedValue?: string`, `selectedValues?: string[]`, `multiple?: boolean`

**Option type**: `{ value: string; icon?: IconDefinition; label: string; subtext?: string; variant?: 'default' | 'destructive'; disabled?: boolean; renderContent?: ReactNode }`

---

### Popover

**Import**: `import Popover from 'ev-components/Popover'`

**Required props**: `anchorButton: ReactNode`

**Key props**: `children?: ReactNode`, `description?: string`, `header?: { title?: string; closeAction?: () => void; divider?: boolean }`, `actionButtons?: { label: string; onClick: () => void; variant?: ButtonTypes }[]`, `maxHeight?: string | number`, `width?: string | number`

---

### Menu

**Import**: `import Menu from 'ev-components/Menu'`

**Required props**: `anchorEl: HTMLElement | null`, `open: boolean`, `options: MenuOption[]`, `size: 'small' | 'medium' | 'large'`

**Key props**: `multiple?: boolean`, `value?: string | string[]`, `onSelect?: (option: MenuOption) => void`, `minWidth?: number`, `maxWidth?: number`, `searchable?: boolean`, `loading?: boolean`, `onClose?: () => void`

---

### Link

**Import**: `import Link from 'ev-components/Link'`

**Required props**: `id: string`, `href: string`

**Key props**: `children?: ReactNode`, `download?: boolean | string`, `onClick?: (event: React.MouseEvent) => void`, `underlined?: boolean`, `variant?: 'body' | 'description' | 'footnote'`, `boldText?: boolean`

---

### Sidebar

**Import**: `import Sidebar from 'ev-components/Sidebar'`

**Required props**: `items: SidebarItem[]`

**SidebarItem**: `{ id: string; label: string; icon?: IconDefinition; badge?: string; disabled?: boolean; subItems?: SidebarItem[] }`

**Key props**: `onSelect?: (item: SidebarItem) => void`, `selectedItemId?: string`, `collapsed?: boolean`, `onToggleCollapse?: () => void`

**Responsive**: Converts to drawer on mobile via useLayout()

---

### DateInput

**Import**: `import DateInput from 'ev-components/DateInput'`

**Required props**: `id: string` + one of: `label`, `ariaLabel`, or `labelledBy`

**Key props**: `value?: DateTime | null`, `onChange?: (date: DateTime | null) => void`, `disableFuture?: boolean`, `disablePast?: boolean`, `format?: string`, `readOnly?: boolean`

---

### DateRange

**Import**: `import DateRange from 'ev-components/DateRange'`

**Key props**: `value?: [DateTime | null, DateTime | null]`, `onChange?: (dates: [DateTime | null, DateTime | null]) => void`, `shortcuts?: { label: string; getValue: () => [DateTime, DateTime] }[]`, `disableFuture?: boolean`, `disablePast?: boolean`, `calendars?: number` (default: 2)

---

### Pagination

**Import**: `import Pagination from 'ev-components/Pagination'`

**Required props**: `count: number` (total pages), `page: number` (1-based), `onChange: (page: number) => void`

**Key props**: `disabled?: boolean`, `size?: 'small' | 'medium' | 'large'`, `showFirstButton?: boolean`, `showLastButton?: boolean`

---

### LoadingIndicator

**Import**: `import LoadingIndicator from 'ev-components/LoadingIndicator'`

**Key props**: `size?: number` (default: 64), `color?: string` (default: EVColors.cerulean)

**Accessibility**: role="status"

---

### Icon

**Import**: `import Icon from 'ev-components/Icon'`

**Required props**: `icon: IconDefinition | React.ComponentType`

**Key props**: `id?: string`, `ariaLabel?: string`, `size?: string | number`, `color?: string`, `spin?: boolean`, `buttonBehavior?: { id: string; onClick: () => void; label?: string }`

**Accessibility**: aria-hidden="true" for decorative, aria-label for meaningful icons

---

### Calendar

**Import**: `import Calendar from 'ev-components/Calendar'`

**Required props**: `id: string`, `events: CalendarEvent[]`, `onDateSelect: (date: DateTime) => void`

**Key props**: `onEventClick?: (event: CalendarEvent) => void`, `selectable?: boolean`, `startDate?: DateTime`, `endDate?: DateTime`

Uses FullCalendar under the hood.

---

### Additional Components

**BasicAccordion** (`ev-components/BasicAccordion`): Collapsible content sections
**BooleanButtons** (`ev-components/BooleanButtons`): Yes/No toggle button group
**Carousel** (`ev-components/Carousel`): Image/content carousel
**CheckboxesTree** (`ev-components/CheckboxesTree`): Hierarchical checkbox tree
**ComplexListItem** (`ev-components/ComplexListItem`): Rich list items with metadata
**ContextPanel** (`ev-components/ContextPanel`): Context-aware side panel
**DropdownChip** (`ev-components/DropdownChip`): Dropdown displayed as a chip
**FlowProgress** (`ev-components/FlowProgress`): Multi-step progress indicator
**GoogleMap** (`ev-components/GoogleMap`): Google Maps integration
**GoogleMapsAutocomplete** (`ev-components/GoogleMapsAutocomplete`): Address autocomplete
**InlineEditableText** (`ev-components/InlineEditableText`): Click-to-edit text
**Journey** (`ev-components/Journey`): Multi-step wizard component
**LanguageSelector** (`ev-components/LanguageSelector`): Language picker
**MenuButton** (`ev-components/MenuButton`): Button with attached dropdown menu
**SelectorChip** (`ev-components/SelectorChip`): Selectable chip/tag group
**SelectorTab** (`ev-components/SelectorTab`): Selectable tab-like buttons
**StarRating** (`ev-components/StarRating`): Star rating input
**Tag** (`ev-components/Tag`): Removable tag/chip
**Tile** (`ev-components/Tile`): Card/tile container
**TieredModal** (`ev-components/TieredModal`): Stacked modal system
**TimeInput** (`ev-components/TimeInput`): Time-only input
**TimezoneDropdown** (`ev-components/TimezoneDropdown`): Timezone selector
**VisitStatusSelector** (`ev-components/VisitStatusSelector`): Visit status dropdown
