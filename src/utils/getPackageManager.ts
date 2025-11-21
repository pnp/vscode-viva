import { getExtensionSettings } from './getExtensionSettings';
import { PackageManagers } from '../constants';


/**
 * Retrieves the package manager setting from VS Code extension settings.
 * If the setting is not found, defaults to 'npm'.
 * @returns The package manager to use (npm, pnpm, or yarn)
 */
export const getPackageManager = (): PackageManagers => {
  return getExtensionSettings<PackageManagers>('packageManager', PackageManagers.npm);
};
