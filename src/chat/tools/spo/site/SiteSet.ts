import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointSiteSetParameters {
    url: string;
    title?: string;
    description?: string;
    classification?: string;
    disableFlows?: boolean;
    socialBarOnSitePagesDisabled?: boolean;
    isPublic?: boolean;
    owners?: string;
    shareByEmailEnabled?: boolean;
    siteDesignId?: string;
    sharingCapability?: string;
    siteLogoUrl?: string;
    siteThumbnailUrl?: string;
    resourceQuota?: number;
    resourceQuotaWarningLevel?: number;
    storageQuota?: number;
    storageQuotaWarningLevel?: number;
    allowSelfServiceUpgrade?: boolean;
    lockState?: string;
    noScriptSite?: boolean;
    wait?: boolean;
}

export class SharePointSiteSet implements LanguageModelTool<ISharePointSiteSetParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointSiteSetParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo site set', 'json', {
            ...params,
            wait: params.wait ?? false
        });
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Site updated successfully${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointSiteSetParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;

        const confirmationMessages = {
            title: 'Update a SharePoint Online site',
            message: new MarkdownString(`Should I update the site '${params.url}' with the specified settings?`),
        };

        return {
            invocationMessage: 'Updating a SharePoint Online site',
            confirmationMessages,
        };
    }
}
