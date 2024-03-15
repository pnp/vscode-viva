import { EXTENSION_NAME } from './General';


export const Commands = {
  // Authentication
  login: `${EXTENSION_NAME}.login`,
  logout: `${EXTENSION_NAME}.logout`,

  // Dependencies
  checkDependencies: `${EXTENSION_NAME}.checkDependencies`,
  installDependencies: `${EXTENSION_NAME}.installDependencies`,

  // Scaffolding
  createProject: `${EXTENSION_NAME}.createProject`,
  addToProject: `${EXTENSION_NAME}.addToProject`,

  // Output channel
  showOutputChannel: `${EXTENSION_NAME}.showOutputChannel`,

  // Execute terminal commands
  executeTerminalCommand: `${EXTENSION_NAME}.executeTerminalCommand`,

  // Upgrade
  upgradeProject: `${EXTENSION_NAME}.upgradeProject`,

  // Deployment
  deployProject: `${EXTENSION_NAME}.deployProject`,

  // Validation
  validateProject: `${EXTENSION_NAME}.validateProject`,

  // Rename
  renameProject: `${EXTENSION_NAME}.renameProject`,

  // Grant API permissions
  grantAPIPermissions: `${EXTENSION_NAME}.grantAPIPermissions`,

  // Generate a CI/CD workflow
  pipeline: `${EXTENSION_NAME}.pipeline`,

  // Webviews
  samplesGallery: `${EXTENSION_NAME}.samplesGallery`,

  // Serving
  serveProject: `${EXTENSION_NAME}.serveProject`,

  // TreeViews
  refreshAppCatalogTreeView: `${EXTENSION_NAME}.refreshAppCatalogTreeView`,
  refreshAccountTreeView: `${EXTENSION_NAME}.refreshAccountTreeView`,
};