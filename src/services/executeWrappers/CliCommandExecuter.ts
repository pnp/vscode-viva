import { Logger } from '../dataType/Logger';
import { CommandOutput, executeCommand } from '@pnp/cli-microsoft365';


export class CliExecuter {

  /**
   * Executes a CLI command and returns the command output.
   * @param command - The CLI command to execute.
   * @param output - The desired output format of the command. Defaults to 'text'.
   * @param args - Additional arguments to pass to the command.
   * @returns A promise that resolves to the command output.
   */
  public static async execute(command: string, output: string | undefined = 'text', args?: any): Promise<CommandOutput> {
    return await CliExecuter.tryExecuteCommand(command, output, args);
  }

  /**
   * Executes a CLI command asynchronously and returns the command output.
   * @param command The CLI command to execute.
   * @param output The type of output to expect from the command (default: 'text').
   * @param args Additional arguments to pass to the command.
   * @returns A Promise that resolves to the command output.
   */
  private static async tryExecuteCommand(command: string, output: string | undefined = 'text', args?: any): Promise<CommandOutput> {
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