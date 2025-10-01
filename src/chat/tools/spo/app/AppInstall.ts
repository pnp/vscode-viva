import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointAppInstallParameters {
    siteUrl: string;
    id: string;
    appCatalogScope?: string;
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

        const isSiteCollection = params.appCatalogScope?.toLowerCase() === 'sitecollection';

        return new LanguageModelToolResult([new LanguageModelTextPart(`App installed successfully from ${isSiteCollection ? 'site collection' : 'tenant'} app catalog to site ${params.siteUrl}${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointAppInstallParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const isSiteCollection = params.appCatalogScope?.toLowerCase() === 'sitecollection';
        const scope = isSiteCollection ? 'site collection' : 'tenant';

        const confirmationMessages = {
            title: `Install an app from ${scope} app catalog`,
            message: new MarkdownString(`Should I install an app with ID ${params.id} from ${scope} app catalog to site ${params.siteUrl}?`),
        };

        return {
            invocationMessage: `Installing app from ${scope} app catalog to site ${params.siteUrl}`,
            confirmationMessages,
        };
    }
}