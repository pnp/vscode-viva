import { sleep } from '../utils/sleep';
import * as vscode from 'vscode';
import { EXTENSION_ID } from './testConstants';


export async function waitForExtensionToActivate() {
    do {
        await sleep(1000);
        await vscode.commands.executeCommand('pnp-view-account.focus');
    } while (!vscode.extensions.getExtension(EXTENSION_ID)?.isActive);
}