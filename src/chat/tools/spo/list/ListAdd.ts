import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointListAddParameters {
    title: string;
    webUrl: string;
    baseTemplate?: string;
    description?: string;
}

export class SharePointListAdd implements LanguageModelTool<ISharePointListAddParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointListAddParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo list add', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`List created successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointListAddParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Create a new SharePoint Online list',
            message: new MarkdownString('Should I create a new List with the following parameters?'),
        };

        return {
            invocationMessage: 'Creating a new SharePoint Online list',
            confirmationMessages,
        };
    }
}