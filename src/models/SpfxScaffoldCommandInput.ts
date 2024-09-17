import { SpfxAddComponentCommandInput } from './SpfxAddComponentCommandInput';


export interface SpfxScaffoldCommandInput extends SpfxAddComponentCommandInput {
  folderPath: string;
  solutionName: string;
  shouldRunInit: boolean;
  shouldInstallReusablePropertyPaneControls: boolean;
  shouldInstallReusableReactControls: boolean;
  shouldInstallPnPJs: boolean;
}