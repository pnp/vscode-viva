import * as assert from 'assert';
import * as vscode from 'vscode';
import { waitForExtensionToActivate } from '../utils';


suite('Extension', function () {
	this.timeout(10000);
	suiteSetup(async () => {
		await waitForExtensionToActivate();
	});

	test('should have the "spfx-toolkit.login" command', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert(commands.includes('spfx-toolkit.login'));
	});
});