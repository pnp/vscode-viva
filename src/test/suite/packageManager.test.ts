import * as assert from 'assert';
import * as vscode from 'vscode';
import { EXTENSION_ID } from '../testConstants';
import { PackageManagers } from '../../constants';


suite('Package Manager Settings', () => {
	test('should verify that "spfx-toolkit.packageManager" setting is contributed', () => {
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		assert(extension, 'Extension not found');

		const contributedSettings = extension.packageJSON.contributes.configuration.properties;
		const packageManagerSetting = contributedSettings['spfx-toolkit.packageManager'];

		assert(packageManagerSetting, 'Package Manager setting is not contributed in package.json');
		assert.strictEqual(packageManagerSetting.title, 'Node Package Manager');
		assert.strictEqual(packageManagerSetting.type, 'string');
		assert.strictEqual(packageManagerSetting.default, 'npm');
	});

	test('should verify that package manager setting has correct enum values', () => {
		const extension = vscode.extensions.getExtension(EXTENSION_ID);
		assert(extension, 'Extension not found');

		const contributedSettings = extension.packageJSON.contributes.configuration.properties;
		const packageManagerSetting = contributedSettings['spfx-toolkit.packageManager'];

		assert(packageManagerSetting, 'Package Manager setting is not contributed');
		assert.deepStrictEqual(packageManagerSetting.enum, ['npm', 'pnpm', 'yarn']);
	});

	test('should verify that package manager setting can be read', async () => {
		const config = vscode.workspace.getConfiguration('spfx-toolkit');
		const packageManager = config.get('packageManager');

		// Should have a default value
		assert(packageManager !== undefined, 'Package Manager setting should have a value');
	});

	test('should verify that PackageManagers enum has correct values', () => {
		assert.strictEqual(PackageManagers.npm, 'npm');
		assert.strictEqual(PackageManagers.pnpm, 'pnpm');
		assert.strictEqual(PackageManagers.yarn, 'yarn');
	});
});
