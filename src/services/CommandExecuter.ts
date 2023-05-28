import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import * as os from 'os';
import { CommandResult } from '../models';
import { Logger } from './Logger';


export class Executer {

  /**
   * Execute the command
   * @param workingDirectory
   * @param command
   * @param args
   * @returns
   */
  public static async executeCommand(workingDirectory: string, command: string, args: string[] = []): Promise<number> {
    const result: CommandResult = await Executer.tryExecuteCommand(workingDirectory, command, ...args);
    return result.code;
  }

  /**
   * Try to execute the command and log the output to the output channel.
   * @param workingDirectory
   * @param command
   * @param args
   * @returns
   */
  private static async tryExecuteCommand(workingDirectory: string | undefined, command: string, ...args: string[]): Promise<CommandResult> {
    // eslint-disable-next-line no-unused-vars
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