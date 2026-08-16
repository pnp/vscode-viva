import { ConfigurationTarget, ExtensionContext, workspace } from 'vscode';
import { EXTENSION_NAME } from '../../constants';
import { AppRegistration } from '../../models';
import { getExtensionSettings } from '../../utils/getExtensionSettings';
import { isValidGUID } from '../../utils/validateGuid';


const SETTING_NAME = 'appRegistrations';
const LAST_USED_KEY = 'lastUsedAppRegistration';
const LEGACY_CLIENT_ID_KEY = 'clientId';
const LEGACY_TENANT_ID_KEY = 'tenantId';

export class AppRegistrations {

  /**
   * Retrieves all valid app registrations stored in the extension settings.
   * @returns The list of saved app registrations.
   */
  public static getAll(): AppRegistration[] {
    const registrations = getExtensionSettings<AppRegistration[]>(SETTING_NAME, []) ?? [];
    return registrations.filter(registration =>
      registration &&
      isValidGUID(registration.clientId) &&
      isValidGUID(registration.tenantId)
    );
  }

  /**
   * Saves the app registration in the extension settings. An existing entry with the same client and tenant ID is updated.
   * @param registration - The app registration to save.
   */
  public static async save(registration: AppRegistration): Promise<void> {
    const registrations = AppRegistrations.getAll();
    const existingIndex = registrations.findIndex(item => AppRegistrations.isSame(item, registration));

    if (existingIndex > -1) {
      registrations[existingIndex] = registration;
    } else {
      registrations.push(registration);
    }

    await AppRegistrations.update(registrations);
  }

  /**
   * Removes the app registration from the extension settings.
   * @param registration - The app registration to remove.
   */
  public static async remove(registration: AppRegistration): Promise<void> {
    const registrations = AppRegistrations.getAll().filter(item => !AppRegistrations.isSame(item, registration));
    await AppRegistrations.update(registrations);
  }

  /**
   * Retrieves the app registration which was used to sign in the last time.
   * @param context - The extension context.
   * @returns The last used app registration or undefined when there is none.
   */
  public static getLastUsed(context: ExtensionContext): AppRegistration | undefined {
    const clientId = context.globalState.get<string>(LAST_USED_KEY);
    if (!clientId) {
      return undefined;
    }

    return AppRegistrations.getAll().find(item => item.clientId.toLowerCase() === clientId.toLowerCase());
  }

  /**
   * Stores the app registration as the one used the last time to sign in.
   * @param context - The extension context.
   * @param registration - The app registration used to sign in.
   */
  public static async setLastUsed(context: ExtensionContext, registration: AppRegistration): Promise<void> {
    await context.globalState.update(LAST_USED_KEY, registration.clientId);
  }

  /**
   * Moves the client and tenant ID stored by previous versions of the extension into the saved app registrations.
   * @param context - The extension context.
   */
  public static async migrateLegacy(context: ExtensionContext): Promise<void> {
    const clientId = context.globalState.get<string>(LEGACY_CLIENT_ID_KEY);
    const tenantId = context.globalState.get<string>(LEGACY_TENANT_ID_KEY);

    if (!clientId || !tenantId) {
      return;
    }

    if (isValidGUID(clientId) && isValidGUID(tenantId)) {
      const registration: AppRegistration = { name: 'Default', clientId, tenantId };
      await AppRegistrations.save(registration);
      await AppRegistrations.setLastUsed(context, registration);
    }

    await context.globalState.update(LEGACY_CLIENT_ID_KEY, undefined);
    await context.globalState.update(LEGACY_TENANT_ID_KEY, undefined);
  }

  private static isSame(first: AppRegistration, second: AppRegistration): boolean {
    return first.clientId.toLowerCase() === second.clientId.toLowerCase() &&
      first.tenantId.toLowerCase() === second.tenantId.toLowerCase();
  }

  private static async update(registrations: AppRegistration[]): Promise<void> {
    await workspace.getConfiguration(EXTENSION_NAME).update(SETTING_NAME, registrations, ConfigurationTarget.Global);
  }
}
