<!-- AI Reference: Versioning, Commits & Refactoring Guidelines for eVisit UI -->
<!-- Source of truth. Referenced by CLAUDE.md -->

## 9. Versioning Guidelines

### 9.1 When Claude Should Proactively Suggest Versioning

This project uses a **calendar-based release versioning** scheme (e.g., `release-2026.1.5`, `release-2025.5.6.1`). The `package.json` version field is fixed at `0.1.0` and is not used for release tracking. Versioning is managed through **release branches** and **Git tags**, not through package version bumps.

Claude should proactively raise the topic of versioning when:

- **A new feature is merged to `staging`** that is intended for a specific release cycle. Ask the developer which release branch the work targets.
- **A breaking change is introduced** (API contract changes, removed components, changed props, removed Redux slices, renamed exports). Flag that this may require a dedicated release or a patch release.
- **A hotfix or patch is needed** for a production issue. Suggest creating a branch from the appropriate release branch (e.g., `release-2026.1.5` becomes `release-2026.1.5.1` for a patch).
- **A significant dependency upgrade** is performed (React, MUI, RTK, Twilio, i18next major versions). These should be coordinated with a release cycle.
- **Multiple features have accumulated on `staging`** without a release cut. Remind the developer to coordinate with the team on the next release.

### 9.2 Versioning Strategy

**Release branch naming format:** `release-YYYY.Q.N[.P]`

| Segment         | Meaning                                    | Example       |
| --------------- | ------------------------------------------ | ------------- |
| `YYYY`          | Calendar year                              | `2026`        |
| `Q`             | Release cycle number within the year       | `1`, `2`, `5` |
| `N`             | Sequential release number within the cycle | `1`, `2`, `3` |
| `.P` (optional) | Patch number for hotfixes on a release     | `.1`, `.2`    |

**Examples from the repository:**

- `release-2026.1.5` — Year 2026, cycle 1, release 5
- `release-2025.5.6.1` — Year 2025, cycle 5, release 6, patch 1

**Branch flow:**

1. Feature branches (`CU-#_description`) are created from `staging`.
2. PRs are merged into `staging` (the main development branch).
3. Release branches are cut from `staging` when a release is prepared.
4. Hotfixes branch from the release branch and merge back into both the release branch and `staging`.

**Dependency version updates** are handled by Dependabot, which targets `staging` with daily checks and uses the `Yarn` commit prefix (e.g., `Yarn(deps): Bump twilio-video from 2.33.0 to 2.34.0`).

### 9.3 Version Bump Checklist

Since this project does not use semantic versioning in `package.json`, there is no version bump step. Instead, when a release is being prepared, Claude should verify:

- [ ] All intended feature branches have been merged to `staging`.
- [ ] CI passes on `staging` (type checks, linting, prettier, Storybook build).
- [ ] Tests pass on `staging` (test suite via `tests-pull-request.yml`).
- [ ] Translation updates are current (Lokalise PRs merged).
- [ ] No unresolved Dependabot security PRs for production dependencies.
- [ ] The release branch name follows the `release-YYYY.Q.N` convention.
- [ ] If this is a patch release, the branch name appends `.P` to the base release (e.g., `release-2026.1.5.1`).

---

## 10. Commit Guidelines

### 10.1 Commit Message Convention

This project uses a **ClickUp task ID prefix** convention, not strict Conventional Commits. Based on the repository history, commit messages follow these patterns:

**Pattern 1 — Feature/fix work (most common):**

```
CU-<taskId>: <Short description of the change>
```

Examples from the repo:

- `CU-86b738cnw: Refactor: unify empty state overlays`
- `CU-86b7takgr: Add ScheduleNode`
- `CU-86b82ejbb: fixes showing correct default pfv when switching practices`
- `CU-86b7xvxx5: fixes chat disabled button logic`

**Pattern 2 — ClickUp ID with dash separator (also common):**

```
CU-<taskId> - <Short description of the change>
```

Examples from the repo:

- `CU-86b82bc4d - Service Line - Form statuses fail to update in default queue`
- `CU-86b81ueqw - Remove feature_flag_reset_video_connection`
- `CU-86b7c07d2 - [FE] Disable Groups and Providers when Unavailable`

**Pattern 3 — Dependency bumps (Dependabot automated):**

