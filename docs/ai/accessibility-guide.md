<!-- AI Reference: Accessibility Guidelines for eVisit UI -->
<!-- Source of truth. Referenced by CLAUDE.md -->

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
