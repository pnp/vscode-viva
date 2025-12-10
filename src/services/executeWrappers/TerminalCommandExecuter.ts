import { commands, ThemeIcon, workspace, window, Terminal, Disposable } from 'vscode';
import { Commands, NodeVersionManagers } from '../../constants';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { getPlatform, getExtensionSettings } from '../../utils';
import { M365AgentsToolkitIntegration } from '../dataType/M365AgentsToolkitIntegration';
import { Folders } from '../check/Folders';
import { join } from 'path';
import { ServeConfig } from '../../models/ServeConfig';
import { readFileSync } from 'fs';
import { Logger } from '../dataType/Logger';


interface ShellSetting {
  source?: string;
  path?: string;
}

export class TerminalCommandExecuter {
  private static shellPath: ShellSetting = {};

  public static register() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;
    subscriptions.push(
      commands.registerCommand(Commands.executeTerminalCommand, TerminalCommandExecuter.runCommand)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpServeProject, TerminalCommandExecuter.gulpServeProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftStartProject, TerminalCommandExecuter.heftStartProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpBundleProject, TerminalCommandExecuter.gulpBundleProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpPackageProject, TerminalCommandExecuter.gulpPackageProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftEjectProject, TerminalCommandExecuter.heftEjectProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftPackageProject, TerminalCommandExecuter.heftPackageProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpPublishProject, TerminalCommandExecuter.gulpPublishProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftPublishProject, TerminalCommandExecuter.heftPublishProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpCleanProject, TerminalCommandExecuter.gulpCleanProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftCleanProject, TerminalCommandExecuter.heftCleanProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpBuildProject, TerminalCommandExecuter.gulpBuildProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftBuildProject, TerminalCommandExecuter.heftBuildProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpTestProject, TerminalCommandExecuter.gulpTestProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftTestProject, TerminalCommandExecuter.heftTestProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpTrustDevCert, TerminalCommandExecuter.gulpTrustDevCert)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftTrustDevCert, TerminalCommandExecuter.heftTrustDevCert)
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpDeployToAzureStorage, TerminalCommandExecuter.gulpDeployToAzureStorage)
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftDeployToAzureStorage, TerminalCommandExecuter.heftDeployToAzureStorage)
    );

    TerminalCommandExecuter.initShellPath();
  }

  /**
   * Gets the shell path.
   * @returns The shell path.
   */
  public static get shell() {
    return TerminalCommandExecuter.shellPath;
  }

  /**
   * Runs the specified command in a new terminal.
   * @param command - The command to run.
   * @param terminalTitle - The title of the terminal.
   * @param terminalIcon - The icon of the terminal.
   */
  public static async runCommand(command: string, terminalTitle: string = 'Task', terminalIcon: string = 'tasks-list-configure') {
    const terminal = await TerminalCommandExecuter.createTerminal(terminalTitle, terminalIcon);

    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let currentProjectPath = wsFolder.uri.fsPath;

      if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
        currentProjectPath = join(currentProjectPath, 'src');
      }

      TerminalCommandExecuter.runInTerminal(`cd "${currentProjectPath}"`, terminal);
    }

    TerminalCommandExecuter.runInTerminal(command, terminal);
  }

  /**
   * Runs a command in a terminal and waits for it to complete.
   * @param command - The command to run.
   * @param terminalTitle - The title of the terminal.
   * @param terminalIcon - The icon of the terminal.
   * @returns A promise that resolves when the command completes with exit code 0, or rejects on non-zero exit.
   */
  public static async runCommandAndWait(command: string, terminalTitle: string = 'Task', terminalIcon: string = 'terminal'): Promise<void> {
    const terminal = await TerminalCommandExecuter.createTerminal(terminalTitle, terminalIcon);

    if (!terminal) {
      throw new Error('Failed to create terminal');
    }

    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let currentProjectPath = wsFolder.uri.fsPath;

      if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
        currentProjectPath = join(currentProjectPath, 'src');
      }

      terminal.sendText(`cd "${currentProjectPath}"`);
    }

    return new Promise<void>((resolve, reject) => {
      const disposable: Disposable = window.onDidCloseTerminal(async (closedTerminal) => {
        if (closedTerminal === terminal) {
          disposable.dispose();
          const exitStatus = await closedTerminal.exitStatus;
          if (exitStatus && exitStatus.code !== 0) {
            reject(new Error(`Command failed with exit code ${exitStatus.code}`));
          } else {
            resolve();
          }
        }
      });

      terminal.show(true);
      terminal.sendText(`${command}${TerminalCommandExecuter.getCommandChainOperator()} exit`);
    });
  }

  /**
   * Serves the project based on the user selected task type.
   */
  public static async gulpServeProject(): Promise<void> {
    const wsFolder = await Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return;
    }

    const serveTaskType = await TerminalCommandExecuter.serveTaskTypePrompt();
    if (!serveTaskType) {
      return;
    }

    switch (serveTaskType) {
      case 'Serve':
        commands.executeCommand(Commands.executeTerminalCommand, 'gulp serve');
        break;
      case 'Serve (no browser)':
        commands.executeCommand(Commands.executeTerminalCommand, 'gulp serve --nobrowser');
        break;
      case 'Serve from configuration':
        await TerminalCommandExecuter.serveFromConfiguration('gulp serve --config=');
        break;
    }
  }

  /**
   * Start the project based on the user selected task type.
   */
  public static async heftStartProject(): Promise<void> {
    const wsFolder = await Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return;
    }

    const startTaskType = await TerminalCommandExecuter.startTaskTypePrompt();
    if (!startTaskType) {
      return;
    }

    switch (startTaskType) {
      case 'Start':
        commands.executeCommand(Commands.executeTerminalCommand, 'npx heft start');
        break;
      case 'Start (no browser)':
        commands.executeCommand(Commands.executeTerminalCommand, 'npx heft start --nobrowser');
        break;
      case 'Start from configuration':
        await TerminalCommandExecuter.serveFromConfiguration('npx heft start --serve-config=');
        break;
    }
  }

  /**
   * Serves the project by executing the specified configuration using Gulp.
   * Prompts the user to select a configuration from the serve.json file.
   */
  public static async serveFromConfiguration(startCommand: string) {
    const configNames = await TerminalCommandExecuter.getServeConfigNames();

    const answer = await window.showQuickPick(configNames, {
      title: 'Select the configuration to serve',
      ignoreFocusOut: true
    });

    if (!answer) {
      return;
    }

    commands.executeCommand(Commands.executeTerminalCommand, `${startCommand}${answer}`);
  }

  /**
   * Bundles the project based on the environment type selected by the user.
   */
  public static async gulpBundleProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `gulp bundle${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Heft command to eject the project
   */
  public static async heftEjectProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'npx heft eject-webpack');
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Gulp command to package the project based on the user's selection.
   */
  public static async gulpPackageProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `gulp package-solution${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Heft command to package the project based on the user's selection.
   */
  public static async heftPackageProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `npx heft package-solution${answer === 'local' ? '' : ' --production'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Gulp command to publish (bundle & package) the project based on the user's selection.
   */
  public static async gulpPublishProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      const cmdChainOperator = TerminalCommandExecuter.getCommandChainOperator();
      commands.executeCommand(Commands.executeTerminalCommand, `gulp bundle${answer === 'local' ? '' : ' --ship'}${cmdChainOperator} gulp package-solution${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Heft command to publish (build & package) the project based on the user's selection.
   */
  public static async heftPublishProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      const cmdChainOperator = TerminalCommandExecuter.getCommandChainOperator();
      commands.executeCommand(Commands.executeTerminalCommand, `npx heft build${answer === 'local' ? '' : ' --production'}${cmdChainOperator} npx heft package-solution${answer === 'local' ? '' : ' --production'}`);
    }
  }

  /**
   * Gets the names of the serve configurations from the serve.json file.
   */
  private static async getServeConfigNames(): Promise<string[]> {
    const wsFolder = await Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return [];
    }

    const serveFiles = await workspace.findFiles('config/serve.json', '**/node_modules/**');
    const serveFile = serveFiles && serveFiles.length > 0 ? serveFiles[0] : null;

    if (!serveFile) {
      return [];
    }

    const serveFileContents = readFileSync(serveFile.fsPath, 'utf8');
    const serveFileData: ServeConfig = JSON.parse(serveFileContents);

    if (!serveFileData.serveConfigurations || typeof serveFileData.serveConfigurations !== 'object') {
      Logger.warning('The serve.json file does not contain any serve configurations.');
      return [];
    }

    return Object.keys(serveFileData.serveConfigurations);
  }

  /**
   * Prompts the user to select the target environment type.
   */
  private static async environmentTypePrompt(): Promise<string | undefined> {
    return await window.showQuickPick(['local', 'production'], {
      title: 'Select the target environment',
      ignoreFocusOut: true
    });
  }

  /**
   * Cleans the project by executing the Gulp clean command.
   */
  private static gulpCleanProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp clean');
  }

  /**
   * Cleans the project by executing the Heft clean command.
   */
  private static heftCleanProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'npx heft clean');
  }

  /**
   * Builds the project by executing the Gulp build command.
  */
  private static gulpBuildProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp build');
  }

  /**
   * Builds the project by executing the Heft build command.
  */
  private static async heftBuildProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `npx heft build${answer === 'local' ? '' : ' --production'}`);
    }
  }

  /**
   * Tests the project by executing the Gulp test command.
  */
  private static gulpTestProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp test');
  }

  /**
   * Tests the project by executing the Heft test command.
  */
  private static heftTestProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'npx heft test');
  }

  /**
   * Trusts the development certificate by executing the Gulp trust-dev-cert command.
  */
  private static gulpTrustDevCert() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp trust-dev-cert');
  }

  /**
   * Trusts the development certificate by executing the Heft trust-dev-cert command.
  */
  private static heftTrustDevCert() {
    commands.executeCommand(Commands.executeTerminalCommand, 'npx heft trust-dev-cert');
  }

  /**
   * Deploys to Azure CDN by executing the Gulp deploy-to-azure-storage command.
  */
  private static gulpDeployToAzureStorage() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp deploy-azure-storage');
  }

  /**
   * Deploys to Azure CDN by executing the Heft deploy-azure-storage command.
  */
  private static heftDeployToAzureStorage() {
    commands.executeCommand(Commands.executeTerminalCommand, 'npx heft deploy-azure-storage');
  }

  /**
   * Initializes the shell path for executing terminal commands.
   * If the shell path is an object with a `path` property, it sets the `shellPath` to that value.
   * If the shell path is a string, it sets the `shellPath` to that value.
   * If the shell path is undefined, it sets the `shellPath` to undefined.
   */
  private static initShellPath() {
    const shell: string | ShellSetting | undefined = TerminalCommandExecuter.getShellPath();

    if (typeof shell !== 'string' && !!shell) {
      TerminalCommandExecuter.shellPath = shell;
    } else {
      TerminalCommandExecuter.shellPath.path = shell || undefined;
    }
  }

  /**
   * Prompts the user to select the serve task type.
   */
  private static async serveTaskTypePrompt(): Promise<string | undefined> {
    const configNames = await TerminalCommandExecuter.getServeConfigNames();
    const options = ['Serve', 'Serve (no browser)'];
    if (configNames.length > 1) {
      options.push('Serve from configuration');
    }
    return await window.showQuickPick(options, {
      title: 'Select the serve type',
      ignoreFocusOut: true
    });
  }

  /**
   * Prompts the user to select the start task type.
   */
  private static async startTaskTypePrompt(): Promise<string | undefined> {
    const configNames = await TerminalCommandExecuter.getServeConfigNames();
    const options = ['Start', 'Start (no browser)'];
    if (configNames.length > 1) {
       options.push('Start from configuration');
    }
    return await window.showQuickPick(options, {
      title: 'Select the start type',
      ignoreFocusOut: true
    });
  }

  /**
   * Retrieves the shell path or shell setting based on the current platform.
   * @returns The shell path or shell setting for the current platform, or undefined if not found.
   */
  private static getShellPath(): string | ShellSetting | undefined {
    const platform = getPlatform();
    const terminalSettings = workspace.getConfiguration('terminal');

    const automationProfile = terminalSettings.get<string | ShellSetting>(`integrated.automationProfile.${platform}`);
    if (!!automationProfile) {
      return automationProfile;
    }

    const defaultProfile = terminalSettings.get<string>(`integrated.defaultProfile.${platform}`);
    const profiles = terminalSettings.get<{ [prop: string]: ShellSetting }>(`integrated.profiles.${platform}`);

    if (defaultProfile && profiles && profiles[defaultProfile]) {
      return profiles[defaultProfile];
    }

    return terminalSettings.get(`integrated.shell.${platform}`);
  }

  /**
   * Creates a new terminal with the specified name and icon.
   * If a terminal with the same name already exists, it returns that terminal instead.
   * If the user's settings specify to use a specific node version manager (nvm or nvs),
   * it checks for the presence of .nvmrc files and sets the appropriate node version manager command.
   * @param name - The name of the terminal.
   * @param icon - The path to the icon for the terminal.
   * @returns A promise that resolves to the created terminal or the existing terminal with the same name.
   */
  private static async createTerminal(name?: string, icon?: string): Promise<Terminal | undefined> {
    let terminal = window.terminals.find(t => t.name === name);

    if (!terminal) {
      terminal = window.createTerminal({
        name: name ? name : undefined,
        iconPath: icon ? new ThemeIcon(icon) : undefined
      });

      // Check the user's settings to see if they want to use nvm or nvs
      // Get the user's preferred node version manager -- nvm or nvs or none, if they don't want to use either
      const nodeVersionManager: string = getExtensionSettings('nodeVersionManager', 'nvm');

      // Check if nvm is used
      const nvmFiles = await workspace.findFiles('.nvmrc', '**/node_modules/**');

      // If there are .nvmrc files and the user wants to use nvm, then use their preferred node version manager
      if (nvmFiles.length > 0 && nodeVersionManager !== NodeVersionManagers.none) {
        if (nodeVersionManager === NodeVersionManagers.nvs) {
          terminal.sendText('nvs use');
        } else {
          terminal.sendText('nvm use');
        }
      }
    }

    return terminal;
  }

  /**
   * Runs a command in the specified terminal.
   * @param command - The command to run.
   * @param terminal - The terminal in which to run the command.
   */
  private static async runInTerminal(command: string, terminal?: Terminal | undefined) {
    if (terminal) {
      terminal.show(true);
      terminal.sendText(` ${command}`);
    }
  }

  private static getCommandChainOperator(): string {
    const shell = TerminalCommandExecuter.shell || '';

    if (shell.path?.includes('PowerShell') || shell.path?.includes('pwsh') || shell.source?.includes('PowerShell') || shell.source?.includes('pwsh')) {
      return ';';
    }

    return ' &&';
  }
}