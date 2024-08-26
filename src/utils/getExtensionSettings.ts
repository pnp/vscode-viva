import { workspace } from 'vscode';
import { EXTENSION_NAME } from '../constants';


/**
   * Retrieves the extension settings value for the specified setting.
   * If the setting is not found, the default value is returned.
   * @param setting - The name of the setting to retrieve.
   * @param defaultValue - The default value to return if the setting is not found.
   * @returns The value of the setting, or the default value if the setting is not found.
   */
export const getExtensionSettings = <T>(setting: any, defaultValue: any) =>{
  return workspace.getConfiguration(EXTENSION_NAME).get<T>(setting, defaultValue);
};
