import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointAppInstanceListParameters {
    siteUrl: string;
}

export class SharePointAppInstanceList implements LanguageModelTool<ISharePointAppInstanceListParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointAppInstanceListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo app instance list', 'csv', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Installed apps from ${params.siteUrl} retrieved successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointAppInstanceListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;

        const confirmationMessages = {
            title: `List installed apps from ${params.siteUrl}`,
            message: new MarkdownString(`Should I retrieve all installed apps from ${params.siteUrl}?`),
        };

        return {
            invocationMessage: `Getting installed apps from ${params.siteUrl}`,
            confirmationMessages,
        };
    }
}