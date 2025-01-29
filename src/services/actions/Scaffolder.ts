import { parseWinPath } from '../../utils/parseWinPath';
import { Folders } from '../check/Folders';
import { Notifications } from '../dataType/Notifications';
import { Logger } from '../dataType/Logger';
import { commands, ProgressLocation, QuickPickItem, Uri, window, workspace } from 'vscode';
import { Commands, ComponentType, ProjectFileContent, WebviewCommand, WebViewType } from '../../constants';
import { Sample, SpfxAddComponentCommandInput, SpfxScaffoldCommandInput, Subscription } from '../../models';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as glob from 'fast-glob';
import { Extension } from '../dataType/Extension';
import download from 'github-directory-downloader/esm';
import { CliExecuter } from '../executeWrappers/CliCommandExecuter';
import { getExtensionSettings, getPlatform } from '../../utils';
import { PnPWebview } from '../../webview/PnPWebview';
import { Executer } from '../executeWrappers/CommandExecuter';
import { TeamsToolkitIntegration } from '../dataType/TeamsToolkitIntegration';
import { TerminalCommandExecuter } from '../executeWrappers/TerminalCommandExecuter';


export const PROJECT_FILE = 'project.pnp';

export class Scaffolder {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.createProject, Scaffolder.showCreateProjectForm)
    );
    subscriptions.push(
      commands.registerCommand(Commands.addToProject, Scaffolder.showAddProjectForm)
    );
    subscriptions.push(
      commands.registerCommand(Commands.createProjectCopilot, Scaffolder.createProjectCopilot)
    );
  }

  /**
   * Creates a project using the provided command.
   * @param yoCommand - The Yeoman command for the project creation.
   */
  public static async createProjectCopilot(yoCommand: string) {
    if (!yoCommand) {
      return;
    }

    if (!yoCommand.includes('--skip-install')) {
      yoCommand += ' --skip-install';
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Generating project... Check [output window](command:${Commands.showOutputChannel}) for more details`,
      cancellable: false
    }, async () => {

      const workspaceFolder = workspace.workspaceFolders?.[0];
      const workspacePath = workspaceFolder?.uri.fsPath;
      if (!workspacePath) {
        return;
      }

      const result = await Executer.executeCommand(workspacePath, yoCommand);
      if (result !== 0) {
        Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
        return;
      }

      const regex = /--solution-name\s+"([^"]+)"/;
      const solutionName = yoCommand.match(regex);
      const newFolderPath = join(workspacePath!, solutionName![1]);
      Scaffolder.createProjectFileAndOpen(newFolderPath, ProjectFileContent.init);
    });
  }

  /**
   * Creates a project using the provided input.
   * @param input - The input for the project creation.
   */
  public static async createProject(input: SpfxScaffoldCommandInput) {
    Scaffolder.scaffold(input, true);
  }

  /**
   * Adds a component to the project.
   * @param input - The input for the SpfxAddComponentCommand.
   */
  public static async addComponentToProject(input: SpfxAddComponentCommandInput) {
    Scaffolder.scaffold(input, false);
  }

  /**
   * Uses the provided sample to create a new project.
   * @param sample - The sample to use for creating the project.
   * @returns A Promise that resolves when the project creation is complete.
   */
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

  /**
   * Displays a dialog to pick a folder and sends the selected folder path to the webview.
   */
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

  /**
   * Validates the solution name by checking if a folder with the same name already exists.
   * @param folderPath - The path of the folder where the solution will be created.
   * @param solutionNameInput - The input solution name to be validated.
   */
  public static validateSolutionName(folderPath: string, solutionNameInput: string) {
    if (existsSync(join(folderPath, solutionNameInput))) {
      PnPWebview.postMessage(WebviewCommand.toWebview.validateSolutionName, false);
      return;
    }

    PnPWebview.postMessage(WebviewCommand.toWebview.validateSolutionName, true);
  }

  /**
   * Validates the component name for a given component type.
   * @param componentType - The type of the component.
   * @param componentNameInput - The input component name to validate.
   */
  public static async validateComponentName(componentType: ComponentType, componentNameInput: string) {
    if (await Scaffolder.componentFolderExists(componentType, componentNameInput)) {
      PnPWebview.postMessage(WebviewCommand.toWebview.validateComponentName, false);
      return;
    }

    PnPWebview.postMessage(WebviewCommand.toWebview.validateComponentName, true);
  }

  /**
   * Returns the value of the createNodeVersionFileDefaultValue setting and sends it to the webview.
   */
  public static async createNodeVersionFileDefaultValue() {
    const value = getExtensionSettings<boolean>(
      'createNodeVersionFileDefaultValue',
      false
    );

    PnPWebview.postMessage(
      WebviewCommand.toWebview.createNodeVersionFileDefaultValue,
      value
    );
  }

  /**
   * Returns the value of the nodeVersionManagerFile setting and sends it to the webview.
   */
  public static async nodeVersionManagerFile() {
    const value = getExtensionSettings<string>('nodeVersionManagerFile', '.nvmrc');

    PnPWebview.postMessage(
      WebviewCommand.toWebview.createNodeVersionManagerFile,
      value
    );
  }

  /**
   * Returns the value of the nodeVersionManager setting and sends it to the webview.
   */
  public static async nodeVersionManager() {
    const value = getExtensionSettings<string>('nodeVersionManager', 'nvm');

    PnPWebview.postMessage(
      WebviewCommand.toWebview.nodeVersionManager,
      value
    );
  }

  /**
   * Returns the value of the custom steps setting and sends it to the webview.
   */
  public static async getCustomSteps() {
    const value = getExtensionSettings<string>('projectCustomSteps', '');
    // eslint-disable-next-line no-console
    console.log('comment here' + getExtensionSettings<string>('projectCustomSteps', ''));
    //return getExtensionSettings<string>('projectCustomSteps', '');
  }

  /**
   * Scaffold method for creating a new project.
   * @param input - The input for the scaffold command.
   * @param isNewProject - A boolean indicating whether it's a new project or not.
   * @returns A Promise that resolves when the scaffold process is complete.
   */
  private static async scaffold(input: SpfxScaffoldCommandInput | SpfxAddComponentCommandInput, isNewProject: boolean) {
    Logger.info('Start creating a new project');

    let yoCommand = '';

    const yoCommandSolutionName = isNewProject ? ` --solution-name "${(input as SpfxScaffoldCommandInput).solutionName}"` : '';

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
        let folderPath = isNewProject ? (input as SpfxScaffoldCommandInput).folderPath : '';
        if (!folderPath) {
          const wsFolder = await Folders.getWorkspaceFolder();
          let path = wsFolder?.uri.fsPath;

          if (path && TeamsToolkitIntegration.isTeamsToolkitProject) {
            path = join(path, 'src');
          }

          folderPath = path || '';
        }

        const result = await Executer.executeCommand(folderPath, yoCommand);
        if (result !== 0) {
          Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
          return;
        }

        if (isNewProject) {
          const newSolutionInput = input as SpfxScaffoldCommandInput;
          const newFolderPath = join(newSolutionInput.folderPath, newSolutionInput.solutionName!);

          let content = newSolutionInput.shouldRunInit ? ProjectFileContent.init : '';
          if (newSolutionInput.shouldInstallReusablePropertyPaneControls) {
            content += ` ${ProjectFileContent.installReusablePropertyPaneControls}`;
          }

          if (newSolutionInput.shouldInstallReusableReactControls) {
            content += ` ${ProjectFileContent.installReusableReactControls}`;
          }

          if (newSolutionInput.shouldInstallReact) {
            content += ` ${ProjectFileContent.installReact}`;
          }

          if (newSolutionInput.shouldInstallPnPJs) {
            content += ` ${ProjectFileContent.installPnPJs}`;
          }

          if (newSolutionInput.shouldInstallSPFxFastServe) {
            content += ` ${ProjectFileContent.installSPFxFastServe}`;
          }

          if (newSolutionInput.shouldCreateNodeVersionFile) {
            switch (newSolutionInput.nodeVersionManager) {
              case 'nvm':
                // If the node version manager is nvm, create the .nvmrc file even if the user has selected .node-version
                content += ` ${ProjectFileContent.createNVMRCFile}`;
                break;
              case 'nvs':
                // If the node version manager is nvs, create the file based on the user's settings
                switch (newSolutionInput.nodeVersionManagerFile) {
                  case '.nvmrc':
                    content += ` ${ProjectFileContent.createNVMRCFile}`;
                    break;
                  case '.node-version':
                    content += ` ${ProjectFileContent.createNodeVersionFile}`;
                    break;
                }
                break;
              // If the node version manager is none, do not create any file
              case 'none':
              // By default, do not create any file
              default:
                break;
            }
          }

          if (newSolutionInput.shouldInstallCustomSteps) {
            content += ` ${ProjectFileContent.installCustomSteps}`;
          }

          Scaffolder.createProjectFileAndOpen(newFolderPath, content);
        } else {
          PnPWebview.close();
        }

        Notifications.info('Component successfully created.');
      } catch (e) {
        Logger.error((e as Error).message);
        Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
      }
    });
  }

  /**
   * Retrieves the folder path where the project will be created.
   * @returns A Promise that resolves to the selected folder path, or undefined if no folder is selected.
   */
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

  /**
   * Displays the create project form in a webview.
   * @returns A promise that resolves when the form is displayed.
   */
  private static async showCreateProjectForm() {
    PnPWebview.open(WebViewType.scaffoldForm, {
      isNewProject: true
    });
  }

  /**
   * Displays the add project form in a PnPWebview.
   * @returns A promise that resolves when the form is displayed.
   */
  private static async showAddProjectForm() {
    PnPWebview.open(WebViewType.scaffoldForm, {
      isNewProject: false
    });
  }

  /**
   * Creates a project file with the given content and opens the folder in Visual Studio Code.
   * @param folderPath - The path of the folder where the project file will be created.
   * @param content - The content of the project file.
   */
  private static async createProjectFileAndOpen(folderPath: string, content: any) {
    if (content) {
      writeFileSync(join(folderPath, PROJECT_FILE), content, { encoding: 'utf8' });
    }

    if (getPlatform() === 'windows') {
      await commands.executeCommand('vscode.openFolder', Uri.file(parseWinPath(folderPath)));
    } else {
      await commands.executeCommand('vscode.openFolder', Uri.parse(folderPath));
    }
  }

  /**
   * Retrieves the solution name from the user.
   * @param folderPath - The path of the folder where the solution will be created.
   * @returns A promise that resolves to the solution name entered by the user, or undefined if no solution name is provided.
   */
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

  /**
   * Checks if a component folder exists in the workspace.
   * @param type - The type of the component.
   * @param value - The value of the component.
   * @returns A boolean indicating whether the component folder exists.
   */
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