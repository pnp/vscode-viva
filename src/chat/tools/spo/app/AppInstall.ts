import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointAppInstallParameters {
    siteUrl: string;
    id: string;
}

export class SharePointAppInstall implements LanguageModelTool<ISharePointAppInstallParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointAppInstallParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo app install', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`App installed successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointAppInstallParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Install an app in the site',
            message: new MarkdownString('Should I install an app in the site?'),
        };

        return {
            invocationMessage: 'Installing an app in the site',
            confirmationMessages,
        };
    }
}