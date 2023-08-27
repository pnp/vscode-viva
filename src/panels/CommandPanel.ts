import { readFileSync } from 'fs';
import { commands, workspace, window, Uri } from 'vscode';
import { Commands, ContextKeys } from '../constants';
import { ActionTreeItem, ActionTreeviewProvider } from '../providers/ActionTreeviewProvider';
import { AuthProvider, M365AuthenticationSession } from '../providers/AuthProvider';
import { CliActions } from '../services/CliActions';
import { DebuggerCheck } from '../services/DebuggerCheck';
import { EnvironmentInformation } from '../services/EnvironmentInformation';


export class CommandPanel {

  public static register() {
    CommandPanel.init();
  }

  /**
   * Initialize the command panel
   * @returns
   */
  private static async init() {
    const files = await workspace.findFiles('.yo-rc.json', '**/node_modules/**');
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
    if (!json || !json['@microsoft/generator-sharepoint']) {
      CommandPanel.showWelcome();
      return;
    }

    commands.executeCommand('setContext', ContextKeys.isSPFxProject, true);
    commands.executeCommand('setContext', ContextKeys.showWelcome, false);

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
      });
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
      commands.executeCommand('setContext', ContextKeys.isLoggedIn, true);
      accountCommands.push(new ActionTreeItem(session.account.label, '', { name: 'M365', custom: true }, undefined, undefined, undefined, 'm365Account', [
        new ActionTreeItem('Sign out', '', { name: 'sign-out', custom: false }, undefined, Commands.logout)
      ]));

      CommandPanel.environmentTreeView();
    } else {
      EnvironmentInformation.reset();
      commands.executeCommand('setContext', ContextKeys.isLoggedIn, false);
      commands.executeCommand('setContext', ContextKeys.hasAppCatalog, false);
      accountCommands.push(new ActionTreeItem('Sign in to M365', '', { name: 'M365', custom: true }, undefined, Commands.login));
    }

    window.registerTreeDataProvider('pnp-view-account', new ActionTreeviewProvider(accountCommands));
  }

  /**
   * Provide the actions for the environment treeview
   */
  private static async environmentTreeView() {
    const appCatalogUrls = await CliActions.appCatalogUrlsGet();

    const environmentCommands: ActionTreeItem[] = [];

    if (!appCatalogUrls) {
      environmentCommands.push(new ActionTreeItem('No app catalog found', ''));
    } else {
      const tenantAppCatalogUrl = appCatalogUrls[0]!;
      const url = new URL(tenantAppCatalogUrl);
      commands.executeCommand('setContext', ContextKeys.hasAppCatalog, true);

      const origin = url.origin;
      DebuggerCheck.validateUrl(origin);

      environmentCommands.push(
        new ActionTreeItem('SharePoint', '', { name: 'sharepoint', custom: true }, undefined, undefined, undefined, undefined, [
          new ActionTreeItem(origin, '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(origin), 'sp-url')
        ]),
        new ActionTreeItem('SharePoint Tenant App Catalog', '', { name: 'sharepoint', custom: true }, undefined, undefined, undefined, undefined, [
          new ActionTreeItem(tenantAppCatalogUrl.replace(origin, '...'), '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(tenantAppCatalogUrl), 'sp-app-catalog-url')
        ]),
      );

      const siteAppCatalogActionItems: ActionTreeItem[] = [];
      for (let i = 1; i < appCatalogUrls.length; i++) {
        siteAppCatalogActionItems.push(new ActionTreeItem(appCatalogUrls[i].replace(origin, '...'), '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(appCatalogUrls[i]), 'sp-app-catalog-url'));
      }
      if (siteAppCatalogActionItems.length > 0) {
        environmentCommands.push(new ActionTreeItem('SharePoint Site App Catalogs', '', { name: 'sharepoint', custom: true }, undefined, undefined, undefined, undefined, siteAppCatalogActionItems));
      }
    }

    window.registerTreeDataProvider('pnp-view-environment', new ActionTreeviewProvider(environmentCommands));
  }

  /**
   * Provide the actions for the task treeview
   */
  private static taskTreeView() {
    const taskCommands: ActionTreeItem[] = [
      new ActionTreeItem('Clean project', '', { name: 'debug-start', custom: false }, undefined, Commands.executeTerminalCommand, 'gulp clean'),
      new ActionTreeItem('Bundle project (local)', '', { name: 'debug-start', custom: false }, undefined, Commands.executeTerminalCommand, 'gulp bundle'),
      new ActionTreeItem('Bundle project (production)', '', { name: 'debug-start', custom: false }, undefined, Commands.executeTerminalCommand, 'gulp bundle --ship'),
      new ActionTreeItem('Package (local)', '', { name: 'debug-start', custom: false }, undefined, Commands.executeTerminalCommand, 'gulp package-solution'),
      new ActionTreeItem('Package (production)', '', { name: 'debug-start', custom: false }, undefined, Commands.executeTerminalCommand, 'gulp package-solution --ship'),
      new ActionTreeItem('Serve', '', { name: 'debug-start', custom: false }, undefined, Commands.executeTerminalCommand, 'gulp serve'),
      new ActionTreeItem('Serve (nobrowser)', '', { name: 'debug-start', custom: false }, undefined, Commands.executeTerminalCommand, 'gulp serve --nobrowser'),
      new ActionTreeItem('Serve from configuration', '', { name: 'debug-start', custom: false }, undefined, Commands.serveProject),
    ];

    window.registerTreeDataProvider('pnp-view-tasks', new ActionTreeviewProvider(taskCommands));
  }

  /**
   * Provide the actions for the actions treeview
   */
  private static async actionsTreeView() {
    const actionCommands: ActionTreeItem[] = [
      new ActionTreeItem('Upgrade project', '', { name: 'arrow-up', custom: false }, undefined, Commands.upgradeProject),
      new ActionTreeItem('Validate current project', '', { name: 'check-all', custom: false }, undefined, Commands.validateProject),
      new ActionTreeItem('Rename current project', '', { name: 'whole-word', custom: false }, undefined, Commands.renameProject),
      new ActionTreeItem('Grant API permissions', '', { name: 'workspace-trusted', custom: false }, undefined, Commands.grantAPIPermissions),
      new ActionTreeItem('Deploy project (sppkg)', '', { name: 'cloud-upload', custom: false }, undefined, Commands.deployProject),
      new ActionTreeItem('Add new component', '', { name: 'add', custom: false }, undefined, Commands.addToProject),
      new ActionTreeItem('View SPFx web part samples', '', { name: 'library', custom: false }, undefined, Commands.showWebpartSampleGallery),
      new ActionTreeItem('View SPFx extension samples', '', { name: 'library', custom: false }, undefined, Commands.showExtensionsSampleGallery),
      new ActionTreeItem('View ACEs samples', '', { name: 'library', custom: false }, undefined, Commands.showACESampleGallery),
      new ActionTreeItem('View ACEs scenarios', '', { name: 'library', custom: false }, undefined, Commands.showACEScenariosGallery),
    ];

    window.registerTreeDataProvider('pnp-view-actions', new ActionTreeviewProvider(actionCommands));
  }

  /**
   * Provide the actions for the help treeview
   */
  private static helpTreeView() {
    const links = [
      {
        title: 'Overview of Viva Connections Extensibility',
        url: 'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/viva/overview-viva-connections',
        image: { name: 'book', custom: false }
      },
      {
        title: 'Overview of the SharePoint Framework',
        url: 'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview',
        image: { name: 'book', custom: false }
      },
      {
        title: 'Overview of Microsoft Graph',
        url: 'https://learn.microsoft.com/en-us/graph/overview?view=graph-rest-1.0',
        image: { name: 'book', custom: false }
      },
      {
        title: 'Learning path: Extend Microsoft Viva Connections',
        url: 'https://learn.microsoft.com/en-us/training/paths/m365-extend-viva-connections/',
        image: { name: 'mortar-board', custom: false }
      },
      {
        title: 'Learning path: Extend Microsoft SharePoint - Associate',
        url: 'https://learn.microsoft.com/en-us/training/paths/m365-sharepoint-associate/',
        image: { name: 'mortar-board', custom: false }
      },
      {
        title: 'Learning path: Microsoft Graph Fundamentals',
        url: 'https://learn.microsoft.com/en-us/training/paths/m365-msgraph-fundamentals/',
        image: { name: 'mortar-board', custom: false }
      },
      {
        title: 'Sample Solution Gallery',
        url: 'https://adoption.microsoft.com/en-us/sample-solution-gallery/',
        image: { name: 'library', custom: false }
      },
      {
        title: 'Adaptive Card Designer',
        url: 'https://adaptivecards.io/designer/',
        image: { name: 'globe', custom: false }
      },
      {
        title: 'Microsoft Graph Explorer',
        url: 'https://developer.microsoft.com/en-us/graph/graph-explorer',
        image: { name: 'globe', custom: false }
      },
      {
        title: 'Join the Microsoft 365 Developer Program',
        url: 'https://developer.microsoft.com/en-us/microsoft-365/dev-program',
        image: { name: 'star-empty', custom: false }
      },
      {
        title: 'Microsoft 365 & Power Platform Community Home',
        url: 'https://pnp.github.io/',
        image: { name: 'organization', custom: false }
      },
      {
        title: 'Join the Microsoft 365 & Power Platform Community Discord Server',
        url: 'https://aka.ms/community/discord',
        image: { name: 'feedback', custom: false }
      },
      {
        title: 'Wiki',
        url: 'https://github.com/pnp/vscode-viva/wiki/How-to',
        image: { name: 'question', custom: false }
      },
      {
        title: 'Report an issue',
        url: 'https://github.com/pnp/vscode-viva/issues/new/choose',
        image: { name: 'github', custom: false }
      }
    ];

    const helpCommands: ActionTreeItem[] = links.map(link => new ActionTreeItem(link.title, '', link.image, undefined, 'vscode.open', Uri.parse(link.url)));
    window.registerTreeDataProvider('pnp-view-help', new ActionTreeviewProvider(helpCommands));
  }

  /**
   * Set the welcome view its context
   */
  private static showWelcome() {
    commands.executeCommand('setContext', ContextKeys.showWelcome, true);
  }
}