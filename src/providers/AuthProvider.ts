import { EnvironmentInformation } from '../services/dataType/EnvironmentInformation';
import { env, authentication, AuthenticationProvider, AuthenticationProviderAuthenticationSessionsChangeEvent, AuthenticationSession, AuthenticationSessionAccountInformation, commands, Disposable, Event, EventEmitter, ProgressLocation, window, Progress, QuickInputButton, QuickPickItem, QuickPickItemKind, ThemeIcon } from 'vscode';
import * as vscode from 'vscode';
import { Commands } from '../constants';
import { Logger } from '../services/dataType/Logger';
import { Notifications } from '../services/dataType/Notifications';
import { Extension } from '../services/dataType/Extension';
import { executeCommand } from '@pnp/cli-microsoft365-spfx-toolkit';
import { exec } from 'child_process';
import { Folders } from '../services/check/Folders';
import { TerminalCommandExecuter } from '../services/executeWrappers/TerminalCommandExecuter';
import { isValidGUID } from '../utils/validateGuid';
import { CliExecuter } from '../services/executeWrappers/CliCommandExecuter';
import { EntraAppRegistration } from '../services/actions/EntraAppRegistration';
import { AppRegistrations } from '../services/dataType/AppRegistrations';
import { AppRegistration } from '../models';


const SIGN_IN_TITLE = 'SPFx Toolkit needs an Entra App Registration in order to grant the required permissions when signing in to your tenant. Pick one of the saved app registrations, provide the client ID and tenant ID of an existing one or create a new one.';

interface AppRegistrationQuickPickItem extends QuickPickItem {
  registration?: AppRegistration;
  action?: 'manual' | 'create';
}


export class M365AuthenticationSession implements AuthenticationSession {
  public readonly id = AuthProvider.id;
  public readonly scopes = []; // Scopes are not needed for the M365 CLI
  public readonly accessToken: string = ''; // Scopes are not needed for the M365 CLI
  public tenantId: string = '';
  public clientId: string = '';

  constructor(public readonly account: AuthenticationSessionAccountInformation) { }
}

export class AuthProvider implements AuthenticationProvider, Disposable {
  public static readonly id = 'm365-pnp-auth-dev';
  public static instance: AuthProvider;
  public static reSignIn = false;

  private static context: vscode.ExtensionContext;
  private onDidChangeEventEmit = new EventEmitter<AuthenticationProviderAuthenticationSessionsChangeEvent>();
  private initializedDisposable: Disposable | undefined;

  /**
   * Registers the authentication provider and associated commands.
   */
  public static register(context: vscode.ExtensionContext) {
    AuthProvider.context = context;
    const ext = Extension.getInstance();
    const subscriptions = ext.subscriptions;

    AuthProvider.instance = new AuthProvider();

    subscriptions.push(
      authentication.registerAuthenticationProvider(
        AuthProvider.id,
        'CLI for Microsoft 365 Authentication',
        AuthProvider.instance
      )
    );

    subscriptions.push(
      commands.registerCommand(Commands.login, AuthProvider.signIn)
    );
    subscriptions.push(
      commands.registerCommand(Commands.logout, AuthProvider.logout)
    );
  }

  /**
   * Returns the singleton instance of the AuthProvider class.
   * @returns The singleton instance of the AuthProvider class.
   */
  public static getInstance(): AuthProvider {
    return AuthProvider.instance;
  }

  /**
   * Verifies the authentication status.
   * Calls the `login` method of the `AuthProvider` class with `false` as the argument.
   */
  public static verify() {
    AuthProvider.login(false);
  }

