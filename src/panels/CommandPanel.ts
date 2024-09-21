import { readFileSync } from 'fs';
import { commands, workspace, window, Uri } from 'vscode';
import { Commands, ContextKeys } from '../constants';
import { ActionTreeItem, ActionTreeDataProvider } from '../providers/ActionTreeDataProvider';
import { AuthProvider, M365AuthenticationSession } from '../providers/AuthProvider';
import { CliActions } from '../services/actions/CliActions';
import { DebuggerCheck } from '../services/check/DebuggerCheck';
import { EnvironmentInformation } from '../services/dataType/EnvironmentInformation';
import { TeamsToolkitIntegration } from '../services/dataType/TeamsToolkitIntegration';
import { AdaptiveCardCheck } from '../services/check/AdaptiveCardCheck';
import { Subscription } from '../models';
import { Extension } from '../services/dataType/Extension';
import { getExtensionSettings } from '../utils';
import { EntraApplicationCheck } from '../services/check/EntraApplicationCheck';
import { Notifications } from '../services/dataType/Notifications';


export class CommandPanel {

  public static register() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.refreshAppCatalogTreeView, CommandPanel.refreshEnvironmentTreeView)
    );
    subscriptions.push(
      commands.registerCommand(Commands.refreshAccountTreeView, CommandPanel.refreshAccountTreeView)
    );
    subscriptions.push(
      commands.registerCommand(Commands.welcome, () => commands.executeCommand('workbench.action.openWalkthrough', 'm365pnp.viva-connections-toolkit#spfx-toolkit-intro', false))
    );

    CommandPanel.init();
  }

  private static async init() {
    try {
      let isTeamsToolkitProject = false;
      let files = await workspace.findFiles('.yo-rc.json', '**/node_modules/**');

      if (files.length <= 0) {
        files = await workspace.findFiles('src/.yo-rc.json', '**/node_modules/**');
        isTeamsToolkitProject = true;
      }

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

      TeamsToolkitIntegration.isTeamsToolkitProject = isTeamsToolkitProject;

      AdaptiveCardCheck.validateACEComponent();
      CommandPanel.registerTreeView();
      AuthProvider.verify();
    } catch (error) {
      CommandPanel.showWelcome();
      Notifications.error('Error initializing the extension, please verify the project and try again.');
    }
  }

  private static registerTreeView() {
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

  private static refreshAccountTreeView(){
    const authInstance = AuthProvider.getInstance();
    if (authInstance) {
      authInstance.getAccount().then(account => CommandPanel.accountTreeView(account));
    }
  }

  private static async accountTreeView(session: M365AuthenticationSession | undefined) {
    const accountCommands: ActionTreeItem[] = [];

    if (session) {
      EntraApplicationCheck.validateEntraAppRegistrationComponent(session);

      commands.executeCommand('setContext', ContextKeys.isLoggedIn, true);

      accountCommands.push(new ActionTreeItem(session.account.label, '', { name: 'spo-m365', custom: true }, undefined, undefined, undefined, 'm365Account', []));
      accountCommands[0].children.push(new ActionTreeItem('Entra app registration', '', { name: 'entra-id', custom: true }, undefined, 'vscode.open', Uri.parse(`https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${session.clientId}`), 'sp-admin-api-url'));

      const appCatalogUrls = await CliActions.appCatalogUrlsGet();
      if (appCatalogUrls?.some) {
        const url = new URL(appCatalogUrls[0]);
        const originUrl = url.origin;
        const adminOriginUrl = originUrl.replace('.sharepoint.com', '-admin.sharepoint.com');
        const webApiPermissionManagementUrl = `${adminOriginUrl}/_layouts/15/online/AdminHome.aspx#/webApiPermissionManagement`;
        DebuggerCheck.validateUrl(originUrl);

        accountCommands[0].children.push(new ActionTreeItem('SharePoint', '', { name: 'spo-logo', custom: true }, undefined, undefined, undefined, undefined, [
          new ActionTreeItem(originUrl.replace('https://',''), '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(originUrl), 'sp-url'),
          new ActionTreeItem(adminOriginUrl.replace('https://',''), '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(adminOriginUrl), 'sp-admin-url'),
          new ActionTreeItem(webApiPermissionManagementUrl.replace(`${adminOriginUrl}/_layouts/15/online/AdminHome.aspx#/`, '...'), '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(webApiPermissionManagementUrl), 'sp-admin-api-url')
        ]));

        const showServiceIncidentList = getExtensionSettings('showServiceIncidentList', true);
        if (showServiceIncidentList === true) {
          const healthInfoList = await CliActions.getTenantHealthInfo();
          if (healthInfoList?.some)
          {
            const healthInfoItems: ActionTreeItem[] = [];
            for (let i = 0; i < healthInfoList.length; i++) {
              healthInfoItems.push(new ActionTreeItem(healthInfoList[i].Title, '', { name: 'm365-warning', custom: true } , undefined, 'vscode.open', Uri.parse(healthInfoList[i].Url), 'm365-health-service-url'));
            }
            if (healthInfoItems.length > 0) {
              accountCommands[0].children.push(new ActionTreeItem('Service health incidents', '', { name: 'm365-health', custom: true }, undefined, undefined, undefined, undefined, healthInfoItems));
            }
          }
        }
      }

      accountCommands[0].children.push(new ActionTreeItem('Sign out', '', { name: 'sign-out', custom: false }, undefined, Commands.logout));
      CommandPanel.environmentTreeView(appCatalogUrls);
    } else {
      EnvironmentInformation.reset();
      commands.executeCommand('setContext', ContextKeys.isLoggedIn, false);
      commands.executeCommand('setContext', ContextKeys.hasAppCatalog, false);
      accountCommands.push(new ActionTreeItem('Sign in to Microsoft 365', '', { name: 'sign-in', custom: false }, undefined, Commands.login));
    }

    window.createTreeView('pnp-view-account', { treeDataProvider: new ActionTreeDataProvider(accountCommands), showCollapseAll: true });
  }

  private static async refreshEnvironmentTreeView(){
    const appCatalogUrls = await CliActions.appCatalogUrlsGet();
    CommandPanel.environmentTreeView(appCatalogUrls);
  }

  private static async environmentTreeView(appCatalogUrls: string[] | undefined) {
    const environmentCommands: ActionTreeItem[] = [];

    if (!appCatalogUrls) {
      environmentCommands.push(new ActionTreeItem('No app catalog found', ''));
    } else {
      const tenantAppCatalogUrl = appCatalogUrls[0];
      const origin = new URL(tenantAppCatalogUrl).origin;
      commands.executeCommand('setContext', ContextKeys.hasAppCatalog, true);

      environmentCommands.push(
        new ActionTreeItem('Tenant App Catalog', '', { name: 'spo-logo', custom: true }, undefined, undefined, undefined, undefined, [
          new ActionTreeItem(tenantAppCatalogUrl.replace(origin, '...'), '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(tenantAppCatalogUrl), 'sp-app-catalog-url')
        ]),
      );

      const showTenantWideExtensions = getExtensionSettings('showTenantWideExtensions', true);

      if (showTenantWideExtensions === true) {
        const tenantWideExtensions = await CliActions.getTenantWideExtensions(tenantAppCatalogUrl);
        const tenantWideExtensionsList: ActionTreeItem[] = [];
        if (tenantWideExtensions && tenantWideExtensions?.length > 0) {
          tenantWideExtensions.forEach((extension) => {
            tenantWideExtensionsList.push(new ActionTreeItem(extension.Title, '', { name: 'spo-app', custom: true }, undefined, 'vscode.open', Uri.parse(extension.Url), 'sp-app-catalog-tenant-wide-extensions-url'));
          });
        }
      else {
        tenantWideExtensionsList.push(new ActionTreeItem('none', '', undefined, undefined, undefined, undefined, undefined));
      }

        environmentCommands.push(new ActionTreeItem('Tenant-wide Extensions', '', { name: 'spo-app-list', custom: true }, undefined, undefined, undefined, 'sp-app-catalog-tenant-wide-extensions', tenantWideExtensionsList));
      }

      const siteAppCatalogActionItems: ActionTreeItem[] = [];
      for (let i = 1; i < appCatalogUrls.length; i++) {
        siteAppCatalogActionItems.push(new ActionTreeItem(appCatalogUrls[i].replace(origin, '...'), '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse(appCatalogUrls[i]), 'sp-app-catalog-url'));
      }
      if (siteAppCatalogActionItems.length > 0) {
        environmentCommands.push(new ActionTreeItem('Site App Catalogs', '', { name: 'spo-logo', custom: true }, undefined, undefined, undefined, undefined, siteAppCatalogActionItems));
      }
    }

    window.createTreeView('pnp-view-environment', { treeDataProvider: new ActionTreeDataProvider(environmentCommands), showCollapseAll: true });
  }

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

    window.registerTreeDataProvider('pnp-view-tasks', new ActionTreeDataProvider(taskCommands));
  }

  private static async actionsTreeView() {
    const actionCommands: ActionTreeItem[] = [
      new ActionTreeItem('Upgrade project', '', { name: 'arrow-up', custom: false }, undefined, Commands.upgradeProject),
      new ActionTreeItem('Validate project', '', { name: 'check-all', custom: false }, undefined, Commands.validateProject),
      new ActionTreeItem('Rename project', '', { name: 'whole-word', custom: false }, undefined, Commands.renameProject),
      new ActionTreeItem('Grant API permissions', '', { name: 'workspace-trusted', custom: false }, undefined, Commands.grantAPIPermissions),
      new ActionTreeItem('Deploy project (sppkg)', '', { name: 'cloud-upload', custom: false }, undefined, Commands.deployProject),
      new ActionTreeItem('Add new component', '', { name: 'add', custom: false }, undefined, Commands.addToProject),
      new ActionTreeItem('CI/CD Workflow', '', { name: 'rocket', custom: false }, undefined, Commands.pipeline),
      new ActionTreeItem('View samples', '', { name: 'library', custom: false }, undefined, Commands.samplesGallery),
    ];

    window.registerTreeDataProvider('pnp-view-actions', new ActionTreeDataProvider(actionCommands));
  }

  private static helpTreeView() {
    const helpCommands: ActionTreeItem[] = [
      new ActionTreeItem('Docs & Learning', '', undefined, undefined, undefined, undefined, undefined, [
        new ActionTreeItem('Overview of the SharePoint Framework', '', { name: 'book', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview')),
        new ActionTreeItem('Overview of Viva Connections Extensibility', '', { name: 'book', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/sharepoint/dev/spfx/viva/overview-viva-connections')),
        new ActionTreeItem('Overview of Microsoft Graph', '', { name: 'book', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/graph/overview?view=graph-rest-1.0')),
        new ActionTreeItem('Learning path: Extend Microsoft SharePoint - Associate', '', { name: 'mortar-board', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/training/paths/m365-sharepoint-associate/')),
        new ActionTreeItem('Learning path: Extend Microsoft Viva Connections', '', { name: 'mortar-board', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/training/paths/m365-extend-viva-connections/')),
        new ActionTreeItem('Learning path: Microsoft Graph Fundamentals', '', { name: 'mortar-board', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/training/paths/m365-msgraph-fundamentals/'))
      ]),
      new ActionTreeItem('Resources & Tooling', '', undefined, undefined, undefined, undefined, undefined, [
        new ActionTreeItem('Microsoft Graph Explorer', '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse('https://developer.microsoft.com/en-us/graph/graph-explorer')),
        new ActionTreeItem('Teams Toolkit', '', { name: 'tools', custom: false }, undefined, 'vscode.open', Uri.parse('https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension')),
        new ActionTreeItem('Adaptive Card Previewer', '', { name: 'tools', custom: false }, undefined, 'vscode.open', Uri.parse('https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.vscode-adaptive-cards')),
        new ActionTreeItem('SharePoint Embedded', '', { name: 'tools', custom: false }, undefined, 'vscode.open', Uri.parse('https://marketplace.visualstudio.com/items?itemName=SharepointEmbedded.ms-sharepoint-embedded-vscode-extension')),
        new ActionTreeItem('Adaptive Card Designer', '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse('https://adaptivecards.io/designer/')),
        new ActionTreeItem('Join the Microsoft 365 Developer Program', '', { name: 'star-empty', custom: false }, undefined, 'vscode.open', Uri.parse('https://developer.microsoft.com/en-us/microsoft-365/dev-program')),
        new ActionTreeItem('Sample Solution Gallery', '', { name: 'library', custom: false }, undefined, 'vscode.open', Uri.parse('https://adoption.microsoft.com/en-us/sample-solution-gallery/'))
      ]),
      new ActionTreeItem('Community', '', undefined, undefined, undefined, undefined, undefined, [
        new ActionTreeItem('Microsoft 365 & Power Platform Community Home', '', { name: 'organization', custom: false }, undefined, 'vscode.open', Uri.parse('https://pnp.github.io/')),
        new ActionTreeItem('Join the Microsoft 365 & Power Platform Community Discord Server', '', { name: 'feedback', custom: false }, undefined, 'vscode.open', Uri.parse('https://aka.ms/community/discord'))
      ]),
      new ActionTreeItem('Support', '', undefined, undefined, undefined, undefined, undefined, [
        new ActionTreeItem('Wiki', '', { name: 'question', custom: false }, undefined, 'vscode.open', Uri.parse('https://github.com/pnp/vscode-viva/wiki')),
        new ActionTreeItem('Report an issue', '', { name: 'github', custom: false }, undefined, 'vscode.open', Uri.parse('https://github.com/pnp/vscode-viva/issues/new/choose')),
        new ActionTreeItem('Start Walkthrough', '', { name: 'info', custom: false }, undefined, Commands.welcome)
      ])
    ];

    window.createTreeView('pnp-view-help', { treeDataProvider: new ActionTreeDataProvider(helpCommands), showCollapseAll: true });
  }

  private static showWelcome() {
    commands.executeCommand('setContext', ContextKeys.showWelcome, true);
  }
}