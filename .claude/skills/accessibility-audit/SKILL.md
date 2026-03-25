---
name: accessibility-audit
description: Use when auditing a component or page for WCAG 2.1 AA compliance. Provides the full checklist covering semantic HTML, ARIA, keyboard, color, forms, and testing.
user-invocable: true
---

# Accessibility Audit Checklist (WCAG 2.1 AA)

## Semantic Structure

- [ ] Correct heading hierarchy (h1 > h2 > h3, no skipping). One h1 per page.
- [ ] Landmark regions: `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`
- [ ] Semantic elements: `<button>` for actions, `<a>` for navigation, `<ul>`/`<ol>` for lists
- [ ] No `<div>` or `<span>` as interactive elements

## ARIA Attributes

- [ ] Every interactive element has an accessible name (label, aria-label, or aria-labelledby)
- [ ] `aria-describedby` for supplementary instructions on form fields
- [ ] `aria-live="polite"` for non-urgent updates, `aria-live="assertive"` for urgent
- [ ] `aria-busy="true"` on loading containers
- [ ] `aria-expanded` on toggles that show/hide content
- [ ] `aria-current="page"` on active navigation links
- [ ] `aria-required` on required form fields
- [ ] `aria-invalid` on fields with validation errors

## Keyboard Navigation

- [ ] Logical tab order (no positive tabIndex values)
- [ ] Focus trapped inside open Dialogs/Drawers
- [ ] Focus returns to trigger when Dialog/Drawer closes
- [ ] Escape closes Dialogs, Drawers, Dropdowns
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate within composite widgets (tabs, menus, grids)

## Focus Indicators

- [ ] Visible `:focus-visible` style on ALL interactive elements
- [ ] Standard focus ring: `box-shadow: 0px 0px 0px 2px ${EVColors.cobalt}, 0px 0px 0px 4px ${EVColors.selectedHover}`
- [ ] Never `outline: none` without a replacement focus style

## Color and Contrast

- [ ] Text contrast: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)
- [ ] UI component contrast: 3:1 for borders, icons, graphical objects
- [ ] No information conveyed by color alone — pair with text, icons, or patterns
- [ ] Use EVColors semantic tokens (designed for AA compliance on white)

## Forms

- [ ] Every field has a visible label or aria-label
- [ ] Required fields marked with `required` prop (auto-adds asterisk + aria-required)
- [ ] Inline error messages next to fields (not just toasts)
- [ ] Error messages are descriptive ("Phone must be 10 digits" not "Invalid input")
- [ ] All error text translated via `t()`
- [ ] Error summary at top of multi-field forms on submission failure

## Images and Media

- [ ] `alt=""` for decorative images, descriptive alt for informational
- [ ] Video controls have text labels
- [ ] Status announcements via aria-live for call state changes

## Touch Targets

- [ ] Minimum 44x44px for all tappable elements on mobile
- [ ] No hover-dependent interactions without tap/focus alternatives

## Testing

```tsx
import { render, validateAccessibility } from 'ev-test/test-utils';

test('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  await validateAccessibility(container);
});
```

- [ ] `validateAccessibility()` test included for this component
- [ ] Tested at mobile and desktop layouts
- [ ] Tested in all states: empty, filled, error, disabled, loading
