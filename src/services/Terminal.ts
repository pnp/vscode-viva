import * as os from "os";
import { commands, ThemeIcon, workspace } from "vscode";
import { Commands } from "../constants";
import { Subscription } from "../models";
import { window } from "vscode";
import { Extension } from "./Extension";

interface ShellSetting {
  path: string;
}

export class Terminal {
  private static shellPath: string | undefined = undefined;

  public static register() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;
    Terminal.registerCommands(subscriptions);

    Terminal.initShellPath();
  }

  public static get shell() {
    return Terminal.shellPath;
  }

  private static initShellPath() {
    let shell: string | { path: string } | undefined = Terminal.getShellPath();

    if (typeof shell !== "string" && !!shell) {
      Terminal.shellPath = shell.path;
    } else {
      Terminal.shellPath = shell || undefined;
    }
  }

  /**
   * Retrieve the automation profile for the current platform
   * @returns 
   */
  private static getShellPath(): string | ShellSetting | undefined {
    const platform = Terminal.getPlatform();
    const terminalSettings = workspace.getConfiguration("terminal");

    const automationProfile = terminalSettings.get<string | ShellSetting>(`integrated.automationProfile.${platform}`);
    if (!!automationProfile) {
      return automationProfile;
    }

    const defaultProfile = terminalSettings.get<string>(`integrated.defaultProfile.${platform}`)
    const profiles = terminalSettings.get<{ [prop: string ]: ShellSetting}>(`integrated.profiles.${platform}`);

    if (defaultProfile && profiles && profiles[defaultProfile]) {
      return profiles[defaultProfile];
    }
    
    return terminalSettings.get(`integrated.shell.${platform}`);
  }

  /**
   * Get the platform name
   * @returns 
   */
  private static getPlatform(): "windows" | "linux" | "osx" {
    const platform = os.platform();
    if (platform === "win32") {
      return "windows";
    } else if (platform === "darwin") {
      return "osx";
    } else {
      return "linux";
    }
  }

  private static registerCommands(subscriptions: Subscription[]) {
    subscriptions.push(
      commands.registerCommand(Commands.executeTerminalCommand, Terminal.runCommand)
    );
  }

  public static async runCommand(command: string, args: string[]) {
    Terminal.runInTerminal(command, 'Gulp task', 'tasks-list-configure');
  }

  public static runInTerminal(command: string, name?: string, icon?: string) {
    let terminal = window.terminals.find(t => t.name === name);

    if (!terminal) {
      terminal = window.createTerminal({
        name: name ? name : undefined,
        iconPath: icon ? new ThemeIcon(icon) : undefined
      });
    }

    if (terminal) {
      terminal.sendText(command);
      terminal.show(true);
    }
  }
}