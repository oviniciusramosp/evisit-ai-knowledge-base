---
name: fix-bug
description: Use when fixing a bug. Guides investigation, root cause analysis, regression test creation, and commit message formatting with ClickUp task ID.
user-invocable: true
---

# Bug Fix Workflow

## 1. Investigate

- Read the bug report / ClickUp task description
- Identify the affected component(s) and code path
- Search for related tests that might already cover this area
- Check recent git history for related changes: `git log --oneline -20 -- <file>`

## 2. Reproduce

- Write a failing test that demonstrates the bug BEFORE fixing it:

```tsx
test('should not crash when data is empty', () => {
  // This test should FAIL before the fix
  render(<AffectedComponent data={[]} />);
  expect(screen.getByTestId('empty-state')).toBeInTheDocument();
});
```

## 3. Root Cause Analysis

- Identify the exact line(s) causing the issue
- Understand WHY it fails, not just WHAT fails
- Check if the same pattern exists elsewhere (systemic vs isolated)

## 4. Fix

- Apply the minimal change needed to fix the bug
- Ensure the fix uses project conventions:
  - EVColors for colors
  - ev-components for UI
  - useLayout() for responsive
  - t() for strings
- Do NOT refactor surrounding code in the same commit

## 5. Verify

- Run the failing test — it should now pass
- Run the full test suite for the affected file: `yarn test <filename>`
- Check for accessibility: add `validateAccessibility()` if not present
- Test at mobile and desktop if the fix touches responsive code

## 6. Commit

```
CU-<taskId>: Fix <concise description>

- Root cause: <brief explanation>
- Solution: <what was changed>
- Add regression test
```

## Common Bug Patterns

### State not updating

- Check if using `useAppSelector` (not `useSelector`)
- Check RTK Query cache tags — missing `invalidatesTags`?
- Check if mutation result needs `refetch()`

### Component not rendering

- Check conditional rendering logic (`&&` vs ternary)
- Check `useLayout()` flags — is `isMobile` undefined on first render?
- Check lazy loading — is the component properly `React.lazy()`?

### API call failing

- Check MSW handler in tests — is the URL pattern matching?
- Check `Base.V3` vs `Base.V4` — correct API version?
- Check auth token — is `Secure-Authentication-Token` header present?

### i18n string not showing

- Is the key in the correct locale JSON file?
- Is `useTranslation()` imported from `ev-i18n` (not `react-i18next`)?
- Run `yarn extract:check` to verify key extraction
