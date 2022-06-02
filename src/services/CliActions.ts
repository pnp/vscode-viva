import { ServeConfig } from './../models/ServeConfig';
import { readFileSync } from 'fs';
import { Folders } from './Folders';
import { commands, Progress, ProgressLocation, Range, Uri, window, workspace } from "vscode";
import { Commands } from "../constants";
import { SolutionAddResult, Subscription } from "../models";
import { Extension } from "./Extension";
import { CliExecuter } from "./CliCommandExecuter";
import { Notifications } from "./Notifications";
import { basename, join } from 'path';
import { writeFileSync } from 'fs';
import { EnvironmentInformation } from './EnvironmentInformation';
import { AuthProvider } from '../providers/AuthProvider';


export class CliActions {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;
    
    subscriptions.push(
      commands.registerCommand(Commands.upgradeSolution, CliActions.upgrade)
    );
    subscriptions.push(
      commands.registerCommand(Commands.deploySolution, CliActions.deploy)
    );
    subscriptions.push(
      commands.registerCommand(Commands.validateSolution, CliActions.validateSolution)
    );
    subscriptions.push(
      commands.registerCommand(Commands.serveSolution, CliActions.serveSolution)
    );
  }

  /**
   * Get the root SPO URL
   */
  public static async appCatalogUrlGet() {
    const data = (await CliExecuter.execute("spo tenant appcatalogurl get", "json")).stdout || undefined;
    EnvironmentInformation.appCatalogUrl = data ? JSON.parse(data) : undefined;
    return EnvironmentInformation.appCatalogUrl;
  }

  /**
   * Upgrade the solution
   */
  private static async upgrade() {
    // Change the current working directory to the root of the solution
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      process.chdir(wsFolder.uri.fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Generating the upgrade steps...`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const result = await CliExecuter.execute("spfx project upgrade", "md");
        
        if (result.stdout) {
          // Create a file to allow the Markdown preview to correctly open the linked/referenced files
          const filePath = join(wsFolder?.uri.fsPath || "", "spfx.upgrade.md");
          writeFileSync(filePath, result.stdout);
          await commands.executeCommand("markdown.showPreview", Uri.file(filePath));
        } else if (result.stderr) {
          Notifications.error(result.stderr);
        }
      } catch(e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Validates the current solution
   */
  private static async validateSolution() {
    // Change the current working directory to the root of the solution
    const wsFolder = await Folders.getWorkspaceFolder();
    if (wsFolder) {
      process.chdir(wsFolder.uri.fsPath);
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Validating the current solution...`,
      cancellable: true
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const result = await CliExecuter.execute("spfx project doctor", "md");
        
        if (result.stdout) {
          // Create a file to allow the Markdown preview to correctly open the linked/referenced files
          const filePath = join(wsFolder?.uri.fsPath || "", "spfx.validate.md");
          writeFileSync(filePath, result.stdout);
          await commands.executeCommand("markdown.showPreview", Uri.file(filePath));
        } else if (result.stderr) {
          Notifications.error(result.stderr);
        }
      } catch(e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Deploy the solution
   */
  private static async deploy(file: Uri | undefined) {
    const authInstance = AuthProvider.getInstance();
    const account = await authInstance.getAccount();

    if (!account) {
      Notifications.error("You must be logged in to deploy a solution.");
      return;
    }

    if (!file) {
      const sppkgFiles = await workspace.findFiles(`**/*.sppkg`, `**/node_modules/**`);
      if (sppkgFiles.length <= 0) {
        Notifications.error("No sppkg files found in the workspace");
        return;
      }

      if (sppkgFiles.length > 1) {
        Notifications.error("Multiple sppkg files found in the workspace");

        const answer = await window.showQuickPick(sppkgFiles.map(f => basename(f.fsPath)), {
          placeHolder: "Select the sppkg file to deploy",
          ignoreFocusOut: true,
          canPickMany: false,
          title: "Select the sppkg file to deploy"
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

    if (!EnvironmentInformation.appCatalogUrl) {
      Notifications.error("We haven't been able to find an app catalog URL. Make sure your environment has an app catalog site.");
      return;
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      title: `Deploying the ${basename(file.fsPath)} solution. Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
      cancellable: false
    }, async (progress: Progress<{ message?: string; increment?: number }>) => {
      try {
        const addResult = await CliExecuter.execute(`spo app add`, "json", { filePath: file?.fsPath, appCatalogUrl: EnvironmentInformation.appCatalogUrl, overwrite: true });
        
        if (addResult.stderr) {
          Notifications.error(addResult.stderr);
          return;
        }

        const data: SolutionAddResult = JSON.parse(addResult.stdout);
        if (!data.UniqueId) {
          Notifications.error("We haven't been able to find the unique ID of the solution. Make sure the solution was added correctly.");
        }

        // Check if skip feature deployment
        const packageSolution = await workspace.findFiles(`**/config/package-solution.json`, `**/node_modules/**`);
        let shouldSkipFeatureDeployment = false;
        if (packageSolution.length > 0) {
          const packageSolutionFile = packageSolution[0];
          const packageSolutionContents = readFileSync(packageSolutionFile.fsPath, "utf8");
          const packageSolutionData = JSON.parse(packageSolutionContents);
          shouldSkipFeatureDeployment = packageSolutionData.solution.skipFeatureDeployment;
        }

        const deployResult = await CliExecuter.execute(`spo app deploy`, "json", { id: data.UniqueId, appCatalogUrl: EnvironmentInformation.appCatalogUrl, skipFeatureDeployment: shouldSkipFeatureDeployment });

        if (deployResult.stderr) {
          Notifications.error(addResult.stderr);
          return;
        }

        Notifications.info("The solution has been deployed successfully.");
      } catch(e: any) {
        const message = e?.error?.message;
        Notifications.error(message);
      }
    });
  }

  /**
   * Serve the solution
   */
  public static async serveSolution() {
    const wsFolder = Folders.getWorkspaceFolder();
    if (!wsFolder) {
      return;
    }

    const serveFiles = await workspace.findFiles("config/serve.json", "**/node_modules/**");
    let serveFile = serveFiles && serveFiles.length > 0 ? serveFiles[0] : null;

    if (!serveFile) {
      return;
    }

    const serveFileContents = readFileSync(serveFile.fsPath, "utf8");
    const serveFileData: ServeConfig = JSON.parse(serveFileContents);
    const configNames = Object.keys(serveFileData.serveConfigurations);

    const answer = await window.showQuickPick(configNames, {
      title: "Select the configuration to serve",
      ignoreFocusOut: true
    });

    if (!answer) {
      return;
    }

    commands.executeCommand(Commands.executeTerminalCommand, `gulp serve --config=${answer}`);
  }
}