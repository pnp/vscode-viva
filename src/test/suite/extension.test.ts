import * as assert from 'assert';
import * as vscode from 'vscode';
import { sleep } from '../../utils/sleep';

suite('Extension', () => {

	suiteSetup(async () => {
		do {
			await sleep(1000);
		} while (!vscode.extensions.getExtension('m365pnp.viva-connections-toolkit')?.isActive);
	});

	test('should activate', async () => {
		const expected = true;
		const actual = vscode.extensions.getExtension('m365pnp.viva-connections-toolkit')?.isActive;
		assert.strictEqual(actual, expected);
	});
});