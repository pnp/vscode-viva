import { ComponentType } from './ComponentTypes';
import { ExtensionType } from './ExtensionTypes';

export interface SpfxAddComponentCommandInput {
  componentType: ComponentType;
  componentName: string;
  frameworkType: string;
  extensionType: ExtensionType;
  aceType: string;
}