import { TreeItemCollapsibleState, workspace } from 'vscode';
import { readFileSync } from 'fs';
import { ActionTreeItem } from '../providers/ActionTreeDataProvider';
import { Commands } from '../constants';
import { Notifications } from '../services/dataType/Notifications';

interface PackageJsonScripts {
    [script: string]: string;
}

export const gulpTaskCommands: ActionTreeItem[] = [
    new ActionTreeItem('Build project', '', { name: 'gear', custom: false }, undefined, Commands.gulpBuildProject),
    new ActionTreeItem('Bundle project', '', { name: 'combine', custom: false }, undefined, Commands.gulpBundleProject),
    new ActionTreeItem('Clean project', '', { name: 'clear-all', custom: false }, undefined, Commands.gulpCleanProject),
    new ActionTreeItem('Deploy project assets to Azure Storage', '', { name: 'cloud-upload', custom: false }, undefined, Commands.gulpDeployToAzureStorage),
    new ActionTreeItem('Package', '', { name: 'package', custom: false }, undefined, Commands.gulpPackageProject),
    new ActionTreeItem('Publish', '', { name: 'rocket', custom: false }, undefined, Commands.gulpPublishProject),
    new ActionTreeItem('Serve', '', { name: 'play-circle', custom: false }, undefined, Commands.gulpServeProject),
    new ActionTreeItem('Test', '', { name: 'beaker', custom: false }, undefined, Commands.gulpTestProject),
    new ActionTreeItem('Trust self-signed developer certificate', '', { name: 'verified', custom: false }, undefined, Commands.gulpTrustDevCert),
];

export const heftTaskCommands: ActionTreeItem[] = [
    new ActionTreeItem('Build project', '', { name: 'combine', custom: false }, undefined, Commands.heftBuildProject),
    new ActionTreeItem('Clean project', '', { name: 'clear-all', custom: false }, undefined, Commands.heftCleanProject),
    new ActionTreeItem('Deploy project assets to Azure Storage', '', { name: 'cloud-upload', custom: false }, undefined, Commands.heftDeployToAzureStorage),
    new ActionTreeItem('Eject', '', { name: 'git-stash', custom: false }, undefined, Commands.heftEjectProject),
    new ActionTreeItem('Package', '', { name: 'package', custom: false }, undefined, Commands.heftPackageProject),
    new ActionTreeItem('Publish', '', { name: 'rocket', custom: false }, undefined, Commands.heftPublishProject),
    new ActionTreeItem('Start', '', { name: 'play-circle', custom: false }, undefined, Commands.heftStartProject),
    new ActionTreeItem('Test', '', { name: 'beaker', custom: false }, undefined, Commands.heftTestProject),
    new ActionTreeItem('Trust self-signed developer certificate', '', { name: 'verified', custom: false }, undefined, Commands.heftTrustDevCert),
];

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
                npmScriptCommands.push(new ActionTreeItem(scriptName, scriptCommand, { name: icon, custom: false }, undefined, Commands.executeTerminalCommand, `npm run ${scriptName}`));
            }
        }
    } catch (error) {
        Notifications.error('Error reading package.json for npm scripts:', error);
    }

    return npmScriptCommands;
}

export async function getCombinedTaskCommands(): Promise<ActionTreeItem[]> {
    const npmCommands = await getNpmScriptCommands();
    const combinedCommands: ActionTreeItem[] = [];

    if (await shouldShowGulpTasks()) {
        combinedCommands.push(
            new ActionTreeItem('Gulp Tasks', '', { name: 'tasklist', custom: false }, TreeItemCollapsibleState.Expanded, undefined, undefined, undefined, gulpTaskCommands)
        );
    }

    if (await shouldShowHeftTasks()) {
        combinedCommands.push(
            new ActionTreeItem('Heft Tasks', '', { name: 'tasklist', custom: false }, TreeItemCollapsibleState.Expanded, undefined, undefined, undefined, heftTaskCommands)
        );
    }

    if (npmCommands.length > 0) {
        combinedCommands.push(
            new ActionTreeItem('NPM Scripts', '', { name: 'terminal', custom: false }, TreeItemCollapsibleState.Expanded, undefined, undefined, undefined, npmCommands)
        );
    }

    return combinedCommands;
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
    }

    return 'terminal';
}

async function shouldShowGulpTasks(): Promise<boolean> {
    try {
        const files = await workspace.findFiles('gulpfile.js', '**/node_modules/**');
        if (files.length === 0) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

async function shouldShowHeftTasks(): Promise<boolean> {
    try {
        const files = await workspace.findFiles('package.json', '**/node_modules/**');
        if (files.length === 0) {
            return false;
        }

        const packageJsonFile = files[0];
        const content = readFileSync(packageJsonFile.fsPath, 'utf8');
        const packageJson = JSON.parse(content);

        const hasHeftDevDependency = packageJson.devDependencies && '@rushstack/heft' in packageJson.devDependencies;

        return hasHeftDevDependency;
    } catch (error) {
        return false;
    }
}