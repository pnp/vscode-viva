import { ServeConfig } from './../models/ServeConfig';
import { readFileSync, writeFileSync } from 'fs';
import { Folders } from './Folders';
import { commands, Progress, ProgressLocation, Uri, window, workspace } from 'vscode';
import { Commands, GenerateWorkflowCommandInput, WebViewType, WebviewCommand } from '../constants';
import { SiteAppCatalog, SolutionAddResult, Subscription } from '../models';
import { Extension } from './Extension';
import { CliExecuter } from './CliCommandExecuter';
import { Notifications } from './Notifications';
import { basename, join } from 'path';
import { EnvironmentInformation } from './EnvironmentInformation';
import { AuthProvider } from '../providers/AuthProvider';
import { CommandOutput } from '@pnp/cli-microsoft365';
import { TeamsToolkitIntegration } from './TeamsToolkitIntegration';
import { PnPWebview } from '../webview/PnPWebview';
import { parseYoRc } from '../utils/parseYoRc';
import { CertificateActions } from './CertificateActions';
import path = require('path');


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
      commands.registerCommand(Commands.serveProject, CliActions.serveProject)
    );
  }

  public static async appCatalogUrlsGet(): Promise<string[] | undefined> {
    const appCatalogUrls: string[] = [];
    const tenantAppCatalog = (await CliExecuter.execute('spo tenant appcatalogurl get', 'json')).stdout || undefined;
    const siteAppCatalogs = (await CliExecuter.execute('spo site appcatalog list', 'json')).stdout || undefined;

    if (tenantAppCatalog) {
      appCatalogUrls.push(JSON.parse(tenantAppCatalog));
    }

    if (siteAppCatalogs) {
      const siteAppCatalogsJson: SiteAppCatalog[] = JSON.parse(siteAppCatalogs);
      siteAppCatalogsJson.forEach((siteAppCatalog) => appCatalogUrls.push(`${siteAppCatalog.AbsoluteUrl}/AppCatalog`));
    }

    EnvironmentInformation.appCatalogUrls = appCatalogUrls ? appCatalogUrls : undefined;
    return EnvironmentInformation.appCatalogUrls;
  }

  public static async generateWorkflowForm(input: GenerateWorkflowCommandInput) {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (TeamsToolkitIntegration.isTeamsToolkitProject) {
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
        PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, {success: false});
        return;
      }

      await window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Creating app registration...',
        cancellable: true
        // eslint-disable-next-line no-unused-vars
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
          PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, {success: false});
        }
      });
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Generating GitHub CI/CD workflow...',
      cancellable: true
      // eslint-disable-next-line no-unused-vars
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const commandOptions: any = {};

        if (input.name) {
          commandOptions.name = input.name;
        }

        if (input.branch) {
          commandOptions.branchName = input.branch;
        }

        if (input.shouldTriggerManually) {
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

        commandOptions.overwrite = true;

        const result = await CliExecuter.execute('spfx project github workflow add', 'json', commandOptions);

        if (result.stderr) {
          Notifications.error(result.stderr);
        }
        Notifications.info('Workflow generated successfully.');
        PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, {
          success: true,
          appId: appId,
          pfxBase64: pfxBase64,
          tenantId: tenantId
        });
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
        PnPWebview.postMessage(WebviewCommand.toWebview.WorkflowCreated, {success: false});
      }
    });
  }

  private static async upgrade() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (TeamsToolkitIntegration.isTeamsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Generating the upgrade steps...',
      cancellable: true
      // eslint-disable-next-line no-unused-vars
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const result = await CliExecuter.execute('spfx project upgrade', 'md');

        if (result.stdout) {
          // Create a file to allow the Markdown preview to correctly open the linked/referenced files
          let savePath = wsFolder?.uri.fsPath;

          if (savePath && TeamsToolkitIntegration.isTeamsToolkitProject) {
            savePath = join(savePath, 'src');
          }

          const filePath = join(savePath || '', 'spfx.upgrade.md');
          writeFileSync(filePath, result.stdout);
          await commands.executeCommand('markdown.showPreview', Uri.file(filePath));
        } else if (result.stderr) {
          Notifications.error(result.stderr);
        }
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  private static async renameProject() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (TeamsToolkitIntegration.isTeamsToolkitProject) {
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
      title: 'Renaming the current project...',
      cancellable: true
      // eslint-disable-next-line no-unused-vars
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

  private static async grantAPIPermissions() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (TeamsToolkitIntegration.isTeamsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Granting API permissions for the current project...',
      cancellable: true
      // eslint-disable-next-line no-unused-vars
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

  private static async showGenerateWorkflowForm() {
    const content = await parseYoRc();
    const data = {
      spfxPackageName: content ? content['@microsoft/generator-sharepoint'].solutionName : '',
      appCatalogUrls: EnvironmentInformation.appCatalogUrls && EnvironmentInformation.appCatalogUrls.length > 1 ? EnvironmentInformation.appCatalogUrls : []
    };

    PnPWebview.open(WebViewType.workflowForm, data);
  }

  private static async validateProject() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      let fsPath = wsFolder.uri.fsPath;

      if (TeamsToolkitIntegration.isTeamsToolkitProject) {
        fsPath = join(fsPath, 'src');
      }

      process.chdir(fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Validating the current project...',
      cancellable: true
      // eslint-disable-next-line no-unused-vars
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const result = await CliExecuter.execute('spfx project doctor', 'md');

        if (result.stdout) {
          // Create a file to allow the Markdown preview to correctly open the linked/referenced files
          let savePath = wsFolder?.uri.fsPath;

          if (savePath && TeamsToolkitIntegration.isTeamsToolkitProject) {
            savePath = join(savePath, 'src');
          }

          const filePath = join(savePath || '', 'spfx.validate.md');
          writeFileSync(filePath, result.stdout);
          await commands.executeCommand('markdown.showPreview', Uri.file(filePath));
        } else if (result.stderr) {
          Notifications.error(result.stderr);
        }
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

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
      // eslint-disable-next-line no-unused-vars
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

  public static async serveProject() {
    const wsFolder = Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return;
    }

    const serveFiles = await workspace.findFiles('config/serve.json', '**/node_modules/**');
    const serveFile = serveFiles && serveFiles.length > 0 ? serveFiles[0] : null;

    if (!serveFile) {
      return;
    }

    const serveFileContents = readFileSync(serveFile.fsPath, 'utf8');
    const serveFileData: ServeConfig = JSON.parse(serveFileContents);
    const configNames = Object.keys(serveFileData.serveConfigurations);

    const answer = await window.showQuickPick(configNames, {
      title: 'Select the configuration to serve',
      ignoreFocusOut: true
    });

    if (!answer) {
      return;
    }

    commands.executeCommand(Commands.executeTerminalCommand, `gulp serve --config=${answer}`);
  }
}