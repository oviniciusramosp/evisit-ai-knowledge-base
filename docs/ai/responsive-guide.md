<!-- AI Reference: Responsive Design Guidelines for eVisit UI -->
<!-- Source of truth. Referenced by CLAUDE.md -->

## 8. Responsive Design Guidelines for Claude

### 8.1 Core Principles

This project follows a **desktop-first approach with explicit breakpoints** for tablet and mobile. The application is embedded in a React Native WebView for mobile native apps, so responsive behavior must work correctly in both browser and WebView contexts.

#### Breakpoint System

The project defines custom breakpoints in `ev-static/breakpoints.ts`:

| Breakpoint                    | Width    | Description                                      |
| ----------------------------- | -------- | ------------------------------------------------ |
| `BreakPoints.MobileSmall`     | 384px    | Small mobile screens                             |
| `BreakPoints.Mobile`          | 744px    | Mobile threshold (width <= 744px)                |
| `BreakPoints.MobileLandscape` | 932px    | Mobile landscape detection (with height < width) |
| `BreakPoints.Tablet`          | 1024px   | Tablet threshold (745px - 1024px)                |
| Desktop                       | > 1024px | Default desktop layout                           |

The MUI theme overrides the default breakpoints in `ev-theme/styles/Breakpoints.ts`:

```tsx
// MUI custom breakpoints (applied as "up from" thresholds)
{
  mobile: 0,        // 0px and up
  tablet: 744,      // 744px and up (maps to BreakPoints.Mobile)
  desktop: 1024,    // 1024px and up (maps to BreakPoints.Tablet)
}
```

**Important:** MUI breakpoints work as "minimum width and up," so `tablet` means "from 744px up" (i.e., tablet and larger). The custom `useLayout()` hook provides boolean flags that are simpler to reason about.

#### The `useLayout()` Hook — Primary Responsive Mechanism

The project's standard pattern for responsive behavior is the `useLayout()` hook from `ev-hooks/layout`. **Always use this hook** instead of CSS media queries for layout-dependent logic:

```tsx
import useLayout from 'ev-hooks/layout';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, isMobileLandscape, isLargeMobile } =
    useLayout();

  return (
    <Wrapper>
      {isDesktop && <Sidebar />}
      <Content $fullWidth={!isDesktop}>
        {isMobile ? <MobileHeader /> : <DesktopHeader />}
        {/* ... */}
      </Content>
    </Wrapper>
  );
};
```

The hook also exposes `width`, `height`, `hideHeader`, `hideTopbar`, and `isEmbedded` for advanced layout control.

### 8.2 Actions Claude Must Take When Building New Interfaces

Claude **must** follow this checklist for every new component, page, or feature:

#### Layout and Structure

1. **Use `useLayout()` for layout decisions** — Do not use `window.innerWidth` directly or create custom resize listeners. The `LayoutProvider` already handles resize events (including iOS Chrome and React Native WebView quirks).
2. **Design for all three breakpoints** — Every new page/feature must work at desktop (> 1024px), tablet (745px - 1024px), and mobile (<= 744px). Provide explicit mobile and tablet layouts, not just "it fits."
3. **Use MUI Grid with custom breakpoints** for layout grids:

   ```tsx
   import Grid from '@mui/material/Grid';

   <Grid container spacing={2}>
     <Grid item desktop={6} mobile={12} tablet={8}>
       <PatientInfo />
     </Grid>
     <Grid item desktop={6} mobile={12} tablet={4}>
       <VisitDetails />
     </Grid>
   </Grid>;
   ```

4. **Use MUI Stack** for simple flex layouts with consistent spacing:
   ```tsx
   <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
     <Button id="accept" label={t('Accept')} />
     <Button id="reject" label={t('Reject')} variant={ButtonTypes.Secondary} />
   </Stack>
   ```
5. **Avoid fixed widths** — Use `max-width`, `min-width`, `width: 100%`, or `calc()` for fluid layouts. Pixel widths are acceptable only for icons, avatars, and design system tokens.

#### Responsive Components

6. **Buttons must be full-width on mobile** — Follow the `Dialog` component pattern where buttons get `fullWidth={isMobile}`:
   ```tsx
   <Button fullWidth={isMobile} id="submit" label={t('Submit')} />
   ```
7. **Dialogs must adapt to viewport** — The `Dialog` component already uses `width: isMobile ? 'calc(100vw - 48px)' : 560` — follow this pattern for any custom dialogs or modals.
8. **Data grids must have mobile alternatives** — `MUI DataGrid` is not usable on mobile. Provide a card/list view for mobile breakpoints:
   ```tsx
   {
     isDesktop || isTablet ? (
       <DataGrid columns={columns} rows={rows} />
     ) : (
       <MobileCardList items={rows} />
     );
   }
   ```
9. **Sidebars become drawers on mobile** — Desktop sidebars should convert to full-screen drawers or bottom sheets on mobile. Use `MobileDrawer` patterns from the existing codebase.
10. **Tab navigation adapts** — Use scrollable tabs on mobile instead of wrapping. MUI Tabs supports `variant="scrollable"` and `scrollButtons="auto"`.

#### Touch and Interaction

