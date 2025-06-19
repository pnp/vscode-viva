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