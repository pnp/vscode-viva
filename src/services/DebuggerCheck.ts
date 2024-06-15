import { ServeConfig } from './../models/ServeConfig';
import { writeFileSync } from 'fs';
import { workspace } from 'vscode';
import { VSCodeLaunch } from '../models';
import { Notifications } from './Notifications';
import { Logger } from './Logger';


export class DebuggerCheck {
  private static launchPlaceholderUrl = 'https://enter-your-SharePoint-site';
  private static servePlaceholderUrl = 'https://contoso.sharepoint.com';

  /**
   * Validates the provided URL by checking the launch.json and serve.json files.
   * If any errors occur during validation, they will be logged using the Logger.
   * @param url - The URL to validate.
   */
  public static async validateUrl(url: string) {
    try {
      await DebuggerCheck.validateLaunch(url);
    } catch (e) {
      Logger.error(`Error validating launch.json: ${e}`);
    }

    try {
      await DebuggerCheck.validateServe(url);
    } catch (e) {
      Logger.error(`Error validating serve.json: ${e}`);
    }
  }

  /**
   * Validates the launch configuration and updates the placeholder URL with the provided URL.
   * @param url The URL to update the placeholder URL with.
   */
  private static async validateLaunch(url: string) {
    let launchFiles = await workspace.findFiles('.vscode/launch.json', '**/node_modules/**');

    if (!launchFiles || launchFiles.length <= 0) {
      launchFiles = await workspace.findFiles('src/.vscode/launch.json', '**/node_modules/**');
    }

    if (!launchFiles || launchFiles.length <= 0) {
      return;
    }

    for (const file of launchFiles) {
      let needsUpdate = false;
      let content: VSCodeLaunch | string = await workspace.openTextDocument(file.fsPath).then(doc => doc.getText());

      if (!content) {
        continue;
      }

      content = typeof content === 'string' ? JSON.parse(content) as VSCodeLaunch : content;

      for (const config of content.configurations) {

        if (config.url.toLowerCase().startsWith(this.launchPlaceholderUrl.toLowerCase())) {
          const answer = await Notifications.info(`The debug config '${config.name}', uses the placeholder URL. Do you want to update it with the ${url}?`, 'yes', 'no');

          if (answer === 'yes') {
            const newUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
            config.url = `${newUrl}/_layouts/workbench.aspx`;
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        writeFileSync(file.fsPath, JSON.stringify(content, null, 2), 'utf8');
      }
    }
  }

  /**
   * Validates the serve configuration by checking if the initialPage and serveConfigurations
   * use placeholder URLs and prompts the user to update them with the provided URL.
   * If the user chooses to update, the URLs are modified and the serve configuration file is saved.
   * @param url - The URL to be used as a replacement for the placeholder URLs.
   */
  private static async validateServe(url: string) {
    let serveFiles = await workspace.findFiles('config/serve.json', '**/node_modules/**');

    if (!serveFiles || serveFiles.length <= 0) {
      serveFiles = await workspace.findFiles('src/config/serve.json', '**/node_modules/**');
    }

    if (!serveFiles || serveFiles.length <= 0) {
      return;
    }

    for (const file of serveFiles) {
      let needsUpdate = false;
      let content: ServeConfig | string = await workspace.openTextDocument(file.fsPath).then(doc => doc.getText());

      if (!content) {
        continue;
      }

      content = typeof content === 'string' ? JSON.parse(content) as ServeConfig : content;

      if (content.initialPage?.toLowerCase().startsWith(this.servePlaceholderUrl.toLowerCase()) ||
        content.initialPage?.toLowerCase().startsWith(this.launchPlaceholderUrl.toLowerCase())) {
        const answer = await Notifications.info(`The serve config 'initialPage', uses the placeholder URL. Do you want to update it with the ${url}?`, 'yes', 'no');

        if (answer === 'yes') {
          const newUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
          content.initialPage = `${newUrl}/_layouts/workbench.aspx`;
          needsUpdate = true;
        }
      }

      for (const configKey in content.serveConfigurations) {
        const config = content.serveConfigurations[configKey];

        if (config.pageUrl.toLowerCase().startsWith(this.servePlaceholderUrl.toLowerCase()) ||
          config.pageUrl.toLowerCase().startsWith(this.launchPlaceholderUrl.toLowerCase())) {
          const answer = await Notifications.info(`The serve config '${configKey}', uses the placeholder URL. Do you want to update it with the ${url}?`, 'yes', 'no');

          if (answer === 'yes') {
            const newUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
            config.pageUrl = `${newUrl}/_layouts/workbench.aspx`;
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        writeFileSync(file.fsPath, JSON.stringify(content, null, 2), 'utf8');
      }
    }
  }
}