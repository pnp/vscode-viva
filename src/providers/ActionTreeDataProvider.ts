import { Event, ProviderResult, ThemeIcon, TreeDataProvider, TreeItem, TreeItemCollapsibleState, EventEmitter } from 'vscode';


export class ActionTreeDataProvider implements TreeDataProvider<any> {
  private _onDidChangeTreeData: EventEmitter<ActionTreeItem | undefined | void> = new EventEmitter<ActionTreeItem | undefined | void>();
  readonly onDidChangeTreeData: Event<ActionTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  actions: ActionTreeItem[];

  constructor(actions: ActionTreeItem[] = []) {
    this.actions = [...actions];
  }

  getTreeItem(element: ActionTreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: ActionTreeItem | undefined): ProviderResult<TreeItem[]> {
    if (element) {
      return element.fetchChildren();
    }
    return this.actions;
  }

  refresh(element?: ActionTreeItem): void {
    this._onDidChangeTreeData.fire(element);
  }
}

export class ActionTreeItem extends TreeItem {
  children: ActionTreeItem[] | undefined;
  loadChildren: (() => Promise<ActionTreeItem[]>) | undefined;

  constructor(label: string, description?: string, image?: { name: string; custom: boolean }, collapsibleState?: TreeItemCollapsibleState, command?: any, args?: any, contextValue?: string, children?: ActionTreeItem[], loadChildren?: () => Promise<ActionTreeItem[]>) {
    super(label, collapsibleState);

    this.label = label;
    this.description = description;
    this.iconPath = image ? new ThemeIcon(image.name) : undefined;

    this.command = command ? {
      command: command,
      title: label,
      arguments: Array.isArray(args) ? args : [args]
    } : undefined;

    this.contextValue = contextValue;

    if (children) {
      this.children = children;
    }
    else if (collapsibleState === TreeItemCollapsibleState.Collapsed) {
      this.children = undefined;
    }

    this.loadChildren = loadChildren;
  }

  async fetchChildren() {
    if (this.loadChildren && !this.children) {
      this.children = await this.loadChildren();
    }
    return this.children || [];
  }
}