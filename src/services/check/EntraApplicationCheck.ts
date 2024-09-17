import { Logger } from '../dataType/Logger';
import { Notifications } from '../dataType/Notifications';
import { AuthProvider, M365AuthenticationSession } from '../../providers/AuthProvider';
import { env, Uri } from 'vscode';
import { EntraAppRegistration } from '../actions/EntraAppRegistration';


export class EntraApplicationCheck {

  /**
   * Validates the Entra App registration component for a given M365AuthenticationSession.
   * @param session - The M365AuthenticationSession to validate.
   * @returns A Promise that resolves when the validation is complete.
   * @throws An error if there is an issue validating the session.
   */
  public static async validateEntraAppRegistrationComponent(session: M365AuthenticationSession) {
    try {
      if (session.clientId === '31359c7f-bd7e-475c-86db-fdb8c937548e') {
        const answer = await Notifications.info('You are still using \'PnP Management Shell\' application as your login method. It is highly recommended to switch to your own single-tenant Entra App registration to grant the needed permissions for SPFx Toolkit.', 'Reauthenticate', 'More information');

        if (answer === 'More information') {
          env.openExternal(Uri.parse('https://github.com/pnp/vscode-viva/wiki/5.3-Login-to-your-tenant-&-retrieve-environment-details'));
        } else if (answer === 'Reauthenticate') {
          AuthProvider.logout();
          EntraAppRegistration.showRegisterEntraAppRegistrationPage();
        }
      }
    } catch (e) {
      Logger.error(`Error validating session Entra Application: ${e}`);
    }
  }
}