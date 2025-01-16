import { commands, extensions } from 'vscode';
import { Commands } from '../../constants';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { Notifications } from '../dataType/Notifications';
import { sleep } from '../../utils/sleep';
import { Logger } from '../dataType/Logger';


export class CopilotActions {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.openCopilot, CopilotActions.openCopilot)
    );
  }

  public static async openCopilot() {
    if (CopilotActions.isGithubCopilotInstalled()) {
      await sleep(1000); // wait for extension activation
      try {
        const options = {
          query: '@spfx ',
          isPartialQuery: true,
        };
        await commands.executeCommand('workbench.panel.chat.view.copilot.focus');
        await commands.executeCommand('workbench.action.chat.open', options);
      } catch (e) {
        Notifications.error('Failed to open GitHub Copilot.');
        Logger.error((e as Error).message);
      }
    } else {
      Notifications.warning('Please install GitHub Copilot extension to use this feature.');
    }
  }

  private static isGithubCopilotInstalled(): boolean {
    const extension = extensions.getExtension('github.copilot-chat');
    return !!extension;
  }
}