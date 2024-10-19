import { PnPWebview } from './webview/PnPWebview';
import { CommandPanel } from './panels/CommandPanel';
import * as vscode from 'vscode';
import { workspace, commands } from 'vscode';
import { PROJECT_FILE, Scaffolder } from './services/actions/Scaffolder';
import { Extension } from './services/dataType/Extension';
import { Dependencies } from './services/actions/Dependencies';
import { unlinkSync, readFileSync } from 'fs';
import { TerminalCommandExecuter } from './services/executeWrappers/TerminalCommandExecuter';
import { AuthProvider } from './providers/AuthProvider';
import { CliActions } from './services/actions/CliActions';
import { PromptHandlers } from './chat/PromptHandlers';
import { CHAT_PARTICIPANT_NAME, ProjectFileContent } from './constants';
import { EntraAppRegistration } from './services/actions/EntraAppRegistration';


export async function activate(context: vscode.ExtensionContext) {

	const chatParticipant = vscode.chat.createChatParticipant(CHAT_PARTICIPANT_NAME, PromptHandlers.handle);
	chatParticipant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'images', 'parker-pnp.png');

	Extension.getInstance(context);

	TerminalCommandExecuter.register();

	AuthProvider.register();

	Dependencies.registerCommands();
	Scaffolder.registerCommands();
	CliActions.registerCommands();
	EntraAppRegistration.registerCommands();

	CommandPanel.register();

	PnPWebview.register();

	workspace.findFiles(PROJECT_FILE, '**/node_modules/**').then(async (files) => {
		if (files.length > 0) {
			const fileContents = readFileSync(files[0].fsPath, 'utf8');

			if (fileContents) {
				unlinkSync(files[0].fsPath);

				const terminalTitle = 'Installing dependencies';
				const terminalIcon = 'cloud-download';

				if (fileContents.indexOf(ProjectFileContent.init) > -1 || fileContents.indexOf(ProjectFileContent.initScenario) > -1) {
					await TerminalCommandExecuter.runCommand('npm i', [], terminalTitle, terminalIcon);
				}

				if (fileContents.indexOf(ProjectFileContent.initScenario) > -1) {
					commands.executeCommand('codetour.startTour');
				}

				if (fileContents.indexOf(ProjectFileContent.installReusablePropertyPaneControls) > -1) {
					await TerminalCommandExecuter.runCommand('npm install @pnp/spfx-property-controls --save --save-exact', [], terminalTitle, terminalIcon);
				}

				if (fileContents.indexOf(ProjectFileContent.installReusableReactControls) > -1) {
					await TerminalCommandExecuter.runCommand('npm install @pnp/spfx-controls-react --save --save-exact', [], terminalTitle, terminalIcon);
				}

				if (fileContents.indexOf(ProjectFileContent.installPnPJs) > -1) {
					await TerminalCommandExecuter.runCommand('npm install @pnp/sp @pnp/graph --save', [], terminalTitle, terminalIcon);
				}

				// If either of the following strings are found in the project file, run the command to get the node version
				if (fileContents.indexOf(ProjectFileContent.createNVMRCFile) > -1 || fileContents.indexOf(ProjectFileContent.createNodeVersionFile) > -1) {
					let nodeVersionCommand = 'node --version > ';
					if (fileContents.indexOf(ProjectFileContent.createNVMRCFile) > -1) {
						nodeVersionCommand += '.nvmrc';
					}
					else if (fileContents.indexOf(ProjectFileContent.createNodeVersionFile) > -1) {
						nodeVersionCommand += '.node-version';
					}
					await TerminalCommandExecuter.runCommand(nodeVersionCommand, [], terminalTitle, terminalIcon);
				}
			}
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
