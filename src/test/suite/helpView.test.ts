import * as assert from 'assert';
import * as vscode from 'vscode';
import { helpCommands } from '../../panels/HelpTreeData';
import { EXTENSION_ID } from '../testConstants';


suite('Help and feedback', () => {
    test('should verify that "pnp-view-help" is contributed', () => {
        const extension = vscode.extensions.getExtension(EXTENSION_ID);
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
            'CLI for Microsoft 365 MCP server',
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

    test('should verify that "Docs & Learning" overview items open the correct URLs', () => {
        const docsSection = helpCommands.find(section => section.label === 'Docs & Learning');
        assert(docsSection, 'Docs & Learning section not found');

        const expectedLinks = [
            {
                label: 'Overview of the SharePoint Framework',
                url: 'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview'
            },
            {
                label: 'Overview of Viva Connections Extensibility',
                url: 'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/viva/overview-viva-connections'
            },
            {
                label: 'Overview of Microsoft Graph',
                url: 'https://learn.microsoft.com/en-us/graph/overview?view=graph-rest-1.0'
            },
            {
                label: 'Learning path: Extend Microsoft SharePoint - Associate',
                url: 'https://learn.microsoft.com/en-us/training/paths/m365-sharepoint-associate/'
            },
            {
                label: 'Learning path: Extend Microsoft Viva Connections',
                url: 'https://learn.microsoft.com/en-us/training/paths/m365-extend-viva-connections/'
            },
            {
                label: 'Learning path: Microsoft Graph Fundamentals',
                url: 'https://learn.microsoft.com/en-us/training/paths/m365-msgraph-fundamentals/'
            }
        ];

        expectedLinks.forEach(({ label, url }) => {
            const item = docsSection.children?.find(child => child.label === label);
            assert(item, `Item "${label}" not found`);
            assert.strictEqual(item.command?.command, 'vscode.open', 'Command should be "vscode.open"');
            assert(item.command?.arguments && item.command.arguments[0] instanceof vscode.Uri, 'Command arguments should contain a valid URI');
            assert.strictEqual(decodeURIComponent(item.command.arguments[0].toString()), url, `URL should match the expected link for "${label}"`);
        });
    });

    test('should verify that "Resources & Tooling" items open the correct URLs', () => {
        const resourcesSection = helpCommands.find(section => section.label === 'Resources & Tooling');
        assert(resourcesSection, 'Resources & Tooling section not found');

        const expectedLinks = [
            {
                label: 'Microsoft Graph Explorer',
                url: 'https://developer.microsoft.com/en-us/graph/graph-explorer'
            },
            {
                label: 'Microsoft 365 Agents Toolkit',
                url: 'https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension'
            },
            {
                label: 'Adaptive Card Previewer',
                url: 'https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.vscode-adaptive-cards'
            },
            {
                label: 'CLI for Microsoft 365 MCP server',
                url: 'https://github.com/pnp/cli-microsoft365-mcp-server'
            },
            {
                label: 'SharePoint Embedded',
                url: 'https://marketplace.visualstudio.com/items?itemName=SharepointEmbedded.ms-sharepoint-embedded-vscode-extension'
            },
            {
                label: 'Adaptive Card Designer',
                url: 'https://adaptivecards.microsoft.com/designer'
            },
            {
                label: 'Join the Microsoft 365 Developer Program',
                url: 'https://developer.microsoft.com/en-us/microsoft-365/dev-program'
            },
            {
                label: 'Sample Solution Gallery',
                url: 'https://adoption.microsoft.com/en-us/sample-solution-gallery/'
            }
        ];

        expectedLinks.forEach(({ label, url }) => {
            const item = resourcesSection.children?.find(child => child.label === label);
            assert(item, `Item "${label}" not found`);
            assert.strictEqual(item.command?.command, 'vscode.open', 'Command should be "vscode.open"');
            assert(item.command?.arguments && item.command.arguments[0] instanceof vscode.Uri, 'Command arguments should contain a valid URI');
            assert.strictEqual(decodeURIComponent(item.command.arguments[0].toString()), url, `URL should match the expected link for "${label}"`);
        });
    });

    test('should verify that "Community" items open the correct URLs', () => {
        const communitySection = helpCommands.find(section => section.label === 'Community');
        assert(communitySection, 'Community section not found');

        const expectedLinks = [
            {
                label: 'Microsoft 365 & Power Platform Community Home',
                url: 'https://pnp.github.io/'
            },
            {
                label: 'Join the Microsoft 365 & Power Platform Community Discord Server',
                url: 'https://aka.ms/community/discord'
            }
        ];

        expectedLinks.forEach(({ label, url }) => {
            const item = communitySection.children?.find(child => child.label === label);
            assert(item, `Item "${label}" not found`);
            assert.strictEqual(item.command?.command, 'vscode.open', 'Command should be "vscode.open"');
            assert(item.command?.arguments && item.command.arguments[0] instanceof vscode.Uri, 'Command arguments should contain a valid URI');
            assert.strictEqual(decodeURIComponent(item.command.arguments[0].toString()), url, `URL should match the expected link for "${label}"`);
        });
    });

    test('should verify that "Support" items open the correct URLs', () => {
        const supportSection = helpCommands.find(section => section.label === 'Support');
        assert(supportSection, 'Support section not found');

        const expectedLinks = [
            {
                label: 'Docs',
                url: 'https://pnp.github.io/vscode-viva/'
            },
            {
                label: 'Report an issue',
                url: 'https://github.com/pnp/vscode-viva/issues/new/choose'
            }
        ];

        expectedLinks.forEach(({ label, url }) => {
            const item = supportSection.children?.find(child => child.label === label);
            assert(item, `Item "${label}" not found`);
            assert.strictEqual(item.command?.command, 'vscode.open', 'Command should be "vscode.open"');
            assert(item.command?.arguments && item.command.arguments[0] instanceof vscode.Uri, 'Command arguments should contain a valid URI');
            assert.strictEqual(decodeURIComponent(item.command.arguments[0].toString()), url, `URL should match the expected link for "${label}"`);
        });
    });

    test('should verify that "Start Walkthrough" item invokes the welcome command', () => {
        const supportSection = helpCommands.find(item => item.label === 'Support');
        assert(supportSection, 'Support section not found');

        const startWalkthroughItem = supportSection.children?.find(item => item.label === 'Start Walkthrough');
        assert(startWalkthroughItem, 'Start Walkthrough item not found');
        assert.strictEqual(startWalkthroughItem.command?.command, 'spfx-toolkit.welcome', 'Command should be "spfx-toolkit.welcome"');
    });
});