import { PackageManagers } from '../constants';

/**
 * Helper function to get the appropriate install command for the package manager.
 * @param packageManager - The package manager to use
 * @returns The install command ('install' for npm, 'add' for pnpm/yarn)
 */
export const getInstallCommand = (packageManager: PackageManagers): string => {
	return packageManager === PackageManagers.npm ? 'install' : 'add';
};
