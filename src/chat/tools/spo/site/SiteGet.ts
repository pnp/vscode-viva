import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointSiteGetParameters {
    url: string;
}

export class SharePointSiteGet implements LanguageModelTool<ISharePointSiteGetParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointSiteGetParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo site get', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Site retrieved successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointSiteGetParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Get a SharePoint Online site',
            message: new MarkdownString('Should I get a Site with the following parameters?'),
        };

        return {
            invocationMessage: 'Getting SharePoint Online site',
            confirmationMessages,
        };
    }
}