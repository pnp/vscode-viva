import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointSiteListParameters {
    type?: string;
    webTemplate?: string;
    filter?: string;
    withOneDriveSites?: boolean;
}

export class SharePointSiteList implements LanguageModelTool<ISharePointSiteListParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointSiteListParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const cmdArgs: Record<string, unknown> = { ...params };
        if (!params.withOneDriveSites) {
            delete cmdArgs.withOneDriveSites;
        }

        const result = await CliExecuter.execute('spo site list', 'csv', cmdArgs);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Sites retrieved successfully${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointSiteListParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'List SharePoint Online sites',
            message: new MarkdownString('Should I retrieve the list of sites from the tenant?'),
        };

        return {
            invocationMessage: 'Getting SharePoint Online sites',
            confirmationMessages,
        };
    }
}
