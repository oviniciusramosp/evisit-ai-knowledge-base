# eVisit UI — GitHub Copilot Instructions

# Last synced with CLAUDE.md: 2026-03-25

## Technology Constraints

- React 17 (NOT 18), MUI v5 (NOT v6), styled-components v5 (NOT v6), MSW v1 (NOT v2)
- TypeScript strict mode, Node.js >= 22

## Import Rules (ENFORCED)

```
# DO NOT USE → USE INSTEAD
@testing-library/react → ev-test/test-utils
react-redux (useDispatch/useSelector) → ev-store/redux (useAppDispatch/useAppSelector)
react-i18next → ev-i18n
react-router-dom (useNavigate) → ev-hooks/navigate (useAppNavigate)
styled-components → styled-components/macro
@mui/material (barrel) → Individual imports (@mui/material/Grid)
@mui/material/Typography → ev-components/Text
```

## Component Library

Always prefer ev-components wrappers over raw MUI:

- `ev-components/Button` (not MUI Button)
- `ev-components/Input` (not MUI TextField)
- `ev-components/Dialog` (not MUI Dialog)
- `ev-components/Dropdown` (not MUI Select)
- `ev-components/Text` (not MUI Typography)
- `ev-components/Tabs` (not MUI Tabs)

Full catalog: `docs/ai/component-catalog.md`

## Design Tokens

Never use raw hex/rgb. Use:

- Colors: `EVColors.text.default`, `EVColors.surface.background`, etc. from `ev-theme/styles`
- Typography: `Text.Body`, `Text.Description`, etc. from `ev-components/Text`
- Shadows: `Elevations.elevation2` from `ev-theme/styles`
- Breakpoints: `useLayout()` from `ev-hooks/layout`

Full reference: `docs/ai/design-tokens.md`

## Code Patterns

```tsx
// Arrow function components (NEVER function keyword or React.FC)
const MyComponent = ({ prop }: MyComponentProps) => { ... };

// forwardRef when needed
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { ... });

// Styled-components with transient props
import styled from 'styled-components/macro';
const Wrapper = styled.div<{ $isMobile: boolean }>`
  padding: ${p => p.$isMobile ? '16px' : '24px'};
`;

// i18n — all user-visible strings
const { t } = useTranslation();
<Text.Body>{t('Welcome')}</Text.Body>

// Responsive
const { isMobile, isDesktop } = useLayout();

// data-testid on interactive elements
<Button id="submit-btn" label={t('Submit')} />
```

## Testing Patterns

```tsx
import { render, screen, validateAccessibility } from 'ev-test/test-utils';

test('renders correctly', () => {
  render(<MyComponent />, { layout: 'desktop' });
  expect(screen.getByTestId('my-component')).toBeInTheDocument();
});

test('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  await validateAccessibility(container);
});
```

- Use `test()` not `it()`
- MSW v1: `rest.get(url, (req, res, ctx) => res(ctx.json(data)))`
- Factories: `userFactory.build()` from `ev-test/test-mocks/api-response`

## Accessibility (WCAG 2.1 AA)

- Semantic HTML elements
- label/ariaLabel/labelledBy on all form inputs
- aria-live for dynamic updates
- Focus management for modals
- 44x44px touch targets on mobile
- Color + text/icon for status (not color alone)

## Workflow Skills

This project has workflow checklists in `.claude/skills/`. Although they are stored in the Claude Code directory, they are generic markdown checklists that any AI can follow. You may need to open the skill files in the editor for Copilot to access them.

**Read the relevant skill file BEFORE starting these tasks:**

| Task | Read this skill file |
|---|---|
| Creating a new UI component | `.claude/skills/new-component/SKILL.md` |
| Building a new page/feature | `.claude/skills/new-feature-page/SKILL.md` |
| Adding an API endpoint | `.claude/skills/new-api-endpoint/SKILL.md` |
| Writing a Storybook story | `.claude/skills/storybook-story/SKILL.md` |
| Auditing accessibility | `.claude/skills/accessibility-audit/SKILL.md` |
| Fixing a bug | `.claude/skills/fix-bug/SKILL.md` |
| Refactoring code | `.claude/skills/refactor/SKILL.md` |
| Looking up existing components | `.claude/skills/component-lookup/SKILL.md` |
| Writing styles/colors | `.claude/skills/design-tokens/SKILL.md` |

These files contain step-by-step checklists with project-specific patterns. Always read the relevant skill before starting work to ensure consistency with the existing codebase.
