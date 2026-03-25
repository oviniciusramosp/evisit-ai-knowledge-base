# eVisit UI Design Tokens

> **For AI Tools** — NEVER use raw hex/rgb values. ALWAYS use the semantic tokens below. Import from `ev-theme/styles`.
>
> Last updated: 2026-03-25

---

## Rules

1. **ALWAYS** use `EVColors.semantic.token` (e.g., `EVColors.surface.background`, `EVColors.text.default`)
2. **ACCEPTABLE** to use named EVColors (e.g., `EVColors.cerulean`, `EVColors.cobalt`) for legacy patterns
3. **NEVER** use raw hex/rgb values (e.g., `#2855F5`, `rgb(40,95,245)`)
4. **ALWAYS** use `ev-components/Text` for typography — NEVER `@mui/material/Typography`
5. **ALWAYS** use `Elevations` object for shadows — NEVER write raw `box-shadow`
6. **ALWAYS** use `useLayout()` hook for responsive breakpoints — NEVER CSS media queries

**Import**: `import { EVColors, Elevations } from 'ev-theme/styles'`

---

## Semantic Color Tokens

### Surface (Backgrounds & Fills)

| Token                       | Purpose                             | Value             |
| --------------------------- | ----------------------------------- | ----------------- |
| `surface.background`        | Default app background              | white             |
| `surface.backgroundHover`   | Hover state for surfaces            | neutral 50        |
| `surface.subtle`            | Subtle background (cards, sections) | neutral 25        |
| `surface.strong`            | Strong background emphasis          | neutral 50        |
| `surface.selected`          | Selected/active state               | brandBlue 25      |
| `surface.selectedHover`     | Selected hover                      | brandBlue 50      |
| `surface.disabled`          | Disabled surface                    | neutral 75        |
| `surface.input`             | Input field background              | white             |
| `surface.inputHover`        | Input hover                         | neutral 50        |
| `surface.inverse`           | Dark inverse surface                | neutral 800       |
| `surface.inverseHover`      | Dark inverse hover                  | neutral 600       |
| `surface.brand`             | Brand surface                       | brandBlue 25      |
| `surface.brandInverse`      | Brand inverse (primary buttons)     | brandBlue 400     |
| `surface.brandInverseHover` | Brand inverse hover                 | brandBlue 500     |
| `surface.brandContrast`     | Brand contrast                      | brandBlue 500     |
| `surface.danger`            | Error/danger surface                | red 25            |
| `surface.dangerHover`       | Danger hover                        | red 200           |
| `surface.dangerInverse`     | Danger inverse                      | red 400           |
| `surface.warning`           | Warning surface                     | yellow 50         |
| `surface.warningHover`      | Warning hover                       | yellow 200        |
| `surface.warningInverse`    | Warning inverse                     | yellow 300        |
| `surface.success`           | Success surface                     | green 25          |
| `surface.successHover`      | Success hover                       | green 200         |
| `surface.successInverse`    | Success inverse                     | green 700         |
| `surface.overlay`           | Semi-transparent overlay            | neutral 800 @ 20% |
| `surface.ptzControls`       | Video controls overlay              | neutral 800 @ 60% |
| `surface.opaqueBlack`       | Heavy overlay                       | neutral 800 @ 80% |

### Border

| Token               | Purpose                | Value         |
| ------------------- | ---------------------- | ------------- |
| `border.default`    | Standard border        | neutral 100   |
| `border.strong`     | Prominent border       | neutral 200   |
| `border.subtle`     | Subtle border          | neutral 75    |
| `border.disabled`   | Disabled border        | neutral 50    |
| `border.inputField` | Input border           | neutral 300   |
| `border.focus`      | Focus state (light)    | brandBlue 300 |
| `border.focusDark`  | Focus state (dark)     | brandBlue 500 |
| `border.focusLight` | Focus state (light bg) | brandBlue 50  |
| `border.selected`   | Selected border        | brandBlue 400 |
| `border.danger`     | Error border           | red 300       |

### Text

