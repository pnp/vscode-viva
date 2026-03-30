import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointAppListParameters {
    appCatalogScope?: string;
    appCatalogUrl?: string;
}

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

        const commandOptions: any = params.appCatalogUrl && params.appCatalogUrl.trim() !== '' ? {
            appCatalogScope: 'sitecollection',
            appCatalogUrl: params.appCatalogUrl
        } : {};

        const result = await CliExecuter.execute('spo app list', 'csv', commandOptions);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        const isSiteCollection = commandOptions.appCatalogScope === 'sitecollection';

        return new LanguageModelToolResult([new LanguageModelTextPart(`Apps from ${isSiteCollection ? 'site collection' : 'tenant'} app catalog${isSiteCollection ? ` from ${params.appCatalogUrl}` : ''} retrieved successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointAppListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const commandOptions: any = params.appCatalogUrl && params.appCatalogUrl.trim() !== '' ? {
            appCatalogScope: 'sitecollection',
            appCatalogUrl: params.appCatalogUrl
        } : {};

        const isSiteCollection = commandOptions.appCatalogScope === 'sitecollection';
        const scope = isSiteCollection ? 'site collection' : 'tenant';
        const location = isSiteCollection ? ` from ${params.appCatalogUrl}` : '';

        const confirmationMessages = {
            title: `List apps from SharePoint Online ${scope} app catalog`,
            message: new MarkdownString(`Should I retrieve all apps from SharePoint Online ${scope} app catalog${location}?`),
        };

        return {
            invocationMessage: `Getting apps from SharePoint Online ${scope} app catalog${location}`,
            confirmationMessages,
        };
    }
}