import * as assert from 'assert';
import * as vscode from 'vscode';
import { sleep } from '../../utils/sleep';


suite('Extension', function () {
	const extensionId = 'm365pnp.viva-connections-toolkit';

	this.timeout(10000); // 10 seconds timeout for the suite

	suiteSetup(async () => {
		do {
			await sleep(1000);
		} while (!vscode.extensions.getExtension(extensionId)?.isActive);
	});

	test('should activate', async () => {
		const expected = true;
		const actual = vscode.extensions.getExtension(extensionId)?.isActive;
		assert.strictEqual(actual, expected);
	});

	test('should register the "spfx-toolkit.login" command', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert(commands.includes('spfx-toolkit.login'));
	});
});