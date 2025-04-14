import { commands, ThemeIcon, workspace, window, Terminal } from 'vscode';
import { Commands, NodeVersionManagers } from '../../constants';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { getPlatform, getExtensionSettings } from '../../utils';
import { TeamsToolkitIntegration } from '../dataType/TeamsToolkitIntegration';
import { Folders } from '../check/Folders';
import { join } from 'path';
import { ServeConfig } from '../../models/ServeConfig';
import { readFileSync } from 'fs';
import { Logger } from '../dataType/Logger';


interface ShellSetting {
  path: string;
}

export class TerminalCommandExecuter {
  private static shellPath: string | undefined = undefined;

  public static register() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;
    subscriptions.push(
      commands.registerCommand(Commands.serveProject, TerminalCommandExecuter.serveProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.bundleProject, TerminalCommandExecuter.bundleProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.packageProject, TerminalCommandExecuter.packageProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.publishProject, TerminalCommandExecuter.publishProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.executeTerminalCommand, TerminalCommandExecuter.runCommand)
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
  public static async runCommand(command: string, terminalTitle: string = 'Gulp task', terminalIcon: string = 'tasks-list-configure') {
    const terminal = await TerminalCommandExecuter.createTerminal(terminalTitle, terminalIcon);

    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let currentProjectPath = wsFolder.uri.fsPath;

      if (TeamsToolkitIntegration.isTeamsToolkitProject) {
        currentProjectPath = join(currentProjectPath, 'src');
      }

      TerminalCommandExecuter.runInTerminal(`cd "${currentProjectPath}"`, terminal);
    }

    TerminalCommandExecuter.runInTerminal(command, terminal);
  }

  /**
   * Serves the project based on the user selected task type.
   */
  public static async serveProject(): Promise<void> {
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
        TerminalCommandExecuter.serveFromConfiguration();
        break;
    }
  }

  /**
   * Serves the project by executing the specified configuration using Gulp.
   * Prompts the user to select a configuration from the serve.json file.
   */
  public static async serveFromConfiguration() {
    const configNames = await TerminalCommandExecuter.getServeConfigNames();

    const answer = await window.showQuickPick(configNames, {
      title: 'Select the configuration to serve',
      ignoreFocusOut: true
    });

    if (!answer) {
      return;
    }

    commands.executeCommand(Commands.executeTerminalCommand, `gulp serve --config=${answer}`);
  }

  /**
   * Bundles the project based on the environment type selected by the user.
   */
  public static async bundleProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `gulp bundle${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Gulp command to package the project based on the user's selection.
   */
  public static async packageProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `gulp package-solution${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Gulp command to publish (bundle & package) the project based on the user's selection.
   */
  public static async publishProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `gulp bundle${answer === 'local' ? '' : ' --ship'} && gulp package-solution${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Gets the names of the serve configurations from the serve.json file.
   */
  private static async getServeConfigNames(): Promise<string[]> {
    const wsFolder = Folders.getWorkspaceFolder();
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
   * Initializes the shell path for executing terminal commands.
   * If the shell path is an object with a `path` property, it sets the `shellPath` to that value.
   * If the shell path is a string, it sets the `shellPath` to that value.
   * If the shell path is undefined, it sets the `shellPath` to undefined.
   */
  private static initShellPath() {
    const shell: string | { path: string } | undefined = TerminalCommandExecuter.getShellPath();

    if (typeof shell !== 'string' && !!shell) {
      TerminalCommandExecuter.shellPath = shell.path;
    } else {
      TerminalCommandExecuter.shellPath = shell || undefined;
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
}