# Contribution guidelines

Thank you for your interest in contributing to the SharePoint Framework Toolkit extension. In this guide, we will walk you through the steps to get started.

## 👉 Before you start

In order to help us process your contributions, please make sure you do the following:

- Don't surprise us with big PR's. Instead, create an issue and start a discussion so we can agree on a direction before you invest a large amount of time.
- Create your branch from `dev` (NOT `main`). This will make it easier for us to merge your changes.
- Submit your PR to the `dev` branch of this repo (NOT `main`). PRs submitted to other branches will be declined.
- Let us know what's in the PR: sometimes code is not enough and in order to help us understand your awesome work please follow the PR template to provide required information.
- Don't commit code you didn't write. Sure, Copilot may help 😉.

Don't be afraid to ask questions. We are here to help you succeed in making this a better product together.

## 👣 How to start - Minimal path to awesome

> ⚠️ **Important**: Before you start, note that this product uses the CLI for Microsoft 365 under the hood. Currently, VS Code extension do not support ECMAScript Modules (ESM), and starting from version 7.x, the CLI has been refactored to use ESM. To overcome this, we are using a fork of CLI that is still maintained in CommonJS (CJS). You can find it in the following Github repo/branch [cli-cjs](https://github.com/Adam-it/cli-microsoft365/tree/cli-cjs).

- Fork this project. When creating the fork, deselect the checkbox 'Copy the `main` branch only' to get both `main` and `dev` branches.
- Clone the forked repository.
- In the cloned repository, run the npm install command: `npm install`. Please note that the recommended node version is 18.17.X or higher.
- Clone the CJS version of CLI for Microsoft 365 from the following Github repo/branch [cli-cjs](https://github.com/Adam-it/cli-microsoft365/tree/cli-cjs)
- In the cloned CLI for Microsoft 365 repository, run: `npm install`, `npm run clean`, `npm run build` to generate the CLI for Microsoft 365 output. Make sure the cloned CLI for Microsoft 365 repository is in the same workspace as the SharePoint Framework Toolkit repository. For example, your folder structure should look like this:

```plaintext
root:
  - cli-microsoft365
  - vscode-viva
```
- From the cloned fork of the SharePoint Framework Toolkit repository, navigate to the `scripts` folder and run the script [cli-for-microsoft365-copy-local-version](./scripts/cli-for-microsoft365-copy-local-version.ps1), passing the `workspacePath` (full path to the root folder of your workspace). This script will copy the output of the CLI for Microsoft 365 to the SharePoint Framework Toolkit extension's `node_modules` folder.
- Open the SharePoint Framework Toolkit project in Visual Studio Code.
- Run the watch command: `npm run watch`.
- Press `F5` to start debugging the extension.

> ⚠️ **Important**: When debugging the SharePoint Framework Toolkit extension in the context of an SPFx project, you may notice errors in the debug console if the following folders are missing: `.\.vscode\tours` and `.\.github\tours`. These errors are caused by the `CodeTour` extension, a dependency of the SPFx Toolkit, and they do not affect the functionality of the SPFx Toolkit extension. To suppress these errors during debugging, you can create empty `.tours` folders in your project. Alternatively, you can safely ignore these errors as they do not impact the extension's behavior.

## ❓ More guidance and tips

For more contributing guidance and tips and technical documentation of this extension please go to the repo [Docs](https://pnp.github.io/vscode-viva/).