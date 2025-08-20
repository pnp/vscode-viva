import { Uri, TreeItemCollapsibleState } from 'vscode';
import { ActionTreeItem } from '../providers/ActionTreeDataProvider';
import { Commands } from '../constants';



export const helpCommands: ActionTreeItem[] = [
    new ActionTreeItem('Docs & Learning', '', undefined, TreeItemCollapsibleState.Expanded, undefined, undefined, undefined, [
        new ActionTreeItem('Overview of the SharePoint Framework', '', { name: 'book', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview')),
        new ActionTreeItem('Overview of Viva Connections Extensibility', '', { name: 'book', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/sharepoint/dev/spfx/viva/overview-viva-connections')),
        new ActionTreeItem('Overview of Microsoft Graph', '', { name: 'book', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/graph/overview?view=graph-rest-1.0')),
        new ActionTreeItem('Learning path: Extend Microsoft SharePoint - Associate', '', { name: 'mortar-board', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/training/paths/m365-sharepoint-associate/')),
        new ActionTreeItem('Learning path: Extend Microsoft Viva Connections', '', { name: 'mortar-board', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/training/paths/m365-extend-viva-connections/')),
        new ActionTreeItem('Learning path: Microsoft Graph Fundamentals', '', { name: 'mortar-board', custom: false }, undefined, 'vscode.open', Uri.parse('https://learn.microsoft.com/en-us/training/paths/m365-msgraph-fundamentals/'))
    ]),
    new ActionTreeItem('Resources & Tooling', '', undefined, TreeItemCollapsibleState.Expanded, undefined, undefined, undefined, [
        new ActionTreeItem('Microsoft Graph Explorer', '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse('https://developer.microsoft.com/en-us/graph/graph-explorer')),
        new ActionTreeItem('Microsoft 365 Agents Toolkit', '', { name: 'tools', custom: false }, undefined, 'vscode.open', Uri.parse('https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension')),
        new ActionTreeItem('Adaptive Card Previewer', '', { name: 'tools', custom: false }, undefined, 'vscode.open', Uri.parse('https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.vscode-adaptive-cards')),
        new ActionTreeItem('SharePoint Embedded', '', { name: 'tools', custom: false }, undefined, 'vscode.open', Uri.parse('https://marketplace.visualstudio.com/items?itemName=SharepointEmbedded.ms-sharepoint-embedded-vscode-extension')),
        new ActionTreeItem('Adaptive Card Designer', '', { name: 'globe', custom: false }, undefined, 'vscode.open', Uri.parse('https://adaptivecards.microsoft.com/designer')),
        new ActionTreeItem('Join the Microsoft 365 Developer Program', '', { name: 'star-empty', custom: false }, undefined, 'vscode.open', Uri.parse('https://developer.microsoft.com/en-us/microsoft-365/dev-program')),
        new ActionTreeItem('Sample Solution Gallery', '', { name: 'library', custom: false }, undefined, 'vscode.open', Uri.parse('https://adoption.microsoft.com/en-us/sample-solution-gallery/'))
    ]),
    new ActionTreeItem('Community', '', undefined, TreeItemCollapsibleState.Expanded, undefined, undefined, undefined, [
        new ActionTreeItem('Microsoft 365 & Power Platform Community Home', '', { name: 'organization', custom: false }, undefined, 'vscode.open', Uri.parse('https://pnp.github.io/')),
        new ActionTreeItem('Join the Microsoft 365 & Power Platform Community Discord Server', '', { name: 'feedback', custom: false }, undefined, 'vscode.open', Uri.parse('https://aka.ms/community/discord'))
    ]),
    new ActionTreeItem('Support', '', undefined, TreeItemCollapsibleState.Expanded, undefined, undefined, undefined, [
        new ActionTreeItem('Docs', '', { name: 'question', custom: false }, undefined, 'vscode.open', Uri.parse('https://pnp.github.io/vscode-viva/')),
        new ActionTreeItem('Report an issue', '', { name: 'github', custom: false }, undefined, 'vscode.open', Uri.parse('https://github.com/pnp/vscode-viva/issues/new/choose')),
        new ActionTreeItem('Start Walkthrough', '', { name: 'info', custom: false }, undefined, Commands.welcome)
    ])
];