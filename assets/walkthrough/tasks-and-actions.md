##  Gulp tasks

The extension shows all possible Gulp tasks one may run on an SPFx project. The tasks allow you to clean, bundle, package, serve the project with a single click.

![Gulp Tasks](../images/tasks.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.4-Gulp-tasks)

##  Actions

The actions section allows unique functionalities that may significantly boost productivity when working with SPFx projects.

![Actions](../images/actions.png)

Currently the extension allows you to:

- **CI/CD Workflow** - This action will allow you to generate yaml CI/CD GitHub Workflow or Azure DevOps Pipeline to bundle, package, and deploy your project to any app catalog on every code push. 

![CI CD pipeline](../images/CICD-pipeline.png)

Check it out in action for GitHub👇

![GitHub CI CD workflow](../images/gh-ci-cd.gif)

And for Azure DevOps👇

![Azure DevOps CI CD pipeline](../images/azdo-ci-cd.gif)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#cicd-github-workflow)

- **Upgrade project** - Uses CLI for Microsoft 365 to create a .md report with upgrade guidance to the latest supported SPFx version by the extension. 

![Upgrade project](../images/upgrade-project.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#upgrade-project)

- **Validate project** - Creates a validation .md report against the currently used SPFx version in the project. The action will automatically detect the SPFx version used and will validate if the project is properly set up. 

![Upgrade project](../images/validate-project.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#validate-current-project)

- **Rename project** - Forget about manual work and let the extension rename your project and generate a new solution ID. 

![Rename](../images/rename.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#rename-current-project)

- **Grant API permissions** - The action will Grant all API permissions specified in the package-solution.json of the current project. This is especially helpful if you just want to debug your SPFx solution using Workbench. No longer do you need to bundle, package, and deploy the project to then go to the SharePoint admin portal and consent to the permissions. All of that is now done with just a single click. 

![Grant permissions](../images/grant-permissions.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#grant-api-permissions)

- **Deploy project** - This action will only work when the user is logged in to tenant and the sppkg file is present. The action will deploy the project to the selected (tenant or site) app catalog. 

![Deploy](../images/deploy.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#grant-api-permissions)

- **Add new component** - Allows scaffolding a new SPFx project as a new component of the currently opened project. The action under the hood uses the same SharePoint Yeoman generator to scaffold a new project and this feature is an abstraction UI layer. 

![Add component](../images/add-component.png)

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#add-new-component)

- **Open sample/scenario galleries of the SPFx web part, extensions, or ACEs projects** - SharePoint Framework Toolkit supports a couple of sample galleries that may be used to scaffold a new SPFx project. 

[Check out our docs for more details](https://github.com/pnp/vscode-viva/wiki/5.5-Actions#open-samplescenario-galleries-of-the-spfx-web-part-extensions-or-aces-projects)