import * as vscode from 'vscode';
import { AdaptiveCardTypes, Commands, ComponentTypes, ExtensionTypes, msSampleGalleryLink, promptContext, promptExplainSharePointData, promptGeneralContext, promptInfoContext, promptNewContext } from '../constants';

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

  private static getChatCommandPrompt(chatCommand: string): string {
    let context: string = '';
    switch (chatCommand) {
      case 'new':
        context += promptNewContext;
        context += `\n Here is some more information regarding each component type ${JSON.stringify(ComponentTypes)}`;
        context += `\n Here is some more information regarding each extension type ${JSON.stringify(ExtensionTypes)}`;
        context += `\n Here is some more information regarding each ACE type ${JSON.stringify(AdaptiveCardTypes)}`;
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