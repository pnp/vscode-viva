import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from './ToolAuthValidationUtil';


interface ISharePointAppUpgradeParameters {
    siteUrl: string;
    id: string;
    appCatalogScope?: string;
}

export class SharePointAppUpgrade implements LanguageModelTool<ISharePointAppUpgradeParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointAppUpgradeParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const commandOptions: any = {
            siteUrl: params.siteUrl,
            id: params.id
        };

        if (params.appCatalogScope && params.appCatalogScope.toLowerCase() === 'sitecollection') {
            commandOptions.appCatalogScope = 'sitecollection';
        }

        const result = await CliExecuter.execute('spo app upgrade', 'json', commandOptions);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        const isSiteCollection = commandOptions.appCatalogScope === 'sitecollection';

        return new LanguageModelToolResult([new LanguageModelTextPart(`App upgraded successfully from ${isSiteCollection ? 'site collection' : 'tenant'} app catalog on site ${params.siteUrl}${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointAppUpgradeParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const isSiteCollection = params.appCatalogScope?.toLowerCase() === 'sitecollection';
        const scope = isSiteCollection ? 'site collection' : 'tenant';

        const confirmationMessages = {
            title: `Upgrade an app from ${scope} app catalog`,
            message: new MarkdownString(`Should I upgrade app with ID ${params.id} from ${scope} app catalog to its latest version on site ${params.siteUrl}?`),
        };

        return {
            invocationMessage: `Upgrading app from ${scope} app catalog to latest version on site ${params.siteUrl}`,
            confirmationMessages,
        };
    }
}
