import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { Scaffolder } from '../../../services/actions/Scaffolder';


interface ISharePointFrameworkCreateNewProject {
    solutionName: string;
    componentType: 'webpart' | 'extension' | 'library' | 'adaptiveCardExtension';
    componentName: string;
    framework?: 'none' | 'react' | 'minimal';
    extensionType?: 'ApplicationCustomizer' | 'FieldCustomizer' | 'ListViewCommandSet' | 'FormCustomizer' | 'SearchQueryModifier';
    aceTemplateType?: 'Generic' | 'Search' | 'DataVisualization';
    skipInstall?: boolean;
}

export class SharePointFrameworkCreateNewProject implements LanguageModelTool<ISharePointFrameworkCreateNewProject> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointFrameworkCreateNewProject>,
        _token: CancellationToken
    ) {
        try {
            const params = options.input;
            const missing: string[] = [];

            if (!params.solutionName?.trim()) {
                missing.push('solutionName');
            }

            if (!params.componentType?.trim()) {
                missing.push('componentType');
            }

            if (!params.componentName?.trim()) {
                missing.push('componentName');
            }

            if ((params.componentType === 'webpart' || params.componentType === 'extension') && !params.framework) {
                missing.push('framework');
            }

            if (params.componentType === 'extension' && !params.extensionType) {
                missing.push('extensionType');
            }

            if (params.componentType === 'adaptiveCardExtension' && !params.aceTemplateType) {
                missing.push('aceTemplateType');
            }

            if (params.componentType === 'extension' && params.extensionType === 'FormCustomizer' && params.framework === 'minimal') {
                return new LanguageModelToolResult([
                    new LanguageModelTextPart('Invalid input: for extensionType "FormCustomizer", framework must be "react" or "none".')
                ]);
            }

            if (missing.length > 0) {
                const response = `I need more information before creating the command. Please provide: ${missing.join(', ')}.`;
                return new LanguageModelToolResult([new LanguageModelTextPart(response)]);
            }

            const quote = (value: string) => `"${value.replace(/\"/g, '\\\"')}"`;
            const commandParts: string[] = [
                'yo @microsoft/sharepoint',
                `--solution-name ${quote(params.solutionName)}`,
                `--component-name ${quote(params.componentName)}`,
                `--component-type ${quote(params.componentType)}`
            ];

            if (params.componentType === 'webpart' || params.componentType === 'extension') {
                commandParts.push(`--framework ${quote(params.framework!)}`);
            }

            if (params.componentType === 'extension') {
                commandParts.push(`--extension-type ${quote(params.extensionType!)}`);
            }

            if (params.componentType === 'adaptiveCardExtension') {
                commandParts.push(`--aceTemplateType ${quote(params.aceTemplateType!)}`);
            }

            if (params.skipInstall) {
                commandParts.push('--skip-install');
            }

            const yoCommand = commandParts.join(' ');

            await Scaffolder.createProjectCopilot(yoCommand);

            const response = `Created and executed the following SPFx command:\n\n\`\`\`\n${yoCommand}\n\`\`\``;

            return new LanguageModelToolResult([new LanguageModelTextPart(response)]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            return new LanguageModelToolResult([new LanguageModelTextPart(`Failed to create a new SharePoint Framework project: ${errorMessage}`)]);
        }
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointFrameworkCreateNewProject>,
        _token: CancellationToken
    ) {
        const confirmationMessages = {
            title: 'Create new SharePoint Framework project',
            message: new MarkdownString('Should I create a new SharePoint Framework project?'),
        };

        return {
            invocationMessage: 'Creating new SharePoint Framework project',
            confirmationMessages,
        };
    }
}