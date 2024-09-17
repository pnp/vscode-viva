import { workspace, window, WorkspaceFolder } from 'vscode';


export class Folders {

  /**
   * Retrieves the workspace folder.
   * @returns A promise that resolves to the workspace folder, or undefined if there are no workspace folders or the user cancels the selection.
   */
  public static async getWorkspaceFolder(): Promise<WorkspaceFolder | undefined> {
    let folder: WorkspaceFolder | undefined;

    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
      return undefined;
    } else if (workspace.workspaceFolders.length === 1) {
      folder = workspace.workspaceFolders[0];
    } else {
      folder = await window.showWorkspaceFolderPick({ placeHolder: 'Select the workspace folder' });
      if (!folder) {
        return undefined;
      }
    }

    return folder;
  }
}