  public static async signIn(createIfNone: boolean = true) {
    const selection = await AuthProvider.pickAppRegistration();

    if (!selection) {
      return;
    }

    if (selection.action === 'create') {
      EntraAppRegistration.showRegisterEntraAppRegistrationPage();
      return;
    }

    if (selection.registration) {
      EnvironmentInformation.clientId = selection.registration.clientId;
      EnvironmentInformation.tenantId = selection.registration.tenantId;
      await AppRegistrations.setLastUsed(AuthProvider.context, selection.registration);

      await authentication.getSession(AuthProvider.id, [], { createIfNone });
      return;
    }

    const clientId = await window.showInputBox({
      title: 'Specify the application (client) ID',
      value: EnvironmentInformation.clientId ?? '',
      ignoreFocusOut: true,
      prompt: 'Please provide the \'Application (client) ID\' of the Entra app registration. If you don\'t have the app registration yet, create one using the \'Create a new Entra app registration\' option.',
      validateInput: async (value) => {
        if (!value) {
          return 'Client ID is required';
        }

        if (!isValidGUID(value)) {
          return 'Client ID is not a valid GUID';
        }

        return undefined;
      }
    });

    if (!clientId) {
      Logger.error('Client ID is required');
      EnvironmentInformation.clientId = undefined;
      throw new Error('Client ID is required');
    }

    const tenantId = await window.showInputBox({
      title: 'Specify the tenant ID',
      value: EnvironmentInformation.tenantId ?? '',
      ignoreFocusOut: true,
      prompt: 'Please provide GUID of your tenant which may be found as \'Directory (tenant) ID\' Entra app registration overview',
      validateInput: async (value) => {
        if (!value) {
          return 'Tenant ID is required';
        }

        if (!isValidGUID(value)) {
          return 'Tenant ID is not a valid GUID';
        }

        return undefined;
      }
    });

    if (!tenantId) {
      Logger.error('Tenant ID is required');
      EnvironmentInformation.clientId = undefined;
      EnvironmentInformation.tenantId = undefined;
      throw new Error('Tenant ID is required');
    }

    const registration = await AuthProvider.nameAppRegistration({ clientId, tenantId });

    EnvironmentInformation.clientId = clientId;
    EnvironmentInformation.tenantId = tenantId;
    await AppRegistrations.save(registration);
    await AppRegistrations.setLastUsed(AuthProvider.context, registration);

    await authentication.getSession(AuthProvider.id, [], { createIfNone });
  }

  /**
   * Asks the user for an optional friendly name for the app registration.
   * @param registration - The app registration to name.
   * @returns The app registration including the name when one was provided.
   */
  public static async nameAppRegistration(registration: AppRegistration): Promise<AppRegistration> {
    const name = await window.showInputBox({
      title: 'App registration name',
      value: registration.name ?? '',
      ignoreFocusOut: true,
      placeHolder: 'For example: Contoso dev tenant',
      prompt: 'Optionally provide a friendly name for your app registration. Leave empty to use the client ID instead.'
    });

    const trimmedName = name?.trim();
    return trimmedName ? { ...registration, name: trimmedName } : { clientId: registration.clientId, tenantId: registration.tenantId };
  }

