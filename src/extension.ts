import { PnPWebview } from './webview/PnPWebview';
import { CommandPanel } from './panels/CommandPanel';
import * as vscode from 'vscode';
import { workspace, window, ThemeIcon, commands } from 'vscode';
import { PROJECT_FILE, Scaffolder } from './services/Scaffolder';
import { Extension } from './services/Extension';
import { Dependencies } from './services/Dependencies';
import { unlinkSync, readFileSync } from 'fs';
import { TerminalCommandExecuter } from './services/TerminalCommandExecuter';
import { AuthProvider } from './providers/AuthProvider';
import { CliActions } from './services/CliActions';
import { PromptHandlers } from './chat/PromptHandlers';
import { CHAT_PARTICIPANT_NAME, ProjectFileContent } from './constants';


export async function activate(context: vscode.ExtensionContext) {

	const chatParticipant = vscode.chat.createChatParticipant(CHAT_PARTICIPANT_NAME, PromptHandlers.handle);
	chatParticipant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'pnp-logo.png');

	Extension.getInstance(context);

	TerminalCommandExecuter.register();

	AuthProvider.register();

	Dependencies.registerCommands();
	Scaffolder.registerCommands();
	CliActions.registerCommands();

	CommandPanel.register();

	PnPWebview.register();

	workspace.findFiles(PROJECT_FILE, '**/node_modules/**').then(async (files) => {
		if (files.length > 0) {
			const fileContents = readFileSync(files[0].fsPath, 'utf8');

			if (fileContents) {
				unlinkSync(files[0].fsPath);

				const terminal = window.createTerminal({
					name: 'Installing dependencies',
					iconPath: new ThemeIcon('cloud-download')
				});

				if (fileContents.indexOf(ProjectFileContent.init) > -1 || fileContents.indexOf(ProjectFileContent.initScenario) > -1) {
					terminal.sendText('npm i');
				}

				if (fileContents.indexOf(ProjectFileContent.initScenario) > -1) {
					commands.executeCommand('codetour.startTour');
				}

				if (fileContents.indexOf(ProjectFileContent.installReusablePropertyPaneControls) > -1) {
					terminal.sendText('npm install @pnp/spfx-property-controls --save --save-exact');
				}

				if (fileContents.indexOf(ProjectFileContent.installReusableReactControls) > -1) {
					terminal.sendText('npm install @pnp/spfx-controls-react --save --save-exact');
				}

				if (fileContents.indexOf(ProjectFileContent.installPnPJs) > -1) {
					terminal.sendText('npm install @pnp/sp @pnp/graph --save');
				}

				terminal.show(true);
			}
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
