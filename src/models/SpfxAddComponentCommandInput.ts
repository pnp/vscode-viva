import { ComponentType } from '../constants/ComponentTypes';
import { ExtensionType } from '../constants/ExtensionTypes';

export interface SpfxAddComponentCommandInput {
  componentType: ComponentType;
  componentName: string;
  frameworkType: string;
  extensionType: ExtensionType;
  aceType: string;
}