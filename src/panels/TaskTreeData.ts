import { workspace } from 'vscode';
import { readFileSync } from 'fs';
import { ActionTreeItem } from '../providers/ActionTreeDataProvider';
import { Commands } from '../constants';


export const gulpTaskCommands: ActionTreeItem[] = [
    new ActionTreeItem('Build project', '', { name: 'gear', custom: false }, undefined, Commands.buildProject),
    new ActionTreeItem('Bundle project', '', { name: 'package', custom: false }, undefined, Commands.bundleProject),
    new ActionTreeItem('Clean project', '', { name: 'clear-all', custom: false }, undefined, Commands.cleanProject),
    new ActionTreeItem('Deploy project assets to Azure Storage', '', { name: 'cloud-upload', custom: false }, undefined, Commands.deployToAzureStorage),
    new ActionTreeItem('Package', '', { name: 'zap', custom: false }, undefined, Commands.packageProject),
    new ActionTreeItem('Publish', '', { name: 'rocket', custom: false }, undefined, Commands.publishProject),
    new ActionTreeItem('Serve', '', { name: 'play-circle', custom: false }, undefined, Commands.serveProject),
    new ActionTreeItem('Test', '', { name: 'beaker', custom: false }, undefined, Commands.testProject),
    new ActionTreeItem('Trust self-signed developer certificate', '', { name: 'verified', custom: false }, undefined, Commands.trustDevCert),
];

interface PackageJsonScripts {
    [script: string]: string;
}

export async function getNpmScriptCommands(): Promise<ActionTreeItem[]> {
    const npmScriptCommands: ActionTreeItem[] = [];

    try {
        const files = await workspace.findFiles('package.json', '**/node_modules/**');
        if (files.length === 0) {
            return npmScriptCommands;
        }

        const packageJsonFile = files[0];
        const content = readFileSync(packageJsonFile.fsPath, 'utf8');
        const packageJson = JSON.parse(content);

        if (packageJson.scripts) {
            const scripts: PackageJsonScripts = packageJson.scripts;

            for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
                const icon = getNpmScriptIcon(scriptName, scriptCommand);
                npmScriptCommands.push(
                    new ActionTreeItem(
                        scriptName,
                        scriptCommand,
                        { name: icon, custom: false },
                        undefined,
                        Commands.executeTerminalCommand,
                        `npm run ${scriptName}`
                    )
                );
            }
        }
    } catch (error) {
        console.error('Error reading package.json for npm scripts:', error);
    }

    return npmScriptCommands;
}

function getNpmScriptIcon(scriptName: string, scriptCommand: string): string {
    const lowerScriptName = scriptName.toLowerCase();
    const lowerCommand = scriptCommand.toLowerCase();

    if (lowerScriptName.includes('build') || lowerCommand.includes('build')) {
        return 'tools';
    } else if (lowerScriptName.includes('test') || lowerCommand.includes('test')) {
        return 'beaker';
    } else if (lowerScriptName.includes('serve') || lowerScriptName.includes('start') || lowerCommand.includes('serve') || lowerCommand.includes('start')) {
        return 'play';
    } else if (lowerScriptName.includes('watch') || lowerCommand.includes('watch')) {
        return 'eye';
    } else if (lowerScriptName.includes('clean') || lowerCommand.includes('clean')) {
        return 'clear-all';
    } else if (lowerScriptName.includes('package') || lowerCommand.includes('package')) {
        return 'package';
    } else if (lowerScriptName.includes('deploy') || lowerCommand.includes('deploy')) {
        return 'cloud-upload';
    } else if (lowerScriptName.includes('lint') || lowerCommand.includes('lint')) {
        return 'checklist';
    } else if (lowerScriptName.includes('compile') || lowerCommand.includes('compile')) {
        return 'gear';
    } else {
        return 'terminal';
    }
}

export async function getCombinedTaskCommands(): Promise<ActionTreeItem[]> {
    const npmCommands = await getNpmScriptCommands();
    const combinedCommands: ActionTreeItem[] = [];

    combinedCommands.push(...gulpTaskCommands);

    if (npmCommands.length > 0) {
        combinedCommands.push(...npmCommands);
    }

    return combinedCommands;
}