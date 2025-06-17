import { commands, window } from 'vscode';
import { Commands } from '../../constants';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { Notifications } from '../dataType/Notifications';
import { increaseVersion } from '../../utils/increaseVersion';


export class IncreaseVersionActions {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.increaseVersion, IncreaseVersionActions.increaseVersion)
    );
  }

  /**
   * Increases the version of the project.
   */
  public static async increaseVersion() {
    const versionType = await window.showQuickPick(['major', 'minor', 'patch'], {
      placeHolder: 'Select the version type to increase',
      ignoreFocusOut: true,
      canPickMany: false,
      title: 'Increase Version'
    });

    if (!versionType) {
      return;
    }

    await increaseVersion(versionType as 'major' | 'minor' | 'patch');
    Notifications.info('Version increased successfully.');
  }
}