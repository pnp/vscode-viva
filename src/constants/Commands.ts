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
  upgradeSolution: `${EXTENSION_NAME}.upgradeSolution`,

  // Deployment
  deploySolution: `${EXTENSION_NAME}.deploySolution`,

  // Validation
  validateSolution: `${EXTENSION_NAME}.validateSolution`,

  // Webviews
  showACESampleGallery: `${EXTENSION_NAME}.showACESampleGallery`,
  showACEScenariosGallery: `${EXTENSION_NAME}.showACEScenariosGallery`,
  showExtensionsSampleGallery: `${EXTENSION_NAME}.showExtensionsSampleGallery`,
  showWebpartSampleGallery: `${EXTENSION_NAME}.showWebpartSampleGallery`,

  // Serving
  serveSolution: `${EXTENSION_NAME}.serveSolution`,
};