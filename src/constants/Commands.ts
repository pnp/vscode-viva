import { EXTENSION_NAME } from "./General";


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
  showSampleGallery: `${EXTENSION_NAME}.showSampleGallery`,

  // Serving
  serveSolution: `${EXTENSION_NAME}.serveSolution`,
}