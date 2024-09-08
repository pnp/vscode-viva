import { extensions, env, Uri } from 'vscode';
import { Logger } from '../dataType/Logger';
import { Notifications } from '../dataType/Notifications';
import { parseYoRc } from '../../utils/parseYoRc';


export class AdaptiveCardCheck {

  /**
   * Validates the ACE (Adaptive Card Extension) component.
   * If the required extension is not installed, prompts the user to install it.
   * @returns A promise that resolves when the validation is complete.
   */
  public static async validateACEComponent() {
    try {
      const vsCodeAdaptiveCardsExtension = extensions.getExtension('TeamsDevApp.vscode-adaptive-cards');

      if (vsCodeAdaptiveCardsExtension) {
        return;
      }

      const content = await parseYoRc();

      if(content && content['@microsoft/generator-sharepoint'] && content['@microsoft/generator-sharepoint'].aceTemplateType) {
        const answer = await Notifications.info('Consider installing Adaptive Card Previewer to boost your productivity with ACE projects. Would you like to install the extension?', 'yes', 'no');

        if (answer === 'yes') {
          env.openExternal(Uri.parse('https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.vscode-adaptive-cards'));
        }
      }
    } catch (e) {
      Logger.error(`Error validating launch.json: ${e}`);
    }
  }
}