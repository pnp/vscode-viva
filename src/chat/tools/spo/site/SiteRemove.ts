import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointSiteRemoveParameters {
    url: string;
}

export class SharePointSiteRemove implements LanguageModelTool<ISharePointSiteRemoveParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointSiteRemoveParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo site remove', 'json', {
            url: params.url,
            force: true
        });

        return new LanguageModelToolResult([new LanguageModelTextPart(`Site removed successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointSiteRemoveParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Remove a SharePoint Online site',
            message: new MarkdownString('Should I remove a Site with the following parameters?'),
        };

        return {
            invocationMessage: 'Removing SharePoint Online site',
            confirmationMessages,
        };
    }
}