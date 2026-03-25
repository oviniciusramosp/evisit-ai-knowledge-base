---
name: design-tokens
description: Automatically activated when writing styles, colors, typography, spacing, or elevation values. Ensures all visual values come from the design token system (EVColors, Typography, Elevations). Prevents hardcoded hex/rgb values.
user-invocable: true
---

# Design Token Enforcement

## When This Activates

This skill activates automatically when you detect:

- Writing styled-components CSS
- Setting `sx` prop on MUI components
- Using color, background, border, shadow, or font values
- Creating or modifying visual styles

## Mandatory Rules

### Colors

**ALWAYS** use semantic tokens from `EVColors`:

```tsx
import { EVColors } from 'ev-theme/styles';

// CORRECT:
color: ${EVColors.text.default};
background: ${EVColors.surface.background};
border-color: ${EVColors.border.default};

// ALSO ACCEPTABLE (named colors):
color: ${EVColors.cerulean};
color: ${EVColors.gunpowder};

// NEVER:
color: #374151;        // ❌ Raw hex
color: rgb(55,65,81);  // ❌ Raw rgb
color: blue;           // ❌ CSS named color
```

### Semantic Token Quick Guide

| Need                | Token                              |
| ------------------- | ---------------------------------- |
| Default text        | `EVColors.text.default`            |
| Secondary text      | `EVColors.text.subtle`             |
| Bold text           | `EVColors.text.strong`             |
| Placeholder         | `EVColors.text.placeholder`        |
| Disabled text       | `EVColors.text.disabled`           |
| Link text           | `EVColors.text.link`               |
| Error text          | `EVColors.text.danger`             |
| Success text        | `EVColors.text.success`            |
| Warning text        | `EVColors.text.warning`            |
| Default background  | `EVColors.surface.background`      |
| Subtle background   | `EVColors.surface.subtle`          |
| Hover background    | `EVColors.surface.backgroundHover` |
| Selected background | `EVColors.surface.selected`        |
| Error background    | `EVColors.surface.danger`          |
| Default border      | `EVColors.border.default`          |
| Input border        | `EVColors.border.inputField`       |
| Error border        | `EVColors.border.danger`           |
| Focus border        | `EVColors.border.focus`            |
| Default icon        | `EVColors.icon.default`            |
| Brand icon          | `EVColors.icon.brand`              |

For full reference, see `docs/ai/design-tokens.md`.

### Typography

**ALWAYS** use `ev-components/Text`:

```tsx
import Text from 'ev-components/Text';

// CORRECT:
<Text.Body>Regular text</Text.Body>
<Text.BodyBold>Bold text</Text.BodyBold>
<Text.Description>Small text</Text.Description>
<Text.Headline3>Section title</Text.Headline3>

// NEVER:
import Typography from '@mui/material/Typography';  // ❌ Banned by ESLint
```

Type scale: Headline1 (28px) → Headline5 (20px) → Title (18px) → Body (16px) → Description (14px) → Footnote (12px) → Caption (10px)

### Elevations

**ALWAYS** use the `Elevations` object:

```tsx
import { Elevations } from 'ev-theme/styles';

// CORRECT:
box-shadow: ${Elevations.elevation2};

// NEVER:
box-shadow: 0px 1px 3px rgba(0,0,0,0.1);  // ❌ Raw shadow
```

Guide: Cards = elevation1-2, Dropdowns = elevation3-4, Modals = elevation5-6

### Breakpoints

**ALWAYS** use `useLayout()` hook:

```tsx
import useLayout from 'ev-hooks/layout';
const { isMobile, isTablet, isDesktop } = useLayout();

// CORRECT:
padding: ${p => p.$isMobile ? '16px' : '24px'};

// NEVER:
@media (max-width: 744px) { ... }  // ❌ CSS media query
```

### Focus Ring

Standard focus style for all custom interactive elements:

```tsx
&:focus-visible {
  box-shadow: 0px 0px 0px 2px ${EVColors.cobalt},
              0px 0px 0px 4px ${EVColors.selectedHover};
  outline: none;
}
```

### Styled-Components Import

```tsx
// CORRECT:
import styled from 'styled-components/macro';

// NEVER:
import styled from 'styled-components';  // ❌ Missing /macro
```

### Transient Props

Use `$` prefix for style-only props to prevent DOM warnings:

```tsx
const Wrapper = styled.div<{ $isMobile: boolean }>`
  padding: ${p => (p.$isMobile ? '16px' : '24px')};
`;

<Wrapper $isMobile={isMobile} />;
```
