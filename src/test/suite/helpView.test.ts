import * as assert from 'assert';
import * as vscode from 'vscode';
import { helpCommands } from '../../panels/HelpTreeData';


suite('Help and feedback', () => {
    const extensionId = 'm365pnp.viva-connections-toolkit';

    test('should verify that "pnp-view-help" is contributed', () => {
        const extension = vscode.extensions.getExtension(extensionId);
        assert(extension, 'Extension not found');

        const contributedViews = extension.packageJSON.contributes.views?.['pnp-view'];
        const helpView = contributedViews?.find((view: any) => view.id === 'pnp-view-help');

        assert(helpView, 'Help and Feedback view is not contributed in package.json');
        assert.strictEqual(helpView.name, 'Help and feedback');
    });

    test('should verify the correct top-level help and feedback sections', () => {
        const sectionLabels = helpCommands.map((item) => item.label);
        assert.deepStrictEqual(sectionLabels, [
            'Docs & Learning',
            'Resources & Tooling',
            'Community',
            'Support'
        ]);
    });

    test('should verify that each section has at least one item', () => {
        helpCommands.forEach((section) => {
            assert(section.children && section.children.length > 0, `Section "${section.label}" should have at least one item`);
        });
    });

    test('should verify that each item with a "vscode.open" command has a valid URI', () => {
        helpCommands.forEach((section) => {
            section.children?.forEach((item) => {
                if (item.command?.command === 'vscode.open') {
                    assert(
                        item.command.arguments && item.command.arguments[0] instanceof vscode.Uri,
                        `Item "${item.label}" with 'vscode.open' should have a valid URI`
                    );
                }
            });
        });
    });

    test('should verify that "Docs & Learning" section contains expected items', () => {
        const docsAndLearningSection = helpCommands.find(item => item.label === 'Docs & Learning');
        assert(docsAndLearningSection, 'Docs & Learning section not found');

        const expectedItems = [
            'Overview of the SharePoint Framework',
            'Overview of Viva Connections Extensibility',
            'Overview of Microsoft Graph',
            'Learning path: Extend Microsoft SharePoint - Associate',
            'Learning path: Extend Microsoft Viva Connections',
            'Learning path: Microsoft Graph Fundamentals'
        ];

        const itemLabels = docsAndLearningSection.children?.map(item => item.label);
        assert(itemLabels, 'No items found in Docs & Learning section');
        expectedItems.forEach(expectedItem => {
            assert(itemLabels.includes(expectedItem), `Expected item "${expectedItem}" not found in Docs & Learning section`);
        });
    });

    test('should verify that "Resources & Tooling" section contains expected items', () => {
        const resourcesAndToolingSection = helpCommands.find(item => item.label === 'Resources & Tooling');
        assert(resourcesAndToolingSection, 'Resources & Tooling section not found');

        const expectedItems = [
            'Microsoft Graph Explorer',
            'Microsoft 365 Agents Toolkit',
            'Adaptive Card Previewer',
            'SharePoint Embedded',
            'Adaptive Card Designer',
            'Join the Microsoft 365 Developer Program',
            'Sample Solution Gallery'
        ];

        const itemLabels = resourcesAndToolingSection.children?.map(item => item.label);
        assert(itemLabels, 'No items found in Resources & Tooling section');
        expectedItems.forEach(expectedItem => {
            assert(itemLabels.includes(expectedItem), `Expected item "${expectedItem}" not found in Resources & Tooling section`);
        });
    });

    test('should verify that "Community" section contains expected items', () => {
        const communitySection = helpCommands.find(item => item.label === 'Community');
        assert(communitySection, 'Community section not found');

        const expectedItems = [
            'Microsoft 365 & Power Platform Community Home',
            'Join the Microsoft 365 & Power Platform Community Discord Server'
        ];

        const itemLabels = communitySection.children?.map(item => item.label);
        assert(itemLabels, 'No items found in Community section');
        expectedItems.forEach(expectedItem => {
            assert(itemLabels.includes(expectedItem), `Expected item "${expectedItem}" not found in Community section`);
        });
    });

    test('should verify that "Support" section contains expected items', () => {
        const supportSection = helpCommands.find(item => item.label === 'Support');
        assert(supportSection, 'Support section not found');

        const expectedItems = [
            'Docs',
            'Report an issue',
            'Start Walkthrough'
        ];

        const itemLabels = supportSection.children?.map(item => item.label);
        assert(itemLabels, 'No items found in Support section');
        expectedItems.forEach(expectedItem => {
            assert(itemLabels.includes(expectedItem), `Expected item "${expectedItem}" not found in Support section`);
        });
    });
});