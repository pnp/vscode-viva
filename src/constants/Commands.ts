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

  // Gulp
  gulpBuildProject: `${EXTENSION_NAME}.gulpBuildProject`,
  gulpBundleProject: `${EXTENSION_NAME}.gulpBundleProject`,
  gulpCleanProject: `${EXTENSION_NAME}.gulpCleanProject`,
  gulpDeployToAzureStorage: `${EXTENSION_NAME}.gulpDeployToAzureStorage`,
  gulpPackageProject: `${EXTENSION_NAME}.gulpPackageProject`,
  gulpPublishProject: `${EXTENSION_NAME}.gulpPublishProject`,
  gulpServeProject: `${EXTENSION_NAME}.gulpServeProject`,
  gulpTestProject: `${EXTENSION_NAME}.gulpTestProject`,
  gulpTrustDevCert: `${EXTENSION_NAME}.gulpTrustDevCert`,

  // Heft
  heftBuildProject: `${EXTENSION_NAME}.heftBuildProject`,
  heftCleanProject: `${EXTENSION_NAME}.heftCleanProject`,
  heftDeployToAzureStorage: `${EXTENSION_NAME}.heftDeployToAzureStorage`,
  heftEjectProject: `${EXTENSION_NAME}.heftEjectProject`,
  heftPackageProject: `${EXTENSION_NAME}.heftPackageProject`,
  heftPublishProject: `${EXTENSION_NAME}.heftPublishProject`,
  heftStartProject: `${EXTENSION_NAME}.heftStartProject`,
  heftTestProject: `${EXTENSION_NAME}.heftTestProject`,
  heftTrustDevCert: `${EXTENSION_NAME}.heftTrustDevCert`,

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
  copyAppCatalogApp: `${EXTENSION_NAME}.copyAppCatalogApp`,
  moveAppCatalogApp: `${EXTENSION_NAME}.moveAppCatalogApp`,
  showMoreActions: `${EXTENSION_NAME}.showMoreActions`,

  // Bulk app catalog actions
  bulkDeployAppCatalogApps: `${EXTENSION_NAME}.bulkDeployAppCatalogApps`,
  bulkRetractAppCatalogApps: `${EXTENSION_NAME}.bulkRetractAppCatalogApps`,
  bulkRemoveAppCatalogApps: `${EXTENSION_NAME}.bulkRemoveAppCatalogApps`,
  bulkEnableAppCatalogApps: `${EXTENSION_NAME}.bulkEnableAppCatalogApps`,
  bulkDisableAppCatalogApps: `${EXTENSION_NAME}.bulkDisableAppCatalogApps`,
  bulkInstallAppCatalogApps: `${EXTENSION_NAME}.bulkInstallAppCatalogApps`,
  bulkUninstallAppCatalogApps: `${EXTENSION_NAME}.bulkUninstallAppCatalogApps`,
  bulkUpgradeAppCatalogApps: `${EXTENSION_NAME}.bulkUpgradeAppCatalogApps`,

  // App Catalog actions
  addTenantAppCatalog: `${EXTENSION_NAME}.addTenantAppCatalog`,
  addSiteAppCatalog: `${EXTENSION_NAME}.addSiteAppCatalog`,
  removeSiteAppCatalog: `${EXTENSION_NAME}.removeSiteAppCatalog`,

  // Set form customizer
  setFormCustomizer: `${EXTENSION_NAME}.setFormCustomizer`,

  // Tenant-wide extension actions
  removeTenantWideExtension: `${EXTENSION_NAME}.removeTenantWideExtension`,
  enableTenantWideExtension: `${EXTENSION_NAME}.enableTenantWideExtension`,
  disableTenantWideExtension: `${EXTENSION_NAME}.disableTenantWideExtension`,
  updateTenantWideExtension: `${EXTENSION_NAME}.updateTenantWideExtension`
};