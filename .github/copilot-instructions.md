# SharePoint Framework (SPFx) Toolkit VS Code Extension - Copilot Instructions

## Architecture Overview

This is a **VS Code extension** that serves as an **abstraction layer** over the SharePoint Framework (SPFx) Yeoman generator and CLI for Microsoft 365. The extension provides a comprehensive toolkit for SPFx development with AI-powered assistance.

**Key architectural components:**
- **Extension Host**: Main entry point (`src/extension.ts`) that registers all services and providers
- **Chat Participant**: AI-powered `@spfx` chat participant with `/setup`, `/new`, `/info`, `/code` commands
- **Webview Panel**: React-based UI for scaffolding, samples gallery, and project management
- **Service Layer**: Abstraction over CLI for Microsoft 365 commands
- **Authentication**: Microsoft 365 authentication via `AuthProvider`

## Key Considerations

### Contribution & Branching Rules
- Always read and follow contributing.md before starting work; use it as the primary source for workflow, coding standards, testing, and PR requirements.
- Start new work from the dev branch:
  - Create feature/fix branches off dev.
  - Open Pull Requests that target dev. Do not open PRs targeting main.
- PRs must include: summary, linked issue (if any), testing steps, and listed reviewers.
- Use descriptive commit messages and reference issue numbers when applicable.
- If uncertain about any change (dependency, behavior, or architecture), open an issue or ask a human reviewer instead of guessing.

### Extension Dependency Rules
- Do not introduce new npm packages to the repository without explicit human approval. Agents must not add dependencies to package.json.
- Do not update npm-shrinkwrap.json (or lockfiles) except when:
  - A new dependency is intentionally added to package.json, AND
  - A human reviewer has approved the addition in the PR. Mention dependency changes in the PR and request approver review.
- Do not modify npm-shrinkwrap.json or lockfiles locally to "fix" builds; report and request guidance.

### File Changes & Documentation
- Do not change existing file contents unless the change is required and documented in contributing.md, an open issue, or the PR description.
- When editing docs or config, preserve existing formatting and context; keep changes minimal and explain why in the PR.

### Testing & Validation
- Add or update unit tests when changing logic.
- Run `npm run test` or `npm run watch-tests` locally before opening a PR.
- Manual testing: verify refactored input prompts, error handling, and edge cases for user prompts.

### Security and privacy
- Never embed secrets, tokens, or credentials in code or docs.
- If work requires sensitive information, request a secure workflow from maintainers.

## Development Workflow

### Build System
- **Webpack**: Dual configuration for extension (`webpack/extension.config.js`) and webview (`webpack/webview.config.js`)
- **Watch Mode**: `npm run watch` - runs parallel watch tasks for both extension and webview
- **Package**: `npm run package` - production build with source maps

### Key NPM Scripts
```bash
npm run watch          # Development mode with hot reload
npm run package        # Production build
npm run compile-tests  # Compile TypeScript tests
npm run test           # Run VS Code extension tests
```

### VS Code Tasks
- `npm: watch` - Background build task (default)
- `npm: watch-tests` - Background test watch task

## Project Structure Patterns

### Core Services (`src/services/`)
- **`actions/`**: Command implementations (Scaffolder, CliActions, Dependencies)
- **`dataType/`**: Data models and singleton classes (Extension, ProjectInformation, EnvironmentInformation)
- **`executeWrappers/`**: Terminal command execution abstraction
- **`check/`**: Validation logic for projects and dependencies

### Chat Integration (`src/chat/`)
- **`PromptHandlers.ts`**: Main chat participant logic with command routing
- **`tools/`**: Language model tools for GitHub Copilot integration
- **`CliForMicrosoft365SpoCommands.ts`**: SharePoint Online command mapping

### UI Components (`src/webview/` and `src/panels/`)
- **React-based webview**: Handles scaffolding forms, sample galleries, project management
- **Tree View Providers**: VS Code native tree views for actions, tasks, environment details
- **CommandPanel**: Central coordination for all extension commands

## Critical Dependencies

### External Tools Integration
- **CLI for Microsoft 365**: Core dependency for all SharePoint operations
- **SPFx Yeoman Generator**: Used for project scaffolding
- **Node Version Managers**: Support for `nvm`/`nvs` via settings

### Extension Dependencies
- **Code Tour**: For upgrade/validation guidance
- **SPFx Snippets**: Bundled coding snippets extension

## Authentication & Microsoft 365 Integration

### AuthProvider Pattern
- Singleton authentication service in `src/providers/AuthProvider.ts`
- Microsoft 365 authentication for tenant operations
- Required for `/info` chat command and deployment actions

### Language Model Tools
The extension exposes SharePoint Online operations as GitHub Copilot tools:
- `list_spo_app`, `install_spo_app`, `uninstall_spo_app`, `upgrade_spo_app`, `list_spo_app_instances` - App catalog management
- `add_spo_list`, `get_spo_list`, `remove_spo_list` - List operations
- `add_spo_page` - Page creation
- `spo_site_add`, `spo_site_get`, `spo_site_remove` - Site management
- `upgrade_spfx_project` - SPFx project upgrade

## Development Conventions

### Command Registration Pattern
All commands follow this pattern in service classes:
```typescript
export class ServiceName {
  public static registerCommands() {
    const subscriptions = Extension.getInstance().subscriptions;
    subscriptions.push(
      commands.registerCommand(Commands.commandName, ServiceName.handler)
    );
  }
}
```

### Constants Management
- All constants centralized in `src/constants/` with index re-exports
- Command names in `Commands.ts`
- Context keys for VS Code when-clauses in `ContextKeys.ts`

### Error Handling & Logging
- Centralized logging via `Logger` class in `src/services/dataType/Logger.ts`
- Terminal command execution wrapped in `TerminalCommandExecuter`

## SPFx-Specific Knowledge

### Project Detection
- Looks for `.yo-rc.json` or `src/.yo-rc.json` (for Microsoft 365 Agents Toolkit projects)
- Creates `project.pnp` file for workspace state management

### Supported SPFx Operations
- **Scaffolding**: New projects, components, samples-based projects
- **Validation**: Project structure, dependencies, SPFx version compatibility
- **Deployment**: Upload to tenant/site app catalogs
- **CI/CD**: Generate GitHub Actions/Azure DevOps pipelines
- **Version Management**: Sync between `package.json` and `package-solution.json`

### Sample Gallery Integration
- Consumes PnP sample repositories data (`data/sp-dev-fx-samples.json`)
- Provides filtering by author, SPFx version, component type
- Supports both web parts and extensions

When working on this extension, prioritize understanding the service layer architecture and the dual nature of the extension (native VS Code UI + React webview). The chat participant and language model tools represent the AI-first approach to SPFx development assistance.
