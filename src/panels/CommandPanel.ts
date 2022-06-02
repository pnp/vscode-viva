import { readFileSync } from "fs";
import { commands, workspace, window, Uri } from "vscode";
import { Commands, ContextKeys } from "../constants";
import { ActionTreeItem, ActionTreeviewProvider } from "../providers/ActionTreeviewProvider";
import { AuthProvider, M365AuthenticationSession } from "../providers/AuthProvider";
import { CliActions } from "../services/CliActions";
import { DebuggerCheck } from "../services/DebuggerCheck";
import { EnvironmentInformation } from "../services/EnvironmentInformation";


export class CommandPanel {

  public static register() {
    CommandPanel.init();
  }

  /**
   * Initialize the command panel
   * @returns 
   */
  private static async init() {
    const files = await workspace.findFiles(`.yo-rc.json`, `**/node_modules/**`);
    if (files.length <= 0) {
      CommandPanel.showWelcome();
      return;
    }

    const file = files[0];
    const content = readFileSync(file.fsPath, 'utf8');
    if (!content) {
      CommandPanel.showWelcome();
      return;
    }

    const json = JSON.parse(content);
    if (!json || !json[`@microsoft/generator-sharepoint`]) { 
      CommandPanel.showWelcome();
      return;
    }

    commands.executeCommand("setContext", ContextKeys.isSPFxSolution, true);
    commands.executeCommand("setContext", ContextKeys.showWelcome, false);

    CommandPanel.registerTreeview();
    AuthProvider.verify();
  }

  /**
   * Register all the treeviews
   */
  private static registerTreeview() {
    const authInstance = AuthProvider.getInstance();
    if (authInstance) {
      authInstance.getAccount().then(account => CommandPanel.accountTreeView(account));
      
      authInstance.onDidChangeSessions(e => {
        if (e && e.added && e.added.length > 0) {
          authInstance.getAccount().then(account => CommandPanel.accountTreeView(account));
        } else {
          CommandPanel.accountTreeView(undefined);
        }
      })
    }

    CommandPanel.taskTreeView();
    CommandPanel.actionsTreeView();
    CommandPanel.helpTreeView();
  }

  /**
   * Provide the actions for the account treeview
   * @param session 
   */
  private static accountTreeView(session: M365AuthenticationSession | undefined) {
    const accountCommands: ActionTreeItem[] = [];

    if (session) {
      commands.executeCommand("setContext", ContextKeys.isLoggedIn, true);
      accountCommands.push(new ActionTreeItem(session.account.label, "", { name: "M365", custom: true }, undefined, undefined, undefined, "m365Account", [
        new ActionTreeItem("Sign out", "", { name: "sign-out", custom: false }, undefined, Commands.logout)
      ]));

      CommandPanel.environmentTreeView();
    } else {
      EnvironmentInformation.reset();
      commands.executeCommand("setContext", ContextKeys.isLoggedIn, false);
      commands.executeCommand("setContext", ContextKeys.hasAppCatalog, false);
      accountCommands.push(new ActionTreeItem("Sign in to M365", "", { name: "M365", custom: true }, undefined, Commands.login));
    }

    window.registerTreeDataProvider('pnp-view-account', new ActionTreeviewProvider(accountCommands));
  }

  /**
   * Provide the actions for the environment treeview
   */
  private static async environmentTreeView() {
    const appCatalogUrl = await CliActions.appCatalogUrlGet();

    let environmentCommands: ActionTreeItem[] = [];

    if (!appCatalogUrl) {
      environmentCommands.push(new ActionTreeItem("No app catalog found", ""));
    } else {
      const url = new URL(appCatalogUrl);
      commands.executeCommand("setContext", ContextKeys.hasAppCatalog, true);

      DebuggerCheck.validateUrl(url.origin);

      environmentCommands.push(
        new ActionTreeItem("SharePoint", "", { name: "sharepoint", custom: true }, undefined, undefined, undefined, undefined, [
          new ActionTreeItem(url.origin, "", { name: "globe", custom: false }, undefined, 'vscode.open', Uri.parse(url.origin), "sp-url")
        ]),
        new ActionTreeItem("SharePoint App Catalog", "", { name: "sharepoint", custom: true }, undefined, undefined, undefined, undefined, [
          new ActionTreeItem(appCatalogUrl, "", { name: "globe", custom: false }, undefined, 'vscode.open', Uri.parse(appCatalogUrl), "sp-app-catalog-url")
        ]),
      )
    }

    window.registerTreeDataProvider('pnp-view-environment', new ActionTreeviewProvider(environmentCommands));
  }

