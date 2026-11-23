import { CancellationToken, LanguageModelTextPart, LanguageModelTool, LanguageModelToolInvocationOptions, LanguageModelToolInvocationPrepareOptions, LanguageModelToolResult, MarkdownString } from 'vscode';
import { Scaffolder } from '../../../services/actions/Scaffolder';
import { ProjectInformation } from '../../../services/dataType/ProjectInformation';
import { ComponentType } from '../../../constants';


interface ISharePointFrameworkCreateNewProject {
    solutionName?: string;
    componentType: 'webpart' | 'extension' | 'library' | 'adaptiveCardExtension';
    componentName: string;
    framework?: 'none' | 'react' | 'minimal';
    extensionType?: 'ApplicationCustomizer' | 'FieldCustomizer' | 'ListViewCommandSet' | 'FormCustomizer' | 'SearchQueryModifier';
    aceTemplateType?: 'Generic' | 'Search' | 'DataVisualization';
}

export class SharePointFrameworkCreateNewProject implements LanguageModelTool<ISharePointFrameworkCreateNewProject> {
    async invoke(
        options: LanguageModelToolInvocationOptions<ISharePointFrameworkCreateNewProject>,
        _token: CancellationToken
    ) {
        const isExistingProject = !!ProjectInformation.isSPFxProject;

        try {
            const params = options.input;
            const missing: string[] = [];

            if (!isExistingProject && !params.solutionName?.trim()) {
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

            if (isExistingProject && await Scaffolder.componentFolderExists(params.componentType as ComponentType, params.componentName)) {
                return new LanguageModelToolResult([
                    new LanguageModelTextPart(`A ${params.componentType} named "${params.componentName}" already exists in the current SharePoint Framework project. Please provide a different componentName.`)
                ]);
            }

            const quote = (value: string) => `"${value.replace(/\"/g, '\\\"')}"`;
            const commandParts: string[] = ['yo @microsoft/sharepoint'];

            if (!isExistingProject) {
                commandParts.push(`--solution-name ${quote(params.solutionName!)}`);
            }

            commandParts.push(
                `--component-name ${quote(params.componentName)}`,
                `--component-type ${quote(params.componentType)}`
            );

            if (params.componentType === 'webpart' || params.componentType === 'extension') {
                commandParts.push(`--framework ${quote(params.framework!)}`);
            }

            if (params.componentType === 'extension') {
                commandParts.push(`--extension-type ${quote(params.extensionType!)}`);
            }

            if (params.componentType === 'adaptiveCardExtension') {
                commandParts.push(`--aceTemplateType ${quote(params.aceTemplateType!)}`);
            }

            const yoCommand = commandParts.join(' ');

            if (isExistingProject) {
                await Scaffolder.addComponentToProjectCopilot(yoCommand);

                let response = `Added a new ${params.componentType} to the existing SharePoint Framework project and installed its dependencies by executing the following SPFx command:\n\n\`\`\`\n${yoCommand}\n\`\`\``;
                if (params.solutionName?.trim()) {
                    response += '\n\nThe provided solutionName was ignored because the component was added to the currently opened SharePoint Framework project.';
                }

                return new LanguageModelToolResult([new LanguageModelTextPart(response)]);
            }

            await Scaffolder.createProjectCopilot(yoCommand);

            const response = `Created and executed the following SPFx command:\n\n\`\`\`\n${yoCommand}\n\`\`\``;

            return new LanguageModelToolResult([new LanguageModelTextPart(response)]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            const action = isExistingProject ? 'add a component to the SharePoint Framework project' : 'create a new SharePoint Framework project';
            return new LanguageModelToolResult([new LanguageModelTextPart(`Failed to ${action}: ${errorMessage}`)]);
        }
    }

    async prepareInvocation(
        options: LanguageModelToolInvocationPrepareOptions<ISharePointFrameworkCreateNewProject>,
        _token: CancellationToken
    ) {
        if (ProjectInformation.isSPFxProject) {
            return {
                invocationMessage: 'Adding component to SharePoint Framework project',
                confirmationMessages: {
                    title: 'Add component to SharePoint Framework project',
                    message: new MarkdownString('Should I add a new component to the currently opened SharePoint Framework project?'),
                },
            };
        }

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