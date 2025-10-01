import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointAppUninstallParameters {
    siteUrl: string;
    id: string;
    appCatalogScope?: string;
}

export class SharePointAppUninstall implements LanguageModelTool<ISharePointAppUninstallParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointAppUninstallParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo app uninstall', 'json', { ...params, force: true });
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`App uninstalled successfully from site ${params.siteUrl}${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointAppUninstallParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;

        const confirmationMessages = {
            title: 'Uninstall an app from site',
            message: new MarkdownString(`Should I uninstall app with ID ${params.id} from site ${params.siteUrl}?`),
        };

        return {
            invocationMessage: `Uninstalling app from site ${params.siteUrl}`,
            confirmationMessages,
        };
    }
}