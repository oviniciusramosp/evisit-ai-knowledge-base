---
name: storybook-story
description: Use when creating or updating a Storybook story for a component. Covers the dual-story pattern (component-local + design-system gallery), Figma URL integration via addon-designs, and autodocs.
user-invocable: true
---

# Storybook Story Guide

## Dual-File Pattern

This project uses TWO story files per component:

### 1. Component-Local Story

Located next to the component: `ev-components/ComponentName/ComponentName.stories.tsx`

```tsx
import { Meta, StoryObj } from '@storybook/react';

import { nt } from 'ev-i18n';

import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  argTypes: {
    variant: {
      control: 'select',
      options: Object.values(VariantEnum),
    },
  },
};
export default meta;

type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    id: 'story-default',
    label: nt('Label'),
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

// Show all variants in a gallery
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <ComponentName
        id="variant-1"
        variant={VariantEnum.A}
        label={nt('Variant A')}
      />
      <ComponentName
        id="variant-2"
        variant={VariantEnum.B}
        label={nt('Variant B')}
      />
    </div>
  ),
};
```

### 2. Design System Gallery Entry

Located in: `src/ev-design-system/StorybookFolders/DesignSystem/DesignSystem.ComponentName.stories.tsx`

```tsx
export {
  Default,
  Gallery,
} from 'ev-components/ComponentName/ComponentName.stories';

export default {
  title: 'Design System/ComponentName',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/...', // Get from design team
    },
  },
};
```

## Key Rules

1. **Use `nt()` for all string values** in stories — satisfies the i18n ESLint rule
2. **Include a Gallery story** showing all variants side-by-side
3. **Add Figma URL** via the `design` parameter in the gallery entry
4. **Show all states**: default, hover (via pseudo-states addon), disabled, error, loading
5. **Test responsive**: Add stories showing mobile vs desktop rendering if applicable

## Storybook Providers

The preview.js already wraps stories with: ReduxProvider, MemoryRouter, LayoutProvider, ThemeProvider, ToastProvider, MobileProvider, DialogProvider. No need to add these in individual stories.

## Story Pattern: `src/ev-design-system/StorybookFolders/`

```
StorybookFolders/
├── DesignSystem/           # Re-exports from component stories + Figma URLs
│   ├── DesignSystem.Button.stories.tsx
│   ├── DesignSystem.Dialog.stories.tsx
│   ├── DesignSystem.Input.stories.tsx
│   └── ...
├── ProductColors/          # Color palette documentation
├── Elevations.stories.tsx  # Elevation system
├── Logos.stories.tsx        # Logo assets
└── utils.tsx               # Storybook utility helpers
```

## Running Storybook

```bash
yarn storybook  # Runs on port 6006
```

Or via Claude Preview: use the `storybook` launch configuration.
