import { parseWinPath } from './../utils/parseWinPath';
import { Folders } from './Folders';
import { Notifications } from './Notifications';
import { Logger } from './Logger';
import { commands, ProgressLocation, QuickPickItem, Uri, window } from 'vscode';
import { Commands, ComponentType, ProjectFileContent, SpfxScaffoldCommandInput, WebviewCommand, WebViewType } from '../constants';
import { Sample, Subscription } from '../models';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as glob from 'fast-glob';
import { Extension } from './Extension';
import download from 'github-directory-downloader/esm';
import { CliExecuter } from './CliCommandExecuter';
import { getPlatform } from '../utils';
import { TerminalCommandExecuter } from './TerminalCommandExecuter';
import { execSync } from 'child_process';
import { PnPWebview } from '../webview/PnPWebview';
// import { TeamsToolkitIntegration } from './TeamsToolkitIntegration';
import { Executer } from './CommandExecuter';


export const PROJECT_FILE = 'project.pnp';

export class Scaffolder {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.createProject, Scaffolder.showCreateProjectForm)
    );
    // subscriptions.push(
    //   commands.registerCommand(Commands.addToProject, Scaffolder.addProject)
    // );
  }

  public static async createProject(input: SpfxScaffoldCommandInput) {
    Logger.info('Start creating a new project');

    let yoCommand = '';

    const yoCommandSolutionName = input.name ? ` --solution-name "${input.name}"` : '';

    // Ask questions per component type
    if (input.componentType === ComponentType.adaptiveCardExtension) {
      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${input.componentType} --aceTemplateType ${input.aceType} --component-name "${input.componentName}" --skip-install`;
    } else if (input.componentType === ComponentType.extension) {
      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${input.componentType} --extension-type ${input.extensionType} --component-name "${input.componentName}" --skip-install`;

      if (input.frameworkType) {
        yoCommand += ` --framework ${input.frameworkType}`;
      } else {
        // To prevent the 'templates/react' scandir issue
        yoCommand += ' --template ""';
      }
    } else if (input.componentType === ComponentType.webPart) {
      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${input.componentType} --component-name "${input.componentName}" --framework ${input.frameworkType} --skip-install`;
    } else if (input.componentType === ComponentType.library) {
      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${input.componentType} --component-name "${input.componentName}" --skip-install`;
    }

    if (!yoCommand) {
      return;
    }

    Logger.info(`Command to execute: ${yoCommand}`);

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Generating project... Check [output window](command:${Commands.showOutputChannel}) for more details`,
      cancellable: false
    }, async () => {
      try {
        // if (!input.folderPath) {
        //   const wsFolder = await Folders.getWorkspaceFolder();
        //   let path = wsFolder?.uri.fsPath;

        //   if (path && TeamsToolkitIntegration.isTeamsToolkitProject) {
        //     path = join(path, 'src');
        //   }

        //   input.folderPath = path || '';
        // }

        const result = await Executer.executeCommand(input.folderPath, yoCommand);
        if (result !== 0) {
          Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
          return;
        }

        if (input.name) {
          const newFolderPath = join(input.folderPath, input.name!);
          Scaffolder.createProjectFileAndOpen(newFolderPath, 'init');
        }

        Notifications.info('Component successfully created.');
      } catch (e) {
        Logger.error((e as Error).message);
        Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
      }
    });
  }

  public static async useSample(sample: Sample) {
    Logger.info(`Start using sample ${sample.name}`);

    const folderPath = await Scaffolder.getFolderPath();
    if (!folderPath) {
      Notifications.warning('You must select the parent folder to create the project in');
      return;
    }

    const solutionName = await Scaffolder.getSolutionName(folderPath);
    if (!solutionName) {
      Logger.warning('Cancelled solution name input');
      return;
    }

    const projectName = solutionName.replace(/\s/g, '-');
    const solutionPath = join(folderPath, projectName);
    if (!existsSync(solutionPath)) {
      mkdirSync(solutionPath, { recursive: true });
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Downloading the sample...',
      cancellable: false
    }, async (progress) => {
      const ghFolder = await download(sample.url, solutionPath);

      if (!ghFolder.downloaded) {
        Notifications.error('Failed to download the sample.');
        return;
      }

      progress.report({ message: 'Renaming the sample data...' });

      // Update the current process to the path of the new folder
      process.chdir(solutionPath);
      const result = await CliExecuter.execute('spfx project rename', 'md', { newName: projectName, generateNewId: true });

      if (result.error || result.stderr) {
        Notifications.error('Failed to rename the sample.');
        return;
      }

      const isScenario = sample.url.includes('/scenarios/');

      Scaffolder.createProjectFileAndOpen(solutionPath, isScenario ? ProjectFileContent.initScenario : ProjectFileContent.init);
    });
  }

  public static async pickFolder() {
    const folder = await window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
      openLabel: 'Select',
      title: 'Select the parent folder where you want to create the project',
    });
    if (folder?.length) {
      PnPWebview.postMessage(WebviewCommand.toWebview.folderPath, folder[0].fsPath);
    }
  }

  public static validateSolutionName(folderPath: string, solutionName: string) {
    if (existsSync(join(folderPath, solutionName))) {
      PnPWebview.postMessage(WebviewCommand.toWebview.validateSolutionName, false);
      return;
    }

    PnPWebview.postMessage(WebviewCommand.toWebview.validateSolutionName, true);
  }

  private static async getFolderPath(): Promise<string | undefined> {
    const wsFolder = await Folders.getWorkspaceFolder();
    const folderOptions: QuickPickItem[] = [{
      label: '$(folder) Browse...',
      alwaysShow: true,
      description: 'Browse for the parent folder to create the project in'
    }];

    if (wsFolder) {
      folderOptions.push({
        label: `\$(folder-active) ${wsFolder.name}`,
        description: wsFolder.uri.fsPath
      });
    }

    const folderPath = await window.showQuickPick(folderOptions, {
      canPickMany: false,
      ignoreFocusOut: true,
      title: 'Select the parent folder to create the project in'
    }).then(async (selectedFolder) => {
      if (selectedFolder?.label === '$(folder) Browse...') {
        const folder = await window.showOpenDialog({
          canSelectFolders: true,
          canSelectFiles: false,
          canSelectMany: false,
          openLabel: 'Select',
          title: 'Select the parent folder where you want to create the project',
        });
        if (folder?.length) {
          return folder[0].fsPath;
        }
        return undefined;
      }

      return selectedFolder?.description;
    });

    return folderPath;
  }

  private static async showCreateProjectForm() {
    const output = execSync('node --version', { shell: TerminalCommandExecuter.shell });
    const match = /v(?<major_version>\d+)\.(?<minor_version>\d+)\.(?<patch_version>\d+)/gm.exec(output.toString());
    const nodeVersion = null === match ? '18' : match.groups?.major_version!;
    const data = {
      isNewProject: true,
      nodeVersion: nodeVersion
    };

    PnPWebview.open(WebViewType.scaffoldForm, data);
  }

  private static async createProjectFileAndOpen(folderPath: string, content: any) {
    writeFileSync(join(folderPath, PROJECT_FILE), content, { encoding: 'utf8' });

    if (getPlatform() === 'windows') {
      await commands.executeCommand('vscode.openFolder', Uri.file(parseWinPath(folderPath)));
    } else {
      await commands.executeCommand('vscode.openFolder', Uri.parse(folderPath));
    }
  }

  private static async getSolutionName(folderPath: string): Promise<string | undefined> {
    return await window.showInputBox({
      title: 'What is your solution name?',
      placeHolder: 'Enter your solution name',
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value) {
          return 'Solution name is required';
        }

        const solutionPath = join(folderPath, value);
        if (existsSync(solutionPath)) {
          return `Folder with '${value}' already exists`;
        }

        return undefined;
      }
    });
  }

  private static async componentFolderExists(type: ComponentType, value: string) {
    let componentFolder = '';
    switch (type) {
      case ComponentType.adaptiveCardExtension:
        componentFolder = 'adaptiveCardExtensions';
        break;
      case ComponentType.extension:
        componentFolder = 'extensions';
        break;
      case ComponentType.library:
        componentFolder = 'libraries';
        break;
      case ComponentType.webPart:
        componentFolder = 'webparts';
        break;
    }

    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      const pattern = `**/${componentFolder}/${value}/*`;
      const files = await glob([pattern], { caseSensitiveMatch: false, cwd: wsFolder?.uri.fsPath });

      return files.length > 0;
    }

    return false;
  }
}