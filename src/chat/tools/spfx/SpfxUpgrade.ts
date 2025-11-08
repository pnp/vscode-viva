import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../services/executeWrappers/CliCommandExecuter';
import { Folders } from '../../../services/check/Folders';
import { CommandOutput } from '@pnp/cli-microsoft365-spfx-toolkit';


interface ISharePointFrameworkProjectUpgrade { }

export class SharePointFrameworkProjectUpgrade implements LanguageModelTool<ISharePointFrameworkProjectUpgrade> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointFrameworkProjectUpgrade>,
        _token: CancellationToken
    ) {
        try {
            let result: CommandOutput;
            const wsFolder = await Folders.getWorkspaceFolder();

            if (wsFolder) {
                const workspacePath = wsFolder.uri.fsPath;
                result = await CliExecuter.execute('spfx project upgrade', 'json', { path: workspacePath });
            } else {
                result = await CliExecuter.execute('spfx project upgrade', 'json');
            }

            if (result.stderr) {
                return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
            }

            const response = `To perform the upgrade, follow these steps: ${result.stdout}. You should always build the project after the upgrade to ensure everything is working correctly and check for errors.`;

            return new LanguageModelToolResult([new LanguageModelTextPart(response)]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            return new LanguageModelToolResult([new LanguageModelTextPart(`Failed to upgrade SharePoint Framework project: ${errorMessage}`)]);
        }
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointFrameworkProjectUpgrade>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Upgrade SharePoint Framework project',
            message: new MarkdownString('Should I upgrade the SharePoint Framework project?'),
        };

        return {
            invocationMessage: 'Upgrading a SharePoint Framework project',
            confirmationMessages,
        };
    }
}