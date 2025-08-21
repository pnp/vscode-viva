import { readFileSync, writeFileSync } from 'fs';
import { Folders } from '../check/Folders';
import { commands, Progress, ProgressLocation, Uri, window, workspace, WorkspaceFolder } from 'vscode';
import { Commands, SpfxCompatibilityMatrix, WebViewType, WebviewCommand, WorkflowType } from '../../constants';
import { AppCatalogApp, GenerateWorkflowCommandInput, SiteAppCatalog, SolutionAddResult, SpfxDoctorOutput, Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { CliExecuter } from '../executeWrappers/CliCommandExecuter';
import { Notifications } from '../dataType/Notifications';
import { basename, join } from 'path';
import { EnvironmentInformation } from '../dataType/EnvironmentInformation';
import { AuthProvider } from '../../providers/AuthProvider';
import { CommandOutput } from '@pnp/cli-microsoft365';
import { M365AgentsToolkitIntegration } from '../dataType/M365AgentsToolkitIntegration';
import { PnPWebview } from '../../webview/PnPWebview';
import { parseYoRc } from '../../utils/parseYoRc';
import { parseCliCommand } from '../../utils/parseCliCommand';
import { CertificateActions } from './CertificateActions';
import path = require('path');
import { getExtensionSettings } from '../../utils/getExtensionSettings';
import * as fs from 'fs';
import { ActionTreeItem } from '../../providers/ActionTreeDataProvider';
import { timezones } from '../../constants/Timezones';
import { Dependencies } from './Dependencies';


export class CliActions {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.upgradeProject, CliActions.upgrade)
    );
    subscriptions.push(
      commands.registerCommand(Commands.deployProject, CliActions.deploy)
    );
    subscriptions.push(
      commands.registerCommand(Commands.validateProject, CliActions.validateProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.renameProject, CliActions.renameProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.grantAPIPermissions, CliActions.grantAPIPermissions)
    );
    subscriptions.push(
      commands.registerCommand(Commands.pipeline, CliActions.showGenerateWorkflowForm)
    );
    subscriptions.push(
      commands.registerCommand(Commands.setFormCustomizer, CliActions.setFormCustomizer)
    );
    subscriptions.push(
      commands.registerCommand(Commands.addTenantAppCatalog, CliActions.addTenantAppCatalog)
    );
    subscriptions.push(
      commands.registerCommand(Commands.addSiteAppCatalog, CliActions.addSiteAppCatalog)
    );
    subscriptions.push(
      commands.registerCommand(Commands.removeSiteAppCatalog, CliActions.removeSiteAppCatalog)
    );
  }

  /**
   * Runs the 'spfx doctor' command to validate the local development environment setup.
   */
  public static async spfxDoctor() {
    try {
      // Change the current working directory to the root of the Project
      const wsFolder = await Folders.getWorkspaceFolder();
      if (wsFolder) {
        let fsPath = wsFolder.uri.fsPath;

        if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
          fsPath = join(fsPath, 'src');
        }

        process.chdir(fsPath);
      }

      await window.withProgress({
        location: ProgressLocation.Notification,
        title: `Validating local setup... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
        cancellable: false,
      }, async () => {
        const result = await CliExecuter.execute('spfx doctor', 'json');

        const doctorOutput: SpfxDoctorOutput[] = result.stdout ? JSON.parse(result.stdout) : [];
        const sPFxCheck = doctorOutput.find(output => output.check === 'SharePoint Framework');

        if (!sPFxCheck?.passed) {
          const installLatestVersion = 'Yes, setup for latest SPFx version';
          const abortOption = 'No';

          Notifications.warning(
            'No SharePoint Framework version detected. Do you want to set up your environment for the latest SPFx version?',
            installLatestVersion,
            abortOption
          ).then(selectedOption => {
            if (selectedOption === installLatestVersion) {
              Dependencies.install(SpfxCompatibilityMatrix[SpfxCompatibilityMatrix.length - 1].Version);
            }
          });
        } else {
          const spfxVersion = SpfxCompatibilityMatrix.find(spfx => spfx.Version === sPFxCheck.version);
          const nodeCheck = Dependencies.isValidNodeJs(spfxVersion?.SupportedNodeVersions || []);
          if (!nodeCheck) {
            const installForSpecifiedVersion = `Yes, setup for v${sPFxCheck.version} SPFx version`;
            const abortOption = 'No';

            Notifications.warning(
              `Your Node version is not supported for v${sPFxCheck.version} SPFx version. Do you want to set up your environment for the v${sPFxCheck.version} SPFx version?`,
              installForSpecifiedVersion,
              abortOption
            ).then(selectedOption => {
              if (selectedOption === installForSpecifiedVersion) {
                Dependencies.install(sPFxCheck.version);
              }
            });
          } else {
            const notPassedChecks = doctorOutput.filter(check => !['SharePoint Framework', 'Node', 'env', 'typescript'].some(name => name.toLowerCase() === check.check.toLowerCase()) && !check.passed);
            if (notPassedChecks.length === 0) {
              Notifications.info('Your local development environment is set up correctly to work with SharePoint Framework. You are ready to go!');
              return;
            }

            const installForSpecifiedVersion = `Yes, setup for v${sPFxCheck.version} SPFx version`;
            const abortOption = 'No';

            Notifications.warning(
              `The following dependencies are not set up correctly: ${notPassedChecks.map(c => c.check).join(', ')}. Do you want to set up your environment for the v${sPFxCheck.version} SPFx version?`,
              installForSpecifiedVersion,
              abortOption
            ).then(selectedOption => {
              if (selectedOption === installForSpecifiedVersion) {
                Dependencies.install(sPFxCheck.version, false);
              }
            });
          }
        }
      });
    } catch (e: any) {
      const message = e?.error?.message || 'An unexpected error occurred.';
      Notifications.error(message);
    }
  }

  /**
   * Retrieves the URLs of the app catalogs in the environment.
   * @returns A promise that resolves to an array of app catalog URLs, or undefined if no app catalogs are found.
   */
  public static async appCatalogUrlsGet(): Promise<string[] | undefined> {
    try {
      const appCatalogUrls: string[] = [];
      const tenantAppCatalog = (await CliExecuter.execute('spo tenant appcatalogurl get', 'json')).stdout || undefined;
      const siteAppCatalogs = (await CliExecuter.execute('spo site appcatalog list', 'json', { excludeDeletedSites: true })).stdout || undefined;

      let tenantUrl: string | undefined;
      if (tenantAppCatalog) {
        tenantUrl = JSON.parse(tenantAppCatalog);
        if (tenantUrl) {
          appCatalogUrls.push(tenantUrl);
        }
      }

      if (siteAppCatalogs) {
        const siteAppCatalogsJson: SiteAppCatalog[] = JSON.parse(siteAppCatalogs);
        siteAppCatalogsJson.forEach((siteAppCatalog) => {
          if (!tenantUrl || siteAppCatalog.AbsoluteUrl !== tenantUrl) {
            appCatalogUrls.push(`${siteAppCatalog.AbsoluteUrl}`);
          }
        });
      }

      EnvironmentInformation.appCatalogUrls = appCatalogUrls.length > 0 ? appCatalogUrls : undefined;
      return EnvironmentInformation.appCatalogUrls;
    } catch {
      return undefined;
    }
  }

  /**
* Retrieves the list of apps deployed at the tenant or site app catalog.
*
* @param appCatalogUrl The URL of the tenant or site app catalog.
* @returns A promise that resolves to an array of objects containing the ID, Title, Deployed, and Enabled status of each app.
*/
  public static async getAppCatalogApps(appCatalogUrl?: string): Promise<AppCatalogApp[] | undefined> {
    try {
      const commandOptions: any = appCatalogUrl && appCatalogUrl.trim() !== '' ? {
        appCatalogScope: 'sitecollection',
        appCatalogUrl: appCatalogUrl
      } : {};

      const response = (await CliExecuter.execute('spo app list', 'json', commandOptions));
      const apps = response?.stdout || '[]';

      const appsJson: any[] = JSON.parse(apps);
      const appList = appsJson.map(({ ID, Title, Deployed, IsEnabled }) => {
        return {
          ID,
          Title,
          Deployed,
          Enabled: IsEnabled
        };
      });

      return appList;
    } catch (e: any) {
      const message = e?.error?.message;
      Notifications.error(message);
    }
  }

  /**
   * Retrieves the tenant-wide extensions from the specified tenant app catalog URL.
   * @param tenantAppCatalogUrl The URL of the tenant app catalog.
   * @returns A promise that resolves to an array of objects containing the URL and title of each tenant-wide extension,
   *          or undefined if no extensions are found.
   */
  public static async getTenantWideExtensions(tenantAppCatalogUrl: string): Promise<any[] | undefined> {
    const origin = new URL(tenantAppCatalogUrl).origin;
    const commandOptions: any = {
      listUrl: `${tenantAppCatalogUrl.replace(origin, '')}/Lists/TenantWideExtensions`,
      webUrl: tenantAppCatalogUrl
    };
    try {
      const tenantWideExtensions = (await CliExecuter.execute('spo listitem list', 'json', commandOptions)).stdout || undefined;

      if (!tenantWideExtensions) {
        return undefined;
      }

      const tenantWideExtensionsJson: any[] = JSON.parse(tenantWideExtensions);
      const tenantWideExtensionList = tenantWideExtensionsJson.map((extension) => {
        return {
          ...extension,
          Url: `${tenantAppCatalogUrl}/Lists/TenantWideExtensions/DispForm.aspx?ID=${extension.Id}`,
          extensionDisabled: extension.TenantWideExtensionDisabled || false
        };
      });
      return tenantWideExtensionList;
    } catch {
      return undefined;
    }
  }

  /**
   * Retrieves the health information of the tenant services.
   * @returns A promise that resolves to an array of objects containing the title and URL of the health information.
   *          Returns undefined if there is no health information available.
   */
  public static async getTenantHealthInfo(): Promise<{ Title: string, Url: string }[] | undefined> {
    try {
      const healthInfo = (await CliExecuter.execute('tenant serviceannouncement health list', 'json')).stdout || undefined;
      if (!healthInfo) {
        return undefined;
      }

      const healthInfoJson: any[] = JSON.parse(healthInfo);
      const healthInfoList = healthInfoJson.filter(service => service.status !== 'serviceOperational').map((service) => {
        return {
          Url: `https://admin.microsoft.com/#/servicehealth/:/currentIssues/${encodeURIComponent(service.service)}/`,
          Title: service.service
        };
      });
      return healthInfoList;
    }
    catch {
      return undefined;
    }
  }

  /**
   * Generates a workflow form based on the provided input.
   * @param input - The input for generating the workflow form.
   * @returns A Promise that resolves when the workflow form generation is complete.
   */
  public static async generateWorkflowForm(input: GenerateWorkflowCommandInput) {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    let pfxBase64: string = '';
    let appId: string = '';
    let tenantId: string = '';
    if (input.shouldCreateAppRegistrationForm && input.isApplicationAuthentication) {
      pfxBase64 = await CertificateActions.generateCertificate(input.certPassword);

      if (!pfxBase64) {
        Notifications.error('Error generating certificate.');
        PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, { success: false });
        return;
      }

      await window.withProgress({
        location: ProgressLocation.Notification,
        title: `Creating app registration... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
        cancellable: true
      }, async (progress: Progress<{ message?: string; increment?: number }>) => {
        try {
          const commandOptions: any = {};

          commandOptions.name = input.appRegistrationName;

          commandOptions.apisApplication = 'https://microsoft.sharepoint-df.com/Sites.FullControl.All,https://graph.microsoft.com/Sites.Read.All';

          const workspaceFolder = workspace.workspaceFolders?.[0];
          const workspacePath = workspaceFolder?.uri.fsPath;
          const certPath = path.join(workspacePath!, 'temp', 'certificate.cer');
          commandOptions.certificateFile = certPath;

          commandOptions.certificateDisplayName = 'CICD Certificate';

          commandOptions.grantAdminConsent = true;

          const result = await CliExecuter.execute('aad app add', 'json', commandOptions);
          const output = JSON.parse(result.stdout);
          appId = output.appId;
          tenantId = output.tenantId;

          if (result.stderr) {
            Notifications.error(result.stderr);
          }
          Notifications.info('New Entra ID app registered successfully.');
        } catch (e: any) {
          const message = e?.error?.message;
          Notifications.error(message);
          PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, { success: false });
        }
      });
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Generating ${input.workflowType === WorkflowType.gitHub ? 'GitHub Workflow' : 'Azure DevOps Pipeline'}... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const commandOptions: any = {};

        if (input.name) {
          commandOptions.name = input.name;
        }

        if (input.branch) {
          commandOptions.branchName = input.branch;
        }

        if (input.shouldTriggerManually && input.workflowType === WorkflowType.gitHub) {
          commandOptions.manuallyTrigger = input.shouldTriggerManually;
        }

        commandOptions.loginMethod = input.isApplicationAuthentication ? 'application' : 'user';

        commandOptions.scope = input.isTenantScope ? 'tenant' : 'sitecollection';

        if (commandOptions.scope === 'sitecollection' && input.siteUrl) {
          commandOptions.siteUrl = input.siteUrl;
        }

        if (input.shouldSkipFeatureDeployment) {
          commandOptions.skipFeatureDeployment = input.shouldSkipFeatureDeployment;
        }

        if (input.workflowType === WorkflowType.gitHub) {
          commandOptions.overwrite = true;
        }

        const result = await CliExecuter.execute(`${input.workflowType === WorkflowType.gitHub ? 'spfx project github workflow add' : 'spfx project azuredevops pipeline add'}`, 'json', commandOptions);

        if (result.stderr) {
          Notifications.error(result.stderr);
        }
        Notifications.info('Generated successfully.');
        PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, {
          success: true,
          appId: appId,
          pfxBase64: pfxBase64,
          tenantId: tenantId
        });
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
        PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, { success: false });
      }
    });
  }

  /**
   * Runs a CLI command.
   * @param command - The CLI command to run.
   * @returns A promise that resolves to the output of the command
   */
  public static async runCliCommand(command: string, output: string = 'text'): Promise<string | undefined> {
    if (!command) {
      return;
    }

    const cliCommand = parseCliCommand(command);
    const commandToRun = cliCommand.command.replace('m365 ', '');
    const result = await CliExecuter.execute(commandToRun, output, cliCommand.options);
    if (result.stderr) {
      Notifications.error(result.stderr);
      return;
    }

    return result.stdout;
  }

  /**
    * Sets the form customizer for a content type on a list.
    */
  public static async setFormCustomizer() {
    const relativeUrl = await window.showInputBox({
      prompt: 'Enter the relative URL of the site',
      ignoreFocusOut: true,
      placeHolder: 'e.g., sites/sales or leave blank for root site',
      validateInput: (input) => {
        const trimmedInput = input.trim();

        if (trimmedInput.startsWith('https://')) {
          return 'Please provide a relative URL, not an absolute URL.';
        }
        if (trimmedInput.startsWith('/')) {
          return 'Please provide a relative URL without a leading slash.';
        }

        return undefined;
      }
    });

    if (relativeUrl === undefined) {
      Notifications.warning('No site URL provided. Setting form customizer aborted.');
      return;
    }

    const siteUrl = `${EnvironmentInformation.tenantUrl}/${relativeUrl.trim()}`;

    const listTitle = await window.showInputBox({
      prompt: 'Enter the list title',
      ignoreFocusOut: true,
      validateInput: (value) => value ? undefined : 'List title is required'
    });

    if (!listTitle) {
      Notifications.warning('No list title provided. Setting form customizer aborted.');
      return;
    }

    const contentType = await window.showInputBox({
      prompt: 'Enter the Content Type name',
      ignoreFocusOut: true,
      validateInput: (value) => value ? undefined : 'Content Type name is required'
    });

    if (!contentType) {
      Notifications.warning('No content type name provided. Setting form customizer aborted.');
      return;
    }

    const editFormClientSideComponentId = await window.showInputBox({
      prompt: 'Enter the Edit form customizer ID (leave empty to skip)',
      ignoreFocusOut: true
    });

    const newFormClientSideComponentId = await window.showInputBox({
      prompt: 'Enter the New form customizer ID (leave empty to skip)',
      ignoreFocusOut: true
    });

    const displayFormClientSideComponentId = await window.showInputBox({
      prompt: 'Enter the View form customizer ID (leave empty to skip)',
      ignoreFocusOut: true
    });

    const commandOptions: any = {
      webUrl: siteUrl,
      listTitle: listTitle,
      name: contentType
    };

    if (editFormClientSideComponentId) {
      commandOptions.EditFormClientSideComponentId = editFormClientSideComponentId;
    }

    if (newFormClientSideComponentId) {
      commandOptions.NewFormClientSideComponentId = newFormClientSideComponentId;
    }

    if (displayFormClientSideComponentId) {
      commandOptions.DisplayFormClientSideComponentId = displayFormClientSideComponentId;
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Setting form customizer... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const result = await CliExecuter.execute('spo contenttype set', 'json', commandOptions);
        if (result.stderr) {
          Notifications.error(result.stderr);
        } else {
          Notifications.info('Form customizer set successfully.');
        }
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
     * Adds a Tenant App Catalog.
     * The URL is fixed to "https://domain.sharepoint.com/sites/appcatalog".
     * Prompts the user for the owner and timeZone.
     */
  public static async addTenantAppCatalog() {
    const tenantUrl = EnvironmentInformation.tenantUrl;
    if (!tenantUrl) {
      Notifications.error('Tenant URL not found. Please ensure you are logged in.');
      return;
    }

    const appCatalogUrl = `${tenantUrl}/sites/appcatalog`;

    const owner: string | undefined = await window.showInputBox({
      prompt: 'Enter the email address of the tenant admin (owner)',
      ignoreFocusOut: true,
      value: EnvironmentInformation.account || '',
      validateInput: (value) => value ? undefined : 'Owner email is required',
    });
    if (!owner) {
      Notifications.error('Owner email is required to create a Tenant App Catalog.');
      return;
    }

    const selectedTimezone = await window.showQuickPick(
      timezones.map(tz => ({
        label: tz.displayName,
        description: `ID: ${tz.id}`,
        timeZoneId: tz.id
      })), {
      placeHolder: 'Select your time zone (e.g., 4 for UTC+4).',
      ignoreFocusOut: true,
      matchOnDescription: true,
      matchOnDetail: true
    }
    );

    if (!selectedTimezone) {
      Notifications.error('Time zone selection is required to create a Tenant App Catalog.');
      return;
    }

    const confirmation = await window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Are you sure you want to create a Tenant App Catalog at '${appCatalogUrl}' with owner '${owner}' and time zone '${selectedTimezone.label}'?`,
      ignoreFocusOut: true,
    });

    if (confirmation !== 'Yes') {
      return;
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Creating Tenant App Catalog at ${appCatalogUrl}... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: false,
    }, async () => {
      try {
        const commandOptions: any = {
          url: appCatalogUrl,
          owner,
          timeZone: selectedTimezone.timeZoneId,
        };
        const result = await CliExecuter.execute('spo tenant appcatalog add', 'json', commandOptions);

        if (result.stderr) {
          Notifications.error(result.stderr);
        } else {
          Notifications.info(`Tenant App Catalog created successfully at '${appCatalogUrl}'.`);
          await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        }
      } catch (e: any) {
        const message = e?.error?.message || 'An unexpected error occurred.';
        Notifications.error(message);
      }
    });
  }

  /**
   * Adds a Site Collection App Catalog.
   * Prompts for the url.
   */
  public static async addSiteAppCatalog() {
    try {
      const relativeUrl = await window.showInputBox({
        prompt: 'Enter the relative URL of the site where you want to create the site app catalog',
        ignoreFocusOut: true,
        placeHolder: 'e.g., sites/sales or leave blank for root site',
        validateInput: (input) => {
          const trimmedInput = input.trim();
          if (trimmedInput.startsWith('https://')) {
            return 'Please provide a relative URL, not an absolute URL.';
          }
          if (trimmedInput.startsWith('/')) {
            return 'Please provide a relative URL without a leading slash.';
          }
          return undefined;
        }
      });

      if (!relativeUrl) {
        Notifications.warning('No site URL provided. Operation aborted.');
        return;
      }

      const siteUrl = `${EnvironmentInformation.tenantUrl}/${relativeUrl.trim()}`;

      const confirmation = await window.showQuickPick(['Yes', 'No'], {
        placeHolder: `Are you sure you want to create a site app catalog for '${relativeUrl}'?`,
        ignoreFocusOut: true,
      });

      if (confirmation !== 'Yes') {
        return;
      }

      await window.withProgress({
        location: ProgressLocation.Notification,
        title: `Creating site app catalog for ${siteUrl}... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
        cancellable: false,
      }, async () => {
        const commandOptions: any = { siteUrl };
        const result = await CliExecuter.execute('spo site appcatalog add', 'json', commandOptions);

        if (result.stderr) {
          Notifications.error(result.stderr);
        } else {
          Notifications.info(`Site app catalog created successfully for '${siteUrl}'.`);
          await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        }
      });
    } catch (e: any) {
      const message = e?.error?.message || 'An unexpected error occurred.';
      Notifications.error(message);
    }
  }

  /**
   * Removes a Site Collection App Catalog.
   */
  public static async removeSiteAppCatalog(node: ActionTreeItem) {
    try {
      let [appCatalogUrl] = node.command?.arguments || [];

      if (!appCatalogUrl) {
        Notifications.error('Failed to retrieve app catalog details for removal.');
        return;
      }

      appCatalogUrl = appCatalogUrl.replace('/AppCatalog', '');

      const shouldRemove = await window.showQuickPick(['Yes', 'No'], {
        title: `Are you sure you want to remove the site app catalog from site '${appCatalogUrl}'?`,
        ignoreFocusOut: true,
        canPickMany: false
      });

      const shouldRemoveAnswer = shouldRemove === 'Yes';

      if (!shouldRemoveAnswer) {
        return;
      }

      const commandOptions: any = {
        siteUrl: appCatalogUrl?.trim(),
        force: true
      };

      await window.withProgress({
        location: ProgressLocation.Notification,
        title: `Removing site app catalog from ${appCatalogUrl}... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
        cancellable: false,
      }, async () => {
        await CliExecuter.execute('spo site appcatalog remove', 'json', commandOptions);
      });

      Notifications.info(`App catalog '${appCatalogUrl}' has been successfully removed. Note: The App Catalog library will remain in the site, but it will be in a disabled state.`);

      await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
    } catch (e: any) {
      const message = e?.error?.message;
      Notifications.error(message);
    }
  }

  /**
   * Upgrades the project by generating the upgrade steps and displaying them in a Markdown preview.
   * @private
   */
  private static async upgrade() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Generating the upgrade steps... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const projectUpgradeOutputMode: string = getExtensionSettings('projectUpgradeOutputMode', 'both');
        const projectUpgradeShellType: string = getExtensionSettings('upgradeShellType', 'powershell');

        const commandOptions: any = {
          shell: projectUpgradeShellType
        };

        if (projectUpgradeOutputMode === 'markdown' || projectUpgradeOutputMode === 'both') {
          const resultMd = await CliExecuter.execute('spfx project upgrade', 'md', commandOptions);
          CliActions.handleMarkdownResult(resultMd, wsFolder, 'upgrade');
        }

        if (projectUpgradeOutputMode === 'code tour' || projectUpgradeOutputMode === 'both') {
          await CliExecuter.execute('spfx project upgrade', 'tour', commandOptions);
          CliActions.handleTourResult(wsFolder, 'upgrade');
        }
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Renames the current project.
   * @returns A promise that resolves when the project is renamed.
   */
  private static async renameProject() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    const newName = await window.showInputBox({
      title: 'What should be the new name for the project?',
      value: 'NewWorld',
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Name is required';
        }

        return undefined;
      }
    });

    if (!newName) {
      return;
    }

    const shouldGenerateNewIdAnswer = await window.showQuickPick(['Yes', 'No'], {
      title: 'Generate a new ID for the project?',
      ignoreFocusOut: true,
      canPickMany: false
    });

    const shouldGenerateNewId = shouldGenerateNewIdAnswer === 'Yes';

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Renaming the current project... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        let result: CommandOutput;
        if (shouldGenerateNewId) {
          result = await CliExecuter.execute('spfx project rename', 'json', { newName: newName, generateNewId: shouldGenerateNewId });
        } else {
          result = await CliExecuter.execute('spfx project rename', 'json', { newName: newName });
        }

        if (result.stderr) {
          Notifications.error(result.stderr);
        }
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Grants API permissions for the current project.
   * This method changes the current working directory to the root of the project,
   * and then executes the command to grant API permissions.
   * If the project is a Microsoft 365 Agents Toolkit project, the source directory is set to 'src'.
   * Displays progress notifications during the execution.
   * @returns A promise that resolves when the API permissions are granted.
   */
  private static async grantAPIPermissions() {
    const authInstance = AuthProvider.getInstance();
    const account = await authInstance.getAccount();

    if (!account) {
      Notifications.error('You must be logged in to grant API permission for a project.');
      return;
    }

    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Granting API permissions for the current project... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        await CliExecuter.execute('spfx project permissions grant', 'json');

        Notifications.info('API permissions granted.');
      } catch (e: any) {
        const message = e?.error?.message;
        if (message.toString().indexOf('webApiPermissionsRequest is not iterable') > -1) {
          Notifications.error('No API permissions found in the current project.');
        } else {
          Notifications.error(message);
        }
      }
    });
  }

  /**
   * Displays the generate workflow form in a PnPWebview.
   * Retrieves the necessary data and opens the webview with the data.
   * @returns A promise that resolves when the form is displayed.
   */
  private static async showGenerateWorkflowForm() {
    const content = await parseYoRc();
    const data = {
      spfxPackageName: content ? content['@microsoft/generator-sharepoint'].solutionName : '',
      appCatalogUrls: EnvironmentInformation.appCatalogUrls && EnvironmentInformation.appCatalogUrls.length > 1 ? EnvironmentInformation.appCatalogUrls : [],
      isSignedIn: EnvironmentInformation.account ? true : false
    };

    PnPWebview.open(WebViewType.workflowForm, data);
  }

  /**
   * Validates the current project.
   * This method changes the current working directory to the root of the project and performs
   * validation on the project. If the project is a Microsoft 365 Agents Toolkit project, it changes the working
   * directory to the 'src' folder before performing validation.
   * @returns A promise that resolves when the validation is complete.
   */
  private static async validateProject() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Validating the current project... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const projectValidateOutputMode: string = getExtensionSettings('projectValidateOutputMode', 'both');

        if (projectValidateOutputMode === 'markdown' || projectValidateOutputMode === 'both') {
          const resultMd = await CliExecuter.execute('spfx project doctor', 'md');
          CliActions.handleMarkdownResult(resultMd, wsFolder, 'validate');
        }

        if (projectValidateOutputMode === 'code tour' || projectValidateOutputMode === 'both') {
          await CliExecuter.execute('spfx project doctor', 'tour');
          CliActions.handleTourResult(wsFolder, 'validation');
        }
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Deploys a project.
   * @param file The file to deploy. If not provided, the method will search for .sppkg files in the workspace and prompt the user to select one.
   */
  private static async deploy(file: Uri | undefined) {
    const authInstance = AuthProvider.getInstance();
    const account = await authInstance.getAccount();

    if (!account) {
      Notifications.error('You must be logged in to deploy a project.');
      return;
    }

    if (!file) {
      const sppkgFiles = await workspace.findFiles('**/*.sppkg', '**/node_modules/**');
      if (sppkgFiles.length <= 0) {
        Notifications.error('No sppkg files found in the workspace');
        return;
      }

      if (sppkgFiles.length > 1) {
        Notifications.error('Multiple sppkg files found in the workspace');

        const answer = await window.showQuickPick(sppkgFiles.map(f => basename(f.fsPath)), {
          placeHolder: 'Select the sppkg file to deploy',
          ignoreFocusOut: true,
          canPickMany: false,
          title: 'Select the sppkg file to deploy'
        });

        if (!answer) {
          return;
        }

        file = sppkgFiles.find(f => basename(f.fsPath) === answer);
      } else {
        file = sppkgFiles[0];
      }
    }

    if (!file) {
      return;
    }

    if (!EnvironmentInformation.appCatalogUrls) {
      Notifications.error('We haven\'t been able to find an app catalog URL. Make sure your environment has an app catalog site.');
      return;
    }

    let appCatalogUrl: string | undefined = EnvironmentInformation.appCatalogUrls[0];
    if (EnvironmentInformation.appCatalogUrls.length > 1) {
      appCatalogUrl = await window.showQuickPick(EnvironmentInformation.appCatalogUrls.map(url => url, {
        placeHolder: 'Select the App Catalog',
        ignoreFocusOut: true,
        canPickMany: false,
        title: 'Select the App Catalog'
      }));
    }

    if (!appCatalogUrl) {
      return;
    }

    const appCatalogScope = appCatalogUrl === EnvironmentInformation.appCatalogUrls[0] ? 'tenant' : 'sitecollection';

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Deploying the ${basename(file.fsPath)} project. Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: false
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const addResult = await CliExecuter.execute('spo app add', 'json', { filePath: file?.fsPath, appCatalogUrl: appCatalogUrl, appCatalogScope: appCatalogScope, overwrite: true });

        if (addResult.stderr) {
          Notifications.error(addResult.stderr);
          return;
        }

        const data: SolutionAddResult = JSON.parse(addResult.stdout);
        if (!data.UniqueId) {
          Notifications.error('We haven\'t been able to find the unique ID of the project. Make sure the project was added correctly.');
        }

        // Check if skip feature deployment
        const packageSolution = await workspace.findFiles('**/config/package-solution.json', '**/node_modules/**');
        let shouldSkipFeatureDeployment = false;
        if (packageSolution.length > 0) {
          const packageSolutionFile = packageSolution[0];
          const packageSolutionContents = readFileSync(packageSolutionFile.fsPath, 'utf8');
          const packageSolutionData = JSON.parse(packageSolutionContents);
          shouldSkipFeatureDeployment = packageSolutionData.solution.skipFeatureDeployment;
        }

        const deployResult = await CliExecuter.execute('spo app deploy', 'json', { id: data.UniqueId, appCatalogUrl: appCatalogUrl, appCatalogScope: appCatalogScope, skipFeatureDeployment: shouldSkipFeatureDeployment });

        if (deployResult.stderr) {
          Notifications.error(deployResult.stderr);
          return;
        }

        Notifications.info('The project has been deployed successfully.');
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Handles the Markdown result
   * @param result The result of the (CLI) command execution
   * @param wsFolder The workspace folder
   */
  private static handleMarkdownResult(result: any, wsFolder: WorkspaceFolder | undefined, fileName: string) {
    if (result?.stderr) {
      Notifications.error(result.stderr);
      return;
    }

    let savePath = wsFolder?.uri.fsPath;

    if (savePath && M365AgentsToolkitIntegration.isM365AgentsToolkitProject) {
      savePath = join(savePath, 'src');
    }

    const filePath = join(savePath || '', `spfx.${fileName}.md`);
    writeFileSync(filePath, result.stdout);
    commands.executeCommand('markdown.showPreview', Uri.file(filePath));
  }

  /**
   * Handles the Tour result
   * @param wsFolder The workspace folder
   */
  private static async handleTourResult(wsFolder: WorkspaceFolder | undefined, fileName: string): Promise<void> {
    if (!wsFolder) {
      Notifications.error('Workspace folder is undefined. Cannot start Code Tour.');
      return;
    }

    const tourFilePath = path.join(wsFolder.uri.fsPath, '.tours', `${fileName}.tour`);
    await workspace.fs.stat(Uri.file(tourFilePath));

    // A timeout is needed so Codetour can find the tour file
    if (fs.existsSync(tourFilePath)) {
      setTimeout(() => {
        commands.executeCommand('codetour.startTour');
      }, 500);
    } else {
      Notifications.error(`${fileName}.tour file not found in path ${path.join(wsFolder.uri.fsPath, '.tours')}. Cannot start Code Tour.`);
    }
  }
}