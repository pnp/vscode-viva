import { Event, ProviderResult, ThemeIcon, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';


export class ActionTreeDataProvider implements TreeDataProvider<any> {
  onDidChangeTreeData?: Event<TreeItem | null | undefined> | undefined;

  actions: ActionTreeItem[];

  constructor(actions: ActionTreeItem[] = []) {
    this.actions = [...actions];
  }

  getTreeItem(element: ActionTreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: ActionTreeItem | undefined): ProviderResult<TreeItem[]> {
    return element && (element as any).children ? Promise.resolve((element as any).children) : Promise.resolve(this.actions);
  }
}

export class ActionTreeItem extends TreeItem {

  children: ActionTreeItem[] = [];

  constructor(label: string, description?: string, image?: { name: string; custom: boolean }, collapsibleState?: TreeItemCollapsibleState, command?: any, args?: any, contextValue?: string, children?: ActionTreeItem[]) {
    super(label, children ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None);

    this.label = label;
    this.description = description;

    this.iconPath = image ? new ThemeIcon(image.name) : undefined;

    this.command = command ? {
      command: command,
      title: label,
      arguments: [args]
    } : undefined;

    this.contextValue = contextValue;

    if (children) {
      this.children = children;
    }
  }
}