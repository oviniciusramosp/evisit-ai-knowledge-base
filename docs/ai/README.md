# AI Knowledge Base — eVisit UI

> This directory contains AI-tool-agnostic documentation for the eVisit UI codebase. These files are consumed by Claude Code, Cursor, GitHub Copilot, Codex, and other AI development tools.
>
> **Source of truth chain**: `CLAUDE.md` → `docs/ai/` → `.cursorrules` / `.github/copilot-instructions.md`

---

## Quick Router: "I'm trying to..."

| Task                                   | Read This                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Build a UI element                     | [component-catalog.md](./component-catalog.md) + [component-selection.md](./decision-trees/component-selection.md) |
| Apply colors, fonts, shadows           | [design-tokens.md](./design-tokens.md)                                                                             |
| Choose between existing components     | [component-selection.md](./decision-trees/component-selection.md)                                                  |
| Write styles (styled-components vs sx) | [styling-approach.md](./decision-trees/styling-approach.md)                                                        |
| Decide where state should live         | [state-location.md](./decision-trees/state-location.md)                                                            |
| Use a custom hook                      | [hook-catalog.md](./hook-catalog.md)                                                                               |
| Add an API endpoint                    | [api-patterns.md](./api-patterns.md)                                                                               |
| Build a form                           | [form-patterns.md](./form-patterns.md)                                                                             |
| Write tests                            | [testing-patterns.md](./testing-patterns.md)                                                                       |
| Add translations                       | [i18n-guide.md](./i18n-guide.md)                                                                                   |
| Understand state management            | [state-management.md](./state-management.md)                                                                       |
| Write a Storybook story                | [storybook-guide.md](./storybook-guide.md)                                                                         |
| Understand routing/sub-apps            | [routing-architecture.md](./routing-architecture.md)                                                               |

---

## File Index

### Core References (Phase 1 — Available Now)

| File                                                                             | Description                                                                     |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [component-catalog.md](./component-catalog.md)                                   | Complete catalog of all ~47 ev-components with props, enums, usage, when-to-use |
| [design-tokens.md](./design-tokens.md)                                           | EVColors, Typography, Elevations, Breakpoints — all token values                |
| [decision-trees/component-selection.md](./decision-trees/component-selection.md) | "I need X" → "Use existing Y" flowchart                                         |

### Complete References

| File                                                                       | Description                                       | Status    |
| -------------------------------------------------------------------------- | ------------------------------------------------- | --------- |
| [hook-catalog.md](./hook-catalog.md)                                       | All 82 custom hooks with signatures and usage     | Available |
| [api-patterns.md](./api-patterns.md)                                       | RTK Query patterns, endpoint structure, Tags      | Available |
| [form-patterns.md](./form-patterns.md)                                     | React Hook Form + Yup + Input API                 | Available |
| [testing-patterns.md](./testing-patterns.md)                               | MSW v1, fishery, render utils, a11y tests         | Available |
| [i18n-guide.md](./i18n-guide.md)                                           | Translation workflow, nt(), Lokalise              | Available |
| [state-management.md](./state-management.md)                               | Redux slices, RTK Query cache, Context providers  | Available |
| [storybook-guide.md](./storybook-guide.md)                                 | Story organization, dual-file pattern, Figma URLs | Available |
| [routing-architecture.md](./routing-architecture.md)                       | Sub-app structure, lazy loading, paths            | Available |
| [decision-trees/styling-approach.md](./decision-trees/styling-approach.md) | styled-components vs sx vs className              | Available |
| [decision-trees/state-location.md](./decision-trees/state-location.md)     | Redux vs Context vs local vs RTK Query            | Available |

---

## Key Principles

1. **Component Reuse Over Creation** — Always search `component-catalog.md` before creating new components
2. **Design Tokens Only** — Never use raw hex/rgb/box-shadow values; always use EVColors/Elevations
3. **Accessibility First** — WCAG 2.1 AA compliance required; all components need `validateAccessibility` tests
4. **Responsive by Default** — Use `useLayout()` hook, test at mobile + desktop
5. **i18n Everything** — All user-visible strings wrapped in `t()` from `ev-i18n`
6. **Restricted Imports** — Use project wrappers (ev-store/redux, ev-i18n, ev-hooks/navigate, ev-test/test-utils)

---

## For AI Tool Configuration

- **Claude Code**: Project rules in `CLAUDE.md` (root), skills in `.claude/skills/`
- **Cursor/Composer**: Rules in `.cursorrules` (root)
- **GitHub Copilot**: Instructions in `.github/copilot-instructions.md`
- **All tools**: Reference `docs/ai/` for detailed documentation
