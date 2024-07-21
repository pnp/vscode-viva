import { commands, ThemeIcon, workspace, window, Terminal } from 'vscode';
import { Commands, NodeVersionManagers } from '../constants';
import { Subscription } from '../models';
import { Extension } from './Extension';
import { getPlatform, getExtensionSettings } from '../utils';
import { TeamsToolkitIntegration } from './TeamsToolkitIntegration';
import { Folders } from './Folders';
import { join } from 'path';


interface ShellSetting {
  path: string;
}

export class TerminalCommandExecuter {
  private static shellPath: string | undefined = undefined;

  public static register() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;
    TerminalCommandExecuter.registerCommands(subscriptions);

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
   * Registers the commands for execution.
   * @param subscriptions - The array of subscriptions to add the registered command to.
   */
  private static registerCommands(subscriptions: Subscription[]) {
    subscriptions.push(
      commands.registerCommand(Commands.executeTerminalCommand, TerminalCommandExecuter.runCommand)
    );
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

  /**
   * Runs a command in the terminal.
   * @param command - The command to run.
   * @param args - The arguments for the command.
   */
  public static async runCommand(command: string, args: string[]) {
    const terminal = await TerminalCommandExecuter.createTerminal('Gulp task', 'tasks-list-configure');

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
}