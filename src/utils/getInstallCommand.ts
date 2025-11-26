import { PackageManagers } from '../constants';

/**
 * Helper function to get the appropriate command for adding specific packages.
 * When installing all dependencies (no package names), all package managers use 'install'.
 * When adding specific packages, npm uses 'install' while pnpm and yarn use 'add'.
 * @param packageManager - The package manager to use
 * @returns The command for adding specific packages ('install' for npm, 'add' for pnpm/yarn)
 */
export const getInstallCommand = (packageManager: PackageManagers): string => {
	return packageManager === PackageManagers.npm ? 'install' : 'add';
};