```
Yarn(deps): Bump <package> from <old> to <new>
Yarn(deps-dev): Bump <package> from <old> to <new>
```

**Pattern 4 — Translation updates (Lokalise automated):**

```
Lokalise: updates
Translations update
```

**Pattern 5 — Standalone improvements (no ClickUp task):**

```
<Action verb> <description> (CU-<taskId>) (#<PR number>)
```

Examples from the repo:

- `Improve VisitCanceled tests (CU-86b83949q) (#8965)`
- `Remove unused video redux selectors (CU-86b83583w) (#8960)`
- `Minor video code simplification (CU-86b7zvuwn) (#8916)`

### 10.2 When Claude Should Proactively Suggest Commits

Claude should suggest creating a commit when:

- **A logical unit of work is complete** — A component is finished, a bug fix is applied, a test suite is written. Do not wait until multiple unrelated changes accumulate.
- **Before switching contexts** — If the developer is about to work on a different task, feature, or file area, suggest committing the current work first.
- **After completing tests** — Tests for a feature should be committed together with (or immediately after) the feature code, not left unstaged.
- **After a refactor is stable** — Refactoring changes should be committed separately from feature changes so they can be reviewed independently.
- **After resolving a merge conflict** — Commit immediately after conflict resolution to avoid losing the resolution.
- **When the working tree has many changed files** — If more than 5-8 files have been modified, suggest committing to keep change sets reviewable and the PR checklist item of ~200 lines satisfied.

Claude should **not** suggest committing when:

- The code does not compile (`yarn check-types` would fail).
- Linting errors are present (`yarn lint` would fail).
- The change is incomplete and would leave the app in a broken state.
- Only auto-generated files have changed (e.g., `yarn.lock` alone without `package.json` changes).

### 10.3 Commit Title and Description Templates

**Feature (new functionality):**

```
CU-<taskId>: Add <feature name>

- Implement <component/hook/endpoint>
- Add unit tests for <feature>
- Update translations for new user-facing strings
```

**Bug fix:**

```
CU-<taskId>: Fix <concise description of the bug>

- Root cause: <brief explanation>
- Solution: <what was changed>
- Add regression test
```

**Refactor:**

```
CU-<taskId>: Refactor: <what was restructured>

- Extract <component/hook/utility> from <original location>
- No functional changes
- Update affected tests
```

**Test improvement:**

```
Improve <ComponentName> tests (CU-<taskId>)

- Add tests for <specific scenarios>
- Increase coverage for <area>
```

**Chore / cleanup:**

```
CU-<taskId>: Remove <unused code/feature flag/deprecated pattern>

- Clean up <what was removed>
- No user-facing changes
```

**Documentation (rare, only when explicitly requested):**

```
CU-<taskId>: Document <what was documented>
```

### 10.4 Branch Naming Convention

**Primary format:** `CU-<taskId>_<description-with-dashes>`

| Component   | Rule                                               | Example                      |
| ----------- | -------------------------------------------------- | ---------------------------- |
| Prefix      | Always `CU-` followed by the ClickUp task ID       | `CU-86b738cnw`               |
| Separator   | Underscore `_` between the task ID and description | `_`                          |
| Description | Kebab-case summary of the work                     | `unify-empty-state-overlays` |

**Examples from the repository:**

- `CU-86b813qag_practice-and-group-availabilities-distinguish-bulk`
- `CU-86b7vmbwe_Audio-to-Video-Permission-Denied-notification-is-not-presenting`
- `CU-86b738cnw_Refactor-unify-empty-state-overlays`
- `CU-86b82ejbb_Custom-Views-Issues-when-switching-between-practices`

**Special branch types:**

- **Dependabot:** `dependabot/npm_and_yarn/staging/<package-name>-<version>`
- **Lokalise (translations):** `lokalise-YYYY-MM-DD_HH-MM-SS`
- **Release:** `release-YYYY.Q.N[.P]`
- **Hotfix:** `CU-<taskId>_hotfix` or `hotfix-<description>`
- **Patch:** `CU-<taskId>_patch` or `<description>-patch`
- **Candidate release:** `CU-<taskId>-candidate-release-YYYY.Q.N`

**What Claude should do:**

