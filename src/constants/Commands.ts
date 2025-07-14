import { EXTENSION_NAME } from './General';


export const Commands = {
  // Authentication
  login: `${EXTENSION_NAME}.login`,
  logout: `${EXTENSION_NAME}.logout`,
  registerEntraAppRegistration: `${EXTENSION_NAME}.registerEntraAppRegistration`,

  // Dependencies
  checkDependencies: `${EXTENSION_NAME}.checkDependencies`,
  installDependencies: `${EXTENSION_NAME}.installDependencies`,

  // Scaffolding
  createProject: `${EXTENSION_NAME}.createProject`,
  addToProject: `${EXTENSION_NAME}.addToProject`,
  createProjectCopilot: `${EXTENSION_NAME}.createProjectCopilot`,

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

  // Increase version
  increaseVersion: `${EXTENSION_NAME}.increaseVersion`,

  // Grant API permissions
  grantAPIPermissions: `${EXTENSION_NAME}.grantAPIPermissions`,

  // Generate a CI/CD workflow
  pipeline: `${EXTENSION_NAME}.pipeline`,

  // Webviews
  samplesGallery: `${EXTENSION_NAME}.samplesGallery`,

  // Bundle
  bundleProject: `${EXTENSION_NAME}.bundleProject`,

  // Package
  packageProject: `${EXTENSION_NAME}.packageProject`,

  // Publish
  publishProject: `${EXTENSION_NAME}.publishProject`,

  // Serving
  serveProject: `${EXTENSION_NAME}.serveProject`,

  // Clean
  cleanProject: `${EXTENSION_NAME}.cleanProject`,

  // Build
  buildProject: `${EXTENSION_NAME}.buildProject`,

  // Test
  testProject: `${EXTENSION_NAME}.testProject`,

  // Trust dev cert
  trustDevCert: `${EXTENSION_NAME}.trustDevCert`,

  // Deploy to Azure Storage
  deployToAzureStorage: `${EXTENSION_NAME}.deployToAzureStorage`,

  // TreeViews
  refreshAppCatalogTreeView: `${EXTENSION_NAME}.refreshAppCatalogTreeView`,
  refreshAccountTreeView: `${EXTENSION_NAME}.refreshAccountTreeView`,

  // Welcome
  welcome: `${EXTENSION_NAME}.welcome`,

  //Copilot
  openCopilot: `${EXTENSION_NAME}.openCopilot`,

  // App actions
  deployAppCatalogApp: `${EXTENSION_NAME}.deployAppCatalogApp`,
  retractAppCatalogApp: `${EXTENSION_NAME}.retractAppCatalogApp`,
  removeAppCatalogApp: `${EXTENSION_NAME}.removeAppCatalogApp`,
  enableAppCatalogApp: `${EXTENSION_NAME}.enableAppCatalogApp`,
  disableAppCatalogApp: `${EXTENSION_NAME}.disableAppCatalogApp`,
  upgradeAppCatalogApp: `${EXTENSION_NAME}.upgradeAppCatalogApp`,
  installAppCatalogApp: `${EXTENSION_NAME}.installAppCatalogApp`,
  uninstallAppCatalogApp: `${EXTENSION_NAME}.uninstallAppCatalogApp`,
  showMoreActions: `${EXTENSION_NAME}.showMoreActions`,

  // App Catalog actions
  addTenantAppCatalog: `${EXTENSION_NAME}.addTenantAppCatalog`,
  addSiteAppCatalog: `${EXTENSION_NAME}.addSiteAppCatalog`,
  removeSiteAppCatalog: `${EXTENSION_NAME}.removeSiteAppCatalog`,

  // Set form customizer
  setFormCustomizer: `${EXTENSION_NAME}.setFormCustomizer`,

  // Tenant-wide extension actions
  removeTenantWideExtension: `${EXTENSION_NAME}.removeTenantWideExtension`,
  enableTenantWideExtension: `${EXTENSION_NAME}.enableTenantWideExtension`,
  disableTenantWideExtension: `${EXTENSION_NAME}.disableTenantWideExtension`
};