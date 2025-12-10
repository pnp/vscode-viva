import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../services/executeWrappers/CliCommandExecuter';
import { Folders } from '../../../services/check/Folders';
import { CommandOutput } from '@pnp/cli-microsoft365-spfx-toolkit';
import { getPackageManager } from '../../../utils';
import { SpfxCompatibilityMatrix } from '../../../constants';


interface ISharePointFrameworkProjectUpgrade {
    toVersion?: string;
}

export class SharePointFrameworkProjectUpgrade implements LanguageModelTool<ISharePointFrameworkProjectUpgrade> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointFrameworkProjectUpgrade>,
        _token: CancellationToken
    ) {
        try {
            const wsFolder = await Folders.getWorkspaceFolder();
            const packageManager = getPackageManager();
            const params = options.input;
            let toVersion = params.toVersion && params.toVersion.trim() !== '' ? params.toVersion : undefined;

            // in case toVersion is provided we need to set it to format x.y.z and validate if such a version exists in the SpfxCompatibilityMatrix
            toVersion = toVersion ? toVersion.match(/^(\d+\.\d+\.\d+)$/)?.[1] : undefined;
            if (toVersion) {
                const versionExists = SpfxCompatibilityMatrix.some(spfx => spfx.Version === toVersion);
                if (!versionExists) {
                    return new LanguageModelToolResult([new LanguageModelTextPart(`Error: The specified version ${toVersion} is not a valid SharePoint Framework version.`)]);
                }
            }

            let path: string | undefined;
            let result = undefined;
            if (wsFolder) {
                const workspacePath = wsFolder.uri.fsPath;
                result = await CliExecuter.execute('spfx project upgrade', 'json', { path: workspacePath, packageManager, toVersion });
            } else {
                result = await CliExecuter.execute('spfx project upgrade', 'json', { packageManager, toVersion });
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