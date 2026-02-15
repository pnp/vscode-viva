import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { SpfxCompatibilityMatrix } from '../../../constants';


interface ISharePointFrameworkLocalEnvironmentSetup {
    version?: string;
}

export class SharePointFrameworkLocalEnvironmentSetup implements LanguageModelTool<ISharePointFrameworkLocalEnvironmentSetup> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointFrameworkLocalEnvironmentSetup>,
        _token: CancellationToken
    ) {
        try {
            const params = options.input;
            let version = params.version && params.version.trim() !== '' ? params.version : undefined;

            version = version ? version.match(/^(\d+\.\d+\.\d+)$/)?.[1] : SpfxCompatibilityMatrix[0].Version;

            const spfxEnvironmentPrerequisite = SpfxCompatibilityMatrix.find(spfx => spfx.Version === version);
            if (!spfxEnvironmentPrerequisite) {
                return new LanguageModelToolResult([new LanguageModelTextPart(`Error: The specified version ${version} is not a valid SharePoint Framework version.`)]);
            }

            const response = `Validate user local setup like node version and global npm packages and check if they fulfill the following requirements: ${JSON.stringify(spfxEnvironmentPrerequisite)}. 
            If not, ask the user for confirmation and perform the necessary steps to fulfill the requirements. If the user has wrong version of node installed, suggest installing and using nvm or nvs to manage node versions. 
            If the user doesn't have the required global npm packages installed, perform the installation.`;

            return new LanguageModelToolResult([new LanguageModelTextPart(response)]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            return new LanguageModelToolResult([new LanguageModelTextPart(`Failed to set up local environment for SharePoint Framework development: ${errorMessage}`)]);
        }
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointFrameworkLocalEnvironmentSetup>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Set up local environment for SharePoint Framework development',
            message: new MarkdownString('Should I validate and set up the local environment for SharePoint Framework development?'),
        };

        return {
            invocationMessage: 'Setting up local environment for SharePoint Framework development',
            confirmationMessages,
        };
    }
}