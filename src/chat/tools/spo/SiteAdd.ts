import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { AuthProvider } from '../../../providers/AuthProvider';
import { CliExecuter } from '../../../services/executeWrappers/CliCommandExecuter';

interface ISharePointSiteAddParameters {
    type: string;
    title: string;
    description?: string;
    owners?: string[];
    url?: string;
}

export class SharePointSiteAdd implements LanguageModelTool<ISharePointSiteAddParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointSiteAddParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authInstance = AuthProvider.getInstance();
        const account = await authInstance.getAccount();
        if (!account) {
            return new LanguageModelToolResult([new LanguageModelTextPart('The SPFx Toolkit tools are only available when you are signed in to your Microsoft 365 tenant. Please sign in first.')]);
        }
        const result = await CliExecuter.execute('spo site add', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Site created successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointSiteAddParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Create a new SharePoint Online site',
            message: new MarkdownString('Should I create a new Site with the following parameters?'),
        };

        return {
            invocationMessage: 'Creating a new SharePoint Online site',
            confirmationMessages,
        };
    }
}