# Change Log

## [4.5.0] - 2025-04-14

- Added new Gulp task Publish, which includes both bundle and package
- Updated settings to allow not to load apps for app catalogs
- Updated serve gulp tasks to combine them into a single task
- Refactored pipeline scaffolding form to smaller components
- Added initial integration tests for the product
- Added an action that allows to increase project version and implement version increment logic
- Fixed App Install/Uninstall issue to allow installing apps on root site

## [4.4.0] - 2025-02-04

- Updated the gulp bundle local and production to a single task with an additional prompt
- Updated the gulp package-solution local and production to a single task with an additional prompt
- Fixed warning message regarding installed Node.js version in validate dependency action
- Added conditional logic to scaffolding form additional dependencies to show them based on project type
- Added install react additional dependency to the scaffolding form visible for Application customizer
- Added Install, and Uninstall apps to a specified site action to app view
- Enhanced progress notifications with output window links for better user guidance to every CLI action
- Added action which allows to set form customizer
- Enhanced error handling in GitHub Copilot Chat participant
- Updated welcome view
- Updated VS Code typings and engine to latest

## [4.3.0] - 2024-12-11

- Added remove confirmation prompt when removing SPFx solution from app catalog
- Added /manage GitHub Chat command
- Added generating code tour for upgrade and validate SPFx solution actions
- Added upgrade SPFx project action
- Added SPFx Fast Serve optional dependency to the scaffolding form
- Improved sign in experience with caching of Client ID and Tenant ID

## [4.2.0] - 2024-10-19

- Included m365 prefix and log passed CLI command options
- Refactored to ensure types for settings
- Added a new project additional step to create or not the node version manager configuration file
- Added new VSCode setting createNodeVersionFileDefaultValue to define the default value of the new project additional step
- Added new VSCode setting nodeVersionManagerFile to specify which configuration file to be created
- Dynamic loading of children for ActionTreeItem
- Present solutions deployed per app catalog
- Allow to disable and enable a solution
- Allow to deploy and retract a solution
- Allow to remove a solution
- Clicking on app link should go to the solution appStore.aspx page
- Updated prompt grounding for /setup and /new
- Added new way to create new project together with Copilot

## [4.1.0] - 2024-09-28

- Added support for SPFx 1.20.0
- Updated missing scopes in the Entra App Registration
- Updated error handling in extension init
- Added guidance in tha scaffolding form for each SPFx project type
- Added more gulp tasks
- Added dedicated walkthrough for gulp tasks
- Updated extension to hide features that require sign in
- Updated action naming

## [4.0.0] - 2024-09-08

- Updated Sign in method
- Updated SPFx Intro and workspace setup walkthrough steps
- Updated readme assets
- Added form to create Entra App Registration required for sign in
- Added Extension filter dropdown to the sample gallery
- Updated account view to show the Entra App Registration
- Updated terminal usage to unified approach
- Updated release workflows
- Added settings to show and hide health incidents and tenant wide extensions

## [3.4.0] - 2024-07-18

- Improved welcome experience
- Fixed lags in sample gallery search
- Improved sample gallery filter functionalities
- Improved create project step in walkthrough

## [3.3.0] - 2024-06-16

- Refactored scaffolding form to smaller components
- Code house keeping
- Added missing ACE template DataVisualization for SPFx 1.19.0
- Added GitHub Copilot Chat participant for SPFx Toolkit

## [3.2.0] - 2024-05-12

- Added support for SPFx 1.19.0

## [3.1.0] - 2024-04-28

- Refactor the action naming
- Fixed bug when there's a space in the folder path causing serve

## [3.0.0] - 2024-03-31

- Added VS Code extension walkthrough
- Rebrand the extension to SharePoint Framework Toolkit
- Added support for picking either nvm or nvs for Node.js version management

## [2.6.0] - 2024-03-18

- Refactored and rebuilt the scaffolding process
- Added an additional dependency step in the scaffolding form
- Fixed bug in sample gallery filters
- Added Azure DevOps pipeline support
- Updated account and app catalog view
- Added tenant health information 
- Added tenant-wide extensions list

## [2.5.0] - 2024-02-05

- Refactored sample galleries to a single sample gallery
- Added detail view for sample
- Added filters to the sample gallery
- Added list view to sample gallery
- Added SharePoint Embedded VS Code extension to help and feedback links
- Refactored CI/CD action to be form based 
- Added the possibility to generate certificate and create a Entra ID app for the CI/CD pipeline

## [2.4.0] - 2023-11-29

- Added support for SPFx v1.18.2
- Added Teams Toolkit support
- Refactored help and feedback section to tree view adding new links to Teams Toolkit and ACE previewer
- Added ACE previewer checker to suggest this extension when ACE component is present in the project
- Modified CI/CD GitHub generate workflow action to present list of site level app catalogs
- Updated dependencies validation to check for latest version of yo

## [2.3.0] - 2023-11-16

- Updated dependencies validation to check for yo@4.3.1

## [2.2.0] - 2023-11-12

- Updated npm packages
- Added support for SPFx v1.18.1
- Updated CI/CD GitHub generate workflow action to use node 18 for SPFx 1.18.x and higher

## [2.1.0] - 2023-10-26

- Updated npm packages
- Updated product logo
- Refactored pipelines to replace npm package with local cleaned-up
version of CLI
- Refactored pipelines to use node v18
- Added new pipeline to create artifact with package
- Bug fix of Login after logout
- Bug fix to read sample data from main
- Added support for SPFx 1.18.0 (upgrade)
- Updated validate environment will validate node 16-18
- Updated scaffolding process (different flow for node 16 and 18, new
ACEs templates)

## [2.0.0] - 2023-09-15

- Added new rename action
- Extended environment details with site app catalog links
- Extended Deploy action to support site app catalog
- Added Grant API permissions action
- Added CI/CD GitHub generate workflow action
- Integrated SPFx Code Snippets
- Upgraded Help and Feedback section

## [1.1.0] - 2023-06-30

- Upgraded CLI for Microsoft 365 dependency to version v6.9
- Added support for SPFx v1.17.4

## [1.0.0] - 2023-05-31

- Major release

## [0.5.3] - 2023-05-29

- Added link to Microsoft 365 & Power Platform Community Discord Server
- Code maintenance

## [0.5.2] - 2023-05-13

- Added support for creating and managing SPFx solutions
- Added SPFx web part and extension samples views

## [0.5.1] - 2023-05-03

- Updated help and feedback section

## [0.5.0] - 2023-05-01

- Updated documentation and guidance

## [0.4.5] - 2023-04-30

- Maintenance release

## [0.4.2] - 2023-04-20

- Updated to use SharePoint Framework version 1.17.1
- Updated to use CLI for Microsoft 365 version 6.6

## [0.4.1] - 2023-03-09

- Maintenance release to fix bug caused by branch conflict

## [0.4] - 2023-03-09

- Sample and scenario listing improvements

## [0.3.2] - 2023-01-04

- Improved exception description when checking the installed Node.js version

## [0.3.1] - 2023-01-02

- Updated to use CLI for Microsoft 365 6.1 GA version

## [0.2.2] - 2022-12-29

- Small updates on the extension overview and releases

## [0.2.0] - 2022-12-28

- Updated to support SPFx 1.16.1 version
- Updated to use CLI for Microsoft 365 6.1.x beta version 
- Scenario samples updated to use latest SPFx version
- Internals updated to use npm for development type

## [0.0.1] - 2022-05-20

- First beta release