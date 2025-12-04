import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointPageGetParameters {
    webUrl: string;
    name?: string;
    default?: boolean;
    metadataOnly?: boolean;
}

export class SharePointPageGet implements LanguageModelTool<ISharePointPageGetParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointPageGetParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo page get', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Page retrieved successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointPageGetParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Get a SharePoint Online page',
            message: new MarkdownString('Should I get a page with the following parameters?'),
        };

        return {
            invocationMessage: 'Getting SharePoint Online page',
            confirmationMessages,
        };
    }
}
