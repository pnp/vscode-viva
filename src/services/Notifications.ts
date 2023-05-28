import { window } from 'vscode';
import { Extension } from './Extension';
import { Logger } from './Logger';


export class Notifications {

  public static info(message: string, ...items: any): Thenable<string | undefined> {
    Logger.info(`${message}`, 'INFO');

    return window.showInformationMessage(`${Extension.getInstance().displayName}: ${message}`, ...items);
  }

  public static warning(message: string, ...items: any): Thenable<string | undefined> {
    Logger.info(`${message}`, 'WARNING');

    return window.showWarningMessage(`${Extension.getInstance().displayName}: ${message}`, ...items);
  }

  public static error(message: string, ...items: any): Thenable<string | undefined> {
    Logger.info(`${message}`, 'ERROR');

    return window.showErrorMessage(`${Extension.getInstance().displayName}: ${message}`, ...items);
  }

  public static errorNoLog(message: string, ...items: any): Thenable<string | undefined> {
    return window.showErrorMessage(`${Extension.getInstance().displayName}: ${message}`, ...items);
  }
}