import * as assert from 'assert';
import * as vscode from 'vscode';
import { gulpTaskCommands } from '../../panels/TaskTreeData';
import { EXTENSION_ID } from '../testConstants';
import * as sinon from 'sinon';
import { TerminalCommandExecuter } from '../../services/executeWrappers/TerminalCommandExecuter';
import { Folders } from '../../services/check/Folders';


suite('Gulp task commands', () => {
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
            'spfx-toolkit.buildProject',
            'spfx-toolkit.bundleProject',
            'spfx-toolkit.cleanProject',
            'spfx-toolkit.deployToAzureStorage',
            'spfx-toolkit.packageProject',
            'spfx-toolkit.publishProject',
            'spfx-toolkit.serveProject',
            'spfx-toolkit.testProject',
            'spfx-toolkit.trustDevCert'
        ];

        expectedCommands.forEach((cmd: any) => {
            assert(commandNames.includes(cmd), `Command ${cmd} is not defined`);
        });
    });

    test('should check that all tasks have correct names', () => {
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

    test('should execute "gulp build" when Build action is triggered from the extension', () => {
        TerminalCommandExecuter['buildProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp build'
        ));
    });

    test('should execute "gulp bundle" when bundling for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['bundleProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle'
        ));
    });

    test('should execute "gulp bundle --ship" when bundling for production environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['bundleProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle --ship'
        ));
    });

    test('should execute "gulp clean" when Clean action is triggered', () => {
        TerminalCommandExecuter['cleanProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp clean'
        ));
    });

    test('should execute "gulp deploy-azure-storage" when Deploy project assets to Azure Storage action is triggered', () => {
        TerminalCommandExecuter['deployToAzureStorage']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp deploy-azure-storage'
        ));
    });

    test('should execute "gulp package-solution" when packaging for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['packageProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp package-solution'
        ));
    });

    test('should execute "gulp package-solution --ship" when packaging for production environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['packageProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp package-solution --ship'
        ));
    });

    test('should execute "gulp bundle && gulp package-solution" when publishing project for local environment', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('local' as any);
        await TerminalCommandExecuter['publishProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle && gulp package-solution'
        ));
    });

    test('should execute "gulp bundle --ship && gulp package-solution --ship" when publishing project for production', async () => {
        sinon.stub(vscode.window, 'showQuickPick').resolves('production' as any);
        await TerminalCommandExecuter['publishProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp bundle --ship && gulp package-solution --ship'
        ));
    });

    test('should execute "gulp serve" when Serve action is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);
        sinon.stub(vscode.window, 'showQuickPick').resolves('Serve' as any);
        await TerminalCommandExecuter['serveProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp serve'
        ));
    });

    test('should execute "gulp serve --nobrowser" when Serve (no browser) action is triggered', async () => {
        sinon.stub(Folders, 'getWorkspaceFolder').resolves({ name: 'mockFolder', uri: vscode.Uri.file('/mockFolder') } as vscode.WorkspaceFolder);
        sinon.stub(vscode.window, 'showQuickPick').resolves('Serve (no browser)' as any);
        await TerminalCommandExecuter['serveProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp serve --nobrowser'
        ));
    });

    test('should execute "gulp test" when Test action is triggered', () => {
        TerminalCommandExecuter['testProject']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp test'
        ));
    });

    test('should execute "gulp trust-dev-cert" when Trust self-signed developer certificate action is triggered', () => {
        TerminalCommandExecuter['trustDevCert']();

        assert(executeCommandStub.calledWithExactly(
            'spfx-toolkit.executeTerminalCommand',
            'gulp trust-dev-cert'
        ));
    });
});