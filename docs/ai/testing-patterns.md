<!-- AI Reference: Testing Patterns for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: src/ev-test/ and src/setupTests.ts -->

# Testing Patterns

Stack: Jest (via react-scripts), React Testing Library 12, MSW v1, fishery, jest-axe.

---

## Custom Render Function

**Always** use `render` from `ev-test/test-utils` (NOT from `@testing-library/react`). This is enforced by ESLint.

```tsx
import { render } from 'ev-test/test-utils';
```

### Render Options

```tsx
type RenderOptions = {
  route?: string; // URL route (default: '/')
  layout?: 'desktop' | 'tablet' | 'mobile'; // Viewport size (default: 'desktop')
  searchParams?: URLSearchParams; // URL search params
  commonData?: Partial<TestCommonDataContext>; // Mock user/practice/select
  environment?: Environments; // Environment override
  useRealProviders?: boolean; // Use real CommonDataProvider (rare)
  windowInnerWidth?: number; // Custom viewport width
  windowInnerHeight?: number; // Custom viewport height
};
```

### Layout Width Mapping

| Layout      | window.innerWidth |
| ----------- | ----------------- |
| `'desktop'` | 1280              |
| `'tablet'`  | 900               |
| `'mobile'`  | 500               |

### Examples

**Basic render:**

```tsx
test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

**With route and layout:**

```tsx
test('renders mobile layout', () => {
  render(<MyComponent />, {
    route: '/provider/patients',
    layout: 'mobile',
  });
  expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
});
```

**With custom commonData:**

```tsx
test('renders for specific user', () => {
  const user = userFactory.build({
    attributes: { role: 'provider', first_name: 'Jane' },
  });

  render(<MyComponent />, {
    commonData: {
      currentUser: user,
      primaryUser: user,
      currentPractice: practiceFactory.build(),
    },
  });
});
```

**With no current user (unauthenticated):**

```tsx
render(<MyComponent />, {
  commonData: { currentUser: false },
});
```

**With environment:**

```tsx
render(<MyComponent />, {
  environment: Environments.Production,
});
```

---

## Provider Chain in Tests

`customRender` wraps components with (in order):

1. `CoreProviders` (Environment, Redux, Router, ErrorBoundary, Layout, FiltersMenu, Theme, Toast, Mobile)
2. `commonDataContext.Provider` (mocked currentUser, primaryUser, currentPractice)
3. `AnalyticsProvider`
4. `AlertProvider`
5. `DialogProvider`

When `useRealProviders: true`, it uses the real `AppProviders` (including `CommonDataProvider` with actual API calls).

---

## MSW v1 Server

The global MSW server is set up in `setupTests.ts`:

```tsx
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.events.removeAllListeners();
  server.resetHandlers();
  store.dispatch(api.util.resetApiState()); // Reset RTK Query cache
});

afterAll(() => server.close());
```

**Important:** `onUnhandledRequest: 'error'` means every API call in tests MUST have a matching handler.

### Override handlers per test

```tsx
import { mockCurrentUser, server } from 'ev-test/test-utils';

test('handles error response', () => {
  server.use(mockCurrentUser(undefined, { success: false }));
  // ... test error handling
});
```

### MSW v1 handler format

```tsx
import { rest } from 'msw';

rest.get('*/api/v3/resource', (req, res, ctx) => {
  return res(ctx.status(200), ctx.json({ data: [...] }));
});

rest.post('*/api/v3/resource', (req, res, ctx) => {
  const body = req.body; // Access request body
  const { id } = req.params; // Access URL params
  return res(ctx.status(201), ctx.json({ data: { id: '1' } }));
});
```

---

## Fishery Factory Pattern

Factories live in `src/ev-test/test-mocks/api-response/`. They use the `fishery` library.

```tsx
import { Factory } from 'fishery';

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: String(sequence),
  type: 'user',
  attributes: userAttributesResponseFactory.build(),
  dependents: [],
}));

export const practiceFactory = Factory.define<Practice>(({ sequence }) => ({
  id: String(sequence),
  type: 'practice',
  attributes: { handle: `practice-${sequence}`, name: `Practice ${sequence}` },
}));
```

### Usage in tests

```tsx
import { practiceFactory, userFactory } from 'ev-test/test-mocks/api-response';

// Build with defaults
const user = userFactory.build();

// Build with overrides
const admin = userFactory.build({
  attributes: { role: 'admin', first_name: 'Admin' },
});

// Build multiple
const users = userFactory.buildList(5);
```

### Factory rewind

Factories are rewound between tests in `setupTests.ts` to reset sequence numbers:

```tsx
beforeEach(() => {
  userFactory.rewindSequence();
  practiceFactory.rewindSequence();
  // ... all factories
});
```

---

## waitForRequest Utility

Assert that specific API calls were made:

```tsx
import { waitForRequest } from 'ev-test/test-utils';

test('saves data on submit', async () => {
  const pendingRequest = waitForRequest('POST', '*/api/v3/visits');

  render(<CreateVisitForm />);
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  const request = await pendingRequest;
  expect(request.body).toMatchObject({ visit_type_id: '1' });
});
```

### With validation callback

```tsx
const pendingRequest = waitForRequest(
  'PUT',
  '*/api/v3/visits/:visitId',
  (params, body, searchParams) => {
    return params?.visitId === '42';
  },
);
```

### Assert request was NOT made

```tsx
const pendingRequest = waitForRequest('DELETE', '*/api/v3/resource');
await pendingRequest.wasNotCalled();
```

---

## validateAccessibility

Run jest-axe WCAG 2.1 AA checks. **Include in every new component test file.**

```tsx
import { render, validateAccessibility } from 'ev-test/test-utils';

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  await validateAccessibility(container);
});
```

---

## withCurrentTime

Mock the current time (Luxon-based):

```tsx
import { DateTime } from 'luxon';

import { withCurrentTime } from 'ev-test/test-utils';

test('shows correct relative time', async () => {
  await withCurrentTime(DateTime.fromISO('2026-03-15T10:00:00'), async () => {
    render(<TimeDisplay />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });
});
```

---

## fakeReactNativeBridge

Mock the React Native WebView bridge:

```tsx
import { fakeReactNativeBridge } from 'ev-test/test-utils';

test('communicates with native app', () => {
  fakeReactNativeBridge();
  render(<MyComponent />);
  expect(window.ReactNativeWebView.postMessage).toHaveBeenCalled();
});
```

---

## Additional Utilities

| Utility                           | Purpose                                                       |
| --------------------------------- | ------------------------------------------------------------- |
| `expectNever(callable, timeout?)` | Assert something never happens within timeout (default 250ms) |
| `waitForUIUpdates()`              | Wait for async non-API operations (e.g., `useStoredState`)    |
| `setBrowserLanguage(lang)`        | Set `navigator.language` for i18n tests                       |
| `MUIFilterApiRef`                 | Mock for MUI DataGrid API ref                                 |
| `queryByCustomAttribute(attr)`    | Query DOM by custom attribute                                 |

---

## Test Conventions

- Use `test()` NOT `it()` (enforced by ESLint `jest/consistent-test-it`)
- Use `screen.findBy*` for async elements, `screen.getBy*` for immediate elements
- Add `data-testid` to all interactive elements
- Jest timeout: 15 seconds (`jest.setTimeout(15000)`)
- Async util timeout: 5 seconds (`asyncUtilTimeout: 5000`)
- `console.log` throws in CI -- only `console.warn` and `console.error` allowed (also throw in CI)
- Coverage thresholds: 70% branches, 75% functions, 80% lines/statements