| Token                  | Purpose                  | Value         |
| ---------------------- | ------------------------ | ------------- |
| `text.default`         | Standard text            | neutral 600   |
| `text.defaultHover`    | Text hover               | neutral 800   |
| `text.subtle`          | Secondary text           | neutral 500   |
| `text.subtleHover`     | Subtle hover             | neutral 600   |
| `text.strong`          | Strong/bold text         | neutral 700   |
| `text.contrast`        | High contrast text       | neutral 800   |
| `text.selected`        | Selected text            | brandBlue 400 |
| `text.placeholder`     | Placeholder text         | neutral 400   |
| `text.disabled`        | Disabled text            | neutral 200   |
| `text.inverse`         | Text on dark backgrounds | neutral 25    |
| `text.brand`           | Brand-colored text       | brandBlue 400 |
| `text.brandHover`      | Brand text hover         | brandBlue 500 |
| `text.brandContrast`   | Brand contrast           | brandBlue 500 |
| `text.link`            | Link color               | brandBlue 400 |
| `text.linkHover`       | Link hover               | brandBlue 500 |
| `text.informational`   | Info text                | brandBlue 700 |
| `text.danger`          | Error text               | red 600       |
| `text.dangerContrast`  | Error contrast           | red 800       |
| `text.warning`         | Warning text             | yellow 600    |
| `text.warningContrast` | Warning contrast         | yellow 800    |
| `text.success`         | Success text             | green 600     |
| `text.successContrast` | Success contrast         | green 800     |

### Icon

| Token                | Purpose                  | Value         |
| -------------------- | ------------------------ | ------------- |
| `icon.default`       | Standard icon            | neutral 500   |
| `icon.contrast`      | High contrast icon       | neutral 600   |
| `icon.hovered`       | Hovered icon             | neutral 700   |
| `icon.subtle`        | Subtle icon              | neutral 400   |
| `icon.disabled`      | Disabled icon            | neutral 400   |
| `icon.inverse`       | Icon on dark backgrounds | white         |
| `icon.brand`         | Brand icon               | brandBlue 400 |
| `icon.brandHover`    | Brand icon hover         | brandBlue 500 |
| `icon.brandContrast` | Brand contrast icon      | brandBlue 500 |
| `icon.selected`      | Selected icon            | brandBlue 400 |
| `icon.danger`        | Error icon               | red 400       |
| `icon.dangerHover`   | Danger hover             | red 600       |
| `icon.warning`       | Warning icon             | yellow 500    |
| `icon.warningHover`  | Warning hover            | yellow 600    |
| `icon.success`       | Success icon             | green 500     |
| `icon.successHover`  | Success hover            | green 600     |

### Decorative

**Solid colors**: `decorative.blue`, `decorative.pink`, `decorative.teal`, `decorative.orange`

**Gradients**: `decorative.blueGradient`, `decorative.purpleGradient`, `decorative.pinkGradient`, `decorative.tealGradient`, `decorative.orangeGradient`, `decorative.yellowGradient`, `decorative.greenGradient`

### Avatar

12 colors for user avatars: `avatar.purple`, `avatar.purpleDark`, `avatar.purpleLight`, `avatar.pink`, `avatar.pinkDark`, `avatar.pinkLight`, `avatar.teal`, `avatar.tealDark`, `avatar.tealLight`, `avatar.orange`, `avatar.orangeDark`, `avatar.orangeLight`

---

## Named Colors (Legacy, Acceptable)

| Name                         | Hex                | Usage                          |
| ---------------------------- | ------------------ | ------------------------------ |
| `EVColors.cerulean`          | `rgb(40,95,245)`   | Primary brand, links, selected |
| `EVColors.cobalt`            | `rgb(22,57,206)`   | Primary dark, focus rings      |
| `EVColors.cornflower`        | `rgb(78,126,255)`  | Primary light                  |
| `EVColors.malibu`            | `rgb(127,166,255)` | Primary lighter                |
| `EVColors.zircon`            | `rgb(240,244,255)` | Brand background (lightest)    |
| `EVColors.vulcan`            | `rgb(17,24,39)`    | Darkest neutral (headings)     |
| `EVColors.asphalt`           | `rgb(31,41,55)`    | Dark neutral                   |
| `EVColors.gunpowder`         | `rgb(55,65,81)`    | Default text color             |
| `EVColors.mako`              | `rgb(79,96,119)`   | Subtle text                    |
| `EVColors.storm`             | `rgb(132,144,171)` | Placeholder, subtle icons      |
| `EVColors.stone`             | `rgb(153,163,180)` | Input borders                  |
| `EVColors.mercury`           | `rgb(182,190,202)` | Disabled text                  |
| `EVColors.aluminum`          | `rgb(209,213,219)` | Default borders                |
| `EVColors.silverBullet`      | `rgb(235,236,240)` | Subtle borders, disabled bg    |
| `EVColors.concrete`          | `rgb(243,244,246)` | Strong background              |
| `EVColors.alabaster`         | `rgb(249,250,251)` | Subtle background              |
| `EVColors.maraschino`        | `rgb(243,40,55)`   | Error/danger                   |
| `EVColors.darkRed`           | `rgb(225,0,17)`    | Danger inverse                 |
| `EVColors.mediumGreen`       | `rgb(6,167,100)`   | Success                        |
| `EVColors.appointmentYellow` | `rgb(245,188,40)`  | Warning                        |

