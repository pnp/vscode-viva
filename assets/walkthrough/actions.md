# Actions

The actions section allows unique functionalities that may significantly boost productivity when working with SPFx projects.

![Actions](../images/actions.png)

Currently the extension allows you to:

- **CI/CD Workflow** - This action will allow you to generate yaml CI/CD GitHub Workflow or Azure DevOps Pipeline to bundle, package, and deploy your project to any app catalog on every code push. 

![CI CD pipeline](../images/CICD-pipeline.png)

Check it out in action for GitHub👇

![GitHub CI CD workflow](../images/gh-ci-cd.gif)

And for Azure DevOps👇

![Azure DevOps CI CD pipeline](../images/azdo-ci-cd.gif)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/ci-cd/)

- **Upgrade project** - Generates a detailed upgrade report (`.md` and/or code tour) to guide users from their current SPFx version to a selected target version using CLI for Microsoft 365. The report includes both required and optional upgrade steps, with a consolidated script at the end for automated actions and a list of remaining manual steps.

![Upgrade project](../images/upgrade-project.png)

And the code tour guidance will provide you upgrade tips directly in your code!

![Upgrade project](../images/upgrade-project-code-tour.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#upgrade-project)

- **Validate project** - Creates a validation .md report and/or code tour validation guidance for the currently open SPFx project. The action will automatically detect the SPFx version used and will validate if the project is properly set up.

![Upgrade project](../images/validate-project.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#validate-current-project)

- **Rename project** - Forget about manual work and let the extension rename your project and generate a new solution ID. 

![Rename](../images/rename.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#rename-current-project)

- **Grant API permissions** - The action will Grant all API permissions specified in the package-solution.json of the current project. This is especially helpful if you just want to debug your SPFx solution using Workbench. No longer do you need to bundle, package, and deploy the project to then go to the SharePoint admin portal and consent to the permissions. All of that is now done with just a single click. 

![Grant permissions](../images/grant-permissions.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#grant-api-permissions)

- **Deploy project** - This action will only work when the user is logged in to tenant and the sppkg file is present. The action will deploy the project to the selected (tenant or site) app catalog. 

![Deploy](../images/deploy.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#deploy-project)

- **Add new component** - Allows scaffolding a new SPFx project as a new component of the currently opened project. The action under the hood uses the same SharePoint Yeoman generator to scaffold a new project and this feature is an abstraction UI layer. 

![Add component](../images/add-component.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#add-new-component)

- **Set Form Customizer** - Allows to update the New, Edit or View from of any SharePoint List to a given SPFx Form Customizer based on provided GUID. 

![Set Form Customizer](../images/set-form-customizer-action.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#set-form-customizer)

- **Increase project version** - This action allows you to increase project major, minor or patch version and automatically align the versioning between `package.json` and `package-solution.json` files.

![Increase project version](../images/increase-versioning.png)

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#increase-project-version)

- **Open sample/scenario galleries of the SPFx web part, extensions, or ACEs projects** - SharePoint Framework Toolkit supports a couple of sample galleries that may be used to scaffold a new SPFx project. 

[Check out our docs for more details](https://pnp.github.io/vscode-viva/features/actions/#open-samplescenario-galleries-of-the-spfx-web-part-extensions-or-aces-projects)