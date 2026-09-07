import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { CliExecuter } from '../../../../services/executeWrappers/CliCommandExecuter';
import { validateAuth } from '../utils/ToolAuthValidationUtil';


interface ISharePointListSetParameters {
    webUrl: string;
    id?: string;
    title?: string;
    url?: string;
    newTitle?: string;
    description?: string;
    allowDeletion?: boolean;
    contentTypesEnabled?: boolean;
    disableCommenting?: boolean;
    disableGridEditing?: boolean;
    draftVersionVisibility?: string;
    enableFolderCreation?: boolean;
    enableMinorVersions?: boolean;
    enableVersioning?: boolean;
    forceCheckout?: boolean;
    hidden?: boolean;
    noCrawl?: boolean;
}

export class SharePointListSet implements LanguageModelTool<ISharePointListSetParameters> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointListSetParameters>,
        _token: CancellationToken
    ) {
        const params = options.input;
        const authValidationResult = await validateAuth();
        if (authValidationResult !== true) {
            return authValidationResult as LanguageModelToolResult;
        }

        const result = await CliExecuter.execute('spo list set', 'json', params);
        if (result.stderr) {
            return new LanguageModelToolResult([new LanguageModelTextPart(`Error: ${result.stderr}`)]);
        }

        return new LanguageModelToolResult([new LanguageModelTextPart(`List updated successfully${(result.stdout !== '' ? `\nResult: ${result.stdout}` : '')}`)]);
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointListSetParameters>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Update a SharePoint Online list',
            message: new MarkdownString('Should I update the list with the following parameters?'),
        };

        return {
            invocationMessage: 'Updating a SharePoint Online list',
            confirmationMessages,
        };
    }
}
