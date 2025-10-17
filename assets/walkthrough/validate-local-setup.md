# Set up your SharePoint Framework development environment

To build and deploy client-side web parts, extensions, or adaptive cards using the SharePoint Framework, you will need to set up your development environment. SPFx requires specific versions of Node.js and several global dependencies. SPFx Toolkit provides two actions that may help you get started with ease:

- **Validate Local Setup**: This action checks if your local development environment meets the required versions of Node.js and global dependencies for the SPFx version you have installed, and in case you do not have any SPFx generator installed, it will validate against the latest SPFx version.

![validate dependencies](../images/validate-dependency.png)

- **Install Dependencies**: This action installs the required global dependencies for any SPFx version.

![install dependencies](../images/install-dependencies.png)

SPFx Toolkit may also help you install and switch to the correct version of Node.js using either `nvm` (Node Version Manager) or `nvs` (Node Version Switcher). First you need to make sure you have set the Node.js Version Manager setting in SPFx Toolkit to either `nvm` or `nvs`.

Then during installing dependencies, SPFx Toolkit will check if you have the correct version of Node.js installed, and if not, it will offer to install and switch to the correct version for you using the selected Node version manager.

![node installation](../images/install-node-support.png)

Check out the [docs for more details](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment) on the required node and dependency versions.
