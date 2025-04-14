##  Gulp tasks

The SharePoint Framework uses [Gulp](https://gulpjs.com/) as its task runner to handle building, bundling, and packaging of the client-side solution project.

The toolchain consists of the following gulp tasks defined in the @microsoft/sp-build-core-tasks package:

build - Builds the client-side solution project.
bundle - Bundles the client-side solution project entry point and all its dependencies into a single JavaScript file.
serve - Serves the client-side solution project and assets from the local machine.
clean - Cleans the client-side solution project's build artifacts from the previous build and from the build target directories (lib and dist).
test - Runs unit tests, if available, for the client-side solution project.
package-solution - Packages the client-side solution into a SharePoint package.
deploy-azure-storage - Deploys client-side solution project assets to Azure Storage.

SPFx Toolkit VS Code extension shows all possible Gulp tasks one may run on an SPFx project. Don't worry about remembering all the commands, just click on the task you want to run and the extension will do the rest.

![Gulp Tasks](../images/tasks.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.4-Gulp-tasks)