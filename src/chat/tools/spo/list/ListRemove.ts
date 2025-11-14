import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointListRemoveParameters {
    title: string;
    webUrl: string;
    recycle?: boolean;
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

        const result = await CliExecuter.execute('spo list remove', 'json', {
            title: params.title,
            webUrl: params.webUrl,
            recycle: params.recycle ?? false,
            force: true
        });
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        const recycleAction = params.recycle ? 'recycled' : 'permanently removed';
        return new LanguageModelToolResult([new LanguageModelTextPart(`List ${recycleAction} successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
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