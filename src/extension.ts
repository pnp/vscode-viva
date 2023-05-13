import { PnPWebview } from './webview/PnPWebview';
import { CommandPanel } from './panels/CommandPanel';
import { workspace, window, ThemeIcon, commands } from 'vscode';
import { PROJECT_FILE, Scaffolder } from './services/Scaffolder';
import { Extension } from './services/Extension';
import { ExtensionContext } from 'vscode';
import { Dependencies } from './services/Dependencies';
import { unlinkSync, readFileSync } from 'fs';
import { Terminal } from './services/Terminal';
import { AuthProvider } from './providers/AuthProvider';
import { CliActions } from './services/CliActions';
import { ProjectFileContent } from './constants';

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
			const fileContents = readFileSync(files[0].fsPath, 'utf8');

			if (fileContents && (fileContents === ProjectFileContent.init || fileContents === ProjectFileContent.initScenario)) {
				unlinkSync(files[0].fsPath);

				const terminal = window.createTerminal({
					name: `Installing dependencies`,
					iconPath: new ThemeIcon('cloud-download')
				});
		
				if (terminal) {
					terminal.sendText(`npm i`);
					terminal.show(true);
				}

				if (fileContents === ProjectFileContent.initScenario) {
					commands.executeCommand('codetour.startTour');
				}
			}
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
