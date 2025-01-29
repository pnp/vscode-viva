import { SpfxAddComponentCommandInput } from './SpfxAddComponentCommandInput';


export interface SpfxScaffoldCommandInput extends SpfxAddComponentCommandInput {
  folderPath: string;
  solutionName: string;
  shouldRunInit: boolean;
  shouldInstallReusablePropertyPaneControls: boolean;
  shouldInstallReusableReactControls: boolean;
  shouldInstallReact: boolean;
  shouldInstallPnPJs: boolean;
  shouldInstallSPFxFastServe: boolean;
  shouldCreateNodeVersionFile: boolean;
  nodeVersionManagerFile: '.nvmrc' | '.node-version';
  nodeVersionManager: 'nvm' | 'nvs' | 'none';
  shouldInstallCustomSteps: boolean;
}