<!-- AI Reference: Storybook Guide for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: .storybook/ and ev-design-system/ -->

# Storybook Guide

Stack: Storybook 8, @storybook/react-webpack5, addon-designs (Figma), storybook-addon-pseudo-states, autodocs.

---

## Running Storybook

```bash
yarn storybook       # Start dev server
yarn build-storybook # Build static site (used by Chromatic)
```

---

## Story Location

Stories are ONLY loaded from one path (configured in `.storybook/main.js`):

```
src/ev-design-system/StorybookFolders/**/*.stories.@(js|jsx|ts|tsx)
```

Stories are NOT co-located with components. They live in the design system gallery folders.

### Directory Structure

```
src/ev-design-system/StorybookFolders/
  DesignSystem/          # Design system component gallery
    DesignSystem.Buttons.stories.tsx
    DesignSystem.Avatar.stories.tsx
    DesignSystem.Dialog.stories.tsx
    DesignSystem.Dropdown.stories.tsx
    DesignSystem.DataGrid.stories.tsx
    constants.ts         # FigmaURLs mapping
    ...
  Style/                 # Style tokens (colors, typography, icons)
  Development/           # Development guides
  Screens/               # Screen-level stories
```

---

## Dual-File Pattern

The project uses a **two-file story pattern**:

### File 1: Component story (co-located with component)

Located in the component folder (e.g., `src/ev-components/Button/Button.stories.tsx`). This file defines the actual story content with all variants and controls.

```tsx
// src/ev-components/Button/Button.stories.tsx
import { nt } from 'ev-i18n';

import Button, { ButtonSize, ButtonTypes } from './Button';

export const ButtonGallery = () => (
  <div>
    <Button id="primary" label={nt('Primary')} variant={ButtonTypes.Primary} />
    <Button
      id="secondary"
      label={nt('Secondary')}
      variant={ButtonTypes.Secondary}
    />
    <Button id="small" label={nt('Small')} size={ButtonSize.Small} />
    <Button disabled id="disabled" label={nt('Disabled')} />
  </div>
);
```

### File 2: Design system gallery story (in StorybookFolders)

Located in `ev-design-system/StorybookFolders/DesignSystem/`. This file re-exports the component story and adds Figma design URL metadata.

```tsx
// src/ev-design-system/StorybookFolders/DesignSystem/DesignSystem.Buttons.stories.tsx
import { FigmaURLs } from './constants';

export default {
  title: 'Design System/Button',
  parameters: {
    design: {
      type: 'figma',
      url: FigmaURLs.Buttons,
    },
  },
};

export { ButtonGallery as Button } from 'ev-components/Button/Button.stories';
```

**Why two files?**

- Component stories define the visual content alongside the component source
- Gallery stories control Storybook organization and link to Figma designs
- Only gallery stories are loaded by Storybook (per `main.js` config)

---

## Figma URL Integration

The `@storybook/addon-designs` plugin shows Figma designs alongside stories.

Figma URLs are centralized in `constants.ts`:

```tsx
// src/ev-design-system/StorybookFolders/DesignSystem/constants.ts
export const FigmaURLs = {
  Buttons: 'https://www.figma.com/file/...',
  Avatar: 'https://www.figma.com/file/...',
  Dialog: 'https://www.figma.com/file/...',
  // ...
};
```

Usage in story metadata:

```tsx
export default {
  title: 'Design System/ComponentName',
  parameters: {
    design: {
      type: 'figma',
      url: FigmaURLs.ComponentName,
    },
  },
};
```

---

## Storybook Provider Chain

From `.storybook/preview.js`, every story is wrapped with:

```
Suspense
  GlobalStyles
    ReduxProvider
      MemoryRouter
        LayoutProvider
          ThemeProvider (MUI)
            ToastProvider
              MobileProvider
                DialogProvider
                  [Story]
```

This means stories have access to:

- Redux store (empty, no API data)
- React Router (MemoryRouter, no real routes)
- Layout context (responsive hooks work)
- Theme (MUI theme applied)
- Toast/Dialog/Mobile contexts

Stories do NOT have:

- CommonDataProvider (no currentUser, currentPractice)
- AnalyticsProvider
- AlertProvider
- RealtimeProvider (Pusher)
- Real API data (use MSW service worker for Storybook API mocking)

---

## Using `nt()` in Stories

All user-visible strings in stories must use `nt()` to satisfy the `i18next/no-literal-string` ESLint rule:

```tsx
import { nt } from 'ev-i18n';

export const Default = () => <Button id="story-btn" label={nt('Click Me')} />;

export const WithError = () => (
  <Input
    error
    helperText={nt('This field is required')}
    id="name"
    label={nt('Name')}
  />
);
```

---

## MSW Service Worker for Storybook

Storybook uses MSW's browser service worker for API mocking (separate from the Node.js server used in tests):

```tsx
// src/ev-design-system/service-worker.ts
import { setupWorker } from 'msw';

// ...handlers
export const worker = setupWorker(...handlers);
```

Started in `preview.js`:

```tsx
import { worker } from 'ev-design-system/service-worker';

worker.start();
```

---

## Storybook Addons

| Addon                           | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| `@storybook/addon-essentials`   | Controls, actions, viewport, backgrounds, docs |
| `@storybook/addon-designs`      | Figma design embed                             |
| `storybook-addon-pseudo-states` | Hover, focus, active, disabled states          |
| `@storybook/addon-links`        | Cross-story linking                            |
| `@storybook/addon-mdx-gfm`      | MDX with GitHub Flavored Markdown              |

### Autodocs

```tsx
// .storybook/main.js
docs: {
  autodocs: true;
}
```

Storybook automatically generates docs pages for components with JSDoc/TSDoc comments.

---

## Story Sort Order

Stories are sorted alphabetically within these top-level categories:

1. `Styles` -- Colors, typography, icons, spacing
2. `Design System` -- Component gallery
3. `Development` -- Dev guides and patterns

---

## Adding a New Component Story

### Step 1: Create component story file

```tsx
// src/ev-components/MyWidget/MyWidget.stories.tsx
import { nt } from 'ev-i18n';

import MyWidget from './MyWidget';

export const MyWidgetGallery = () => (
  <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
    <MyWidget id="default" label={nt('Default Widget')} />
    <MyWidget disabled id="disabled" label={nt('Disabled Widget')} />
    <MyWidget id="error" label={nt('Error State')} error />
  </div>
);
```

### Step 2: Create gallery story in StorybookFolders

```tsx
// src/ev-design-system/StorybookFolders/DesignSystem/DesignSystem.MyWidget.stories.tsx
import { FigmaURLs } from './constants';

export default {
  title: 'Design System/MyWidget',
  parameters: {
    design: {
      type: 'figma',
      url: FigmaURLs.MyWidget, // Add URL to constants.ts
    },
  },
};

export { MyWidgetGallery as MyWidget } from 'ev-components/MyWidget/MyWidget.stories';
```

### Step 3: Add Figma URL to constants (if available)

```tsx
// constants.ts
export const FigmaURLs = {
  // ...existing
  MyWidget: 'https://www.figma.com/file/...',
};
```

---

## Chromatic Integration

Chromatic runs visual regression tests against Storybook builds:

- Build: `yarn build-storybook`
- Chromatic config: `chromatic: { delay: 500 }` in preview parameters
- Stories are the source of truth for visual regression
