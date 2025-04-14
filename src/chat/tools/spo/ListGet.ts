import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from './ToolAuthValidationUtil';


interface ISharePointListGetParameters {
    title: string;
    webUrl: string;
}

export class SharePointListGet implements LanguageModelTool<ISharePointListGetParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointListGetParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo list get', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`List retrieved successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointListGetParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Get a SharePoint Online list',
            message: new MarkdownString('Should I get a list with the following parameters?'),
        };

        return {
            invocationMessage: 'Getting a new SharePoint Online list',
            confirmationMessages,
        };
    }
}