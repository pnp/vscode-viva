import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from './ToolAuthValidationUtil';


interface ISharePointPageAddParameters {
    title: string;
    webUrl: string;
    baseTemplate?: string;
    description?: string;
}

export class SharePointPageAdd implements LanguageModelTool<ISharePointPageAddParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointPageAddParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo page add', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Page created successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointPageAddParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Create a new SharePoint Online page',
            message: new MarkdownString('Should I create a new Page with the following parameters?'),
        };

        return {
            invocationMessage: 'Creating a new SharePoint Online page',
            confirmationMessages,
        };
    }
}