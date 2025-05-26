import { Extension } from './Extension';
import { commands, OutputChannel, window } from 'vscode';
import { Commands } from '../../constants';


export class Logger {
  private static instance: Logger;
  public static channel: OutputChannel | null = null;

  private constructor() {
    const title = Extension.getInstance().displayName;
    Logger.channel = window.createOutputChannel(title);
    commands.registerCommand(Commands.showOutputChannel, () => { Logger.channel?.show(); });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public static info(message: string, type: 'INFO' | 'WARNING' | 'ERROR' = 'INFO'): void {
    if (!Logger.channel) {
      Logger.getInstance();
    }

    Logger.channel?.appendLine(`[${new Date().toISOString()}] [${type}]
> ${message}`);
  }

  public static warning(message: string): void {
    Logger.info(message, 'WARNING');
  }

  public static error(message: string): void {
    Logger.info(message, 'ERROR');
  }
}