  /**
   * Provide the actions for the task treeview
   */
  private static taskTreeView() {
    const taskCommands: ActionTreeItem[] = [
      new ActionTreeItem("Clean project", "", { name: "debug-start", custom: false }, undefined, Commands.executeTerminalCommand, `gulp clean`),
      new ActionTreeItem("Bundle project (local)", "", { name: "debug-start", custom: false }, undefined, Commands.executeTerminalCommand, `gulp bundle`),
      new ActionTreeItem("Bundle project (production)", "", { name: "debug-start", custom: false }, undefined, Commands.executeTerminalCommand, `gulp bundle --ship`),
      new ActionTreeItem("Package (local)", "", { name: "debug-start", custom: false }, undefined, Commands.executeTerminalCommand, `gulp package-solution`),
      new ActionTreeItem("Package (production)", "", { name: "debug-start", custom: false }, undefined, Commands.executeTerminalCommand, `gulp package-solution --ship`),
      new ActionTreeItem("Serve", "", { name: "debug-start", custom: false }, undefined, Commands.executeTerminalCommand, `gulp serve`),
      new ActionTreeItem("Serve (nobrowser)", "", { name: "debug-start", custom: false }, undefined, Commands.executeTerminalCommand, `gulp serve --nobrowser`),
      new ActionTreeItem("Serve from configuration", "", { name: "debug-start", custom: false }, undefined, Commands.serveSolution),
    ];

    window.registerTreeDataProvider('pnp-view-tasks', new ActionTreeviewProvider(taskCommands));
  }

  /**
   * Provide the actions for the actions treeview
   */
  private static async actionsTreeView() {
    let actionCommands: ActionTreeItem[] = [
      new ActionTreeItem("Upgrade solution", "", { name: "arrow-up", custom: false }, undefined, Commands.upgradeSolution),
      new ActionTreeItem("Deploy solution (sppkg)", "", { name: "cloud-upload", custom: false }, undefined, Commands.deploySolution),
      new ActionTreeItem("Validate current project", "", { name: "check-all", custom: false }, undefined, Commands.validateSolution),
      new ActionTreeItem("View samples", "", { name: "library", custom: false }, undefined, Commands.showSampleGallery),
      new ActionTreeItem("Add new component", "", { name: "add", custom: false }, undefined, Commands.addToProject),
    ];
    
    window.registerTreeDataProvider('pnp-view-actions', new ActionTreeviewProvider(actionCommands));
  }

  /**
   * Provide the actions for the help treeview
   */
  private static helpTreeView() {
    const links = [
      {
        title: "Viva Connections Extensibility",
        url: "https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/overview-viva-connections",
        image: { name: "book", custom: false }
      },
      {
        title: "Viva Connections Design Guidance",
        url: "https://docs.microsoft.com/en-us/sharepoint/dev/spfx/viva/design/design-intro",
        image: { name: "book", custom: false }
      },
      {
        title: "Viva Connections samples",
        url: "https://adoption.microsoft.com/sample-solution-gallery?sortby=creationDateTime-true&keyword=&product=Viva&action=ajax_plugin_call_sample_solution_gallery",
        image: { name: "library", custom: false }
      },
      {
        title: "Learning path: Microsoft Viva Connections",
        url: "https://docs.microsoft.com/en-us/learn/modules/viva-connections-get-started/",
        image: { name: "mortar-board", custom: false }
      },
      {
        title: "Adaptive Card Designer",
        url: "https://adaptivecards.io/designer/",
        image: { name: "globe", custom: false }
      },
      {
        title: "Microsoft Graph REST API Documentation",
        url: "https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0",
        image: { name: "book", custom: false }
      },
      {
        title: "Microsoft Graph Explorer",
        url: "https://developer.microsoft.com/en-us/graph/graph-explorer",
        image: { name: "globe", custom: false }
      },
      {
        title: "Report an issue",
        url: "https://github.com/SharePoint/sp-dev-docs/issues/new/choose",
        image: { name: "github", custom: false }
      }
    ]


    const helpCommands: ActionTreeItem[] = links.map(link => new ActionTreeItem(link.title, "", link.image, undefined, 'vscode.open', Uri.parse(link.url)));
    window.registerTreeDataProvider('pnp-view-help', new ActionTreeviewProvider(helpCommands));
  }

  /**
   * Set the welcome view its context
   */
  private static showWelcome() {
    commands.executeCommand("setContext", ContextKeys.showWelcome, true);
  }
}