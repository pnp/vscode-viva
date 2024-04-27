# Contribution guidelines

Thank you for your interest in contributing to the SharePoint Framework Toolkit extension. In this guide, we will walk you through the steps to get started.

## 👉 Before you start

In order to help us process your contributions, please make sure you do the following:

- don't surprise us with big PR's. Instead create an issue & start a discussion so we can agree on a direction before you invest a large amount of time.
- create your branch from `dev` (NOT `main`). This will make it easier for us to merge your changes.
- submit PR to the `dev` branch of this repo (NOT `main`). PRs submitted to other branches will be declined.
- let us know what's in the PR: sometimes code is not enough and in order to help us understand your awesome work please follow the PR template to provide required information.
- don't commit code you didn't write. Sure Copilot may help 😉.

Do not be afraid to ask question. We are here to help you succeed in helping us making a better product.

## 👣 How to start - Minimal path to awesome

> ⚠️ **Important**: Before you start, this product under the hood uses CLI for Microsoft 365. As of now VS Code extension do not support esm and CLI for Microsoft 365 from version 7.x was refactored to esm. To overcome this issue we are using a fork of CLI for Microsoft 365 that is still maintained in cjs and may be found in the following Github repo/branch [cli-cjs](https://github.com/Adam-it/cli-microsoft365/tree/cli-cjs).

- Fork this project. When creating the fork deselect the checkbox 'Copy the `main` branch only' to get both `main` and `dev` branches.
- Clone the forked repository
- In the cloned repository, run the npm install command: `npm i`. Please be aware the recommended node version is 18.17.X or higher.
- Clone the cjs version of CLI for Microsoft 365 from the following Github repo/branch [cli-cjs](https://github.com/Adam-it/cli-microsoft365/tree/cli-cjs)
- In the cloned CLI for Microsoft 365 repository, run: `npm install`, `npm run clean`, `npm run build` to generate the CLI for Microsoft 365 output. Make sure the cloned CLI for Microsoft 365 repository is in the same workspace as the SharePoint Framework Toolkit repository. So for example you should have the following structure:
```plaintext
root:
  - cli-microsoft365
  - vscode-viva
```
- from the cloned for of SharePoint Framework Toolkit repository run the following script [cli-for-microsoft365-copy-local-version](./scripts/cli-for-microsoft365-copy-local-version.ps1) passing the `workspacePath` the full path to the root folder of the workspace. This script will copy the output of the CLI for Microsoft 365 to the SharePoint Framework Toolkit extension node modules folder.
- Open the SharePoint Framework Toolkit project in Visual Studio Code
- Run the watch command: `npm run watch`
- Press `F5` to start the extension

## ❓ More guidance and tips

For more contributing guidance and tips and technical documentation of this extension please go to the repo [wiki](https://github.com/pnp/vscode-viva/wiki).