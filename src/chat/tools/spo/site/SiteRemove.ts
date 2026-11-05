import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointSiteRemoveParameters {
    url: string;
    skipRecycleBin?: boolean;
    fromRecycleBin?: boolean;
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
            skipRecycleBin: params.skipRecycleBin ?? false,
            fromRecycleBin: params.fromRecycleBin ?? false,
            force: true
        });
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        const removeAction = params.fromRecycleBin
            ? 'permanently removed from the recycle bin'
            : params.skipRecycleBin
                ? 'permanently removed'
                : 'moved to the recycle bin';
        return new LanguageModelToolResult([new LanguageModelTextPart(`Site ${removeAction} successfully ${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointSiteRemoveParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const permanent = params.skipRecycleBin || params.fromRecycleBin;
        const message = params.fromRecycleBin
            ? `Should I permanently remove the site '${params.url}' from the recycle bin? This cannot be undone.`
            : params.skipRecycleBin
                ? `Should I permanently remove the site '${params.url}' without moving it to the recycle bin? This cannot be undone.`
                : `Should I remove the site '${params.url}' and move it to the recycle bin?`;

        const confirmationMessages = {
            title: permanent ? 'Permanently remove a SharePoint Online site' : 'Remove a SharePoint Online site',
            message: new MarkdownString(message),
        };

        return {
            invocationMessage: 'Removing SharePoint Online site',
            confirmationMessages,
        };
    }
}