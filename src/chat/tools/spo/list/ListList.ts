import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointListListParameters {
    webUrl: string;
}

export class SharePointListList implements LanguageModelTool<ISharePointListListParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointListListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo list list', 'csv', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Lists retrieved successfully from ${params.webUrl}${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointListListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;

        const confirmationMessages = {
            title: 'List SharePoint Online lists',
            message: new MarkdownString(`Should I retrieve all lists from ${params.webUrl}?`),
        };

        return {
            invocationMessage: `Getting lists from ${params.webUrl}`,
            confirmationMessages,
        };
    }
}
