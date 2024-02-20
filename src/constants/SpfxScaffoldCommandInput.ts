import { SpfxAddComponentCommandInput } from './SpfxAddComponentCommandInput';

export interface SpfxScaffoldCommandInput extends SpfxAddComponentCommandInput {
  folderPath: string;
  solutionName: string;
}