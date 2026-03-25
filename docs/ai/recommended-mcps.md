# Recommended MCP Servers for AI-Driven Development

This document covers the Model Context Protocol (MCP) servers recommended for AI-assisted development on the eVisit UI project. These MCPs bridge design tools, component libraries, and code editors to streamline design-to-code workflows.

---

## 1. Figma MCP Servers

### 1.1 Figma Dev MCP (Official)

**Package:** `@anthropic-ai/figma-mcp`
**Purpose:** Design-to-code workflows — extracting design context, screenshots, metadata, and variables from Figma files via the REST API.

#### Key Tools

| Tool                   | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `get_design_context`   | Primary tool. Returns reference code, screenshot, and metadata for a node.  |
| `get_screenshot`       | Renders a node as an image for visual reference.                            |
| `get_metadata`         | Returns XML structure of a node tree (IDs, types, names, positions, sizes). |
| `get_variable_defs`    | Extracts variable definitions (colors, spacing, fonts) bound to a node.    |
| `search_design_system` | Searches published library components, variables, and styles by text query. |
| `use_figma`            | Executes JavaScript in Figma's Plugin API context for write operations.     |

#### Configuration (Claude Code)

Add to `.claude/settings.json` or the project-level settings:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<your-figma-personal-access-token>"
      }
    }
  }
}
```

#### Use Case: Convert Figma Design to React Component

1. Provide a Figma URL with `node-id` parameter.
2. Claude calls `get_design_context` to extract layout, styles, and token references.
3. Claude maps Figma tokens to `EVColors`, `TypographyTheme`, and `Breakpoints` from `ev-theme/styles`.
4. Claude generates a component using `ev-components` primitives, `styled-components/macro`, and project conventions.
5. Claude calls `get_variable_defs` to verify design token alignment.

---

### 1.2 Figma Console MCP

**Package:** `figma-console` (via Desktop Bridge plugin)
**Purpose:** Real-time interaction with the Figma desktop app for design system auditing, token extraction, component instantiation, and design-code parity checks.

**Requires:** The Figma Desktop Bridge plugin running in Figma Desktop (Right-click > Plugins > Development > Figma Desktop Bridge).

#### Key Tools

| Tool                                     | Description                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `figma_execute`                          | Run arbitrary JavaScript in Figma's plugin context (full `figma` API).   |
| `figma_get_variables`                    | Extract design tokens/variables with mode support (Light/Dark).          |
| `figma_get_styles`                       | Get all styles (color, text, effects, grids) with optional code exports. |
| `figma_search_components`                | Search components by name, category, or description.                     |
| `figma_get_component_for_development`    | Get component data optimized for code generation (deep tree, tokens).    |
| `figma_get_design_system_kit`            | Full design system extraction (tokens + components + styles) in one call.|
| `figma_lint_design`                      | Run WCAG accessibility and design quality checks on a node tree.         |
| `figma_check_design_parity`              | Compare Figma specs against code to find discrepancies.                  |
| `figma_instantiate_component`            | Create component instances from published or local libraries.            |
| `figma_batch_create_variables`           | Create up to 100 variables in one call (10-50x faster than individual).  |
| `figma_setup_design_tokens`              | Create a complete token structure (collection + modes + variables).      |

#### Configuration (Claude Code)

The Figma Console MCP connects via WebSocket to the Desktop Bridge plugin. Configuration depends on the MCP server setup:

```json
{
  "mcpServers": {
    "figma-console": {
      "command": "npx",
      "args": ["-y", "figma-console-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<your-figma-personal-access-token>"
      }
    }
  }
}
```

#### Use Case: Design System Auditing

1. Call `figma_get_design_system_kit` to extract all tokens, components, and styles.
2. Call `figma_lint_design` to run WCAG and design quality checks.
3. Call `figma_check_design_parity` with code-side specs to identify drift between Figma and implementation.
4. Use results to update `EVColors`, component props, or Figma designs to restore parity.

---

## 2. Storybook MCP Servers

### 2.1 Official Storybook MCP Addon

**Package:** `@storybook/addon-mcp`
**Minimum version:** Storybook 10.3+
**Current project version:** Storybook 8

> **Note:** This project is currently on Storybook 8. The official MCP addon requires Storybook 10.3 or later. An upgrade path is required before using this addon.

#### What It Provides

- Component metadata (props, variants, descriptions) extracted from stories.
- Live component previews rendered in the Storybook dev server.
- Automated visual testing integration.
- Direct component interaction from AI clients.

#### Installation (after upgrading to Storybook 10.3+)

```bash
npx storybook add @storybook/addon-mcp
```

#### Configuration (Claude Code)

```json
{
  "mcpServers": {
    "storybook": {
      "type": "http",
      "url": "http://localhost:6006/mcp"
    }
  }
}
```

The Storybook dev server must be running (`yarn storybook`) for the MCP endpoint to be available.

#### Upgrade Path from Storybook 8

1. Review the Storybook migration guides for versions 9 and 10.
2. Update `@storybook/*` packages in `package.json`.
3. Run `npx storybook automigrate` to handle breaking changes.
4. Verify all existing stories compile and render.
5. Add the MCP addon after the upgrade is confirmed stable.

---

### 2.2 Community Alternative: storybook-mcp

**Package:** `storybook-mcp`
**Compatibility:** Works with Storybook 8 (current project version).

#### What It Provides

| Tool                | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `getComponentList`  | Lists all available components registered in Storybook.  |
| `getComponentsProps`| Returns prop definitions and types for a given component.|

#### Installation

```bash
npm install -g storybook-mcp
```

#### Configuration (Claude Code)

```json
{
  "mcpServers": {
    "storybook-mcp": {
      "command": "npx",
      "args": ["-y", "storybook-mcp", "--port", "6006"]
    }
  }
}
```

#### Use Case: Immediate Integration

This is the recommended option for immediate use since it works with the current Storybook 8 setup. It allows AI clients to discover existing components and their prop interfaces without requiring a Storybook upgrade.

---

## 3. Configuration Examples

### Full Claude Code MCP Configuration

Add to `.claude/settings.json` at the project root:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<your-figma-personal-access-token>"
      }
    },
    "figma-console": {
      "command": "npx",
      "args": ["-y", "figma-console-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<your-figma-personal-access-token>"
      }
    },
    "storybook-mcp": {
      "command": "npx",
      "args": ["-y", "storybook-mcp", "--port", "6006"]
    }
  }
}
```

### Environment Variables

Store tokens securely. Never commit access tokens to the repository. Use one of:

- **Shell environment:** Export `FIGMA_ACCESS_TOKEN` in your shell profile.
- **`.env.local`:** Add to a gitignored local env file and reference via the MCP config.
- **Credential manager:** Use OS-level secret storage and reference via environment variables.

### Generating a Figma Personal Access Token

1. Open Figma and go to Account Settings.
2. Scroll to "Personal access tokens."
3. Click "Generate new token."
4. Give it a description (e.g., "Claude Code MCP").
5. Set scope to read-only for design files (write if using `use_figma`).
6. Copy the token and store it securely.

---

## 4. AI Client Compatibility

| MCP Server              | Claude Code          | Cursor               | GitHub Copilot       | Codex CLI            |
| ----------------------- | -------------------- | --------------------- | -------------------- | -------------------- |
| Figma Dev MCP           | Supported            | Supported (MCP panel) | Not supported        | Supported            |
| Figma Console MCP       | Supported            | Supported (MCP panel) | Not supported        | Supported            |
| Storybook MCP (official)| Supported (HTTP)     | Supported (HTTP)      | Not supported        | Supported (HTTP)     |
| storybook-mcp (community)| Supported           | Supported (MCP panel) | Not supported        | Supported            |

### Client-Specific Notes

**Claude Code:**
- Configure MCPs in `.claude/settings.json` under `mcpServers`.
- Supports both `command` (stdio) and `type: "http"` (SSE/HTTP) transports.
- MCP tools appear as callable functions within the Claude Code session.

**Cursor:**
- Configure MCPs in Cursor Settings > MCP panel.
- Add servers via the "Add MCP Server" button.
- Supports stdio and HTTP transports.
- MCP tools are available in Composer and Chat modes.

**GitHub Copilot:**
- MCP support is limited. As of early 2026, Copilot does not natively support MCP servers.
- Use Copilot Instructions (`.github/copilot-instructions.md`) to reference design tokens and component patterns manually.

**Codex CLI:**
- Configure MCPs in the Codex configuration file.
- Supports stdio transport for MCP servers.

---

## 5. Workflow Integration

### Design-to-Code Pipeline

The recommended workflow combines Figma MCP and Storybook MCP into a continuous pipeline:

```
Figma Design
    |
    v
[Figma Dev MCP: get_design_context]
    |--- Extract layout, colors, typography, spacing
    |--- Map to EVColors, TypographyTheme tokens
    |
    v
[Component Generation]
    |--- Use ev-components primitives (Button, Input, Text, etc.)
    |--- Apply styled-components/macro with EVColors
    |--- Follow project patterns (arrow functions, data-testid, i18n)
    |
    v
[Storybook MCP: verify component]
    |--- Check against existing component list (getComponentList)
    |--- Verify prop interface matches design intent
    |
    v
[Storybook Story Creation]
    |--- Create *.stories.tsx alongside the component
    |--- Include all variants and states from Figma
    |
    v
[Testing]
    |--- Unit tests with ev-test/test-utils
    |--- Accessibility tests with validateAccessibility()
    |--- Responsive tests at mobile/desktop layouts
    |
    v
[Design Parity Check]
    |--- figma_check_design_parity to verify implementation matches design
    |--- Fix any drift before PR
```

### Design Token Enforcement

The Figma MCP extracts raw design values. The `/design-tokens` Claude skill enforces that these values map to project tokens:

1. **Colors:** Figma hex values must map to `EVColors.*` constants from `ev-theme/styles`. Never hardcode hex values.
2. **Typography:** Figma font sizes and weights must map to `TypographyTheme` variants. Use `ev-components/Text` (Title, Subtitle, Body, Caption, etc.).
3. **Spacing:** Figma padding and gap values should use consistent multiples of 4px or 8px, matching the project spacing scale.
4. **Breakpoints:** Figma responsive variants must map to `BreakPoints.Mobile` (744px), `BreakPoints.Tablet` (1024px), and desktop (>1024px).

### Example: Figma to Component Workflow

```
Developer: "Build the VendorCard component from this Figma design"
           [provides Figma URL with node-id]

1. Claude calls get_design_context with the node ID
   -> Gets: layout structure, colors (#1976D2, #424242), font sizes (14px, 16px), padding (16px, 24px)

2. Claude maps tokens:
   - #1976D2 -> EVColors.cerulean
   - #424242 -> EVColors.asphalt
   - 14px body text -> Text.Body
   - 16px subtitle -> Text.Subtitle
   - 16px/24px padding -> project spacing constants

3. Claude generates VendorCard.tsx using:
   - styled-components/macro for layout
   - ev-components/Text for typography
   - EVColors for all color values
   - useLayout() for responsive behavior
   - data-testid on interactive elements
   - t() for all user-facing strings

4. Claude generates VendorCard.stories.tsx with variants

5. Claude generates __tests__/VendorCard.test.tsx with:
   - Render tests
   - validateAccessibility()
   - Mobile/desktop layout tests
```

### Combining Figma Console with Storybook

For design system maintenance, these tools work in tandem:

- **figma_get_design_system_kit** extracts the full token and component inventory from Figma.
- **storybook-mcp getComponentList** shows what is implemented in code.
- Compare the two to identify:
  - Components in Figma that are not yet built.
  - Components in code that have drifted from the Figma source.
  - Tokens defined in Figma that are not used in code, or vice versa.

---

## 6. Troubleshooting

### Figma MCP Issues

| Issue                                    | Solution                                                        |
| ---------------------------------------- | --------------------------------------------------------------- |
| `403 Forbidden` on API calls             | Regenerate your Figma personal access token.                    |
| `get_design_context` returns empty code  | The node may be too large. Try a child node or use `forceCode`. |
| Variables API returns 403                | Variables REST API requires Figma Enterprise plan. Use `figma_get_variables` with `useConsoleFallback: true`. |
| Desktop Bridge not connecting            | Ensure the Figma Desktop Bridge plugin is running (Right-click > Plugins > Development). |

### Storybook MCP Issues

| Issue                               | Solution                                                    |
| ------------------------------------ | ----------------------------------------------------------- |
| MCP endpoint not reachable           | Ensure Storybook dev server is running on port 6006.        |
| Components not listed                | Verify stories are properly registered in `.storybook/main.js`. |
| Official addon not available         | Project must be on Storybook 10.3+. Use `storybook-mcp` community package instead. |
