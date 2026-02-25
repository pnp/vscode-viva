import * as vscode from 'vscode';
import { Logger } from '../services/dataType/Logger';
import { AdaptiveCardTypes, Commands, ComponentTypes, ExtensionTypes, msSampleGalleryLink, promptContext, promptExplainSharePointData, promptGeneralContext, promptInfoContext, promptNewContext } from '../constants';
import { ProjectInformation } from '../services/dataType/ProjectInformation';
import { CliActions } from '../services/actions/CliActions';
import { AuthProvider } from '../providers/AuthProvider';
import { EnvironmentInformation } from '../services/dataType/EnvironmentInformation';


export class PromptHandlers {
  public static history: string[] = [];
  public static previousCommand: string = '';
  public static modelFamily = 'gpt-4o';

  public static async handle(request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<any> {
    stream.progress(PromptHandlers.getRandomProgressMessage());
    const chatCommand = (request.command && ['new'].indexOf(request.command.toLowerCase()) > -1) ? request.command.toLowerCase() : '';

    const messages: vscode.LanguageModelChatMessage[] = [];
    messages.push(vscode.LanguageModelChatMessage.Assistant(promptContext));
    messages.push(vscode.LanguageModelChatMessage.Assistant(PromptHandlers.getChatCommandPrompt(chatCommand)));

    if (PromptHandlers.previousCommand !== chatCommand && PromptHandlers.previousCommand !== '') {
      PromptHandlers.history = [];
    } else {
      PromptHandlers.history.forEach(message => messages.push(vscode.LanguageModelChatMessage.Assistant(message)));
    }
    PromptHandlers.previousCommand = chatCommand;

    messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
    PromptHandlers.history.push(request.prompt);

    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: PromptHandlers.modelFamily });
    try {
      const chatResponse = await model.sendRequest(messages, {}, token);
      let query = '';
      for await (const fragment of chatResponse.text) {
        query += fragment;
        stream.markdown(fragment);
      }
      PromptHandlers.history.push(query);
      PromptHandlers.getChatCommandButtons(chatCommand, query).forEach(button => stream.button(button));

      if (chatCommand === 'info') {
        try {
          const data = await PromptHandlers.tryToGetDataFromSharePoint(query);
          if (data) {
            stream.markdown('\n\nThis is what I found...\n\n');
            const explanationResponse = await PromptHandlers.explainOverSharePointData(data, token);
            let explanationQuery = '';
            for await (const fragment of explanationResponse.text) {
              explanationQuery += fragment;
              stream.markdown(fragment);
            }
            PromptHandlers.history.push(explanationQuery);
          }
        } catch (err: any) {
          Logger.getInstance();
          const errorText = err!.error ? err!.error.message.toString() : err.toString();
          Logger.error(errorText);
          stream.markdown('\n\nI was not able to retrieve the data from SharePoint. Please check the logs in output window for more information.');

          const markdownString = new vscode.MarkdownString();
          markdownString.supportHtml = true;
          markdownString.appendMarkdown(`<span style="color:#f00;">${errorText}</span>`);
          stream.markdown(markdownString);
        }
      }

      return { metadata: { command: chatCommand } };
    } catch (err) {
      if (err instanceof vscode.LanguageModelError) {
        if (err.message.includes('off_topic')) {
          stream.markdown('\n\n...I am sorry, I am not able to help with that. Please try again with a different question.');
        }
      } else {
        stream.markdown('\n\n...It seems that something is not working as expected. Please try again later.');
      }

      return { metadata: { command: '' } };
    }
  }

  private static async tryToGetDataFromSharePoint(chatResponse: string): Promise<string | undefined> {
    const cliRegex = /```([^\n]*)\n(?=[\s\S]*?m365 spo.+)([\s\S]*?)\n?```/g;
    const cliMatch = cliRegex.exec(chatResponse);

    if (cliMatch && cliMatch[2]) {
      const outputMode = cliMatch[2].toLowerCase().includes('list') ? 'text' : 'md';
      const result = await CliActions.runCliCommand(cliMatch[2], outputMode);
      return result;
    }

    return;
  }

  private static async explainOverSharePointData(data: string, token: vscode.CancellationToken): Promise<vscode.LanguageModelChatResponse> {
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: PromptHandlers.modelFamily });
    const messages = [
      vscode.LanguageModelChatMessage.User(promptExplainSharePointData),
      vscode.LanguageModelChatMessage.User('Analyze and explain the following response:'),
      vscode.LanguageModelChatMessage.User(data)
    ];
    const chatResponse = await model.sendRequest(messages, {}, token);
    return chatResponse;
  }

  private static getChatCommandPrompt(chatCommand: string): string {
    let context: string = '';
    switch (chatCommand) {
      case 'new':
        context += promptNewContext;
        context += `\n Here is some more information regarding each component type ${JSON.stringify(ComponentTypes)}`;
        context += `\n Here is some more information regarding each extension type ${JSON.stringify(ExtensionTypes)}`;
        context += `\n Here is some more information regarding each ACE type ${JSON.stringify(AdaptiveCardTypes)}`;
      case 'info':
        // TODO: since we are already retrieving list of sites app catalog we could add it as additional context here
        context += promptInfoContext;
        if (EnvironmentInformation.tenantUrl) {
          context += `Tenant SharePoint URL is: ${EnvironmentInformation.tenantUrl}`;
        }
      default:
        context += promptGeneralContext;
    }

    return context;
  }

  private static getRandomProgressMessage(): string {
    const messages = [
      'Checking...',
      'Let me think about it...',
      'Reading the docs...',
      'Cracking the code...',
      'Unleashing the algorithms...',
      'Beaming up the data...',
      'Feeding the hamsters...',
      'Charging the flux capacitor...',
      'Warming up the servers...',
      'Consulting with the rubber duck...',
      'Asking the magic 8-ball...',
      'Counting backwards from infinity...',
      'Commencing time travel...',
      'Converting coffee to code...',
      'Adjusting the reality matrix...',
      'Waking up the AI...'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private static getChatCommandButtons(chatCommand: string, chatResponse: string) {
    switch (chatCommand) {
      case 'new':
        const buttons = [];
        const yoRegex = /```([^\n]*)\n(?=[\s\S]*?yo @microsoft\/sharepoint.+)([\s\S]*?)\n?```/g;
        const yoMatch = yoRegex.exec(chatResponse);
        if (yoMatch && yoMatch[2]) {
          buttons.push(
            {
              command: Commands.createProjectCopilot,
              title: vscode.l10n.t('Create project'),
              arguments: [yoMatch[2]],
            });
        }
        if (chatResponse.toLowerCase().includes(msSampleGalleryLink)) {
          buttons.push({
            command: Commands.samplesGallery,
            title: vscode.l10n.t('Open sample gallery'),
          });
        }
        return buttons;
      case 'setup':
        if (chatResponse.toLowerCase().includes('validate local setup')) {
          return [{
            command: Commands.checkDependencies,
            title: vscode.l10n.t('Check if my local workspace is ready'),
          }];
        }

        return [];
      default:
        return [];
    }
  }
}