11. **Minimum touch target size: 44x44px** — All tappable elements on mobile must meet this minimum (WCAG 2.5.8 Target Size). Buttons, links, icons, and form controls must have adequate hit areas. The project's `ButtonSize.Large` is appropriate for mobile touch targets.
12. **Avoid hover-dependent interactions on mobile** — Tooltips, hover previews, and hover menus have no equivalent on touch. Provide tap or long-press alternatives. The project uses `use-long-press` for long-press interactions.
13. **Handle virtual keyboard** — Forms on mobile must account for the virtual keyboard pushing content up. Ensure submit buttons remain visible when the keyboard is open.

#### Typography and Content

14. **Use relative font sizes** — The project's `TypographyTheme` defines the type scale. Never use hardcoded pixel values for font sizes in component styles. Let the theme handle sizing.
15. **Truncate long text responsibly** — Use `text-overflow: ellipsis` with a tooltip for the full text on desktop. On mobile, consider allowing text to wrap instead:
    ```tsx
    const Title = styled(Text.Body)`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: ${p => (p.$isMobile ? 'normal' : 'nowrap')};
    `;
    ```
16. **Ensure readability** — Line length should not exceed 75 characters for body text. On wide screens, constrain content width with `max-width`.

#### Images and Media

17. **Use responsive images** — Set `max-width: 100%` and `height: auto` on images. For the video visit interface, the video container must resize fluidly.
18. **Handle landscape and portrait** — The `isMobileLandscape` flag from `useLayout()` detects landscape orientation on mobile devices. The video visit UI should adapt its layout for landscape mode (side-by-side participant views).

#### Telehealth-Specific Responsive Considerations

19. **Video visit layout** — The video interface must support:
    - Full-screen video on mobile with overlay controls.
    - Side-by-side participant views on desktop.
    - Landscape mode optimization on mobile.
    - Minimal UI during active calls with expandable controls.
20. **Waiting room adaptability** — The waiting room (provider view) shows a data grid on desktop but must use a card-based list on mobile with clear patient status indicators.
21. **Form flows (intake, registration, insurance)** — Multi-step forms should use a single-column layout on mobile with step indicators that adapt from horizontal (desktop) to vertical or minimal (mobile).
22. **Navigation** — Desktop uses the sidebar navigation. Mobile uses a bottom bar or hamburger menu with the `MobileBar` and `MobileHeader` components from the project.

### 8.3 Responsive Patterns in This Project

#### Pattern 1: Conditional Rendering with `useLayout()`

The most common responsive pattern in this codebase. Components render different structures based on viewport:

```tsx
import useLayout from 'ev-hooks/layout';

const WaitingRoom = () => {
  const { isMobile, isTablet, isDesktop } = useLayout();

  return (
    <Wrapper>
      {isDesktop && <WaitingRoomSidebar />}
      {isMobile ? <MobileWaitingRoomList /> : <WaitingRoomDataGrid />}
    </Wrapper>
  );
};
```

#### Pattern 2: Responsive Styled Components with Transient Props

Pass layout flags as transient props (prefixed with `$`) to styled-components:

```tsx
const Container = styled.div<{ $isMobile: boolean }>`
  padding: ${p => (p.$isMobile ? '16px' : '24px')};
  flex-direction: ${p => (p.$isMobile ? 'column' : 'row')};
  gap: ${p => (p.$isMobile ? '12px' : '24px')};
`;

// Usage
const { isMobile } = useLayout();
<Container $isMobile={isMobile}>{children}</Container>;
```

#### Pattern 3: MUI `sx` Prop with Theme Breakpoints

Use for one-off responsive adjustments on MUI components:

```tsx
<Stack
  sx={{
    flexDirection: { mobile: 'column', tablet: 'row', desktop: 'row' },
    gap: { mobile: 1, tablet: 2, desktop: 3 },
    padding: { mobile: '16px', desktop: '24px' },
  }}
>
  {children}
</Stack>
```

#### Pattern 4: Full-Width Mobile Dialogs

Dialogs adapt their width and button layout based on viewport:

```tsx
<Dialog
  width={isMobile ? 'calc(100vw - 48px)' : 560}
  // Buttons become full-width and centered on mobile
  // Button variant changes to Secondary on mobile
/>
```

#### Pattern 5: Test Rendering at Different Layouts

The custom `render` utility from `ev-test/test-utils` supports a `layout` option for testing responsive behavior:

```tsx
test('renders mobile layout', () => {
  render(<MyComponent />, { layout: 'mobile' });
  expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
  expect(screen.queryByTestId('desktop-sidebar')).not.toBeInTheDocument();
});

test('renders desktop layout', () => {
  render(<MyComponent />, { layout: 'desktop' });
  expect(screen.getByTestId('desktop-sidebar')).toBeInTheDocument();
});
```

**Always write responsive tests** — at minimum, test the mobile and desktop layouts for any new page or component that has responsive behavior.

#### Pattern 6: React Native WebView Considerations

When the app runs inside React Native WebView (`isReactNative()` from `ev-config/config`), the `LayoutProvider` uses `document.body.clientWidth` instead of `window.innerWidth` due to iOS Chrome bugs. Additionally:

- The `isEmbedded` flag from `useLayout()` indicates the app is embedded in a native shell.
- URL search params `layout`, `hide`, and `embedded` allow the native shell to override layout behavior.
- Mobile-specific components (`MobileBar`, `MobileHeader`, `MobileDrawer`) integrate with the native navigation via `useMobile()` hook.
