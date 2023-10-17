import { parseWinPath } from './../utils/parseWinPath';
import { Executer } from './CommandExecuter';
import { Folders } from './Folders';
import { Notifications } from './Notifications';
import { Logger } from './Logger';
import { commands, ProgressLocation, QuickPickItem, Uri, window } from 'vscode';
import { AdaptiveCardTypesNode16, AdaptiveCardTypesNode18, Commands, ComponentType, ComponentTypes, FrameworkTypes, ProjectFileContent } from '../constants';
import { Sample, Subscription } from '../models';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as glob from 'fast-glob';
import { ExtensionTypes } from '../constants/ExtensionTypes';
import { Extension } from './Extension';
import download from 'github-directory-downloader/esm';
import { CliExecuter } from './CliCommandExecuter';
import { getPlatform } from '../utils';
import { Terminal } from './Terminal';
import { execSync } from 'child_process';


export const PROJECT_FILE = 'project.pnp';

interface NameValue {
  name: string;
  value: string;
}

export class Scaffolder {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.createProject, Scaffolder.createProject)
    );
    subscriptions.push(
      commands.registerCommand(Commands.addToProject, Scaffolder.addProject)
    );
  }

  /**
   * Create a new project
   * @returns
   */
  public static async createProject() {
    Logger.info('Start creating a new project');

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

    Scaffolder.addProject(solutionName, folderPath);
  }

  /**
   * Start from a sample
   * @param sample
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
   * Create project file and open it in VS Code
   * @param folderPath
   * @param content
   */
  private static async createProjectFileAndOpen(folderPath: string, content: any) {
    writeFileSync(join(folderPath, PROJECT_FILE), content, { encoding: 'utf8' });

    if (getPlatform() === 'windows') {
      await commands.executeCommand('vscode.openFolder', Uri.file(parseWinPath(folderPath)));
    } else {
      await commands.executeCommand('vscode.openFolder', Uri.parse(folderPath));
    }
  }

  /**
   * Get the name of the solution to create
   * @returns
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
   * Select the path to create the project in
   * @returns
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
   * Add a new component to the project
   */
  private static async addProject(solutionName?: string | undefined, folderPath?: string | undefined) {
    const componentTypeChoice = await window.showQuickPick(ComponentTypes.map(ct => ct.name), {
      title: 'Which type of client-side component to create?',
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!componentTypeChoice) {
      Logger.warning('Cancelled client-side component input');
      return;
    }

    const componentType = ComponentTypes.find(ct => ct.name === componentTypeChoice);

    if (!componentType) {
      Logger.error(`Unknown component type: ${componentTypeChoice}`);
      return;
    }

    let yoCommand = '';

    const yoCommandSolutionName = solutionName ? ` --solution-name "${solutionName}"` : '';

    // Ask questions per component type
    if (componentType.value === ComponentType.adaptiveCardExtension) {
      const componentAnswers = await Scaffolder.aceComponent();
      if (!componentAnswers) {
        return;
      }

      const { aceTemplateType, componentName } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${componentType.value} --aceTemplateType ${aceTemplateType?.value} --component-name "${componentName}" --skip-install`;
    } else if (componentType.value === ComponentType.extension) {
      const componentAnswers = await Scaffolder.extensionComponent();
      if (!componentAnswers) {
        return;
      }

      const { componentName, extensionType, framework } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${componentType.value} --extension-type ${extensionType} --component-name "${componentName}" --skip-install`;

      if (framework) {
        yoCommand += ` --framework ${framework}`;
      } else {
        // To prevent the 'templates/react' scandir issue
        yoCommand += ' --template ""';
      }
    } else if (componentType.value === ComponentType.webPart) {
      const componentAnswers = await Scaffolder.webpartComponent();
      if (!componentAnswers) {
        return;
      }

      const { componentName, framework } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${componentType.value} --component-name "${componentName}" --framework ${framework} --skip-install`;
    } else if (componentType.value === ComponentType.library) {
      const componentAnswers = await Scaffolder.libraryComponent();
      if (!componentAnswers) {
        return;
      }

      const { componentName } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint ${yoCommandSolutionName} --component-type ${componentType.value} --component-name "${componentName}" --skip-install`;
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
        if (!folderPath) {
          const wsFolder = await Folders.getWorkspaceFolder();
          folderPath = wsFolder?.uri.fsPath || '';
        }

        const result = await Executer.executeCommand(folderPath, yoCommand);
        if (result !== 0) {
          Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
          return;
        }

        if (solutionName) {
          const newFolderPath = join(folderPath, solutionName!);
          Scaffolder.createProjectFileAndOpen(newFolderPath, 'init');
        }

        Notifications.info('Component successfully created.');
      } catch (e) {
        Logger.error((e as Error).message);
        Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
      }
    });
  }

  /**
   * Questions to create a new ACE component
   * @returns
   */
  private static async aceComponent(): Promise<{ aceTemplateType: NameValue, componentName: string } | undefined> {
    const output = execSync('node --version', { shell: Terminal.shell });
    const match = /v(?<major_version>\d+)\.(?<minor_version>\d+)\.(?<patch_version>\d+)/gm.exec(output.toString());
    const nodeVersion = null === match ? '18' : match.groups?.major_version!;
    const adaptiveCardTypes = nodeVersion === '16' ? AdaptiveCardTypesNode16 : AdaptiveCardTypesNode18;

    const aceTemplateTypeChoice = await window.showQuickPick(adaptiveCardTypes.map(ace => ace.name), {
      title: 'Which adaptive card extension template do you want to use?',
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!aceTemplateTypeChoice) {
      Logger.warning('Cancelled ACE template input');
      return;
    }

    const aceTemplateType = adaptiveCardTypes.find(ace => ace.name === aceTemplateTypeChoice);

    const componentName = await window.showInputBox({
      title: 'What is your Adaptive Card Extension name?',
      value: 'HelloWorld',
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.adaptiveCardExtension, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning('Cancelled component name input');
      return;
    }

    return {
      aceTemplateType: aceTemplateType as NameValue,
      componentName
    };
  }

  /**
   * Questions to create a new library component
   * @returns
   */
  private static async libraryComponent(): Promise<{ componentName: string } | undefined> {
    const componentName = await window.showInputBox({
      title: 'What is your library name?',
      value: 'HelloWorld',
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.library, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning('Cancelled component name input');
      return;
    }

    return {
      componentName
    };
  }

  /**
   * Questions to create a new web part component
   * @returns
   */
  private static async webpartComponent(): Promise<{ componentName: string, framework: string } | undefined> {
    const componentName = await window.showInputBox({
      title: 'What is your web part name?',
      value: 'HelloWorld',
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.webPart, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning('Cancelled component name input');
      return;
    }

    const frameworkChoice = await window.showQuickPick(FrameworkTypes.map(type => type.name), {
      title: 'Which template would you like to use?',
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!frameworkChoice) {
      Logger.warning('Cancelled template input');
      return;
    }

    const framework = FrameworkTypes.find(type => type.name === frameworkChoice);

    return {
      componentName,
      framework: framework?.value as string
    };
  }

  /**
   * Questions to create a new extension component
   * @returns
   */
  private static async extensionComponent(): Promise<{ componentName: string, extensionType: string, framework: string | undefined } | undefined> {
    const componentName = await window.showInputBox({
      title: 'What is your extension name?',
      value: 'HelloWorld',
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.extension, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning('Cancelled component name input');
      return;
    }

    const extensionChoice = await window.showQuickPick(ExtensionTypes.map(type => type.name), {
      title: 'Which extension type would you like to create?',
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!extensionChoice) {
      Logger.warning('Cancelled extension type input');
      return;
    }

    const extension = ExtensionTypes.find(type => type.name === extensionChoice);

    let framework: string | undefined = undefined;
    if (extension && extension.templates.length > 0) {
      const frameworkChoice = await window.showQuickPick(extension.templates, {
        title: 'Which template would you like to use?',
        ignoreFocusOut: true,
        canPickMany: false
      });

      if (!frameworkChoice) {
        Logger.warning('Cancelled template input');
        return;
      }

      framework = frameworkChoice;
    }

    return {
      componentName,
      extensionType: extension?.value as string,
      framework
    };
  }

  /**
   * Check if a component folder exists
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