import * as vscode from 'vscode';
import { Commands, promptActionContext, promptCodeContext, promptContext, promptNewContext, promptSetupContext } from '../constants';

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-4' };

export class PromptHandlers {

  public static async handle(request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<any> {
    stream.progress(PromptHandlers.getRandomProgressMessage());
    const chatCommand = (request.command && ['setup', 'new', 'code', 'action'].indexOf(request.command) > -1) ? request.command : '';

    const messages = [vscode.LanguageModelChatMessage.User(promptContext)];
    messages.push(vscode.LanguageModelChatMessage.User(PromptHandlers.getChatCommandPrompt(chatCommand)));
    messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
    const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
    const chatResponse = await model.sendRequest(messages, {}, token);
    for await (const fragment of chatResponse.text) {
      stream.markdown(fragment);
    }
    PromptHandlers.getChatCommandButtons(chatCommand).forEach(button => stream.button(button));
    return { metadata: { command: chatCommand } };
  }

  private static getChatCommandButtons(chatCommand: string) {
    switch (chatCommand) {
      case 'setup':
        return [{
          command: Commands.checkDependencies,
          title: vscode.l10n.t('Check if my local workspace is ready'),
        },
        {
          command: Commands.installDependencies,
          title: vscode.l10n.t('Install required dependencies'),
        }];
      case 'new':
        return [{
          command: Commands.createProject,
          title: vscode.l10n.t('Create a new project'),
        },
        {
          command: Commands.samplesGallery,
          title: vscode.l10n.t('View samples'),
        }];
      case 'code':
        return [];
      case 'action':
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
      default:
        return [];
    }
  }

  private static getChatCommandPrompt(chatCommand: string): string {
    switch (chatCommand) {
      case 'setup':
        return promptSetupContext;
      case 'new':
        return promptNewContext;
      case 'code':
        return promptCodeContext;
      case 'action':
        return promptActionContext;
      default:
        return '';
    }
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
}