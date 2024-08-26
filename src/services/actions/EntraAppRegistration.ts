import { commands } from 'vscode';
import { Extension } from '../dataType/Extension';
import { Subscription } from '../../models';
import { Commands, WebViewType } from '../../constants';
import { PnPWebview } from '../../webview/PnPWebview';


export class EntraAppRegistration {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.registerEntraAppRegistration, EntraAppRegistration.showRegisterEntraAppRegistrationPage)
    );
  }

  //TODO: Add comment details
  private static async showRegisterEntraAppRegistrationPage() {
    /* TODO: Show webview with guidance and methods to register an Entra app
    and cache the client ID and tenant ID of the created app for the login method if possible*/
    PnPWebview.open(WebViewType.registerEntraAppRegistration);
  }
}