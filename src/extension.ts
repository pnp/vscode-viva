import { PnPWebview } from './webview/PnPWebview';
import { CommandPanel } from './panels/CommandPanel';
import { workspace, window, ThemeIcon } from 'vscode';
import { PROJECT_FILE, Scaffolder } from './services/Scaffolder';
import { Extension } from './services/Extension';
import { ExtensionContext } from 'vscode';
import { Dependencies } from './services/Dependencies';
import { unlinkSync } from 'fs';
import { Terminal } from './services/Terminal';
import { AuthProvider } from './providers/AuthProvider';
import { CliActions } from './services/CliActions';

export async function activate(context: ExtensionContext) {
	Extension.getInstance(context);

	Terminal.register();

	AuthProvider.register();

	Dependencies.registerCommands();
	Scaffolder.registerCommands();

	CliActions.registerCommands();

	CommandPanel.register();

	PnPWebview.register();

	workspace.findFiles(PROJECT_FILE, `**/node_modules/**`).then(async (files) => {
		if (files.length > 0) {
			unlinkSync(files[0].fsPath);

			const terminal = window.createTerminal({
				name: `Installing dependencies`,
				iconPath: new ThemeIcon('cloud-download')
			});
	
			if (terminal) {
				terminal.sendText(`npm i`);
				terminal.show(true);
			}
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
