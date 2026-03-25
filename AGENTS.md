# eVisit UI — AI Development Rules (Codex)

> This file is for OpenAI Codex. The source of truth is `CLAUDE.md`.
> For detailed patterns and examples, read files in `docs/ai/`.

## Critical Constraints

- **React 17** — NEVER use React 18 APIs (createRoot, useId, automatic batching)
- **MUI v5** — NEVER use MUI v6 APIs
- **styled-components v5** — NEVER use v6 APIs; always import from `styled-components/macro`
- **MSW v1** — NEVER use v2 APIs; handler format: `rest.get(url, (req, res, ctx) => ...)`
- **TypeScript 5.9+** strict mode; NEVER use `any` (use `unknown` with type guards)
- **Node.js >= 22**, Yarn package manager
- **No `console.log`** — only `console.warn` / `console.error`
- **No `React.FC`**, `React.FunctionComponent`, or `React.PropsWithChildren`
- **No barrel MUI imports** — use `import Grid from '@mui/material/Grid'`
- **No `@mui/material/Typography`** — use `ev-components/Text`
- **No raw hex colors** — use `EVColors` from `ev-theme/styles`
- **No `useNavigate`** from react-router-dom — use `useAppNavigate` from `ev-hooks/navigate`
- **No `useDispatch`/`useSelector`** from react-redux — use `useAppDispatch`/`useAppSelector` from `ev-store/redux`
- **No `useTranslation`** from react-i18next — use from `ev-i18n`
- **No `render`** from @testing-library/react — use from `ev-test/test-utils`
- **No `styled-components`** bare — use `styled-components/macro`
- **No `btoa`/`atob`** — use `ev-utils/base64`
- **Arrow function components only** — never `function` keyword for components
- **All user-visible strings** must be wrapped in `t()` from `useTranslation()`
- **All interactive elements** must have `data-testid`
- **baseUrl is `src/`** — `import X from 'ev-api/api'` resolves to `src/ev-api/api.ts`
- **Use `test()` not `it()`** for test blocks
- **Max cyclomatic complexity: 15**

## Mandatory Documentation

Before writing code, read these files in order of relevance:

1. `docs/ai/coding-patterns.md` — Import restrictions, component rules, naming conventions
2. `docs/ai/component-catalog.md` — 47+ existing components with props/enums (ALWAYS prefer existing)
3. `docs/ai/design-tokens.md` — EVColors, Typography, Elevations, Breakpoints (NEVER hardcode)
4. `docs/ai/testing-patterns.md` — Jest, RTL, MSW v1, fishery factories, validateAccessibility
5. `docs/ai/accessibility-guide.md` — WCAG 2.1 AA compliance requirements
6. `docs/ai/api-patterns.md` — RTK Query 5-file pattern, Tags, Base paths
7. `docs/ai/form-patterns.md` — React Hook Form + Yup + useController
8. `docs/ai/i18n-guide.md` — i18next setup, t(), nt(), flat keys
9. `docs/ai/storybook-guide.md` — Every new component needs a story
10. `docs/ai/decision-trees/component-selection.md` — "Use existing vs create new" flowchart
11. See `docs/ai/README.md` for the full index

## Proactive Behaviors

- Search existing components in `ev-components/` before creating new ones
- Create unit tests for every new component/feature (coverage: 70% branches, 75% functions, 80% lines)
- Include `validateAccessibility(container)` test for every new component
- Test at both `mobile` and `desktop` layouts for responsive components
- Use `useLayout()` from `ev-hooks/layout` for responsive logic (not CSS media queries)
- Use Luxon `DateTime` for all date/time operations
- Commit after each logical unit with `CU-<taskId>: <description>` format
- Add Storybook stories for every new ev-components/ component
- Update `docs/ai/` files when creating new patterns or components
