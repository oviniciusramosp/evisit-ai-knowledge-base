---
name: new-feature-page
description: Use when building a new page or feature section within any sub-app (app-provider, app-patient, app-admin, etc.). Covers routing, layout, responsive design, i18n, state management, API integration, and testing.
user-invocable: true
---

# New Feature/Page Checklist

## 1. Route Setup

Add the route to the sub-app's router (typically in the sub-app's `index.tsx` or routing file):

```tsx
import { lazy } from 'react';

const NewFeature = lazy(() => import('./NewFeature'));

// In routes:
<Route element={<NewFeature />} path={paths.newFeature} />;
```

Add the path to the sub-app's `paths.ts`.

## 2. Page Component

```tsx
import { useTranslation } from 'ev-i18n';

import Text from 'ev-components/Text';
import useLayout from 'ev-hooks/layout';

const NewFeaturePage = () => {
  const { t } = useTranslation();
  const { isMobile, isDesktop } = useLayout();

  return (
    <Wrapper data-testid="new-feature-page">
      <Text.Headline3>{t('Feature Title')}</Text.Headline3>
      {/* Page content using ev-components */}
    </Wrapper>
  );
};
```

### Rules:

- [ ] Use `useLayout()` for responsive behavior
- [ ] Use `useTranslation()` from `ev-i18n` for all strings
- [ ] Use `useAppNavigate()` from `ev-hooks/navigate` for navigation
- [ ] Use ev-components for all UI elements
- [ ] Add `data-testid` to the page wrapper
- [ ] Use `EVColors` and `Elevations` for all styles

## 3. API Integration

If the page needs API data, add RTK Query endpoints in `ev-api/core/<domain>/`:

```
ev-api/core/<domain>/
├── index.ts           # Re-exports hooks and types
├── <endpoint>.ts      # Endpoint definitions (injectEndpoints)
├── params.ts          # Request parameter types
├── responses.ts       # Response types
└── transformers.ts    # Response transformers
```

Use `providesTags` and `invalidatesTags` for cache management.

## 4. State Management

Follow this priority:

1. **RTK Query** for server data (API calls)
2. **React Hook Form** for form state
3. **React Context** for shared UI state (already exists: alert, dialog, toast, layout, mobile)
4. **Redux slice** only for global UI state that persists across routes
5. **Local useState** for component-specific state

## 5. Responsive Design

- [ ] Desktop layout (> 1024px): Full layout with sidebars, grids
- [ ] Tablet layout (744-1024px): Simplified, wider columns
- [ ] Mobile layout (< 744px): Single column, full-width buttons, drawers instead of sidebars

```tsx
{
  isDesktop && <Sidebar />;
}
{
  isMobile ? <MobileCardList /> : <DataGrid />;
}
<Button fullWidth={isMobile} id="submit" label={t('Submit')} />;
```

## 6. Testing

```tsx
import { rest } from 'msw';

import { render, screen, validateAccessibility } from 'ev-test/test-utils';
import { server } from 'ev-test/test-utils';

describe('NewFeaturePage', () => {
  test('renders page', async () => {
    render(<NewFeaturePage />, { layout: 'desktop' });
    expect(await screen.findByTestId('new-feature-page')).toBeInTheDocument();
  });

  test('mobile layout', () => {
    render(<NewFeaturePage />, { layout: 'mobile' });
    // Assert mobile-specific rendering
  });

  test('accessibility', async () => {
    const { container } = render(<NewFeaturePage />);
    await validateAccessibility(container);
  });
});
```

- [ ] MSW handlers for any API calls
- [ ] Fishery factories for test data
- [ ] Test desktop and mobile layouts
- [ ] Test loading, error, and empty states
- [ ] validateAccessibility test
