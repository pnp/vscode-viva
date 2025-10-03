import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointAppListParameters {}

export class SharePointAppList implements LanguageModelTool<ISharePointAppListParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointAppListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo app list', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Apps from tenant app catalog retrieved successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointAppListParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'List apps from SharePoint Online tenant app catalog',
            message: new MarkdownString('Should I retrieve all apps from SharePoint Online tenant app catalog?'),
        };

        return {
            invocationMessage: 'Getting apps from SharePoint Online tenant app catalog',
            confirmationMessages,
        };
    }
}