import { join } from 'path';
import { commands, Uri, ViewColumn, Webview, WebviewPanel, window, env } from 'vscode';
import { Commands, WebViewType, WebViewTypes, WebviewCommand } from '../constants';
import { Extension } from '../services/Extension';
import { Logger } from '../services/Logger';
import { Scaffolder } from '../services/Scaffolder';
import { CliActions } from '../services/CliActions';


export class PnPWebview {
  public static webview: WebviewPanel | null = null;
  private static isDisposed: boolean = true;

  public static register() {
    const ext = Extension.getInstance();
    const subscriptions = ext.subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.samplesGallery, () => PnPWebview.open(WebViewType.samplesGallery))
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
  public static async open(type: WebViewType, data?: any) {
    if (PnPWebview.isOpen) {
      PnPWebview.reveal(type, data);
    } else {
      PnPWebview.create(type, data);
    }
  }

  /**
   * Reveal the dashboard if it is open
   */
  public static reveal(type: WebViewType, data?: any) {
    if (PnPWebview.webview) {
      const webViewType = WebViewTypes.find(viewType => viewType.value === type);
      PnPWebview.webview.reveal();
      PnPWebview.webview.title = webViewType?.Title as string;
      const messageData: any = { 'webViewType': type };

      if (data && data.spfxPackageName) {
        messageData.spfxPackageName = data.spfxPackageName;
      }

      if (data && data.appCatalogUrls) {
        messageData.appCatalogUrls = data.appCatalogUrls;
      }

      if (data && data.isNewProject !== undefined) {
        messageData.isNewProject = data.isNewProject;
      }

      PnPWebview.postMessage(WebviewCommand.toWebview.viewType, messageData);
    }
  }

  /**
   * Creates a new webview
   */
  public static async create(type: WebViewType, data?: any) {
    const ext = Extension.getInstance();

    PnPWebview.webview = window.createWebviewPanel(
      'spfx-toolkit.webview',
      'PnP',
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [Uri.file(join(ext.extensionPath, 'dist'))]
      }
    );

    PnPWebview.webview.iconPath = {
      dark: Uri.file(join(ext.extensionPath, 'assets/logo-dark.svg')),
      light: Uri.file(join(ext.extensionPath, 'assets/logo-light.svg'))
    };

    PnPWebview.isDisposed = false;

    const webViewType = WebViewTypes.find(viewType => viewType.value === type);
    const webViewData: any = { homePageUrl: webViewType?.homePageUrl as string };

    if (data && data.spfxPackageName) {
      webViewData.spfxPackageName = data['spfxPackageName'];
    }

    if (data && data.appCatalogUrls) {
      webViewData.appCatalogUrls = data.appCatalogUrls;
    }

    if (data && data.isNewProject !== undefined) {
      webViewData.isNewProject = data.isNewProject;
    }

    PnPWebview.webview.webview.html = PnPWebview.getWebviewContent(PnPWebview.webview.webview, webViewData);

    PnPWebview.webview.title = webViewType?.Title as string;

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
				case WebviewCommand.toVSCode.redirectTo:
					env.openExternal(Uri.parse(payload));
					break;
				case WebviewCommand.toVSCode.createWorkFlow:
					CliActions.generateWorkflowForm(payload);
					break;
				case WebviewCommand.toVSCode.pickFolder:
					Scaffolder.pickFolder();
					break;
				case WebviewCommand.toVSCode.validateSolutionName:
					Scaffolder.validateSolutionName(
						payload.folderPath,
						payload.solutionNameInput
					);
					break;
				case WebviewCommand.toVSCode.createSpfxProject:
					Scaffolder.createProject(payload);
					break;
				case WebviewCommand.toVSCode.validateComponentName:
					Scaffolder.validateComponentName(
						payload.componentType,
						payload.componentNameInput
					);
					break;
				case WebviewCommand.toVSCode.addSpfxComponent:
					Scaffolder.addComponentToProject(payload);
					break;
				case WebviewCommand.toVSCode.createNodeVersionFileDefaultValue:
					Scaffolder.createNodeVersionFileDefaultValue();
					break;
				case WebviewCommand.toVSCode.nodeVersionManagerFile:
					Scaffolder.nodeVersionManagerFile();
					break;
				case WebviewCommand.toVSCode.nodeVersionManager:
					Scaffolder.nodeVersionManager();
					break;
			}
    });
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
   * @param dataAttr
   * @returns
   */
  /* eslint-disable quotes */
  private static getWebviewContent(webView: Webview, dataAttr: { [key: string]: string } = {}): string {
    const localServer = 'http://localhost';
    const devPort = 9000;
    const bundleName = 'vscode-webview';
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
      `connect-src https: https://raw.githubusercontent.com/pnp/vscode-viva/main/data/sp-dev-fx-samples.json ${isProd ? `` : `ws://localhost:${devPort} ws://0.0.0.0:${devPort} ${localServer}:${devPort} http://0.0.0.0:${devPort}`}`,
    ];

    // Provide additional data attributes for the webview
    dataAttr['version'] = version;

    const dataAttributes = Object.keys(dataAttr).map(key => `data-${key}='${dataAttr[key]}'`).join(' ');

    return `
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