import { commands, ThemeIcon, workspace, window, Terminal } from 'vscode';
import { Commands } from '../constants';
import { Subscription } from '../models';
import { Extension } from './Extension';
import { getPlatform } from '../utils';
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

  public static get shell() {
    return TerminalCommandExecuter.shellPath;
  }

  private static initShellPath() {
    const shell: string | { path: string } | undefined = TerminalCommandExecuter.getShellPath();

    if (typeof shell !== 'string' && !!shell) {
      TerminalCommandExecuter.shellPath = shell.path;
    } else {
      TerminalCommandExecuter.shellPath = shell || undefined;
    }
  }

  /**
   * Retrieve the automation profile for the current platform
   * @returns
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

  private static registerCommands(subscriptions: Subscription[]) {
    subscriptions.push(
      commands.registerCommand(Commands.executeTerminalCommand, TerminalCommandExecuter.runCommand)
    );
  }

  private static async createTerminal(name?: string, icon?: string): Promise<Terminal | undefined> {
    let terminal = window.terminals.find(t => t.name === name);

    if (!terminal) {
      terminal = window.createTerminal({
        name: name ? name : undefined,
        iconPath: icon ? new ThemeIcon(icon) : undefined
      });

      // Check the user's settings to see if they want to use nvm or nvs
      // Get the user's preferred node version manager -- nvm or nvs or none, if they don't want to use either
      const nodeVersionManager: string = TerminalCommandExecuter.getExtensionSettings('nodeVersionManager', 'nvm');

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
    }

    return terminal;
  }

  private static getExtensionSettings<T>(setting: string, defaultValue: T): T {
      return workspace.getConfiguration(EXTENSION_NAME).get<T>(setting, defaultValue);
  }

  private static async runInTerminal(command: string, terminal?: Terminal | undefined) {
    if (terminal) {
      terminal.show(true);
      terminal.sendText(` ${command}`);
    }
  }

  // eslint-disable-next-line no-unused-vars
  public static async runCommand(command: string, args: string[]) {
    const terminal = await TerminalCommandExecuter.createTerminal('Gulp task', 'tasks-list-configure');

    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let currentProjectPath = wsFolder.uri.fsPath;

      if (TeamsToolkitIntegration.isTeamsToolkitProject) {
        currentProjectPath = join(currentProjectPath, 'src');
      }

      TerminalCommandExecuter.runInTerminal(`cd ${currentProjectPath}`, terminal);
    }

    TerminalCommandExecuter.runInTerminal(command, terminal);
  }
}