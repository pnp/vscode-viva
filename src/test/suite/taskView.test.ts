import * as assert from 'assert';
import * as vscode from 'vscode';
import { gulpTaskCommands, heftTaskCommands, getCombinedTaskCommands } from '../../panels/TaskTreeData';
import { EXTENSION_ID } from '../testConstants';
import * as sinon from 'sinon';
import { TerminalCommandExecuter } from '../../services/executeWrappers/TerminalCommandExecuter';
import { Folders } from '../../services/check/Folders';


suite('Task commands', () => {
    let executeCommandStub: sinon.SinonStub;

    setup(() => {
        executeCommandStub = sinon.stub(vscode.commands, 'executeCommand').resolves();
    });

    teardown(() => {
        sinon.restore();
    });

    test('should verify that "pnp-view-tasks" is contributed', () => {
        const extension = vscode.extensions.getExtension(EXTENSION_ID);
        assert(extension, 'Extension not found');

        const contributedViews = extension.packageJSON.contributes.views?.['pnp-view'];
        const tasksView = contributedViews?.find((view: any) => view.id === 'pnp-view-tasks');

        assert(tasksView, 'Tasks view is not contributed in package.json');
        assert.strictEqual(tasksView.name, 'Tasks');
    });

    test('should verify that all gulp task commands are defined', () => {
        assert.strictEqual(gulpTaskCommands.length, 9, 'Expected 9 gulp task commands');

        const commandNames = gulpTaskCommands.map(command => command.command?.command);
        const expectedCommands = [
            'spfx-toolkit.gulpBuildProject',
            'spfx-toolkit.gulpBundleProject',
            'spfx-toolkit.gulpCleanProject',
            'spfx-toolkit.gulpDeployToAzureStorage',
            'spfx-toolkit.gulpPackageProject',
            'spfx-toolkit.gulpPublishProject',
            'spfx-toolkit.gulpServeProject',
            'spfx-toolkit.gulpTestProject',
            'spfx-toolkit.gulpTrustDevCert'
        ];

        expectedCommands.forEach((cmd: any) => {
            assert(commandNames.includes(cmd), `Command ${cmd} is not defined`);
        });
    });

    test('should verify that all heft task commands are defined', () => {
        assert.strictEqual(heftTaskCommands.length, 9, 'Expected 9 heft task commands');

        const commandNames = heftTaskCommands.map(command => command.command?.command);
        const expectedCommands = [
            'spfx-toolkit.heftBuildProject',
            'spfx-toolkit.heftCleanProject',
            'spfx-toolkit.heftDeployToAzureStorage',
            'spfx-toolkit.heftEjectProject',
            'spfx-toolkit.heftPackageProject',
            'spfx-toolkit.heftPublishProject',
            'spfx-toolkit.heftStartProject',
            'spfx-toolkit.heftTestProject',
            'spfx-toolkit.heftTrustDevCert'
        ];

        expectedCommands.forEach((cmd: any) => {
            assert(commandNames.includes(cmd), `Command ${cmd} is not defined`);
        });
    });

    test('should check that all gulp tasks have correct names', () => {
        const expectedNames = [
            'Build project',
            'Bundle project',
            'Clean project',
            'Deploy project assets to Azure Storage',
            'Package',
            'Publish',
            'Serve',
            'Test',
            'Trust self-signed developer certificate'
        ];

        gulpTaskCommands.forEach((command, index) => {
            assert.strictEqual(command.label, expectedNames[index], `Command label mismatch for ${command.command?.command}`);
        });
    });

    test('should check that all heft tasks have correct names', () => {
        const expectedNames = [
            'Build project',
            'Clean project',
            'Deploy project assets to Azure Storage',
            'Eject',
            'Package',
            'Publish',
            'Start',
            'Test',
            'Trust self-signed developer certificate'
        ];

        heftTaskCommands.forEach((command, index) => {
            assert.strictEqual(command.label, expectedNames[index], `Command label mismatch for ${command.command?.command}`);
        });
    });

    test('should execute "gulp build" when Build action is triggered from the extension', () => {
        TerminalCommandExecuter['gulpBuildProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp build'
        ));
    });

    test('should execute "heft build" when heft Build action is triggered for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['heftBuildProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft build'
        ));
    });

    test('should execute "heft build --production" when heft Build action is triggered for production environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['heftBuildProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft build --production'
        ));
    });

    test('should execute "gulp bundle" when bundling for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['gulpBundleProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle'
        ));
    });

    test('should execute "gulp bundle --ship" when bundling for production environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['gulpBundleProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle --ship'
        ));
    });

    test('should execute "gulp clean" when Clean action is triggered', () => {
        TerminalCommandExecuter['gulpCleanProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp clean'
        ));
    });

    test('should execute "heft clean" when heft Clean action is triggered', () => {
        TerminalCommandExecuter['heftCleanProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft clean'
        ));
    });

    test('should execute "gulp deploy-azure-storage" when Deploy project assets to Azure Storage action is triggered', () => {
        TerminalCommandExecuter['gulpDeployToAzureStorage']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp deploy-azure-storage'
        ));
    });

    test('should execute "heft deploy-azure-storage" when heft Deploy project assets to Azure Storage action is triggered', () => {
        TerminalCommandExecuter['heftDeployToAzureStorage']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft deploy-azure-storage'
        ));
    });

    test('should execute "heft eject-webpack" when heft Eject action is triggered', async () => {
        await TerminalCommandExecuter['heftEjectProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft eject-webpack'
        ));
    });

    test('should execute "gulp package-solution" when packaging for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['gulpPackageProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp package-solution'
        ));
    });

    test('should execute "gulp package-solution --ship" when packaging for production environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['gulpPackageProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp package-solution --ship'
        ));
    });

    test('should execute "heft package-solution" when heft packaging for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['heftPackageProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft package-solution'
        ));
    });

    test('should execute "heft package-solution --production" when heft packaging for production environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['heftPackageProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft package-solution --production'
        ));
    });

    test('should execute "gulp bundle && gulp package-solution" when publishing project for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['gulpPublishProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle && gulp package-solution'
        ));
    });

    test('should execute "gulp bundle --ship && gulp package-solution --ship" when publishing project for production', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['gulpPublishProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle --ship && gulp package-solution --ship'
        ));
    });

    test('should execute "heft build; heft package-solution" when heft publishing project for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['heftPublishProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft build && heft package-solution'
        ));
    });

    test('should execute "heft build --production; heft package-solution --production" when heft publishing project for production', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['heftPublishProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft build --production && heft package-solution --production'
        ));
    });

    test('should execute "gulp serve" when Serve action is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);
        sinon.stub(vscode.window, 'showQuickPick').resolves('Serve' as any);
        await TerminalCommandExecuter['gulpServeProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp serve'
        ));
    });

    test('should execute "gulp serve --nobrowser" when Serve (no browser) action is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);
        sinon.stub(vscode.window, 'showQuickPick').resolves('Serve (no browser)' as any);
        await TerminalCommandExecuter['gulpServeProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp serve --nobrowser'
        ));
    });

    test('should execute "gulp serve --config=myconfig" when Serve from configuration is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);

        const fs = require('fs');
        const readFileSyncStub = sinon.stub(fs, 'readFileSync');
        readFileSyncStub.returns(JSON.stringify({
            '$schema': 'https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json',
            'port': 4321,
            'https': true,
            'serveConfigurations': {
                'default': {
                    'pageUrl': 'https://contoso.sharepoint.com/sites/mySite/SitePages/myPage.aspx'
                },
                'myconfig': {
                    'pageUrl': 'https://contoso.sharepoint.com/sites/teamSite/SitePages/home.aspx'
                }
            }
        }));

        const findFilesStub = sinon.stub(vscode.workspace, 'findFiles');
        findFilesStub.resolves([{ fsPath: '/fake/config/serve.json' } as any]);

        const quickPickStub = sinon.stub(vscode.window, 'showQuickPick');
        quickPickStub.onCall(0).resolves('Serve from configuration' as any);
        quickPickStub.onCall(1).resolves('myconfig' as any);

        await TerminalCommandExecuter['gulpServeProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp serve --config=myconfig'
        ));
    });

    test('should execute "heft start" when heft Start action is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);
        sinon.stub(vscode.window, 'showQuickPick').resolves('Start' as any);
        await TerminalCommandExecuter['heftStartProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft start'
        ));
    });

    test('should execute "heft start --nobrowser" when heft Start (no browser) action is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);
        sinon.stub(vscode.window, 'showQuickPick').resolves('Start (no browser)' as any);
        await TerminalCommandExecuter['heftStartProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft start --nobrowser'
        ));
    });

    test('should execute "heft start --serve-config=myconfig" when heft Start from configuration is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);

        const fs = require('fs');
        const readFileSyncStub = sinon.stub(fs, 'readFileSync');
        readFileSyncStub.returns(JSON.stringify({
            '$schema': 'https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json',
            'port': 4321,
            'https': true,
            'serveConfigurations': {
                'default': {
                    'pageUrl': 'https://contoso.sharepoint.com/sites/mySite/SitePages/myPage.aspx'
                },
                'myconfig': {
                    'pageUrl': 'https://contoso.sharepoint.com/sites/teamSite/SitePages/home.aspx'
                }
            }
        }));

        const findFilesStub = sinon.stub(vscode.workspace, 'findFiles');
        findFilesStub.resolves([{ fsPath: '/fake/config/serve.json' } as any]);

        const quickPickStub = sinon.stub(vscode.window, 'showQuickPick');
        quickPickStub.onCall(0).resolves('Start from configuration' as any);
        quickPickStub.onCall(1).resolves('myconfig' as any);

        await TerminalCommandExecuter['heftStartProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft start --serve-config=myconfig'
        ));
    });

    test('should execute "gulp test" when Test action is triggered', () => {
        TerminalCommandExecuter['gulpTestProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp test'
        ));
    });

    test('should execute "heft test" when heft Test action is triggered', () => {
        TerminalCommandExecuter['heftTestProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft test'
        ));
    });

    test('should execute "gulp trust-dev-cert" when Trust self-signed developer certificate action is triggered', () => {
        TerminalCommandExecuter['gulpTrustDevCert']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp trust-dev-cert'
        ));
    });

    test('should execute "heft trust-dev-cert" when heft Trust self-signed developer certificate action is triggered', () => {
        TerminalCommandExecuter['heftTrustDevCert']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'heft trust-dev-cert'
        ));
    });

    test('should load combined task commands including gulp and heft tasks', async () => {
        const findFilesStub = sinon.stub(vscode.workspace, 'findFiles');
        findFilesStub.withArgs('gulpfile.js', sinon.match.any).resolves([{ fsPath: '/fake/gulpfile.js' } as any]);
        findFilesStub.withArgs('package.json', sinon.match.any).resolves([{ fsPath: '/fake/package.json' } as any]);

        const fs = require('fs');
        const readFileSyncStub = sinon.stub(fs, 'readFileSync');
        readFileSyncStub.returns(JSON.stringify({
            devDependencies: {
                '@rushstack/heft': '^0.50.0'
            },
            scripts: {}
        }));

        const combinedCommands = await getCombinedTaskCommands();

        const gulpTasksGroup = combinedCommands.find(cmd => cmd.label === 'Gulp Tasks');
        assert(gulpTasksGroup, 'Gulp Tasks should exist');
        const combinedGulpCommands = gulpTasksGroup.children || [];

        assert.strictEqual(combinedGulpCommands.length, gulpTaskCommands.length, 'Combined commands should include all gulp commands');

        const combinedGulpCommandNames = combinedGulpCommands.map(command => command.label);
        const gulpCommandNames = gulpTaskCommands.map(command => command.label);

        gulpCommandNames.forEach(gulpCommandName => {
            assert(combinedGulpCommandNames.includes(gulpCommandName), `Gulp command ${gulpCommandName} should be included in combined commands`);
        });

        const heftTasksGroup = combinedCommands.find(cmd => cmd.label === 'Heft Tasks');
        assert(heftTasksGroup, 'Heft Tasks should exist');
        const combinedHeftCommands = heftTasksGroup.children || [];

        assert.strictEqual(combinedHeftCommands.length, heftTaskCommands.length, 'Combined commands should include all heft commands');

        const combinedHeftCommandNames = combinedHeftCommands.map(command => command.label);
        const heftCommandNames = heftTaskCommands.map(command => command.label);

        heftCommandNames.forEach(heftCommandName => {
            assert(combinedHeftCommandNames.includes(heftCommandName), `Heft command ${heftCommandName} should be included in combined commands`);
        });
    });
});