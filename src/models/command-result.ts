
export interface CommandResult {
  code: number;
  cmdOutput: string;
  cmdOutputIncludingStderr: string;
  formattedArgs: string;
}