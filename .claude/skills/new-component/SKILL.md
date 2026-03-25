---
name: new-component
description: Use when creating a new reusable component in ev-components/. Enforces the project's component structure, barrel exports, props patterns, data-testid, accessibility, Storybook story, responsive design, and test requirements.
user-invocable: true
---

# New Component Checklist

## Prerequisites

Before creating a new component, verify you've run `/component-lookup` to confirm no existing component serves this need.

## File Structure

Create the following files:

```
src/ev-components/ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx     # Or __tests__/ComponentName.test.tsx
├── ComponentName.stories.tsx  # Storybook story
└── index.ts                   # Barrel export
```

## 1. Component File (ComponentName.tsx)

```tsx
import { forwardRef } from 'react';
import styled from 'styled-components/macro';

import { EVColors } from 'ev-theme/styles';

export type ComponentNameProps = {
  /** Unique identifier, also used as data-testid */
  id: string;
  // Add props here
};

const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ id, ...props }, ref) => {
    return (
      <Wrapper data-testid={id} ref={ref}>
        {/* Component content */}
      </Wrapper>
    );
  },
);

ComponentName.displayName = 'ComponentName';
export default ComponentName;

// Styled components
const Wrapper = styled.div`
  /* Use EVColors tokens only - no raw hex/rgb */
  color: ${EVColors.text.default};
`;
```

### Rules:

- [ ] Arrow function component (no `function` keyword, no `React.FC`)
- [ ] Export props type separately
- [ ] Use `forwardRef` if wrapping a native element
- [ ] Set `displayName` when using `forwardRef`
- [ ] `id` prop is required → maps to `data-testid`
- [ ] All colors from `EVColors` (no raw hex/rgb)
- [ ] Import `styled-components/macro` (not bare)
- [ ] Transient props with `$` prefix (`$isMobile`, `$variant`)

## 2. Accessibility

- [ ] Accessible name: implement `AccessibleLabelProps` pattern (label OR ariaLabel OR labelledBy)
- [ ] `aria-required` on required form elements
- [ ] `aria-describedby` for helper text/errors
- [ ] `aria-expanded` on toggleable elements
- [ ] `aria-live` for dynamic content
- [ ] Focus ring: use standard `EVColors.cobalt` / `EVColors.selectedHover` pattern
- [ ] Keyboard navigation: all interactive elements reachable via Tab
- [ ] No information conveyed by color alone

## 3. Responsive Design

- [ ] Use `useLayout()` from `ev-hooks/layout` (not CSS media queries)
- [ ] Pass responsive flags as transient props (`$isMobile`)
- [ ] Test at mobile (500px) and desktop (1280px) layouts
- [ ] Buttons: `fullWidth={isMobile}` on mobile
- [ ] Touch targets: 44x44px minimum on mobile

## 4. i18n

- [ ] All user-visible strings wrapped in `t()` from `useTranslation()`
- [ ] Use `nt()` for test/story string values

## 5. Barrel Export (index.ts)

```tsx
export * from './ComponentName';
export { default } from './ComponentName';
```

## 6. Tests (ComponentName.test.tsx)

```tsx
import ComponentName from 'ev-components/ComponentName';
import { render, screen, validateAccessibility } from 'ev-test/test-utils';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName id="test" />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<ComponentName id="test" />);
    await validateAccessibility(container);
  });

  test('renders mobile layout', () => {
    render(<ComponentName id="test" />, { layout: 'mobile' });
    // Assert mobile-specific behavior
  });

  test('renders desktop layout', () => {
    render(<ComponentName id="test" />, { layout: 'desktop' });
    // Assert desktop-specific behavior
  });
});
```

### Test rules:

- [ ] Use `test()` not `it()`
- [ ] Use `render` from `ev-test/test-utils`
- [ ] Include `validateAccessibility()` test
- [ ] Test mobile and desktop layouts
- [ ] Test all variants/states

## 7. Storybook Story

Create both the component story AND a design system gallery entry:

**Component story** (`ComponentName.stories.tsx`):

```tsx
import { Meta, StoryObj } from '@storybook/react';

import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
};
export default meta;

type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: { id: 'story-default' },
};
```

**Design system gallery** (`src/ev-design-system/StorybookFolders/DesignSystem/DesignSystem.ComponentName.stories.tsx`):

```tsx
export { Default } from 'ev-components/ComponentName/ComponentName.stories';

export default {
  title: 'Design System/ComponentName',
  parameters: {
    design: {
      type: 'figma',
      url: 'FIGMA_URL_HERE',
    },
  },
};
```

## 8. Update Documentation

- [ ] Add entry to `docs/ai/component-catalog.md`
- [ ] If new enum types created, document in the catalog entry
