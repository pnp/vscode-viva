import { ServeConfig } from './../models/ServeConfig';
import { readFileSync, writeFileSync } from 'fs';
import { Folders } from './Folders';
import { commands, Progress, ProgressLocation, Uri, window, workspace } from 'vscode';
import { Commands } from '../constants';
import { SiteAppCatalog, SolutionAddResult, Subscription } from '../models';
import { Extension } from './Extension';
import { CliExecuter } from './CliCommandExecuter';
import { Notifications } from './Notifications';
import { basename, join } from 'path';
import { EnvironmentInformation } from './EnvironmentInformation';
import { AuthProvider } from '../providers/AuthProvider';
import { CommandOutput } from '@pnp/cli-microsoft365';


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
      commands.registerCommand(Commands.pipelineGitHub, CliActions.generateGitHubWorkflow)
    );
    subscriptions.push(
      commands.registerCommand(Commands.serveProject, CliActions.serveProject)
    );
  }

  /**
   * Get the root SPO URL
   */
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

  /**
   * Upgrade the Project
   */
  private static async upgrade() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      process.chdir(wsFolder.uri.fsPath);
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
          const filePath = join(wsFolder?.uri.fsPath || '', 'spfx.upgrade.md');
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

  /**
     * Renames the current Project
     */
  private static async renameProject() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      process.chdir(wsFolder.uri.fsPath);
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
        if(shouldGenerateNewId) {
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
     * grant API permissions for the current Project
     */
  private static async grantAPIPermissions() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      process.chdir(wsFolder.uri.fsPath);
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
        }
      }
    });
  }

  /**
     * generate a GitHub CI/CD workflow for the current Project
     */
  private static async generateGitHubWorkflow() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      process.chdir(wsFolder.uri.fsPath);
    }

    const name = await window.showInputBox({
      title: 'What should be the name of the workflow? (default: Deploy Solution ${name of sppkg file})',
      ignoreFocusOut: true
    });

    const branchName = await window.showInputBox({
      title: 'What should be the branch name which should trigger the workflow on push? (default: main)',
      value: 'main',
      ignoreFocusOut: true
    });

    const shouldManuallyTriggerAnswer = await window.showQuickPick(['Yes', 'No'], {
      title: 'Should it be possible to trigger the workflow manually?',
      ignoreFocusOut: true,
      canPickMany: false
    });
    const shouldManuallyTrigger = shouldManuallyTriggerAnswer === 'Yes';

    const loginMethod = await window.showQuickPick(['application', 'user'], {
      title: 'Specify the login method used for the login action. (default: application)',
      ignoreFocusOut: true,
      canPickMany: false
    });

    const scope = await window.showQuickPick(['tenant', 'sitecollection'], {
      title: 'Specify the scope of the app catalog. (default: tenant)',
      ignoreFocusOut: true,
      canPickMany: false
    });

    let siteUrl: string | undefined;
    if (scope === 'sitecollection'){
      siteUrl = await window.showInputBox({
        title: 'Specify the URL of the site collection where the solution package will be added',
        ignoreFocusOut: true,
        validateInput: async (value) => {
          if (!value) {
            return 'Site app catalog url is required';
          }

          if (value.toLowerCase().indexOf('https://') < 0 || value.toLowerCase().indexOf('appcatalog') < 0) {
            return `${value} is not a valid SharePoint Online site app catalog URL`;
          }

          return undefined;
        }
      });

      if (!siteUrl) {
        return;
      }
    }

    const skipFeatureDeploymentAnswer = await window.showQuickPick(['Yes', 'No'], {
      title: 'Should the solution be deployed to the whole tenant? (applies when app supports tenant-wide deployment)',
      ignoreFocusOut: true,
      canPickMany: false
    });
    const skipFeatureDeployment = skipFeatureDeploymentAnswer === 'Yes';

    const overwriteAnswer = await window.showQuickPick(['Yes', 'No'], {
      title: 'Should overwrite the solution package if it already exists in the app catalog?',
      ignoreFocusOut: true,
      canPickMany: false
    });
    const overwrite = overwriteAnswer === 'Yes';

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Generating GitHub CI/CD workflow...',
      cancellable: true
      // eslint-disable-next-line no-unused-vars
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const commandOptions: any = {};

        if (name) {
          commandOptions.name = name;
        }

        if (branchName) {
          commandOptions.branchName = branchName;
        }

        if (shouldManuallyTrigger) {
          commandOptions.manuallyTrigger = shouldManuallyTrigger;
        }

        if (loginMethod) {
          commandOptions.loginMethod = loginMethod;
        }

        if (scope) {
          commandOptions.scope = scope;

          if (scope === 'sitecollection' && siteUrl) {
            commandOptions.siteUrl = siteUrl;
          }
        }

        if (skipFeatureDeployment) {
          commandOptions.skipFeatureDeployment = skipFeatureDeployment;
        }

        if (overwrite) {
          commandOptions.overwrite = overwrite;
        }

        const result = await CliExecuter.execute('spfx project github workflow add', 'json', commandOptions);

        if (result.stderr) {
          Notifications.error(result.stderr);
        }
        Notifications.info('Workflow generated successfully.');
      } catch (e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Validates the current Project
   */
  private static async validateProject() {
    // Change the current working directory to the root of the Project
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      process.chdir(wsFolder.uri.fsPath);
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
          const filePath = join(wsFolder?.uri.fsPath || '', 'spfx.validate.md');
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

  /**
   * Deploy the Project
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

  /**
   * Serve the Project
   */
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