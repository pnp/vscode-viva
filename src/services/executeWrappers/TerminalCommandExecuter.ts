import { commands, ThemeIcon, workspace, window, Terminal, Disposable } from 'vscode';
import { Commands, NodeVersionManagers } from '../../constants';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { getPlatform, getExtensionSettings } from '../../utils';
import { M365AgentsToolkitIntegration } from '../dataType/M365AgentsToolkitIntegration';
import { Folders } from '../check/Folders';
import { join } from 'path';
import { ServeConfig } from '../../models/ServeConfig';
import { existsSync, readFileSync } from 'fs';
import { Logger } from '../dataType/Logger';
import { TelemetryService } from '../../utils/telemetry';


interface ShellSetting {
  source?: string;
  path?: string;
}

interface TerminalProject {
  /** The folder commands run in (the `src` folder for M365 Agents Toolkit projects). */
  path: string;
  /** The workspace folder root. */
  root: string;
}

export class TerminalCommandExecuter {
  private static shellPath: ShellSetting = {};

  public static register() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;
    subscriptions.push(
      commands.registerCommand(Commands.executeTerminalCommand, TelemetryService.withTelemetry(Commands.executeTerminalCommand, TerminalCommandExecuter.runCommand))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpServeProject, TelemetryService.withTelemetry(Commands.gulpServeProject, TerminalCommandExecuter.gulpServeProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftStartProject, TelemetryService.withTelemetry(Commands.heftStartProject, TerminalCommandExecuter.heftStartProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpBundleProject, TelemetryService.withTelemetry(Commands.gulpBundleProject, TerminalCommandExecuter.gulpBundleProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpPackageProject, TelemetryService.withTelemetry(Commands.gulpPackageProject, TerminalCommandExecuter.gulpPackageProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftEjectProject, TelemetryService.withTelemetry(Commands.heftEjectProject, TerminalCommandExecuter.heftEjectProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftPackageProject, TelemetryService.withTelemetry(Commands.heftPackageProject, TerminalCommandExecuter.heftPackageProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpPublishProject, TelemetryService.withTelemetry(Commands.gulpPublishProject, TerminalCommandExecuter.gulpPublishProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftPublishProject, TelemetryService.withTelemetry(Commands.heftPublishProject, TerminalCommandExecuter.heftPublishProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpCleanProject, TelemetryService.withTelemetry(Commands.gulpCleanProject, TerminalCommandExecuter.gulpCleanProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftCleanProject, TelemetryService.withTelemetry(Commands.heftCleanProject, TerminalCommandExecuter.heftCleanProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpBuildProject, TelemetryService.withTelemetry(Commands.gulpBuildProject, TerminalCommandExecuter.gulpBuildProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftBuildProject, TelemetryService.withTelemetry(Commands.heftBuildProject, TerminalCommandExecuter.heftBuildProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpTestProject, TelemetryService.withTelemetry(Commands.gulpTestProject, TerminalCommandExecuter.gulpTestProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftTestProject, TelemetryService.withTelemetry(Commands.heftTestProject, TerminalCommandExecuter.heftTestProject))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpTrustDevCert, TelemetryService.withTelemetry(Commands.gulpTrustDevCert, TerminalCommandExecuter.gulpTrustDevCert))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftTrustDevCert, TelemetryService.withTelemetry(Commands.heftTrustDevCert, TerminalCommandExecuter.heftTrustDevCert))
    );
    subscriptions.push(
      commands.registerCommand(Commands.gulpDeployToAzureStorage, TelemetryService.withTelemetry(Commands.gulpDeployToAzureStorage, TerminalCommandExecuter.gulpDeployToAzureStorage))
    );
    subscriptions.push(
      commands.registerCommand(Commands.heftDeployToAzureStorage, TelemetryService.withTelemetry(Commands.heftDeployToAzureStorage, TerminalCommandExecuter.heftDeployToAzureStorage))
    );

    TerminalCommandExecuter.initShellPath();
  }

  /**
   * Gets the shell path.
   * @returns The shell path.
   */
  public static get shell() {
    return TerminalCommandExecuter.shellPath;
  }

  /**
   * Runs the specified command in a new terminal.
   * @param command - The command to run.
   * @param terminalTitle - The title of the terminal.
   * @param terminalIcon - The icon of the terminal.
   */
  public static async runCommand(command: string, terminalTitle: string = 'Task', terminalIcon: string = 'tasks-list-configure') {
    const project = await TerminalCommandExecuter.getCurrentProject();
    const terminal = await TerminalCommandExecuter.createTerminal(terminalTitle, terminalIcon, project);

    if (project) {
      TerminalCommandExecuter.runInTerminal(`cd "${project.path}"`, terminal);
    }

    TerminalCommandExecuter.runInTerminal(command, terminal);
  }

  /**
   * Runs a command in a terminal and waits for it to complete.
   * @param command - The command to run.
   * @param terminalTitle - The title of the terminal.
   * @param terminalIcon - The icon of the terminal.
   * @returns A promise that resolves when the command completes with exit code 0, or rejects on non-zero exit.
   */
  public static async runCommandAndWait(command: string, terminalTitle: string = 'Task', terminalIcon: string = 'terminal'): Promise<void> {
    const project = await TerminalCommandExecuter.getCurrentProject();
    const terminal = await TerminalCommandExecuter.createTerminal(terminalTitle, terminalIcon, project);

    if (!terminal) {
      throw new Error('Failed to create terminal');
    }

    if (project) {
      terminal.sendText(`cd "${project.path}"`);
    }

    return new Promise<void>((resolve, reject) => {
      const disposable: Disposable = window.onDidCloseTerminal(async (closedTerminal) => {
        if (closedTerminal === terminal) {
          disposable.dispose();
          const exitStatus = await closedTerminal.exitStatus;
          if (exitStatus && exitStatus.code !== 0) {
            reject(new Error(`Command failed with exit code ${exitStatus.code}`));
          } else {
            resolve();
          }
        }
      });

      terminal.show(true);
      // Only exit when the command succeeded, so a failure stays visible in the terminal (in every shell)
      terminal.sendText(TerminalCommandExecuter.chainCommands(command, 'exit'));
    });
  }

  /**
   * Serves the project based on the user selected task type.
   */
  public static async gulpServeProject(): Promise<void> {
    const wsFolder = await Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return;
    }

    const serveTaskType = await TerminalCommandExecuter.serveTaskTypePrompt();
    if (!serveTaskType) {
      return;
    }

    switch (serveTaskType) {
      case 'Serve':
        commands.executeCommand(Commands.executeTerminalCommand, 'gulp serve');
        break;
      case 'Serve (no browser)':
        commands.executeCommand(Commands.executeTerminalCommand, 'gulp serve --nobrowser');
        break;
      case 'Serve from configuration':
        await TerminalCommandExecuter.serveFromConfiguration('gulp serve --config=');
        break;
    }
  }

  /**
   * Start the project based on the user selected task type.
   */
  public static async heftStartProject(): Promise<void> {
    const wsFolder = await Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return;
    }

    const startTaskType = await TerminalCommandExecuter.startTaskTypePrompt();
    if (!startTaskType) {
      return;
    }

    switch (startTaskType) {
      case 'Start':
        commands.executeCommand(Commands.executeTerminalCommand, 'heft start');
        break;
      case 'Start (no browser)':
        commands.executeCommand(Commands.executeTerminalCommand, 'heft start --nobrowser');
        break;
      case 'Start from configuration':
        await TerminalCommandExecuter.serveFromConfiguration('heft start --serve-config=');
        break;
    }
  }

  /**
   * Serves the project by executing the specified configuration using Gulp.
   * Prompts the user to select a configuration from the serve.json file.
   */
  public static async serveFromConfiguration(startCommand: string) {
    const configNames = await TerminalCommandExecuter.getServeConfigNames();

    const answer = await window.showQuickPick(configNames, {
      title: 'Select the configuration to serve',
      ignoreFocusOut: true
    });

    if (!answer) {
      return;
    }

    commands.executeCommand(Commands.executeTerminalCommand, `${startCommand}${answer}`);
  }

  /**
   * Bundles the project based on the environment type selected by the user.
   */
  public static async gulpBundleProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `gulp bundle${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Heft command to eject the project
   */
  public static async heftEjectProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'heft eject-webpack');
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Gulp command to package the project based on the user's selection.
   */
  public static async gulpPackageProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `gulp package-solution${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Heft command to package the project based on the user's selection.
   */
  public static async heftPackageProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `heft package-solution${answer === 'local' ? '' : ' --production'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Gulp command to publish (bundle & package) the project based on the user's selection.
   */
  public static async gulpPublishProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      const cmdChainOperator = TerminalCommandExecuter.getCommandChainOperator();
      commands.executeCommand(Commands.executeTerminalCommand, `gulp bundle${answer === 'local' ? '' : ' --ship'}${cmdChainOperator} gulp package-solution${answer === 'local' ? '' : ' --ship'}`);
    }
  }

  /**
   * Prompts the user to select an environment type and executes the appropriate
   * Heft command to publish (build & package) the project based on the user's selection.
   */
  public static async heftPublishProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      const cmdChainOperator = TerminalCommandExecuter.getCommandChainOperator();
      commands.executeCommand(Commands.executeTerminalCommand, `heft build${answer === 'local' ? '' : ' --production'}${cmdChainOperator} heft package-solution${answer === 'local' ? '' : ' --production'}`);
    }
  }

  /**
   * Gets the names of the serve configurations from the serve.json file.
   */
  private static async getServeConfigNames(): Promise<string[]> {
    const wsFolder = await Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return [];
    }

    const serveFiles = await workspace.findFiles('config/serve.json', '**/node_modules/**');
    const serveFile = serveFiles && serveFiles.length > 0 ? serveFiles[0] : null;

    if (!serveFile) {
      return [];
    }

    const serveFileContents = readFileSync(serveFile.fsPath, 'utf8');
    const serveFileData: ServeConfig = JSON.parse(serveFileContents);

    if (!serveFileData.serveConfigurations || typeof serveFileData.serveConfigurations !== 'object') {
      Logger.warning('The serve.json file does not contain any serve configurations.');
      return [];
    }

    return Object.keys(serveFileData.serveConfigurations);
  }

  /**
   * Prompts the user to select the target environment type.
   */
  private static async environmentTypePrompt(): Promise<string | undefined> {
    return await window.showQuickPick(['local', 'production'], {
      title: 'Select the target environment',
      ignoreFocusOut: true
    });
  }

  /**
   * Cleans the project by executing the Gulp clean command.
   */
  private static gulpCleanProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp clean');
  }

  /**
   * Cleans the project by executing the Heft clean command.
   */
  private static heftCleanProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'heft clean');
  }

  /**
   * Builds the project by executing the Gulp build command.
  */
  private static gulpBuildProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp build');
  }

  /**
   * Builds the project by executing the Heft build command.
  */
  private static async heftBuildProject() {
    const answer = await TerminalCommandExecuter.environmentTypePrompt();

    if (answer) {
      commands.executeCommand(Commands.executeTerminalCommand, `heft build${answer === 'local' ? '' : ' --production'}`);
    }
  }

  /**
   * Tests the project by executing the Gulp test command.
  */
  private static gulpTestProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp test');
  }

  /**
   * Tests the project by executing the Heft test command.
  */
  private static heftTestProject() {
    commands.executeCommand(Commands.executeTerminalCommand, 'heft test');
  }

  /**
   * Trusts the development certificate by executing the Gulp trust-dev-cert command.
  */
  private static gulpTrustDevCert() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp trust-dev-cert');
  }

  /**
   * Trusts the development certificate by executing the Heft trust-dev-cert command.
  */
  private static heftTrustDevCert() {
    commands.executeCommand(Commands.executeTerminalCommand, 'heft trust-dev-cert');
  }

  /**
   * Deploys to Azure CDN by executing the Gulp deploy-to-azure-storage command.
  */
  private static gulpDeployToAzureStorage() {
    commands.executeCommand(Commands.executeTerminalCommand, 'gulp deploy-azure-storage');
  }

  /**
   * Deploys to Azure CDN by executing the Heft deploy-azure-storage command.
  */
  private static heftDeployToAzureStorage() {
    commands.executeCommand(Commands.executeTerminalCommand, 'heft deploy-azure-storage');
  }

  /**
   * Initializes the shell path for executing terminal commands.
   * If the shell path is an object with a `path` property, it sets the `shellPath` to that value.
   * If the shell path is a string, it sets the `shellPath` to that value.
   * If the shell path is undefined, it sets the `shellPath` to undefined.
   */
  private static initShellPath() {
    const shell: string | ShellSetting | undefined = TerminalCommandExecuter.getShellPath();

    if (typeof shell !== 'string' && !!shell) {
      TerminalCommandExecuter.shellPath = shell;
    } else {
      TerminalCommandExecuter.shellPath.path = shell || undefined;
    }
  }

  /**
   * Prompts the user to select the serve task type.
   */
  private static async serveTaskTypePrompt(): Promise<string | undefined> {
    const configNames = await TerminalCommandExecuter.getServeConfigNames();
    const options = ['Serve', 'Serve (no browser)'];
    if (configNames.length > 1) {
      options.push('Serve from configuration');
    }
    return await window.showQuickPick(options, {
      title: 'Select the serve type',
      ignoreFocusOut: true
    });
  }

  /**
   * Prompts the user to select the start task type.
   */
  private static async startTaskTypePrompt(): Promise<string | undefined> {
    const configNames = await TerminalCommandExecuter.getServeConfigNames();
    const options = ['Start', 'Start (no browser)'];
    if (configNames.length > 1) {
      options.push('Start from configuration');
    }
    return await window.showQuickPick(options, {
      title: 'Select the start type',
      ignoreFocusOut: true
    });
  }

  /**
   * Retrieves the shell path or shell setting based on the current platform.
   * @returns The shell path or shell setting for the current platform, or undefined if not found.
   */
  private static getShellPath(): string | ShellSetting | undefined {
    const platform = getPlatform();
    const terminalSettings = workspace.getConfiguration('terminal');

    const automationProfile = terminalSettings.get<string | ShellSetting>(`integrated.automationProfile.${platform}`);
    if (!!automationProfile) {
      return automationProfile;
    }

    const defaultProfile = terminalSettings.get<string>(`integrated.defaultProfile.${platform}`);
    const profiles = terminalSettings.get<{ [prop: string]: ShellSetting }>(`integrated.profiles.${platform}`);

    if (defaultProfile && profiles && profiles[defaultProfile]) {
      return profiles[defaultProfile];
    }

    return terminalSettings.get(`integrated.shell.${platform}`);
  }

  /**
   * Joins commands so each one runs only if the previous one succeeded.
   * Uses `&&` for most shells. Windows PowerShell 5.1 does not support `&&`, so for PowerShell
   * each command after the first is wrapped in `if ($?) { ... }`. A failure skips all later
   * commands, and the result can itself be chained again.
   * @param commandsToChain - The commands to join.
   * @returns The chained command line.
   */
  public static chainCommands(...commandsToChain: string[]): string {
    if (TerminalCommandExecuter.isPowerShell()) {
      const [first, ...rest] = commandsToChain;
      return [first, ...rest.map(command => `if ($?) { ${command} }`)].join('; ');
    }

    return commandsToChain.join(' && ');
  }

  /**
   * Resolves the project the terminal commands should run in.
   * In a multi-root workspace this prompts the user to pick a folder.
   * @returns The project path (the `src` folder for M365 Agents Toolkit projects) and its workspace folder root, or undefined if no folder is open or selected.
   */
  private static async getCurrentProject(): Promise<TerminalProject | undefined> {
    const wsFolder = await Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return undefined;
    }

    const root = wsFolder.uri.fsPath;
    const path = M365AgentsToolkitIntegration.isM365AgentsToolkitProject ? join(root, 'src') : root;
    return { path, root };
  }

  /**
   * Creates a new terminal with the specified name and icon.
   * If a terminal with the same name already exists, it returns that terminal instead.
   * If the user's settings specify to use a specific node version manager (nvm, nvs or fnm),
   * it checks the selected project for a .nvmrc or .node-version file and sends the matching "use" command.
   * @param name - The name of the terminal.
   * @param icon - The path to the icon for the terminal.
   * @param project - The project the terminal runs in. The terminal starts in its folder and only its version files are used.
   * @returns A promise that resolves to the created terminal or the existing terminal with the same name.
   */
  private static async createTerminal(name?: string, icon?: string, project?: TerminalProject): Promise<Terminal | undefined> {
    let terminal = window.terminals.find(t => t.name === name);

    if (!terminal) {
      terminal = window.createTerminal({
        name: name ? name : undefined,
        iconPath: icon ? new ThemeIcon(icon) : undefined,
        // Start in the project folder so a bare "<manager> use" finds the project's version file
        cwd: project?.path
      });

      // Get the user's preferred node version manager -- nvm, nvs, fnm, or none if node version manager not selected
      const nodeVersionManager: string = getExtensionSettings('nodeVersionManager', 'nvm');

      const nvmrcPath = await TerminalCommandExecuter.findVersionFile('.nvmrc', project);

      if (nodeVersionManager === NodeVersionManagers.nvs) {
        const nodeVersionPath = await TerminalCommandExecuter.findVersionFile('.node-version', project);

        if (nvmrcPath || nodeVersionPath) {
          terminal.sendText('nvs use');
        }
      } else if (nodeVersionManager === NodeVersionManagers.nvm) {
        if (nvmrcPath) {
          TerminalCommandExecuter.sendUseCommand(terminal, 'nvm', nvmrcPath);
        }
      } else if (nodeVersionManager === NodeVersionManagers.fnm) {
        const versionFilePath = nvmrcPath ?? await TerminalCommandExecuter.findVersionFile('.node-version', project);
        if (versionFilePath) {
          TerminalCommandExecuter.sendUseCommand(terminal, 'fnm', versionFilePath);
        }
      }
    }

    return terminal;
  }

  /**
   * Finds a Node version file for the project.
   * Checks the project folder first, then its workspace folder root.
   * Without a project, falls back to searching the workspace.
   * @param fileName - The version file name (.nvmrc or .node-version).
   * @param project - The project to search in.
   * @returns The path to the version file, or undefined if none is found.
   */
  private static async findVersionFile(fileName: string, project?: TerminalProject): Promise<string | undefined> {
    if (project) {
      return [project.path, project.root]
        .map(folder => join(folder, fileName))
        .find(filePath => existsSync(filePath));
    }

    const files = await workspace.findFiles(fileName, '**/node_modules/**', 1);
    return files.length > 0 ? files[0].fsPath : undefined;
  }

  /**
   * Sends "<manager> use <version>" to the terminal, using the version from the given file.
   * Falls back to a bare "<manager> use" (which reads the version file from the terminal's folder)
   * if the file content is not safe to send to the shell or cannot be read.
   * @param terminal - The terminal to send the command to.
   * @param manager - The node version manager command (nvm or fnm).
   * @param versionFilePath - The path to the .nvmrc or .node-version file.
   */
  private static sendUseCommand(terminal: Terminal, manager: string, versionFilePath: string) {
    try {
      const version = TerminalCommandExecuter.readNodeVersion(versionFilePath);
      terminal.sendText(version ? `${manager} use ${version}` : `${manager} use`);
    } catch (error) {
      Logger.error(`Failed to read Node version file at ${versionFilePath}. Falling back to "${manager} use" without version. Error: ${error}`);
      terminal.sendText(`${manager} use`);
    }
  }

  /**
   * Reads a Node version from a .nvmrc or .node-version file.
   * The value is sent to a shell, so only plain versions (e.g. 22, 22.14, v22.14.0) and simple aliases
   * made of letters, digits, `.`, `_`, `-` and `/` (e.g. lts/iron, node) are accepted.
   * @param filePath - The path to the version file.
   * @returns The version (without a leading `v` for numeric versions), or undefined if the file content is not safe to send to the shell.
   */
  private static readNodeVersion(filePath: string): string | undefined {
    const content = readFileSync(filePath, 'utf8').trim();

    const numeric = /^v?(\d+(?:\.\d+){0,2})$/.exec(content);
    if (numeric) {
      return numeric[1];
    }

    if (/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(content)) {
      return content;
    }

    if (content) {
      Logger.warning(`Ignoring unsupported Node version "${content}" in ${filePath}. Falling back to the version manager's own file lookup.`);
    }
    return undefined;
  }

  /**
   * Runs a command in the specified terminal.
   * @param command - The command to run.
   * @param terminal - The terminal in which to run the command.
   */
  private static async runInTerminal(command: string, terminal?: Terminal | undefined) {
    if (terminal) {
      terminal.show(true);
      terminal.sendText(` ${command}`);
    }
  }

  private static getCommandChainOperator(): string {
    return TerminalCommandExecuter.isPowerShell() ? ';' : ' &&';
  }

  private static isPowerShell(): boolean {
    const shell = TerminalCommandExecuter.shell || '';

    return !!(shell.path?.includes('PowerShell') || shell.path?.includes('pwsh') || shell.source?.includes('PowerShell') || shell.source?.includes('pwsh'));
  }
}