- When creating a branch, always ask for the ClickUp task ID if not provided.
- Format the branch name as `CU-<taskId>_<short-kebab-description>`.
- Keep the description concise (under 60 characters).
- Never include spaces or special characters other than dashes and underscores.

---

## 11. Refactoring & Improvement Guidelines

### 11.1 When Claude Should Proactively Identify Improvements

Claude should flag potential improvements in these situations:

- **While implementing a feature** — If the surrounding code has issues that make the feature harder to implement or maintain, note them.
- **While reading existing code** for context — If patterns violate the project's established conventions (Section 4), flag them.
- **While writing tests** — If the code under test is hard to test due to tight coupling, excessive side effects, or poor separation of concerns, suggest refactoring.
- **During code review** — When reviewing a PR or diff, identify improvements beyond the immediate scope that could be follow-up tasks.
- **When a file exceeds ~300 lines** — Large files are a signal that the component or module may benefit from decomposition.
- **When a function exceeds cyclomatic complexity 15** — The ESLint rule already enforces this, but Claude should proactively simplify before the linter flags it.

Claude should **not** proactively refactor when:

- The change is outside the scope of the current task.
- The refactoring would cause a large diff that obscures the actual feature/fix work.
- The code is in a shared module (`ev-components`, `ev-hooks`, `ev-utils`) and the refactoring would require updating many consumers without tests to verify correctness.
- The developer has explicitly asked for a minimal change.

### 11.2 Areas to Watch For

#### Code Smells

- **Duplicated logic** — Same API transformation, validation rule, or UI pattern implemented in multiple places. Suggest extracting to `ev-utils`, `ev-hooks`, or `ev-common`.
- **Overly complex components** — Components that handle rendering, state management, API calls, and business logic all in one file. Suggest splitting into a container/presentation pattern or extracting custom hooks.
- **Prop drilling beyond 2 levels** — If a prop is passed through 3+ components unchanged, suggest using React Context or Redux.
- **Unused exports, variables, or imports** — Dead code increases maintenance burden. Flag for removal.
- **Any usage of `any` type** — TypeScript `any` defeats the purpose of the type system. Suggest `unknown` with type guards or proper typing.
- **Magic numbers and strings** — Suggest extracting to named constants or enums.
- **Inconsistent error handling** — Some API calls may silently fail. Ensure RTK Query errors are handled in the UI.

#### Performance Issues

- **Missing `useMemo` / `useCallback`** for expensive computations or functions passed as props to memoized children.
- **Unnecessary re-renders** — Components that re-render on every parent render when their props have not changed. Suggest `React.memo` where appropriate.
- **Large component trees rendered unconditionally** — Suggest lazy loading (`React.lazy`) for sub-apps and heavy components (already used in `Main.tsx`; ensure new heavy components follow the same pattern).
- **Unbounded lists** — Rendering hundreds of items without virtualization. The project uses `@mui/x-data-grid-pro` for grids; ensure custom lists also use virtualization when item counts can exceed ~50.
- **Redundant API calls** — RTK Query cache tags should prevent duplicate fetches. If a component triggers a fetch that another component already caches, suggest using the same cache tag.

#### Security Concerns

- **User input rendered as HTML** — Any use of `dangerouslySetInnerHTML` or TipTap/TinyMCE output must be sanitized (DOMPurify or equivalent).
- **Sensitive data in Redux store** — Ensure PII (patient health records, SSN, insurance details) is not persisted beyond the session. Check for accidental logging.
- **Authentication token handling** — The auth token is in the Redux store and sent via `Secure-Authentication-Token` header. Ensure no code logs or exposes this token.
- **URL parameters** — Never put sensitive data in URL query parameters (they appear in browser history and server logs). Use POST body or Redux state.

#### Accessibility Gaps

- **Missing `aria-label`** on icon-only buttons.
- **Missing `aria-live` regions** for dynamic content (waiting room updates, form submission results, toast notifications).
- **Missing keyboard handlers** on custom interactive elements.
- **Color-only status indicators** without text or icon alternatives.
- Refer to Section 7 for the complete accessibility checklist.

#### Test Coverage

- **Untested edge cases** — Error states, empty states, loading states, boundary values.
- **Missing accessibility tests** — Every new component should include `validateAccessibility()`.
- **Missing responsive tests** — Components with `useLayout()` should be tested at both `mobile` and `desktop` layouts.
- **Missing MSW handlers** — New API endpoints need corresponding handlers in `ev-test/request-handlers/`.