  /**
   * Shows the list of saved app registrations together with the options to provide an existing one or to create a new one.
   * Saved app registrations may be removed from the list using the button on the item.
   * @returns The picked item or undefined when the user dismissed the list.
   */
  private static async pickAppRegistration(): Promise<AppRegistrationQuickPickItem | undefined> {
    const removeButton: QuickInputButton = {
      iconPath: new ThemeIcon('trash'),
      tooltip: 'Remove this app registration from the list'
    };

    const getItems = (): AppRegistrationQuickPickItem[] => {
      const lastUsed = AppRegistrations.getLastUsed(AuthProvider.context);
      const items: AppRegistrationQuickPickItem[] = AppRegistrations.getAll().map(registration => ({
        label: registration.name || registration.clientId,
        description: registration.name ? registration.clientId : undefined,
        detail: `Tenant ID: ${registration.tenantId}${lastUsed?.clientId === registration.clientId ? ' (last used)' : ''}`,
        buttons: [removeButton],
        registration
      }));

      if (items.length > 0) {
        items.push({ label: '', kind: QuickPickItemKind.Separator });
      }

      items.push({
        label: 'Sign in using existing App Registration',
        detail: 'Provide the client ID and tenant ID of an existing Entra app registration',
        action: 'manual'
      });
      items.push({
        label: 'Create a new App Registration',
        detail: 'Let the SPFx Toolkit create a new Entra app registration in your tenant',
        action: 'create'
      });

      return items;
    };

    const quickPick = window.createQuickPick<AppRegistrationQuickPickItem>();
    quickPick.title = SIGN_IN_TITLE;
    quickPick.ignoreFocusOut = true;
    quickPick.canSelectMany = false;
    quickPick.items = getItems();

    const lastUsed = AppRegistrations.getLastUsed(AuthProvider.context);
    const lastUsedItem = lastUsed ? quickPick.items.find(item => item.registration?.clientId === lastUsed.clientId) : undefined;
    if (lastUsedItem) {
      quickPick.activeItems = [lastUsedItem];
    }

    return new Promise<AppRegistrationQuickPickItem | undefined>((resolve) => {
      let picked: AppRegistrationQuickPickItem | undefined = undefined;
      // the confirmation dialog takes the focus away from the list, so the hide event must be ignored while it is shown
      let isRemoving = false;

      quickPick.onDidTriggerItemButton(async (event) => {
        const registration = event.item.registration;
        if (!registration) {
          return;
        }

        isRemoving = true;
        try {
          const confirmation = await window.showWarningMessage(
            `Are you sure you want to remove '${event.item.label}' from the list? The app registration itself will not be deleted from your tenant.`,
            { modal: true },
            'Remove'
          );

          if (confirmation === 'Remove') {
            await AppRegistrations.remove(registration);
            quickPick.items = getItems();
          }
        } catch (error) {
          Notifications.error(`Removing the app registration from the list failed: ${(error as Error).message}`);
        } finally {
          isRemoving = false;
          quickPick.show();
        }
      });

      quickPick.onDidAccept(() => {
        picked = quickPick.selectedItems[0];
        quickPick.hide();
      });

      quickPick.onDidHide(() => {
        if (isRemoving) {
          return;
        }

        quickPick.dispose();
        resolve(picked);
      });

      quickPick.show();
    });
  }

  /**
   * Logs in the user.
   * @param createIfNone - A boolean indicating whether to create a new session if none exists.
   */
  public static async login(createIfNone: boolean = true) {
    AuthProvider.reSignIn = false;
    await authentication.getSession(AuthProvider.id, [], { createIfNone });
  }

  /**
   * Logs out the user by removing the session.
   */
  public static async logout() {
    AuthProvider.instance.removeSession('');
  }

  /**
   * Event that fires when the authentication sessions change.
   */
  public get onDidChangeSessions(): Event<AuthenticationProviderAuthenticationSessionsChangeEvent> {
    return this.onDidChangeEventEmit.event;
  }

  /**
   * Retrieves the authentication sessions for the specified scopes.
   * If no scopes are provided, retrieves all authentication sessions.
   * @param scopes - The scopes for which to retrieve authentication sessions.
   * @returns A promise that resolves to an array of authentication sessions.
   */
  public async getSessions(scopes: readonly string[] | undefined, options: vscode.AuthenticationProviderSessionOptions): Promise<AuthenticationSession[]> {
    const account = await this.getAccount();
    return account ? [account] : [];
  }

