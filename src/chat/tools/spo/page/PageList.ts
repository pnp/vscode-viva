import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointPageListParameters {
    webUrl: string;
}

export class SharePointPageList implements LanguageModelTool<ISharePointPageListParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointPageListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo page list', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Pages retrieved successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointPageListParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'List SharePoint Online pages',
            message: new MarkdownString('Should I list pages with the following parameters?'),
        };

        return {
            invocationMessage: 'Listing SharePoint Online pages',
            confirmationMessages,
        };
    }
}
