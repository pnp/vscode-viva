import { ComponentType } from './ComponentTypes';
import { ExtensionType } from './ExtensionTypes';

export interface SpfxScaffoldCommandInput {
  folderPath: string;
  name: string;
  componentType: ComponentType;
  componentName: string;
  frameworkType: string;
  extensionType: ExtensionType;
  aceType: string;
}