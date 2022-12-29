> ### Important: The extension is currently in preview. If you find issues, please report them to the [issue list](https://github.com/pnp/vscode-viva/issues).

<br />

<h1 align="center">
  <img alt="Viva Connections Toolkit for Visual Studio Code" src="./assets/logo.png" width="100px" />
</h1>

# Viva Connections Toolkit for Visual Studio Code

With the Viva Connections Toolkit extension, you can create and manage your Viva Connections solutions in your tenant. All actions you need to perform during the development flow are at your fingertips.

![Sample Gallery](./assets/images/sample-gallery.png)

## Architecture

Viva Connections Toolkit for Viva Studio Code is an abstraction layer on top of the [SPFx](https://aka.ms/spfx) Yeoman generator and [CLI for Microsoft 365](https://pnp.github.io/cli-microsoft365/). All operations and actions are performed on the command line level using these two tools with the environment settings on your computer.

This means that the features and capabilities provided through this tool are avaialble for any solution which has been build with SPFx.
 
## Capabilities

The extension provides the following capabilities:

### Create a new Viva Connections app

The extension automatically detects if you are in an Viva Connections project (SharePoint Framework project). If not, it will show helpful actions to allow you to create a new Viva Connections app.

![Welcome experience](./assets/images/welcome-experience.png)

### Check the dependencies

To ensure that you can create Viva Connections Toolkit, you can use the **check dependencies** functionality. This action will check if you have the required dependencies to create a new Viva Connections app.

- Node version: 16
- NPM dependencies:
  - gulp
  - yo
  - @microsoft/generator-sharepoint

> **Info**: This list is based on the [set up your development environment recommendations](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)

### Installing the dependencies

In case when you do not have all dependencies installed, you can use the **install dependencies** action to install them.

### Start from a sample

From our sample gallery, you can quickly get started with one of the Viva Connections Toolkit that were created by the community.

### Start from a scenario

Start your solution creation based on the provided set of scenarios with ready to use code to showcase what's possible. Scenario solutions are provided with detailed guidance using the [Code Tour](https://aka.ms/codetour) to provide you more details on the structure and options.

### Create a new project

Creating a new project was never easier. Just use the **create a Viva Connections project** action, and the extension will guide you through the process.

### Project actions

When you open a Viva Connections app project (SharePoint Framework solution), you will be able to perform the following actions:

- Sign in and out to your tenant
- Run gulp tasks
- Upgrade the solution
- Deploy the solution
- Project validation
- Useful links to help you get started
- Add a new component to your project

<p align="center">
  <img alt="Add new component" src="./assets/images/new-component.png" />
</p>

These options are available for any SPFx solution regardless if it was created using the Viva Toolkit or not.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to grant us the right to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

If you have ideas for new features or feedback, let us know by creating an issue in the [issues list](https://github.com/pnp/vscode-viva/issues). Before you submit a PR with your improvements, please review our [contributing guide](./contributing.md).

## Support

This project is community lead extension providded by the [Microsoft 365 platform community](https://aka.ms/m365/community) members. Microsoft employees are closely involved on this work, but the solution is provided under the community brand without direct supportability channels from Microsoft.

## Community

Are you building experiences for the Microsoft 365? - Everyone is welcome to join on our [Microsoft 365 platform community](https://aka.ms/m365/community) efforts with community calls, samples and guidance. Join on our [weekly community calls](https://aka.ms/m365/calls) for Microsoft 365 and Power Platform topics. Everyone is welcome 🧡

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## "Sharing is Caring"

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