#### Dead Code and Outdated Patterns

- **Removed feature flags** — If a feature flag is fully rolled out, the flag check and the legacy code path should be removed (e.g., `CU-86b81ueqw - Remove feature_flag_reset_video_connection`).
- **Unused Redux selectors or slices** — If a slice or selector is no longer referenced, remove it (e.g., `Remove unused video redux selectors`).
- **Deprecated component usage** — If `ev-components` has a newer version of a component, flag the old usage for migration.
- **Direct imports from restricted modules** — Any import violating the restricted imports table in Section 4 must be corrected.

### 11.3 How Claude Should Suggest Improvements

When identifying an improvement, Claude should use this structured format:

```
**Improvement: <Short title>**
- Severity: Low | Medium | High | Critical
- Effort: Small (< 1 hour) | Medium (1-4 hours) | Large (4+ hours)
- Impact: <What improves — performance, maintainability, accessibility, security, test coverage>
- Description: <What the issue is and what the suggested change looks like>
- Location: <File path(s) and line numbers>
```

**Severity definitions:**

- **Critical** — Security vulnerability, data loss risk, or accessibility blocker. Must be fixed before merging.
- **High** — Bug, significant performance issue, or pattern that will cause problems at scale. Should be fixed in the current PR or as an immediate follow-up.
- **Medium** — Code smell, minor performance concern, or convention violation. Should be tracked as a follow-up task.
- **Low** — Stylistic improvement, minor cleanup, or optional enhancement. Nice to have but not urgent.

**Example:**

```
**Improvement: Extract duplicated visit status formatting logic**
- Severity: Medium
- Effort: Small (< 1 hour)
- Impact: Maintainability — reduces duplicated logic across 3 files
- Description: The visit status badge formatting logic is duplicated in
  `WaitingRoom/VisitCard.tsx`, `VisitHistory/VisitRow.tsx`, and
  `Sidebar/VisitHeader.tsx`. Extract to a shared utility in
  `ev-utils/visit-status.ts` or a `useVisitStatusDisplay` hook in `ev-hooks`.
- Location: src/app-provider/WaitingRoom/VisitCard.tsx:45-62,
  src/app-provider/VisitHistory/VisitRow.tsx:30-47,
  src/ev-common/Sidebar/VisitHeader.tsx:55-72
```

### 11.4 Refactoring Principles

1. **Tests first** — Before refactoring, ensure the code being changed has adequate test coverage. If it does not, write tests that capture the current behavior before making changes. The project's coverage thresholds (70% branches, 75% functions, 80% lines) are minimums, not goals.

2. **Small, incremental steps** — Each refactoring commit should be a single, reviewable change. Do not combine refactoring with feature work in the same commit. The PR template expects ~200 lines of change; large refactors should be broken into multiple PRs.

3. **Backwards compatible** — Refactoring should not change the external behavior of a module. If a component's props change, the old props should be supported during a transition period, or all consumers must be updated in the same PR.

4. **Follow the existing extraction patterns** — The project has clear conventions for where shared code lives:
   - Reusable UI components go in `ev-components/`.
   - Feature-level shared components go in `ev-common/`.
   - Custom hooks go in `ev-hooks/`.
   - Utility functions go in `ev-utils/`.
   - Types go in `ev-types/`.
   - API endpoints go in `ev-api/core/<domain>/`.

5. **Preserve `data-testid` attributes** — When renaming or restructuring components, ensure all existing `data-testid` values are preserved. QA automation depends on these identifiers.

6. **Update barrel exports** — When moving or renaming a file, update the `index.ts` barrel export in the directory. Ensure no consumer import path breaks.

7. **Run the full pre-commit check** — After any refactoring, run `yarn precommit` (which runs `check-types`, `lint-staged`, and `extract:check`) to verify nothing is broken. The CI pipeline (`ci-pull-request.yml`) will also run type checks, linting, prettier, and Storybook build.

8. **Verify translation extraction** — If refactoring moves or renames files containing translated strings, run `yarn extract:check` to ensure the i18n extraction still finds all keys.

9. **Document the rationale** — In the commit message and PR description, explain **why** the refactoring was done, not just what changed. Link to the ClickUp task if one exists.
