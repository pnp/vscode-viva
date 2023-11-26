import { extensions, workspace, env, Uri } from 'vscode';
import { Logger } from './Logger';
import { YoRc } from '../models';
import { Notifications } from './Notifications';


export class AdaptiveCardCheck {
  /**
   * Check if yo-rc has ACE component
   */
  public static async validateACEComponent() {
    try {
      const vsCodeAdaptiveCardsExtension = extensions.getExtension('TeamsDevApp.vscode-adaptive-cards');

      if (vsCodeAdaptiveCardsExtension) {
        return;
      }

      let yoRcFiles = await workspace.findFiles('.yo-rc.json', '**/node_modules/**');

      if (!yoRcFiles || yoRcFiles.length <= 0) {
        yoRcFiles = await workspace.findFiles('src/.yo-rc.json', '**/node_modules/**');
      }

      if (!yoRcFiles || yoRcFiles.length <= 0) {
        return;
      }

      for (const file of yoRcFiles) {
        let content: YoRc | string = await workspace.openTextDocument(file.fsPath).then(doc => doc.getText());

        if (!content) {
          continue;
        }

        content = typeof content === 'string' ? JSON.parse(content) as YoRc : content;

        if(content && content['@microsoft/generator-sharepoint'] && content['@microsoft/generator-sharepoint'].aceTemplateType) {
          const answer = await Notifications.info('Consider installing Adaptive Card Previewer to boost your productivity with ACE projects. Would you like to install the extension?', 'yes', 'no');

          if (answer === 'yes') {
            env.openExternal(Uri.parse('https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.vscode-adaptive-cards'));
          }
        }
      }
    } catch (e) {
      Logger.error(`Error validating launch.json: ${e}`);
    }
  }
}