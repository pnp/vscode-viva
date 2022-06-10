import { join } from "path";
import { commands, Uri, ViewColumn, Webview, WebviewPanel, window } from "vscode";
import { Commands } from "../constants";
import { Extension } from "../services/Extension";
import { Logger } from "../services/Logger";
import { WebviewCommand } from "../constants";
import { WebviewType } from "./WebviewType";
import { Scaffolder } from "../services/Scaffolder";


export class PnPWebview {
  public static webview: WebviewPanel | null = null;
  private static isDisposed: boolean = true;

  public static register() { 
    const ext = Extension.getInstance();
    const subscriptions = ext.subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.showSampleGallery, () => PnPWebview.open(WebviewType.SampleGallery))
    );
    subscriptions.push(
      commands.registerCommand(Commands.showScenariosGallery, () => PnPWebview.open(WebviewType.ScenarioGallery))
    );
  }

  /**
   * Check if the dashboard is still open
   */
  public static get isOpen(): boolean {
    return !PnPWebview.isDisposed;
  }

  /**
   * Open or reveal the webview
   */
   public static async open(type: WebviewType) {    
    if (PnPWebview.isOpen) {
			PnPWebview.reveal(type);
		} else {
			PnPWebview.create(type);
		}
  }

  /**
   * Reveal the dashboard if it is open
   */
   public static reveal(type: WebviewType) {
    if (PnPWebview.webview) {
      PnPWebview.setTitle(type);
      PnPWebview.webview.reveal();

      if (type) {
        PnPWebview.postMessage(WebviewCommand.toWebview.viewType, type);
      }
    }
  }

  /**
   * Creates a new webview
   */
  public static async create(type: WebviewType) {
    const ext = Extension.getInstance();

    PnPWebview.webview = window.createWebviewPanel(
      'viva-connections-toolkit.webview',
      'PnP',
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [Uri.file(join(ext.extensionPath, "dist"))]
      }
    );

    PnPWebview.webview.iconPath = {
      dark: Uri.file(join(ext.extensionPath, 'assets/logo-dark.svg')),
      light: Uri.file(join(ext.extensionPath, 'assets/logo-light.svg'))
    };

    PnPWebview.isDisposed = false;

    PnPWebview.webview.webview.html = PnPWebview.getWebviewContent(PnPWebview.webview.webview, type);

    PnPWebview.setTitle(type);

    PnPWebview.webview.onDidDispose(async () => {
      PnPWebview.isDisposed = true;
      this.close();
    });

    // Listen to the messages from the webview
    PnPWebview.webview.webview.onDidReceiveMessage(async (msg) => {
      const { command, payload } = msg;

      switch (command) {
        case WebviewCommand.toVSCode.logError:
          Logger.error(payload);
          break;
        case WebviewCommand.toVSCode.useSample:
          Scaffolder.useSample(payload);
          break;
      }
    });
  }

  /**
   * Set the title of the webview
   * @param type 
   * @returns 
   */
  public static setTitle(type: WebviewType) {
    if (!PnPWebview.webview) {
      return;
    }

    switch (type) {
      case WebviewType.SampleGallery:
        PnPWebview.webview.title = 'Sample Gallery';
        break;
      case WebviewType.ScenarioGallery:
        PnPWebview.webview.title = 'Scenario Gallery';
        break;
    }
  }

  /**
   * Close the webview 
   */
  public static close() {
    PnPWebview.webview?.dispose();
  }

  /**
   * Send messages to the webview
   * @param command 
   * @param data 
   */
  public static postMessage(command: string, data?: any) {
    if (command) {
      Logger.info(`[${command}]: ${data ? JSON.stringify(data) : 'no data provided'}`);
      
      this.webview?.webview.postMessage({
        command,
        payload: data
      });
    }
  }

  /**
   * Create the webview HTML content
   * @param webView 
   * @param type 
   * @param dataAttr 
   * @returns 
   */
  private static getWebviewContent(webView: Webview, type: WebviewType, dataAttr: { [key: string]: string } = {}): string {
    const localServer = "http://localhost";
    const devPort = 9000;
    const bundleName = "vscode-webview";
    const jsFile = `${bundleName}.js`;
  
    let scriptUrl = null;
    
    const ext = Extension.getInstance();
    const isProd = ext.isProductionMode;
    const version = ext.version;
    
    if (isProd) {
      scriptUrl = webView.asWebviewUri(Uri.file(join(ext.extensionPath, 'dist', jsFile))).toString();
    } else {
      scriptUrl = `${localServer}:${devPort}/${jsFile}`;
    }

    const csp = [
      `default-src 'none'`,
      `style-src http: https: 'self' 'unsafe-inline'`,
      `script-src http: https: 'self' 'unsafe-inline' 'unsafe-eval'`,
      `img-src http: https: blob: data: 'self'`,
      `font-src 'self' https: ${isProd ? `` : `${localServer}:${devPort}`}`,
      `connect-src https://pnp.github.io/sp-dev-fx-aces/samples.json ${isProd ? `` : `ws://localhost:${devPort} ws://0.0.0.0:${devPort} ${localServer}:${devPort} http://0.0.0.0:${devPort}`}`,
    ];

    // Provide additional data attributes for the webview
    dataAttr["version"] = version;
    dataAttr["type"] = type;

    const dataAttributes = Object.keys(dataAttr).map(key => `data-${key}="${dataAttr[key]}"`).join(' ');
    
    return  `
    <!DOCTYPE html>
    <html lang="en" style="width:100%;height:100%;margin:0;padding:0;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="${csp.join(`; `)}">
    </head>
    <body style="width:100%;height:100%;margin:0;padding:0;">
      <div id="root" ${dataAttributes} style="width:100%;height:100%;margin:0;padding:0;"></div>
  
      <script crossorigin src="${scriptUrl}"></script>
    </body>
    </html>`;
  }
}