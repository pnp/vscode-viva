import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointPageCopyParameters {
    webUrl: string;
    sourceName: string;
    targetUrl: string;
    overwrite?: boolean;
}

export class SharePointPageCopy implements LanguageModelTool<ISharePointPageCopyParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointPageCopyParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo page copy', 'json', {
            webUrl: params.webUrl,
            sourceName: params.sourceName,
            targetUrl: params.targetUrl,
            overwrite: params.overwrite ?? false
        });

        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`Page copied successfully from '${params.sourceName}' to '${params.targetUrl}'${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointPageCopyParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const confirmationMessages = {
            title: 'Copy a SharePoint Online page',
            message: new MarkdownString(`Should I copy the page '${params.sourceName}' to '${params.targetUrl}'?`),
        };

        return {
            invocationMessage: 'Copying a SharePoint Online page',
            confirmationMessages,
        };
    }
}
