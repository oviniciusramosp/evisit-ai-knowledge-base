---
name: component-lookup
description: Automatically activated when the developer describes a UI need or asks to create a UI element. Searches the ev-components catalog to find existing components before suggesting creation of new ones. Always prefer existing components over new ones.
user-invocable: true
---

# Component Lookup

## When This Activates

This skill activates automatically when you detect any of these patterns:

- Developer describes a UI element they need ("I need a button", "add a form", "create a modal")
- Developer asks to create a new component
- Developer mentions creating UI for a feature

## Mandatory Steps

### 1. Search the Component Catalog

Read `docs/ai/component-catalog.md` and search for the described need.

### 2. Check the Decision Tree

Read `docs/ai/decision-trees/component-selection.md` to determine the correct path.

### 3. Follow This Priority

1. **Use existing ev-component as-is** — Show the import path and props
2. **Compose existing components** — Combine Button + Dialog + Input for a form modal
3. **Extend existing component** — Add a new prop if < 50 lines of changes
4. **Create in app-specific components/** — If only used in one sub-app
5. **Create in ev-common/** — If shared across sub-apps with business logic
6. **Create in ev-components/** — Only for generic UI primitives (requires full story + tests)

### 4. When Showing an Existing Component

Always include:

- The exact import statement
- Required props
- Key optional props relevant to the use case
- Any exported enums/types they'll need
- A code example of usage

### 5. When Creating a New Component

If no existing component serves the need, invoke the `/new-component` skill which enforces:

- Proper file structure
- Accessibility compliance
- Storybook story
- Tests with validateAccessibility
- Design token usage
- Catalog entry update

## Quick Reference

These components exist and cover most UI needs:

- **Actions**: Button, MenuButton, Link, Icon (with buttonBehavior)
- **Form Inputs**: Input, Dropdown, Checkbox, RadioButtons, Toggle, DateInput, DateRange, DateTimeInput, TimeInput
- **Layout**: Dialog, Drawer, Sidebar, ContextPanel, Tabs, BasicAccordion, TieredModal
- **Data Display**: DataGrid, Text, Badge, Tag, Avatar, StarRating, ComplexListItem
- **Feedback**: Toast (via useToast), Banner, Snackbar, LoadingIndicator, Tooltip
- **Navigation**: Tabs, SelectorTab, SelectorChip, BooleanButtons, FlowProgress, Journey
- **Specialized**: Calendar, GoogleMap, GoogleMapsAutocomplete, Carousel, VisitStatusSelector

## Anti-Pattern Alert

NEVER create raw HTML elements when an ev-component exists:

- `<div onClick>` → Use `Button` or `Icon` with buttonBehavior
- `<input>` → Use `Input`
- `<select>` → Use `Dropdown`
- MUI components directly → Use the ev-components wrapper
