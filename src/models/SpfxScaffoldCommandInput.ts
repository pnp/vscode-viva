import { SpfxAddComponentCommandInput } from './SpfxAddComponentCommandInput';


export interface SpfxScaffoldCommandInput extends SpfxAddComponentCommandInput {
  folderPath: string;
  solutionName: string;
  shouldRunInit: boolean;
  shouldInstallReusablePropertyPaneControls: boolean;
  shouldInstallReusableReactControls: boolean;
  shouldInstallPnPJs: boolean;
  shouldCreateNodeVersionFile: boolean;
  nodeVersionManagerFile: '.nvmrc' | '.node-version';
  nodeVersionManager: 'nvm' | 'nvs' | 'none';
}