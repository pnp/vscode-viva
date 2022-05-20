import { CommandResult } from '../models';
import { Logger } from './Logger';
import { Terminal } from './Terminal';
import { CommandOutput, executeCommand } from '@pnp/cli-microsoft365';

export class CliExecuter {

  /**
   * Execute the command
   * @param command 
   * @param args 
   * @returns 
   */
  public static async execute(command: string, output: string | undefined = "text", args?: any): Promise<CommandOutput> {
    return await CliExecuter.tryExecuteCommand(command, output, args);
  }

  /**
   * Try to execute the command and log the output to the output channel.
   * @param command
   * @returns 
   */
  private static async tryExecuteCommand(command: string, output: string | undefined = "text", args?: any): Promise<CommandOutput> {
    return await new Promise((resolve: (res: CommandOutput) => void, reject: (e: Error) => void): void => {
      Logger.getInstance();
      let cmdOutput: string = '';
      let cmdOutputIncludingStderr: string = '';
      const outputChannel = Logger.channel;

      Logger.info(`Running CLI command: ${command}`);
      executeCommand(command, { output, ...args }, {
        stdout: (message: string) => {
          message = message.toString();
          cmdOutput = cmdOutput.concat(message);
          cmdOutputIncludingStderr = cmdOutputIncludingStderr.concat(message);
          if (outputChannel) {
            outputChannel.appendLine(message);
          }
        },
        stderr: (message: string) => {
          if (outputChannel) {
            outputChannel.append(message);
          }
        }
      }).then(result => {
        resolve(result);
      }).catch(error => {
        reject(error);
      });
    });
  }
}