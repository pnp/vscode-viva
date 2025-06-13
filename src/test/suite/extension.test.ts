import * as assert from 'assert';
import * as vscode from 'vscode';
import { sleep } from '../../utils/sleep';
import { EXTENSION_ID } from '../testConstants';


suite('Extension', function () {
	this.timeout(10000); // 10 seconds timeout for the suite

	suiteSetup(async () => {
		do {
			await sleep(1000);
		} while (!vscode.extensions.getExtension(EXTENSION_ID)?.isActive);
	});

	test('should activate', async () => {
		const expected = true;
		const actual = vscode.extensions.getExtension(EXTENSION_ID)?.isActive;
		assert.strictEqual(actual, expected);
	});

	test('should have the "spfx-toolkit.login" command', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert(commands.includes('spfx-toolkit.login'));
	});

	test('should have the "spfx-toolkit.welcome" command', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert(commands.includes('spfx-toolkit.welcome'));
	});
});