---

## Typography Scale

| Level       | Size | Line Height | Weight  | Component                                   |
| ----------- | ---- | ----------- | ------- | ------------------------------------------- |
| Headline 1  | 28px | 48px        | 400/600 | `Text.Headline1`                            |
| Headline 2  | 26px | 40px        | 400/600 | `Text.Headline2`                            |
| Headline 3  | 24px | 36px        | 400/600 | `Text.Headline3`                            |
| Headline 4  | 22px | 32px        | 400/600 | `Text.Headline4`                            |
| Headline 5  | 20px | 28px        | 400/600 | `Text.Headline5`                            |
| Title       | 18px | 24px        | 400/600 | `Text.Title`                                |
| Body        | 16px | 20px        | 400/600 | `Text.Body` / `Text.BodyBold`               |
| Description | 14px | 18px        | 400/600 | `Text.Description` / `Text.DescriptionBold` |
| Footnote    | 12px | 16px        | 400/600 | `Text.Footnote` / `Text.FootnoteBold`       |
| Caption     | 10px | 16px        | 400/600 | `Text.Caption` / `Text.CaptionBold`         |

Font: **Inter** (sans-serif). Weights: Regular (400), SemiBold (600).

All levels have italic variants: `Text.BodyItalic`, `Text.DescriptionItalic`, etc.

---

## Elevation System

| Level                   | Use Case              | Description         |
| ----------------------- | --------------------- | ------------------- |
| `Elevations.elevation0` | Flat content          | No shadow           |
| `Elevations.elevation1` | Subtle cards          | Minimal shadow      |
| `Elevations.elevation2` | Cards, sticky headers | Light shadow        |
| `Elevations.elevation3` | Dropdowns, popovers   | Medium shadow       |
| `Elevations.elevation4` | Floating panels       | Prominent shadow    |
| `Elevations.elevation5` | Modals, dialogs       | Strong shadow       |
| `Elevations.elevation6` | Full-screen overlays  | Deep shadow         |
| `Elevations.elevation7` | Top-level overlays    | Maximum shadow      |
| `Elevations.elevation8` | Inset/pressed state   | Inset border effect |

**Usage**:

```tsx
import { Elevations } from 'ev-theme/styles';

const Card = styled.div`
  box-shadow: ${Elevations.elevation2};
`;
```

---

## Breakpoints

| Name             | Width    | Constant                      |
| ---------------- | -------- | ----------------------------- |
| Mobile Small     | 384px    | `BreakPoints.MobileSmall`     |
| Mobile           | 744px    | `BreakPoints.Mobile`          |
| Mobile Landscape | 932px    | `BreakPoints.MobileLandscape` |
| Tablet           | 1024px   | `BreakPoints.Tablet`          |
| Desktop          | > 1024px | (default)                     |

**MUI Grid breakpoints**: `mobile: 0`, `tablet: 744`, `desktop: 1024`

**Usage** — Always use the `useLayout()` hook:

```tsx
import useLayout from 'ev-hooks/layout';

const { isMobile, isTablet, isDesktop } = useLayout();
```

---

## Focus Ring Standard

All interactive elements must show this focus ring on `:focus-visible`:

```tsx
box-shadow: 0px 0px 0px 2px ${EVColors.cobalt}, 0px 0px 0px 4px ${EVColors.selectedHover};
outline: none;
```

---

## Common Patterns

**Styled component with tokens**:

```tsx
import styled from 'styled-components/macro';

import { Elevations, EVColors } from 'ev-theme/styles';

const Card = styled.div`
  background: ${EVColors.surface.background};
  border: 1px solid ${EVColors.border.default};
  box-shadow: ${Elevations.elevation2};
  border-radius: 8px;
  padding: 16px;
  color: ${EVColors.text.default};

  &:hover {
    border-color: ${EVColors.border.strong};
    background: ${EVColors.surface.backgroundHover};
  }

  &:focus-visible {
    box-shadow:
      0px 0px 0px 2px ${EVColors.cobalt},
      0px 0px 0px 4px ${EVColors.selectedHover};
    outline: none;
  }
`;
```

**Error state**:

```tsx
border-color: ${EVColors.border.danger};
color: ${EVColors.text.danger};
background: ${EVColors.surface.danger};
```

**Success state**:

```tsx
border-color: ${EVColors.mediumGreen};
color: ${EVColors.text.success};
background: ${EVColors.surface.success};
```
