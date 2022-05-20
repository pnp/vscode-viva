import { writeFileSync } from "fs";
import { workspace } from "vscode";
import { VSCodeLaunch } from "../models";
import { Notifications } from "./Notifications";


export class DebuggerCheck {
  private static placeholderUrl = "https://enter-your-SharePoint-site";

  /**
   * Check if the URL is used in the launch.json file
   * @param url 
   */
  public static async validateUrl(url: string) {
    const launchFiles = await workspace.findFiles("**/.vscode/launch.json", "**/node_modules/**");

    if (!launchFiles || launchFiles.length <= 0) {
      return;
    }

    for (const file of launchFiles) {
      let content: VSCodeLaunch | string = await workspace.openTextDocument(file.fsPath).then(doc => doc.getText());
    
      if (!content) {
        continue;
      }

      content = typeof content === "string" ? JSON.parse(content) as VSCodeLaunch : content;

      for (const config of content.configurations) {
        if (config.url.toLowerCase().startsWith(this.placeholderUrl.toLowerCase())) {
          const answer = await Notifications.info(`The debug config "${config.name}", uses the placeholder URL. Do you want to update it with the ${url}?`, "yes", "no");

          if (answer === "yes") {
            const newUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
            config.url = `${newUrl}/_layouts/workbench.aspx`;
          }
        }
      }

      writeFileSync(file.fsPath, JSON.stringify(content, null, 2), "utf8");
    }
  }
}