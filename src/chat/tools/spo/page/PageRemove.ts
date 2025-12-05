import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointPageRemoveParameters {
    name: string;
    webUrl: string;
    recycle?: boolean;
    bypassSharedLock?: boolean;
}

export class SharePointPageRemove implements LanguageModelTool<ISharePointPageRemoveParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointPageRemoveParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo page remove', 'json', {
            name: params.name,
            webUrl: params.webUrl,
            recycle: params.recycle ?? false,
            bypassSharedLock: params.bypassSharedLock ?? false,
            force: true
        });
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        const action = params.recycle ? 'recycled' : 'permanently deleted';
        return new LanguageModelToolResult([new LanguageModelTextPart(`Page ${action} successfully${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointPageRemoveParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const action = params.recycle ? 'recycle' : 'permanently delete';
        const confirmationMessages = {
            title: 'Remove a SharePoint Online page',
            message: new MarkdownString(`Should I ${action} the page '${params.name}' from the site ${params.webUrl}?`),
        };

        return {
            invocationMessage: 'Removing a SharePoint Online page',
            confirmationMessages,
        };
    }
}