  /**
   * Creates a session for authentication.
   * @param _scopes - The scopes for the session.
   * @returns A promise that resolves to an AuthenticationSession.
   */
  public async createSession(_scopes: string[]): Promise<AuthenticationSession> {
    const clientId = EnvironmentInformation.clientId;
    const tenantId = EnvironmentInformation.tenantId;
    return new Promise((resolve) => {
      window.withProgress({
        location: ProgressLocation.Notification,
        title: `Logging in to Microsoft 365. Check [output window](command:${Commands.showOutputChannel}) for more details`,
        cancellable: true
      }, async (progress: Progress<{ message?: string; increment?: number }>) => {
        await executeCommand('login', { output: 'json', appId: clientId, tenant: tenantId, authType: 'browser' }, {
          stdout: (message: string) => {
            Notifications.info('To sign in, use the web browser that just has been opened. Please sign-in there.');
            return '';
          },
          stderr: (message: string) => {
            Logger.error(`login: ${message}`);
            return message;
          }
        });

        Notifications.info('Logged in to Microsoft 365');
        const account = await this.getAccount();

        // Bring the editor to the front
        const wsFolder = await Folders.getWorkspaceFolder();
        exec('code .', { cwd: wsFolder?.uri.fsPath });

        this.onDidChangeEventEmit.fire({ added: [account as any], removed: [], changed: [] });

        resolve(account as any);
      });
    });
  }

  /**
   * Removes a session with the specified session ID.
   * @param _sessionId - The ID of the session to remove.
   * @returns A Promise that resolves when the session is successfully removed.
   */
  public async removeSession(_sessionId: string): Promise<void> {
    const output = await CliExecuter.execute('logout', 'json');

    if (output.stderr) {
      Logger.error(`logout: ${output.stderr}`);
      return;
    }

    EnvironmentInformation.reset();

    Logger.info('logged out');
    AuthProvider.login(false);

    this.onDidChangeEventEmit.fire({ added: [], removed: [], changed: [] });
  }

  public dispose(): void {
    this.initializedDisposable?.dispose();
  }

  /**
   * Retrieves the M365 authentication session for the current account.
   * If the account is not available, it tries to fetch the account information using the 'status' command.
   * If successful, it returns a new M365AuthenticationSession object with the account details.
   * If unsuccessful, it logs an error message and returns undefined.
   * If the account is already available, it returns a new M365AuthenticationSession object with the account details.
   * @returns A Promise that resolves to an M365AuthenticationSession object or undefined.
   */
  public async getAccount(): Promise<M365AuthenticationSession | undefined> {
    if (!EnvironmentInformation.account) {
      return await new Promise((resolve: (res: M365AuthenticationSession | undefined) => void, reject: (e: Error) => void): void => {
        let account: M365AuthenticationSession | undefined;
        executeCommand('status', { output: 'json' }, {
          stdout: (message: string) => {
            Logger.info(`status: ${message}`);
            const sessions = JSON.parse(message.toString());

            if (sessions && sessions.connectedAs) {
              EnvironmentInformation.account = sessions.connectedAs;

              account = new M365AuthenticationSession({
                id: AuthProvider.id,
                label: sessions.connectedAs
              });
              account.tenantId = sessions.appTenant ?? '';
              EnvironmentInformation.tenantId = sessions.appTenant;
              account.clientId = sessions.appId ?? '';
              EnvironmentInformation.clientId = sessions.appId;
            }
          },
          stderr: (message: string) => {
            message = message.toString();
            if (!AuthProvider.reSignIn && message.includes('Access token expired')) {
              AuthProvider.logout();
              AuthProvider.reSignIn = true;
              const SignInButton = 'Sign in';
              Notifications.info('Access token expired.', SignInButton).then((item) => {
                if (item === SignInButton) {
                  AuthProvider.signIn();
                }
              });
            } else {
              Logger.error(`status: ${message}`);
            }
          }
        }).then(() => {
          resolve(account);
        }).catch(error => {
          reject(error);
        });
      });
    }

    const account = new M365AuthenticationSession({
      id: AuthProvider.id,
      label: EnvironmentInformation.account
    });
    account.tenantId = EnvironmentInformation.tenantId ?? '';
    account.clientId = EnvironmentInformation.clientId ?? '';

    return account;
  }
}