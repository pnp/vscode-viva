import { parseWinPath } from './../utils/parseWinPath';
import { Executer } from './CommandExecuter';
import { Folders } from './Folders';
import { Notifications } from './Notifications';
import { Logger } from "./Logger";
import { commands, ProgressLocation, QuickPickItem, Uri, window } from 'vscode';
import { AdaptiveCardTypes, Commands, ComponentType, ComponentTypes, FrameworkTypes } from '../constants';
import { Sample, Subscription } from '../models';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as glob from 'fast-glob';
import { ExtensionTypes } from '../constants/ExtensionTypes';
import { Extension } from './Extension';
import download from "github-directory-downloader/esm";
import { CliExecuter } from './CliCommandExecuter';
import { getPlatform } from '../utils';

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
      commands.registerCommand(Commands.addToProject, Scaffolder.addToProject)
    );
  }
  
  /**
   * Create a new project
   * @returns 
   */
  public static async createProject() {
    Logger.info('Start creating a new project');

    const componentType = 'adaptiveCardExtension';

    const folderPath = await Scaffolder.getFolderPath();
    if (!folderPath) {
      Notifications.warning(`You must select the parent folder to create the project in`);
      return;
    }

    const solutionName = await Scaffolder.getSolutionName();
    if (!solutionName) {
      Logger.warning(`Cancelled solution name input`);
      return;
    }

    const componentAnswers = await Scaffolder.aceComponent();
    if (!componentAnswers) {
      return;
    }

    const { aceTemplateType, componentName } = componentAnswers;

    Logger.info(`Creating a new project in ${folderPath}`);

    const yoCommand = `yo @microsoft/sharepoint --solution-name "${solutionName}" --component-type ${componentType} --aceTemplateType ${aceTemplateType?.value} --component-name "${componentName}" --skip-install`;
    Logger.info(`Command to execute: ${yoCommand}`);

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Generating the new project... Check [output window](command:${Commands.showOutputChannel}) for more details`,
      cancellable: false
    }, async () => {
      try {
        const result = await Executer.executeCommand(folderPath, yoCommand);
        if (result !== 0) {
          Notifications.errorNoLog(`Failed to create the project. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
          return;
        }

        Logger.info(`Command result: ${result}`);
        
        const newFolderPath = join(folderPath, solutionName);
        Scaffolder.createProjectFileAndOpen(newFolderPath, 'init');
      } catch (e) {
        Logger.error((e as Error).message);
        Notifications.errorNoLog(`Error creating the project. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
      }
    });
  }

  /**
   * Start from a sample
   * @param sample 
   */
  public static async useSample(sample: Sample) {
    Logger.info(`Start using sample ${sample.name}`);

    const folderPath = await Scaffolder.getFolderPath();
    if (!folderPath) {
      Notifications.warning(`You must select the parent folder to create the project in`);
      return;
    }

    const solutionName = await Scaffolder.getSolutionName();
    if (!solutionName) {
      Logger.warning(`Cancelled solution name input`);
      return;
    }

    const projectName = solutionName.replace(/\s/g, '-');
    const solutionPath = join(folderPath, projectName);
    if (!existsSync(solutionPath)) {
      mkdirSync(solutionPath, { recursive: true });
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Downloading the sample...`,
      cancellable: false
    }, async (progress) => {
      const ghFolder = await download(sample.url, solutionPath);

      if (!ghFolder.downloaded) {
        Notifications.error(`Failed to download the sample.`);
        return;
      }

      progress.report({ message: `Renaming the sample data...` });

      // Update the current process to the path of the new folder
      process.chdir(solutionPath);
      const result = await CliExecuter.execute("spfx project rename", "md", { newName: projectName, generateNewId: true });

      if (result.error || result.stderr) {
        Notifications.error(`Failed to rename the sample.`);
        return;
      }

      Scaffolder.createProjectFileAndOpen(solutionPath, 'init');
    });
  }

  /**
   * Create project file and open it in VS Code
   * @param folderPath 
   * @param content 
   */
  private static async createProjectFileAndOpen(folderPath: string, content: any) {
    writeFileSync(join(folderPath, PROJECT_FILE), content, { encoding: 'utf8' });

    if (getPlatform() === "windows") {
      await commands.executeCommand(`vscode.openFolder`, Uri.file(parseWinPath(folderPath)));
    } else {
      await commands.executeCommand(`vscode.openFolder`, Uri.parse(folderPath));
    }
  }

  /**
   * Get the name of the solution to create
   * @returns 
   */
  private static async getSolutionName(): Promise<string | undefined> {
    return await window.showInputBox({
      title: 'What is your solution name?',
      placeHolder: 'Enter your solution name',
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value) {
          return 'Solution name is required';
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
      } else {
        return selectedFolder?.description;
      }
    });

    return folderPath;
  }

  /**
   * Add a new component to the project
   */
  private static async addToProject() {
    const componentTypeChoice = await window.showQuickPick(ComponentTypes.map(ct => ct.name), {
      title: `Which type of client-side component to create?`,
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!componentTypeChoice) {
      Logger.warning(`Cancelled client-side component input`);
      return;
    }

    const componentType = ComponentTypes.find(ct => ct.name === componentTypeChoice);

    if (!componentType) {
      Logger.error(`Unknown component type: ${componentTypeChoice}`);
      return;
    }

    let yoCommand = ``;

    // Ask questions per component type
    if (componentType.value === ComponentType.AdaptiveCardExtension) {
      const componentAnswers = await Scaffolder.aceComponent();
      if (!componentAnswers) {
        return;
      }

      const { aceTemplateType, componentName } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint --component-type ${componentType.value} --aceTemplateType ${aceTemplateType?.value} --component-name "${componentName}"`;
    } else if (componentType.value === ComponentType.Extension) {
      const componentAnswers = await Scaffolder.extensionComponent();
      if (!componentAnswers) {
        return;
      }

      const { componentName, extensionType, framework } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint --component-type ${componentType.value} --extension-type ${extensionType} --component-name "${componentName}"`;

      if (framework) {
        yoCommand += ` --framework ${framework}`;
      } else {
        // To prevent the 'templates/react' scandir issue
        yoCommand += ` --template ""`;
      }
    } else if (componentType.value === ComponentType.WebPart) {
      const componentAnswers = await Scaffolder.webpartComponent();
      if (!componentAnswers) {
        return;
      }

      const { componentName, framework } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint --component-type ${componentType.value} --component-name "${componentName}" --framework ${framework}`;
    } else if (componentType.value === ComponentType.Library) {
      const componentAnswers = await Scaffolder.libraryComponent();
      if (!componentAnswers) {
        return;
      }

      const { componentName } = componentAnswers;

      yoCommand = `yo @microsoft/sharepoint --component-type ${componentType.value} --component-name "${componentName}"`;
    }


    if (!yoCommand) {
      return;
    }
    
    Logger.info(`Command to execute: ${yoCommand}`);

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Adding the new component to your project... Check [output window](command:${Commands.showOutputChannel}) for more details`,
      cancellable: false
    }, async () => {
      try {
        const wsFolder = await Folders.getWorkspaceFolder();
        const result = await Executer.executeCommand(wsFolder?.uri.fsPath || "", yoCommand);
        if (result !== 0) {
          Notifications.errorNoLog(`Error creating the component. Check [output window](command:${Commands.showOutputChannel}) for more details.`);
          return;
        }

        Notifications.info(`Component successfully created.`);
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
    const aceTemplateTypeChoice = await window.showQuickPick(AdaptiveCardTypes.map(ace => ace.name), {
      title: `Which adaptive card extension template do you want to use?`,
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!aceTemplateTypeChoice) {
      Logger.warning(`Cancelled ACE template input`);
      return;
    }

    const aceTemplateType = AdaptiveCardTypes.find(ace => ace.name === aceTemplateTypeChoice);

    const componentName = await window.showInputBox({
      title: 'What is your Adaptive Card Extension name?',
      value: "HelloWorld",
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.AdaptiveCardExtension, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning(`Cancelled component name input`);
      return;
    }

    return {
      aceTemplateType: aceTemplateType as NameValue,
      componentName
    }
  }

  /**
   * Questions to create a new library component
   * @returns 
   */
  private static async libraryComponent(): Promise<{ componentName: string } | undefined> {
    const componentName = await window.showInputBox({
      title: 'What is your library name?',
      value: "HelloWorld",
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.Library, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning(`Cancelled component name input`);
      return;
    }

    return {
      componentName
    }
  }

  /**
   * Questions to create a new web part component
   * @returns 
   */
  private static async webpartComponent(): Promise<{ componentName: string, framework: string } | undefined> {
    const componentName = await window.showInputBox({
      title: 'What is your web part name?',
      value: "HelloWorld",
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.WebPart, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning(`Cancelled component name input`);
      return;
    }

    const frameworkChoice = await window.showQuickPick(FrameworkTypes.map(type => type.name), {
      title: `Which template would you like to use?`,
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!frameworkChoice) {
      Logger.warning(`Cancelled template input`);
      return;
    }

    const framework = FrameworkTypes.find(type => type.name === frameworkChoice);

    return {
      componentName,
      framework: framework?.value as string
    }
  }

  /**
   * Questions to create a new extension component
   * @returns 
   */
  private static async extensionComponent(): Promise<{ componentName: string, extensionType: string, framework: string | undefined } | undefined> {
    const componentName = await window.showInputBox({
      title: 'What is your extension name?',
      value: "HelloWorld",
      ignoreFocusOut: true,
      validateInput: async (value) => {
        if (!value) {
          return 'Component name is required';
        }

        if (await Scaffolder.componentFolderExists(ComponentType.Extension, value)) {
          return 'Component name already exists';
        }

        return undefined;
      }
    });

    if (!componentName) {
      Logger.warning(`Cancelled component name input`);
      return;
    }

    const extensionChoice = await window.showQuickPick(ExtensionTypes.map(type => type.name), {
      title: `Which extension type would you like to create?`,
      ignoreFocusOut: true,
      canPickMany: false
    });

    if (!extensionChoice) {
      Logger.warning(`Cancelled extension type input`);
      return;
    }

    const extension = ExtensionTypes.find(type => type.name === extensionChoice);

    let framework: string | undefined = undefined;
    if (extension && extension.templates.length > 0) {
      const frameworkChoice = await window.showQuickPick(extension.templates, {
        title: `Which template would you like to use?`,
        ignoreFocusOut: true,
        canPickMany: false
      });
  
      if (!frameworkChoice) {
        Logger.warning(`Cancelled template input`);
        return;
      }

      framework = frameworkChoice;
    }

    return {
      componentName,
      extensionType: extension?.value as string,
      framework
    }
  }

  /**
   * Check if a component folder exists
   */
  private static async componentFolderExists(type: ComponentType, value: string) {
    let componentFolder = '';
    switch (type) {
      case ComponentType.AdaptiveCardExtension:
        componentFolder = `adaptiveCardExtensions`;
        break;
      case ComponentType.Extension:
        componentFolder = `extensions`;
        break;
      case ComponentType.Library:
        componentFolder = `libraries`;
        break;
      case ComponentType.WebPart:
        componentFolder = `webparts`;
        break;
    }

    const wsFolder = await Folders.getWorkspaceFolder();
    const pattern = `**/${componentFolder}/${value}/*`;
    const files = await glob([pattern], { caseSensitiveMatch: false, cwd: wsFolder?.uri.fsPath });

    return files.length > 0;
  }
}