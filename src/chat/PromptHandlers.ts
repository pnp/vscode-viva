import * as vscode from 'vscode';
import { AdaptiveCardTypes, Commands, ComponentTypes, ExtensionTypes, msSampleGalleryLink, promptCodeContext, promptContext, promptGeneralContext, promptNewContext, promptSetupContext } from '../constants';
import { ProjectInformation } from '../services/dataType/ProjectInformation';


export class PromptHandlers {
  public static history: string[] = [];
  public static previousCommand: string = '';

  public static async handle(request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<any> {
    stream.progress(PromptHandlers.getRandomProgressMessage());
    const chatCommand = (request.command && ['setup', 'new', 'code'].indexOf(request.command.toLowerCase()) > -1) ? request.command.toLowerCase() : '';

    const messages: vscode.LanguageModelChatMessage[] = [];
    messages.push(vscode.LanguageModelChatMessage.Assistant(promptContext));
    messages.push(vscode.LanguageModelChatMessage.Assistant(PromptHandlers.getChatCommandPrompt(chatCommand)));

    if (PromptHandlers.previousCommand !== chatCommand) {
      PromptHandlers.history = [];
      PromptHandlers.previousCommand = chatCommand;
    } else {
      PromptHandlers.history.forEach(message => messages.push(vscode.LanguageModelChatMessage.Assistant(message)));
    }

    messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
    PromptHandlers.history.push(request.prompt);
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
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
          stream.markdown('...I am sorry, I am not able to help with that. Please try again with a different question.');
        }
      } else {
        stream.markdown('...It seems that something is not working as expected. Please try again later.');
      }

      return { metadata: { command: '' } };
    }
  }

  private static getChatCommandPrompt(chatCommand: string): string {
    let context: string = '';
    switch (chatCommand) {
      case 'setup':
        context += promptSetupContext;
      case 'new':
        context += promptNewContext;
        context += `\n Here is some more information regarding each component type ${ComponentTypes}`;
        context += `\n Here is some more information regarding each extension type ${ExtensionTypes}`;
        context += `\n Here is some more information regarding each ACE type ${AdaptiveCardTypes}`;
      case 'code':
        context += promptCodeContext;
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
        const regex = /```([^\n]*)\n(?=[\s\S]*?yo @microsoft\/sharepoint.+)([\s\S]*?)\n?```/g;
        const match = regex.exec(chatResponse);
        if (match && match[2]) {
          buttons.push(
            {
              command: Commands.executeTerminalCommand,
              title: vscode.l10n.t('Create project'),
              arguments: [match[2], 'Create project'],
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
        // return [{
        //         command: Commands.checkDependencies,
        //         title: vscode.l10n.t('Check if my local workspace is ready'),
        //       },
        //       {
        //         command: Commands.installDependencies,
        //         title: vscode.l10n.t('Install required dependencies'),
        //       }];
        //     case 'new':
        //       return [{
        //         command: Commands.createProject,
        //         title: vscode.l10n.t('Create a new project'),
        //       },
        //       {
        //         command: Commands.samplesGallery,
        //         title: vscode.l10n.t('View samples'),
        //       }];
        return [];
      case 'code':
        if (ProjectInformation.isSPFxProject) {
          return [{
            command: Commands.upgradeProject,
            title: vscode.l10n.t('Get upgrade guidance to latest SPFx version'),
          },
          {
            command: Commands.validateProject,
            title: vscode.l10n.t('Validate your project'),
          },
          {
            command: Commands.renameProject,
            title: vscode.l10n.t('Rename your project'),
          },
          {
            command: Commands.pipeline,
            title: vscode.l10n.t('Create a CI/CD workflow'),
          }];
        }

        return [];
      default:
        return [];
    }
  }
}