---
name: refactor
description: Use when refactoring existing code. Ensures backward compatibility, test coverage preservation, extraction patterns, and proper documentation of changes.
user-invocable: true
---

# Refactoring Workflow

## Before Refactoring

1. **Ensure test coverage exists** — If the code lacks tests, write tests that capture current behavior FIRST
2. **Check scope** — Refactoring should be a separate commit from feature work
3. **Identify consumers** — Find all files that import from the module being refactored

## Extraction Patterns

### Hook → ev-hooks/

Extract reusable logic into a custom hook when:

- The same state + effect pattern appears in 2+ components
- A component has complex logic that obscures its rendering

```
src/ev-hooks/myHook.ts
```

### Utility → ev-utils/

Extract pure functions when:

- The same transformation/calculation appears in 2+ places
- A function has no React dependencies

```
src/ev-utils/my-utility.ts
```

### Shared Component → ev-common/

Extract feature-level components when:

- A component is used across 2+ sub-apps
- It contains business logic specific to the eVisit domain

```
src/ev-common/MyFeature/MyComponent/
```

### UI Primitive → ev-components/

Extract generic UI components when:

- The component is purely presentational
- It has no business logic
- It could be used in any React project

```
src/ev-components/MyComponent/
```

Requires: full story, tests, a11y test, catalog entry (use `/new-component` skill)

## Refactoring Rules

- [ ] **Tests pass before AND after** the refactoring
- [ ] **No behavior change** — External API (props, hooks, exports) stays the same
- [ ] **Preserve data-testid** attributes — QA automation depends on them
- [ ] **Update barrel exports** — `index.ts` in the directory
- [ ] **Update imports** in all consumers
- [ ] **Run `yarn precommit`** — type check + lint + i18n extraction
- [ ] **Keep PR small** — ~200 lines max, or split into multiple commits

## Commit Format

```
CU-<taskId>: Refactor: <what was restructured>

- Extract <component/hook/utility> from <original location>
- No functional changes
- Update affected tests
```

## When NOT to Refactor

- During a feature PR (do it in a separate PR)
- Without existing test coverage (write tests first)
- In shared modules without updating ALL consumers
- When the developer asked for a minimal change
