import { window, commands, ProgressLocation, Progress } from 'vscode';
import { Extension } from '../dataType/Extension';
import { Subscription } from '../../models';
import { Commands, WebViewType } from '../../constants';
import { PnPWebview } from '../../webview/PnPWebview';
import { executeCommand } from '@pnp/cli-microsoft365';
import { Logger } from '../dataType/Logger';
import { Notifications } from '../dataType/Notifications';
import { EnvironmentInformation } from '../dataType/EnvironmentInformation';
import { AuthProvider } from '../../providers/AuthProvider';


export class EntraAppRegistration {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.registerEntraAppRegistration, EntraAppRegistration.showRegisterEntraAppRegistrationPage)
    );
  }

  //TODO: Add comment details
  public static async showRegisterEntraAppRegistrationPage() {
    PnPWebview.open(WebViewType.registerEntraAppRegistration);
  }

  public static async createEntraAppRegistration() {
    new Promise((resolve) => {
      window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Creating Entra App Registration. Please use the web browser that just has been opened to sign-in to your tenant.',
        cancellable: true
      }, async (progress: Progress<{ message?: string; increment?: number }>) => {
        await executeCommand('spfxToolkit', { output: 'json'}, {
          stdout: (message: string) => {
            try {
              const entraAppDetails = JSON.parse(message);
              Logger.info(`Created Entra App Registration: ${JSON.stringify(entraAppDetails)}`);
              EnvironmentInformation.tenantId = entraAppDetails.tenantId;
              EnvironmentInformation.clientId = entraAppDetails.appId;
            } catch (error) {
              Logger.error(`Creating Entra App Registration Error: ${message}`);
            }
            return;
          },
          stderr: (message: string) => {
            if (!message.includes('use the web browser')) {
              Logger.error(`Creating Entra App Registration Error: ${message}`);
            }
            return;
          }
        });

        Notifications.info('SPFx Toolkit App Registration created successfully');
        PnPWebview.close();
        AuthProvider.login();
      });
    });
  }
}