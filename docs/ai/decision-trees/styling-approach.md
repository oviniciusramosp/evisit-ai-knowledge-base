<!-- AI Reference: Styling Approach Decision Tree for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: ev-components/ and ev-theme/ -->

# Styling Approach

Primary: **styled-components v5** (via `/macro`). Secondary: **MUI `sx` prop**. Theme colors from **EVColors**.

---

## Decision Tree

```
What are you styling?

1. A new reusable component or custom element?
   --> styled-components/macro (primary approach)

2. A one-off adjustment to an MUI component?
   --> MUI sx prop

3. A responsive MUI layout using theme breakpoints?
   --> MUI sx prop with breakpoint object

4. Conditionally applying CSS classes from external CSS?
   --> classnames utility

5. Overriding MUI component styles globally?
   --> ev-theme/components/ (MUI theme overrides)
```

---

## 1. styled-components/macro (Primary)

**Always import from `styled-components/macro`** -- not bare `styled-components`. Enforced by ESLint.

```tsx
// CORRECT
import styled from 'styled-components/macro';

// WRONG -- ESLint error
import styled from 'styled-components';
```

### Basic usage

```tsx
import styled from 'styled-components/macro';

import { EVColors } from 'ev-theme/styles/Colors';

const Card = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: ${EVColors.white};
  border: 1px solid ${EVColors.borderDefault};
`;

const Title = styled.h2`
  color: ${EVColors.asphalt};
  font-size: 18px;
  font-weight: 600;
`;
```

### Transient props ($prefix)

Props prefixed with `$` are consumed by styled-components and NOT forwarded to the DOM. Use for any styling prop.

```tsx
const Container = styled.div<{ $isMobile: boolean; $variant: string }>`
  padding: ${p => (p.$isMobile ? '16px' : '24px')};
  flex-direction: ${p => (p.$isMobile ? 'column' : 'row')};
  background: ${p =>
    p.$variant === 'dark' ? EVColors.asphalt : EVColors.white};
`;

// Usage
const { isMobile } = useLayout();
<Container $isMobile={isMobile} $variant="dark">
  {children}
</Container>;
```

**Why `$` prefix?** Without it, the prop would be forwarded to the DOM element as an HTML attribute, causing React warnings. This is a styled-components v5 convention.

### Extending components

```tsx
const BaseButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const PrimaryButton = styled(BaseButton)`
  background: ${EVColors.cerulean};
  color: ${EVColors.white};
`;

const SecondaryButton = styled(BaseButton)`
  background: transparent;
  border: 1px solid ${EVColors.cerulean};
  color: ${EVColors.cerulean};
`;
```

### Styling MUI components

```tsx
import styled from 'styled-components/macro';

import Grid from '@mui/material/Grid';

const StyledGrid = styled(Grid)`
  padding: 16px;
  &.MuiGrid-item {
    max-width: 600px;
  }
`;
```

### Focus styles (accessibility)

Use the project's standard focus pattern:

```tsx
const InteractiveCard = styled.div`
  cursor: pointer;

  &:focus-visible {
    box-shadow:
      0px 0px 0px 2px ${EVColors.cobalt},
      0px 0px 0px 4px ${EVColors.selectedHover};
    outline: none;
  }
`;
```

---

## 2. MUI `sx` Prop (One-Off Adjustments)

Use for quick, single-use style overrides on MUI components. Do not use `sx` for complex or reusable styles.

```tsx
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

<Stack sx={{ gap: 2, padding: '16px' }}>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>{content}</Box>
</Stack>;
```

### Responsive with theme breakpoints

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

MUI breakpoints (from ev-theme): `mobile: 0`, `tablet: 744`, `desktop: 1024`.

### When to use `sx` vs styled-components

| Use `sx` when...                                  | Use styled-components when...                |
| ------------------------------------------------- | -------------------------------------------- |
| Adjusting 1-3 CSS properties on an MUI component  | Creating a new styled element                |
| Using MUI theme breakpoints for responsive values | Component needs multiple states/variants     |
| Quick margin/padding overrides                    | Styles are reused across multiple places     |
| Adding gap/spacing to MUI layout components       | Complex selectors (pseudo-elements, nesting) |

---

## 3. classnames (Conditional Classes)

For toggling CSS classes conditionally:

```tsx
import classnames from 'classnames';

<div className={classnames('card', {
  'card--active': isActive,
  'card--disabled': isDisabled,
})}>
```

Rare in this project -- prefer transient props with styled-components.

---

## 4. Theme Colors (EVColors)

**Never hardcode hex colors.** Always use `EVColors` from `ev-theme/styles/Colors`.

```tsx
import { EVColors } from 'ev-theme/styles/Colors';
```

### Common color tokens

| Token                    | Usage                                 |
| ------------------------ | ------------------------------------- |
| `EVColors.cerulean`      | Primary action color (buttons, links) |
| `EVColors.cobalt`        | Focus ring color                      |
| `EVColors.asphalt`       | Primary text color                    |
| `EVColors.white`         | White backgrounds                     |
| `EVColors.maraschino`    | Error/destructive                     |
| `EVColors.mediumGreen`   | Success                               |
| `EVColors.sunflower`     | Warning                               |
| `EVColors.borderDefault` | Default border                        |
| `EVColors.selectedHover` | Focus ring outer                      |
| `EVColors.black`         | Black text                            |
| `EVColors.surface.*`     | Surface/background tokens             |
| `EVColors.text.*`        | Text color tokens                     |
| `EVColors.border.*`      | Border color tokens                   |
| `EVColors.icon.*`        | Icon color tokens                     |

---

## 5. Typography (ev-components/Text)

**Never import `@mui/material/Typography` directly.** Use `ev-components/Text` instead.

```tsx
import Text from 'ev-components/Text';

<Text.Title>{t('Page Title')}</Text.Title>
<Text.Subtitle>{t('Section')}</Text.Subtitle>
<Text.Body>{t('Content text')}</Text.Body>
<Text.Caption>{t('Small text')}</Text.Caption>
```

---

## Quick Reference

| Approach          | Import                                              | When                           |
| ----------------- | --------------------------------------------------- | ------------------------------ |
| styled-components | `import styled from 'styled-components/macro'`      | Default for all custom styles  |
| MUI sx            | Inline `sx={{}}` prop                               | One-off MUI component tweaks   |
| EVColors          | `import { EVColors } from 'ev-theme/styles/Colors'` | All color values               |
| Text              | `import Text from 'ev-components/Text'`             | All typography                 |
| classnames        | `import classnames from 'classnames'`               | Conditional CSS classes (rare) |

---

## Anti-Patterns

| Anti-Pattern                                        | Correct Approach                               |
| --------------------------------------------------- | ---------------------------------------------- |
| `import styled from 'styled-components'`            | `import styled from 'styled-components/macro'` |
| `import Typography from '@mui/material/Typography'` | `import Text from 'ev-components/Text'`        |
| `color: '#2196f3'` (hardcoded hex)                  | `color: ${EVColors.cerulean}`                  |
| `<div style={{ color: 'red' }}>` (inline styles)    | Use styled-components or `sx`                  |
| Styled prop without `$` prefix                      | Always use `$` prefix for transient props      |
| Complex styles in `sx` prop                         | Extract to styled-component                    |
