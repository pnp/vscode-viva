import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import * as os from 'os';
import { CommandResult } from '../../models';
import { Logger } from '../dataType/Logger';


export class Executer {

  /**
   * Executes a command in the specified working directory with optional arguments.
   * @param workingDirectory The working directory in which to execute the command.
   * @param command The command to execute.
   * @param args Optional arguments to pass to the command.
   * @returns A promise that resolves to the exit code of the command.
   */
  public static async executeCommand(workingDirectory: string, command: string, args: string[] = []): Promise<number> {
    const result: CommandResult = await Executer.tryExecuteCommand(workingDirectory, command, ...args);
    return result.code;
  }

  /**
   * Executes a command asynchronously and returns a promise that resolves to a CommandResult.
   * @param workingDirectory - The working directory for the command execution.
   * @param command - The command to execute.
   * @param args - The arguments to pass to the command.
   * @returns A promise that resolves to a CommandResult.
   */
  private static async tryExecuteCommand(workingDirectory: string | undefined, command: string, ...args: string[]): Promise<CommandResult> {
    return await new Promise((resolve: (res: CommandResult) => void, reject: (e: Error) => void): void => {
      Logger.getInstance();
      let cmdOutput: string = '';
      let cmdOutputIncludingStderr: string = '';
      const formattedArgs: string = args.join(' ');
      const outputChannel = Logger.channel;

      workingDirectory = workingDirectory || os.tmpdir();
      const options: SpawnOptions = {
        cwd: workingDirectory,
        shell: true
      };
      const childProc: ChildProcess = spawn(command, args, options);

      Logger.info(`Running command: ${command} ${formattedArgs}`);

      childProc.stdout?.on('data', (data: string | Buffer) => {
        data = data.toString();
        cmdOutput = cmdOutput.concat(data);
        cmdOutputIncludingStderr = cmdOutputIncludingStderr.concat(data);
        if (outputChannel) {
          outputChannel.append(data);
        }
      });

      childProc.stderr?.on('data', (data: string | Buffer) => {
        data = data.toString();
        cmdOutputIncludingStderr = cmdOutputIncludingStderr.concat(data);
        if (outputChannel) {
          outputChannel.append(data);
        }
      });

      childProc.on('error', (e) => {
        reject(e);
      });

      childProc.on('close', (code: number) => {
        resolve({
          code,
          cmdOutput,
          cmdOutputIncludingStderr,
          formattedArgs
        });
      });
    });
  }
}