# eVisit UI — AI-Driven Development Knowledge Base

A comprehensive knowledge base that enables AI coding assistants (Claude Code, Cursor/Composer, GitHub Copilot, Codex) to work effectively on the eVisit UI codebase.

## Structure

```
.
├── CLAUDE.md                          # Primary knowledge base (source of truth)
├── .cursorrules                       # Condensed rules for Cursor/Composer
├── .github/
│   ├── copilot-instructions.md        # GitHub Copilot instructions
│   └── pull_request_template.md       # PR template with AI compliance checklist
├── .claude/
│   ├── launch.json                    # Dev server configuration
│   └── skills/                        # Claude Code slash-command skills
│       ├── accessibility-audit/       # /accessibility-audit — WCAG 2.1 AA checklist
│       ├── component-lookup/          # /component-lookup — Find existing components
│       ├── design-tokens/             # /design-tokens — Enforce EVColors, Typography
│       ├── fix-bug/                   # /fix-bug — Investigation + regression test
│       ├── new-api-endpoint/          # /new-api-endpoint — 5-file RTK Query pattern
│       ├── new-component/             # /new-component — ev-components/ creation
│       ├── new-feature-page/          # /new-feature-page — Full page scaffold
│       ├── refactor/                  # /refactor — Safe refactoring workflow
│       └── storybook-story/           # /storybook-story — Dual-file story pattern
├── docs/ai/                           # Detailed AI reference documentation
│   ├── README.md                      # Index and quick router
│   ├── component-catalog.md           # 47+ components with props and usage
│   ├── design-tokens.md               # EVColors, Typography, Elevations, Breakpoints
│   ├── api-patterns.md                # RTK Query endpoints, Tags, MSW handlers
│   ├── form-patterns.md               # React Hook Form + Yup patterns
│   ├── hook-catalog.md                # 65+ custom hooks reference
│   ├── i18n-guide.md                  # Internationalization (16 locales)
│   ├── routing-architecture.md        # React Router 6, lazy loading, sub-apps
│   ├── state-management.md            # RTK Query + Redux + Context layers
│   ├── storybook-guide.md             # Dual-file story pattern, Figma integration
│   ├── testing-patterns.md            # Jest, RTL, MSW v1, fishery factories
│   └── decision-trees/               # "When should I use X?" flowcharts
│       ├── component-selection.md     # UI need → existing component mapping
│       ├── state-location.md          # Where to put state
│       └── styling-approach.md        # styled-components vs sx vs classnames
├── bin/                               # Automation scripts
│   ├── check-stories.sh               # CI: verify all components have stories
│   ├── check-a11y-tests.sh            # CI: verify all components have a11y tests
│   └── generate-component-catalog.ts  # Generate component inventory markdown
└── .storybook/
    └── main.js                        # Storybook config (with a11y addon)
```

## Source of Truth Chain

```
CLAUDE.md → docs/ai/* → .cursorrules → .github/copilot-instructions.md
```

## AI Tool Coverage

| File                           | Claude Code | Cursor/Composer | Copilot | Codex |
| ------------------------------ | ----------- | --------------- | ------- | ----- |
| `CLAUDE.md`                    | Primary     | —               | —       | —     |
| `.cursorrules`                 | —           | Primary         | —       | —     |
| `.github/copilot-instructions` | —           | —               | Primary | —     |
| `docs/ai/*`                    | Reference   | Reference       | —       | Feed  |
| `.claude/skills/*`             | Skills      | —               | —       | —     |

## Key Principles

1. **Prefer existing components** — AI must search ev-components/ before creating new ones
2. **Design tokens only** — No hardcoded colors; use EVColors, Typography, Elevations
3. **Accessibility first** — WCAG 2.1 AA, validateAccessibility() in every test
4. **Always translate** — All user-facing strings wrapped in t() from ev-i18n
5. **Test everything** — Unit tests, responsive tests, a11y tests with every change

## Usage

Copy these files into the eVisit UI repository root. The .claude/skills/ and docs/ai/ directories integrate automatically with Claude Code and other AI tools.

### CI Integration

Add to your CI pipeline:
```yaml
- run: bash bin/check-stories.sh
- run: bash bin/check-a11y-tests.sh
```
