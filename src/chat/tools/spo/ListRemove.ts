import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from './ToolAuthValidationUtil';


interface ISharePointListRemoveParameters {
    title: string;
    webUrl: string;
}

export class SharePointListRemove implements LanguageModelTool<ISharePointListRemoveParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointListRemoveParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo list add', 'json', {
            title: params.title,
            webUrl: params.webUrl,
            force: true
        });
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`List removed successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointListRemoveParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Remove a SharePoint Online list',
            message: new MarkdownString('Should I remove a List with the following parameters?'),
        };

        return {
            invocationMessage: 'Removing a SharePoint Online list',
            confirmationMessages,
        };
    }
}