import { commands, Progress, ProgressLocation, window, Uri } from 'vscode';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { Commands, ContextKeys, WebTemplates, ListTemplates } from '../../constants';
import { ActionTreeItem, ActionTreeDataProvider } from '../../providers/ActionTreeDataProvider';
import { Notifications } from '../dataType/Notifications';
import { CliExecuter } from '../executeWrappers/CliCommandExecuter';
import { EnvironmentInformation } from '../dataType/EnvironmentInformation';
import { CliActions } from './CliActions';
import { Logger } from '../dataType/Logger';


export class SpfxAppCLIActions {

    public static registerCommands() {
        const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

        subscriptions.push(
            commands.registerCommand(Commands.deployAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleAppDeployed(node, ContextKeys.deployApp, 'deploy')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.retractAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleAppDeployed(node, ContextKeys.retractApp, 'retract')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.removeAppCatalogApp, SpfxAppCLIActions.removeAppCatalogApp)
        );
        subscriptions.push(
            commands.registerCommand(Commands.enableAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleAppEnabled(node, ContextKeys.enableApp, 'enable')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.disableAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleAppEnabled(node, ContextKeys.disableApp, 'disable')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.installAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleAppInstalled(node, ContextKeys.installApp, 'install')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.uninstallAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleAppInstalled(node, ContextKeys.uninstallApp, 'uninstall')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.upgradeAppCatalogApp, SpfxAppCLIActions.upgradeAppCatalogApp)
        );
        subscriptions.push(
            commands.registerCommand(Commands.removeTenantWideExtension, SpfxAppCLIActions.removeTenantWideExtension)
        );
        subscriptions.push(
            commands.registerCommand(Commands.enableTenantWideExtension, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleExtensionEnabled(node, ContextKeys.enableTenantWideExtension, 'enable')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.disableTenantWideExtension, (node: ActionTreeItem) =>
                SpfxAppCLIActions.toggleExtensionEnabled(node, ContextKeys.disableTenantWideExtension, 'disable')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.updateTenantWideExtension, SpfxAppCLIActions.updateTenantWideExtension)
        );
        subscriptions.push(
            commands.registerCommand(Commands.copyAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.handleAppCatalogAppTransfer(node, ContextKeys.copyApp, 'copy')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.moveAppCatalogApp, (node: ActionTreeItem) =>
                SpfxAppCLIActions.handleAppCatalogAppTransfer(node, ContextKeys.moveApp, 'move')
            )
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkDeployAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkDeployAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkRetractAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkRetractAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkRemoveAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkRemoveAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkEnableAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkEnableAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkDisableAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkDisableAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkInstallAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkInstallAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkUninstallAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkUninstallAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkUpgradeAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIActions.bulkUpgradeAppCatalogApps(node))
        );
    }

    /**
     * Deploys or retracts the app in the tenant or site app catalog.
     *
     * @param node The tree item representing the app to be deployed or retracted.
     * @param ctxValue The context value used to identify the action node.
     * @param action The action to be performed: 'deploy' or 'retract'.
     */
    public static async toggleAppDeployed(node: ActionTreeItem, ctxValue: string, action: 'deploy' | 'retract') {
        try {
            const actionNode = node.children?.find(child => child.contextValue === ctxValue);

            if (!actionNode?.command?.arguments) {
                Notifications.error(`Failed to retrieve app details for ${action}.`);
                return;
            }

            const [appID, appTitle, appCatalogUrl, deployed] = actionNode.command.arguments;

            if (action === 'deploy' && deployed) {
                Notifications.info(`App '${appTitle}' is already deployed.`);
                return;
            }

            if (action === 'retract' && !deployed) {
                Notifications.info(`App '${appTitle}' is already retracted.`);
                return;
            }

            const commandOptions: any = {
                id: appID,
                ...(action === 'retract' && { force: true }),
                ...(appCatalogUrl?.trim() && {
                    appCatalogScope: 'sitecollection',
                    appCatalogUrl: appCatalogUrl
                })
            };

            const cliCommand = action === 'deploy' ? 'spo app deploy' : 'spo app retract';
            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `${action === 'deploy' ? 'Deploying' : 'Retracting'} SPFx app... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: true
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                await CliExecuter.execute(cliCommand, 'json', commandOptions);
            });

            Notifications.info(`App '${appTitle}' has been successfully ${action === 'deploy' ? 'deployed' : 'retracted'}.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message;
            Notifications.error(message);
        }
    }

    /**
    * Removes an app from the tenant or site app catalog.
    *
    * @param node The tree item representing the app to be removed.
    */
    public static async removeAppCatalogApp(node: ActionTreeItem) {
        const actionNode = node.children?.find(child => child.contextValue === ContextKeys.removeApp);

        if (!actionNode?.command?.arguments) {
            Notifications.error('Failed to retrieve app details for removal.');
            return;
        }

        const [appID, appTitle, appCatalogUrl] = actionNode.command.arguments;

        await SpfxAppCLIActions.remove(appID, appTitle, appCatalogUrl);
    }

    /**
    * Upgrades an app to a newer version available in the app catalog.
    *
    * @param node The tree item representing the app to be upgraded.
    */
    public static async upgradeAppCatalogApp(node: ActionTreeItem) {
        const actionNode = node.children?.find(child => child.contextValue === ContextKeys.upgradeApp);

        if (!actionNode?.command?.arguments) {
            Notifications.error('Failed to retrieve app details for upgrade.');
            return;
        }

        const [appID, appTitle, appCatalogUrl, isTenantApp] = actionNode.command.arguments;

        await SpfxAppCLIActions.upgrade(appCatalogUrl, isTenantApp, appID, appTitle);
    }

    /**
     * Enables or disables the app in the tenant or site app catalog.
     *
     * @param node The tree item representing the app to be deployed or retracted.
     * @param ctxValue The context value used to identify the action node.
     * @param action The action to be performed: 'enable' or 'disable'.
     */
    public static async toggleAppEnabled(node: ActionTreeItem, ctxValue: string, action: 'enable' | 'disable') {
        try {
            const actionNode = node.children?.find(child => child.contextValue === ctxValue);

            if (!actionNode?.command?.arguments) {
                Notifications.error(`Failed to retrieve app details for ${action}.`);
                return;
            }

            const [appTitle, appCatalogUrl, isEnabled] = actionNode.command.arguments;

            if (action === 'enable' && isEnabled) {
                Notifications.info(`App '${appTitle}' is already enabled.`);
                return;
            }

            if (action === 'disable' && !isEnabled) {
                Notifications.info(`App '${appTitle}' is already disabled.`);
                return;
            }

            const appProductIdFilter = `Title eq '${appTitle}'`;
            const commandOptionsList: any = {
                listTitle: 'Apps for SharePoint',
                webUrl: appCatalogUrl,
                fields: 'Id, Title, IsAppPackageEnabled',
                filter: appProductIdFilter
            };

            const listItemsResponse = await CliExecuter.execute('spo listitem list', 'json', commandOptionsList);
            const listItems = JSON.parse(listItemsResponse.stdout || '[]');

            if (listItems.length === 0) {
                Notifications.error(`App '${appTitle}' not found in the app catalog.`);
                return;
            }

            const appListItemId = listItems[0].Id;

            const commandOptionsSet: any = {
                listTitle: 'Apps for SharePoint',
                id: appListItemId,
                webUrl: appCatalogUrl,
                IsAppPackageEnabled: !isEnabled ? true : false
            };

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `${action === 'enable' ? 'Enabling' : 'Disabling'} SPFx app... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: true
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                await CliExecuter.execute('spo listitem set', 'json', commandOptionsSet);
            });

            Notifications.info(`App '${appTitle}' has been successfully ${action === 'enable' ? 'enabled' : 'disabled'}.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message;
            Notifications.error(message);
        }
    }

    /**
   * Installs or uninstalls the app on a specified site.
   *
   * @param node The tree item representing the app to be installed or uninstalled.
   * @param ctxValue The context value used to identify the action node.
   * @param action The action to be performed: 'install' or 'uninstall'.
   */
    public static async toggleAppInstalled(node: ActionTreeItem, ctxValue: string, action: 'install' | 'uninstall') {
        const actionNode = node.children?.find(child => child.contextValue === ctxValue);

        if (!actionNode?.command?.arguments) {
            Notifications.error(`Failed to retrieve app details for ${action}.`);
            return;
        }

        const [appID, appTitle, appCatalogUrl] = actionNode.command.arguments;

        try {
            let siteUrl: string | undefined;
            if (!appCatalogUrl) {
                const relativeUrl = await window.showInputBox({
                    prompt: 'Enter the relative URL of the site',
                    ignoreFocusOut: true,
                    placeHolder: 'e.g., sites/sales or leave blank for root site',
                    validateInput: (input) => {
                        const trimmedInput = input.trim();

                        if (trimmedInput.startsWith('https://')) {
                            return 'Please provide a relative URL, not an absolute URL.';
                        }
                        if (trimmedInput.startsWith('/')) {
                            return 'Please provide a relative URL without a leading slash.';
                        }

                        return undefined;
                    }
                });

                if (relativeUrl === undefined) {
                    Notifications.warning('No site URL provided. Operation aborted.');
                    return;
                }

                siteUrl = `${EnvironmentInformation.tenantUrl}/${relativeUrl.trim()}`;

            } else {
                siteUrl = appCatalogUrl;
            }

            let forceUninstall = false;
            if (action === 'uninstall') {
                const confirmForce = await window.showQuickPick(['Yes', 'No'], {
                    placeHolder: `Are you sure you want to uninstall the app '${appTitle}' from site '${siteUrl}'?`,
                    ignoreFocusOut: true,
                    canPickMany: false
                });

                if (confirmForce === 'Yes') {
                    forceUninstall = true;
                } else {
                    Notifications.warning('App uninstallation aborted.');
                    return;
                }
            }

            const commandOptions: any = {
                id: appID,
                siteUrl: siteUrl,
                ...(appCatalogUrl && {
                    appCatalogScope: 'sitecollection'
                }),
                ...(forceUninstall && { force: true })
            };

            const cliCommand = action === 'install' ? 'spo app install' : 'spo app uninstall';
            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `${action === 'install' ? 'Installing' : 'Uninstalling'} SPFx app... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: true
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                await CliExecuter.execute(cliCommand, 'json', commandOptions);
            });

            Notifications.info(`App '${appTitle}' has been successfully ${action === 'install' ? 'installed' : 'uninstalled'} on site '${siteUrl}'.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message;
            if (message.toString().toLowerCase().includes('app already exists at the specified location')) {
                const upgradeItem = 'Upgrade App';
                Notifications.warning(message, upgradeItem).then((item) => {
                    if (item === upgradeItem) {
                        SpfxAppCLIActions.upgrade(appCatalogUrl, !appCatalogUrl, appID, appTitle);
                    }
                });
            }
            else if (message.toString().toLowerCase().includes('app is already installed with the same version number')) {
                const removeItem = 'Remove App';
                Notifications.warning(message, removeItem).then((item) => {
                    if (item === removeItem) {
                        SpfxAppCLIActions.remove(appID, appTitle, appCatalogUrl);
                    }
                });
            }
            else {
                Notifications.error(message);
            }
        }
    }

    /**
     * Upgrades a SharePoint Framework (SPFx) app in the specified app catalog site.
     * @param appCatalogUrl - The URL of the app catalog site.
     * @param isTenantApp - Indicates whether the app is tenant-scoped.
     * @param appID - The unique identifier of the app to upgrade.
     * @param appTitle - The display title of the app being upgraded.
     * @returns A promise that resolves when the upgrade operation is complete.
     */
    private static async upgrade(appCatalogUrl: string, isTenantApp: boolean, appID: string, appTitle: string) {
        try {
            let siteUrl: string = appCatalogUrl;

            if (isTenantApp) {
                const relativeUrl = await window.showInputBox({
                    prompt: 'Enter the relative URL of the site to upgrade the app in',
                    placeHolder: 'e.g., sites/sales or leave blank for root site',
                    validateInput: (input) => {
                        const trimmedInput = input.trim();

                        if (trimmedInput.startsWith('https://')) {
                            return 'Please provide a relative URL, not an absolute URL.';
                        }
                        if (trimmedInput.startsWith('/')) {
                            return 'Please provide a relative URL without a leading slash.';
                        }

                        return undefined;
                    }
                });

                if (relativeUrl === undefined) {
                    Notifications.warning('No site URL provided. App upgrade aborted.');
                    return;
                }

                siteUrl = `${new URL(appCatalogUrl).origin}/${relativeUrl.trim()}`;
            }

            const commandOptions: any = {
                id: appID,
                ...(isTenantApp
                    ? { siteUrl }
                    : { appCatalogScope: 'sitecollection', siteUrl })
            };

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Upgrading SPFx app... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: true
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                await CliExecuter.execute('spo app upgrade', 'json', commandOptions);
            });

            Notifications.info(`App '${appTitle}' has been successfully upgraded on site '${siteUrl}'.`);
        } catch (e: any) {
            const message = e?.message || 'An unexpected error occurred during the app upgrade.';
            Notifications.error(message);
        }
    }

    private static async remove(appID: string, appTitle: string, appCatalogUrl: string) {
        try {
            const shouldRemove = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to remove the app '${appTitle}' from the app catalog?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (shouldRemove !== 'Yes') {
                return;
            }

            const commandOptions: any = {
                id: appID,
                force: true,
                ...(appCatalogUrl?.trim() && {
                    appCatalogScope: 'sitecollection',
                    appCatalogUrl: appCatalogUrl
                })
            };

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Removing SPFx app... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: true
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                await CliExecuter.execute('spo app remove', 'json', commandOptions);
            });

            Notifications.info(`App '${appTitle}' has been successfully removed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message;
            Notifications.error(message);
        }
    }

    /**
     * Removes a tenant-wide extension.
     *
     * @param node The tree item representing the tenant-wide extension to be removed.
     */
    public static async removeTenantWideExtension(node: ActionTreeItem) {
        try {
            const actionNode = node.children?.find(child => child.contextValue === ContextKeys.removeTenantWideExtension);

            if (!actionNode?.command?.arguments) {
                Notifications.error('Failed to retrieve the extension details for removal.');
                return;
            }

            const [extensionTitle, extensionUrl, tenantAppCatalogUrl] = actionNode.command.arguments;

            const shouldRemove = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to remove the app '${extensionTitle}' from the Tenant Wide Extensions list?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (shouldRemove !== 'Yes') {
                return;
            }

            const url = new URL(extensionUrl);
            const extensionId = url.searchParams.get('ID');
            if (!extensionId) {
                Notifications.error('Failed to retrieve the extension ID from the extension URL.');
                return;
            }

            const commandOptionsSet: any = {
                listUrl: `${tenantAppCatalogUrl.replace(new URL(tenantAppCatalogUrl).origin, '')}/Lists/TenantWideExtensions`,
                webUrl: tenantAppCatalogUrl,
                id: extensionId,
                force: true
            };

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Removing Tenant Wide Extension... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: true
            }, async () => {
                await CliExecuter.execute('spo listitem remove', 'json', commandOptionsSet);
            });

            Notifications.info(`Tenant Wide Extension '${extensionTitle}' has been successfully removed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message;
            Notifications.error(message);
        }
    }

    /**
     * Enables or disables a tenant-wide extension.
     *
     * @param node The tree item representing the tenant-wide extension to be enabled or disabled.
     * @param ctxValue The context value used to identify the action node.
     * @param action The action to be performed: 'enable' or 'disable'.
     */
    public static async toggleExtensionEnabled(node: ActionTreeItem, ctxValue: string, action: 'enable' | 'disable') {
        try {
            const actionNode = node.children?.find(child => child.contextValue === ctxValue);

            if (!actionNode?.command?.arguments) {
                Notifications.error(`Failed to retrieve the extension details for ${action}.`);
                return;
            }

            const [extensionTitle, extensionUrl, tenantAppCatalogUrl, extensionDisabled] = actionNode.command.arguments;

            if (action === 'enable' && !extensionDisabled) {
                Notifications.info(`Extension '${extensionTitle}' is already enabled.`);
                return;
            }

            if (action === 'disable' && extensionDisabled) {
                Notifications.info(`Extension '${extensionTitle}' is already disabled.`);
                return;
            }

            const url = new URL(extensionUrl);
            const extensionId = url.searchParams.get('ID');
            if (!extensionId) {
                Notifications.error('Failed to retrieve the extension ID from the extension URL.');
                return;
            }

            await SpfxAppCLIActions.updateExtensionProperties(extensionId,
                `${tenantAppCatalogUrl.replace(new URL(tenantAppCatalogUrl).origin, '')}/Lists/TenantWideExtensions`,
                {
                    TenantWideExtensionDisabled: action === 'enable' ? false : true
                },
                tenantAppCatalogUrl
            );

            Notifications.info(`Extension '${extensionTitle}' has been successfully ${action === 'enable' ? 'enabled' : 'disabled'}.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message;
            Notifications.error(message);
        }
    }

    /**
     * Updates the properties of a tenant-wide extension.
     *
     * @param id The ID of the extension to update.
     * @param listUrl The URL of the list containing the extension.
     * @param properties The properties to update.
     * @param webUrl The URL of the web where the list is located.
     */
    private static async updateExtensionProperties(id: string, listUrl: string, properties: { [key: string]: any }, webUrl: string) {
        const commandOptions: any = {
            id: id,
            listUrl: listUrl,
            webUrl: webUrl,
            ...properties
        };

        await window.withProgress({
            location: ProgressLocation.Notification,
            title: `Updating extension properties... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
            cancellable: true
        }, async () => {
            await CliExecuter.execute('spo listitem set', 'json', commandOptions);
        });
    }

    /**
     * Updates a tenant-wide extension.
     *
     * @param node The tree item representing the tenant-wide extension to be updated.
     */
    public static async updateTenantWideExtension(node: ActionTreeItem) {
        const actionNode = node.children?.find(child => child.contextValue === ContextKeys.updateTenantWideExtension);

        if (!actionNode?.command?.arguments) {
            Notifications.error('Failed to retrieve the extension details for update.');
            return;
        }

        const [extension, extensionUrl, tenantAppCatalogUrl] = actionNode.command.arguments;
        const url = new URL(extensionUrl);
        const extensionId = url.searchParams.get('ID');

        if (!extensionId) {
            Notifications.error('Failed to retrieve the extension ID from the extension URL.');
            return;
        }

        try {
            const properties = [
                { label: 'Title', description: `${extension.Title}`, property: 'Title' },
                { label: 'Component Properties', description: `${extension.TenantWideExtensionComponentProperties || 'Not set'}`, property: 'TenantWideExtensionComponentProperties' },
                { label: 'Web Template', description: `${extension.TenantWideExtensionWebTemplate || 'Not set'}`, property: 'TenantWideExtensionWebTemplate' },
                { label: 'List Template', description: `${extension.TenantWideExtensionListTemplate || 'Not set'}`, property: 'TenantWideExtensionListTemplate' },
                { label: 'Sequence', description: `${extension.TenantWideExtensionSequence?.toString() || 'Not set'}`, property: 'TenantWideExtensionSequence' },
                { label: 'Host Properties', description: `${extension.TenantWideExtensionHostProperties || 'Not set'}`, property: 'TenantWideExtensionHostProperties' }
            ];

            const selectedProps = await window.showQuickPick([...properties], {
                title: `Update Extension: ${extension.Title}`,
                placeHolder: 'Select properties to update (you can select multiple)',
                canPickMany: true,
                ignoreFocusOut: true
            });

            if (!selectedProps?.length) {
                Notifications.warning('No properties selected for update.');
                return;
            }

            const updatedProperties: { [key: string]: any } = {};

            for (const prop of selectedProps) {
                const currentValue = extension[prop.property];
                let newValue: string | undefined;

                switch (prop.property) {
                    case 'TenantWideExtensionWebTemplate':
                        newValue = await SpfxAppCLIActions.handleTemplateInput('web', currentValue);
                        break;

                    case 'TenantWideExtensionListTemplate':
                        newValue = await SpfxAppCLIActions.handleTemplateInput('list', currentValue);
                        break;

                    case 'TenantWideExtensionSequence':
                        newValue = await SpfxAppCLIActions.handleSequenceInput(currentValue);
                        break;

                    default:
                        newValue = await SpfxAppCLIActions.handleDefaultInput(prop.label, currentValue);
                        break;

                }

                if (newValue === undefined) {
                    Notifications.warning('Update cancelled.');
                    return;
                }

                const trimmed = newValue.trim();
                if (trimmed !== currentValue) {
                    switch (prop.property) {
                        case 'TenantWideExtensionWebTemplate':
                        case 'TenantWideExtensionListTemplate':
                            updatedProperties[prop.property] = trimmed;
                            break;

                        case 'TenantWideExtensionSequence':
                            if (trimmed && !isNaN(Number(trimmed))) {
                                updatedProperties[prop.property] = parseInt(trimmed, 10);
                            }
                            break;

                        default:
                            if (trimmed) {
                                updatedProperties[prop.property] = trimmed;
                            }
                            break;
                    }
                }
            }

            if (!Object.keys(updatedProperties).length) {
                Notifications.info('No changes detected.');
                return;
            }

            const changesSummary = Object.entries(updatedProperties)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');

            const confirmOptions = ['Yes', 'No'];
            const confirm = await window.showQuickPick([...confirmOptions], {
                title: 'Confirm Changes',
                placeHolder: `Apply the following changes?\n\n${changesSummary}`,
                ignoreFocusOut: true
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Update cancelled.');
                return;
            }

            const listUrl = `${tenantAppCatalogUrl.replace(new URL(tenantAppCatalogUrl).origin, '')}/Lists/TenantWideExtensions`;

            await SpfxAppCLIActions.updateExtensionProperties(extensionId, listUrl, updatedProperties, tenantAppCatalogUrl);

            Notifications.info(`Extension '${extension.Title}' has been successfully updated.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            Notifications.error(e?.error?.message || e?.message || 'Failed to update extension');
        }
    }

    /**
     * Handles the selection of a template (web or list) from the available options.
     *
     * @param templateType the type of template to handle ('web' or 'list')
     * @param currentValue the current value of the template, used as a placeholder
     * @returns the selected template value or undefined if cancelled
     */
    private static async handleTemplateInput(templateType: 'web' | 'list', currentValue: string): Promise<string | undefined> {
        const isWebTemplate = templateType === 'web';

        const templates = isWebTemplate ? WebTemplates : ListTemplates;
        const title = `Select ${isWebTemplate ? 'Web' : 'List'} Template`;
        const placeholder = currentValue ||
            `Select a ${isWebTemplate ? 'web' : 'list'} template or clear to apply to all ${isWebTemplate ? 'sites' : 'lists'}`;

        const options = templates.map(template => ({
            label: template.name,
            description: template.description,
            value: template.value
        }));

        const selectedOption = await window.showQuickPick([...options], {
            title,
            placeHolder: placeholder,
            ignoreFocusOut: true
        });

        return selectedOption?.value;
    }

    /**
     * Handles the input for the sequence number.
     *
     * @param currentValue the current value of the sequence number
     * @returns the new sequence number value or undefined if cancelled
     */
    private static async handleSequenceInput(currentValue: string): Promise<string | undefined> {
        return await window.showInputBox({
            prompt: 'Enter sequence number (numeric)',
            value: currentValue?.toString() || '',
            ignoreFocusOut: true,
            validateInput: val => val.trim() === '' || !isNaN(Number(val)) ? undefined : 'Please enter a valid number'
        });
    }

    /**
     * Handles the input for a default property.
     *
     * @param propertyLabel the label of the property
     * @param currentValue the current value of the property
     * @returns the new value for the property or undefined if cancelled
     */
    private static async handleDefaultInput(propertyLabel: string, currentValue: string): Promise<string | undefined> {
        return await window.showInputBox({
            prompt: `Enter new value for ${propertyLabel}`,
            value: currentValue || '',
            ignoreFocusOut: true,
            validateInput: val => val.trim() ? undefined : `${propertyLabel} cannot be empty`
        });
    }

    /**
     * Copies or Moves an SPFx app from one App Catalog to another.
     *
     * @param node the tree item representing the app to copy
     */
    public static async handleAppCatalogAppTransfer(node: ActionTreeItem, ctxValue: string, action: 'copy' | 'move') {
        try {
            const actionNode = node.children?.find(child => child.contextValue === ctxValue);

            if (!actionNode?.command?.arguments) {
                Notifications.error(`Failed to retrieve app details for ${action}.`);
                return;
            }

            const [appID, appTitle, appCatalogUrl, appCatalogUrls] = actionNode.command.arguments;

            if (!appCatalogUrls || appCatalogUrls.length === 0) {
                Notifications.error('No App Catalog URLs found.');
                return;
            }

            const selectedUrl = await window.showQuickPick(appCatalogUrls, {
                placeHolder: 'Select target App Catalog URL',
                ignoreFocusOut: true
            });

            if (!selectedUrl) {
                Notifications.error('No target App Catalog URL selected.');
                return;
            }

            const commandOptions: any = {
                webUrl: appCatalogUrl,
                sourceId: appID,
                targetUrl: `${selectedUrl}/AppCatalog`,
                nameConflictBehavior: 'replace'
            };

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `${action === 'move' ? 'Moving' : 'Copying'} SPFx app... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: true
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                await CliExecuter.execute(action === 'move' ? 'spo file move' : 'spo file copy', 'json', commandOptions);
            });

            Notifications.info(`App '${appTitle}' has been successfully ${action === 'move' ? 'moved' : 'copied'} to '${selectedUrl}'.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.message || `An unexpected error occurred during the app ${action}.`;
            Notifications.error(message);
        }
    }

    /**
     * Helper method to extract app catalog URL from a tree node.
     */
    private static getAppCatalogUrlFromNode(node: ActionTreeItem): string | undefined {
        if (node.command?.arguments?.[0]) {
            const uri = node.command.arguments[0] as Uri;
            const urlString = uri.toString().replace('/AppCatalog', '');
            return urlString;
        }
        return undefined;
    }

    /**
     * Deploys all non-deployed apps in the specified app catalog.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkDeployAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);

            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to deploy all non-deployed apps in this app catalog?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk deploy operation cancelled.');
                return;
            }

            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info('No apps found in the app catalog.');
                return;
            }

            const notDeployedApps = apps.filter(app => !app.Deployed);

            if (notDeployedApps.length === 0) {
                Notifications.info('No non-deployed apps found to deploy.');
                return;
            }

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Deploying ${notDeployedApps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                let completed = 0;
                for (const app of notDeployedApps) {
                    try {
                        progress.report({ message: `Deploying '${app.Title}'...`, increment: (1 / notDeployedApps.length) * 100 });

                        const commandOptions: any = {
                            id: app.ID,
                            ...(appCatalogUrl && {
                                appCatalogScope: 'sitecollection',
                                appCatalogUrl: appCatalogUrl
                            })
                        };

                        await CliExecuter.execute('spo app deploy', 'json', commandOptions);
                        Logger.info(`Deployed app '${app.Title}' with ID '${app.ID}'.`);
                        completed++;
                    } catch (e: any) {
                        Logger.error(`Failed to deploy app '${app.Title}' with ID '${app.ID}': ${e?.error?.message || e?.message}`);
                    }
                }

                if (completed === notDeployedApps.length) {
                    Notifications.info(`Successfully deployed ${completed} app(s).`);
                } else {
                    Notifications.warning(`Deployed ${completed} out of ${notDeployedApps.length} app(s). Check [output window](command:${Commands.showOutputChannel}) for details.`);
                }
            });

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message || e?.message;
            Notifications.error(message);
        }
    }

    /**
     * Retracts all apps in the specified app catalog.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkRetractAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);

            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to retract all apps in this app catalog?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk retract operation cancelled.');
                return;
            }

            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info('No apps found in the app catalog.');
                return;
            }

            const deployedApps = apps.filter(app => app.Deployed);

            if (deployedApps.length === 0) {
                Notifications.info('No deployed apps found to retract.');
                return;
            }

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Retracting ${deployedApps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                let completed = 0;
                for (const app of deployedApps) {
                    try {
                        progress.report({ message: `Retracting '${app.Title}'...`, increment: (1 / deployedApps.length) * 100 });

                        const commandOptions: any = {
                            id: app.ID,
                            force: true,
                            ...(appCatalogUrl && {
                                appCatalogScope: 'sitecollection',
                                appCatalogUrl: appCatalogUrl
                            })
                        };

                        await CliExecuter.execute('spo app retract', 'json', commandOptions);
                        completed++;
                    } catch (e: any) {
                        Notifications.error(`Failed to retract '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${deployedApps.length} app(s) retracted.` });
            });

            Notifications.info(`Bulk retract completed: ${deployedApps.length} app(s) processed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message || e?.message;
            Notifications.error(message);
        }
    }

    /**
     * Removes all apps from the specified app catalog.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkRemoveAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);

            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to remove all apps from this app catalog? This action cannot be undone.`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk remove operation cancelled.');
                return;
            }

            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info('No apps found in the app catalog.');
                return;
            }

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Removing ${apps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                let completed = 0;
                for (const app of apps) {
                    try {
                        progress.report({ message: `Removing '${app.Title}'...`, increment: (1 / apps.length) * 100 });

                        const commandOptions: any = {
                            id: app.ID,
                            force: true,
                            ...(appCatalogUrl && {
                                appCatalogScope: 'sitecollection',
                                appCatalogUrl: appCatalogUrl
                            })
                        };

                        await CliExecuter.execute('spo app remove', 'json', commandOptions);
                        completed++;
                    } catch (e: any) {
                        Notifications.error(`Failed to remove '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${apps.length} app(s) removed.` });
            });

            Notifications.info(`Bulk remove completed: ${apps.length} app(s) processed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message || e?.message;
            Notifications.error(message);
        }
    }

    /**
     * Enables all apps in the specified app catalog.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkEnableAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);

            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to enable all apps in this app catalog?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk enable operation cancelled.');
                return;
            }

            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info('No apps found in the app catalog.');
                return;
            }

            const disabledApps = apps.filter(app => !app.Enabled);

            if (disabledApps.length === 0) {
                Notifications.info('All apps are already enabled.');
                return;
            }

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Enabling ${disabledApps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                let completed = 0;
                for (const app of disabledApps) {
                    try {
                        progress.report({ message: `Enabling '${app.Title}'...`, increment: (1 / disabledApps.length) * 100 });

                        const appProductIdFilter = `Title eq '${app.Title}'`;
                        const commandOptionsList: any = {
                            listTitle: 'Apps for SharePoint',
                            webUrl: appCatalogUrl,
                            fields: 'Id, Title, IsAppPackageEnabled',
                            filter: appProductIdFilter
                        };

                        const listItemsResponse = await CliExecuter.execute('spo listitem list', 'json', commandOptionsList);
                        const listItems = JSON.parse(listItemsResponse.stdout || '[]');

                        if (listItems.length > 0) {
                            const appListItemId = listItems[0].Id;

                            const commandOptionsSet: any = {
                                listTitle: 'Apps for SharePoint',
                                id: appListItemId,
                                webUrl: appCatalogUrl,
                                IsAppPackageEnabled: true
                            };

                            await CliExecuter.execute('spo listitem set', 'json', commandOptionsSet);
                            completed++;
                        }
                    } catch (e: any) {
                        Notifications.error(`Failed to enable '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${disabledApps.length} app(s) enabled.` });
            });

            Notifications.info(`Bulk enable completed: ${disabledApps.length} app(s) processed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message || e?.message;
            Notifications.error(message);
        }
    }

    /**
     * Disables all apps in the specified app catalog.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkDisableAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);

            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to disable all apps in this app catalog?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk disable operation cancelled.');
                return;
            }

            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info('No apps found in the app catalog.');
                return;
            }

            const enabledApps = apps.filter(app => app.Enabled);

            if (enabledApps.length === 0) {
                Notifications.info('All apps are already disabled.');
                return;
            }

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Disabling ${enabledApps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                let completed = 0;
                for (const app of enabledApps) {
                    try {
                        progress.report({ message: `Disabling '${app.Title}'...`, increment: (1 / enabledApps.length) * 100 });

                        const appProductIdFilter = `Title eq '${app.Title}'`;
                        const commandOptionsList: any = {
                            listTitle: 'Apps for SharePoint',
                            webUrl: appCatalogUrl,
                            fields: 'Id, Title, IsAppPackageEnabled',
                            filter: appProductIdFilter
                        };

                        const listItemsResponse = await CliExecuter.execute('spo listitem list', 'json', commandOptionsList);
                        const listItems = JSON.parse(listItemsResponse.stdout || '[]');

                        if (listItems.length > 0) {
                            const appListItemId = listItems[0].Id;

                            const commandOptionsSet: any = {
                                listTitle: 'Apps for SharePoint',
                                id: appListItemId,
                                webUrl: appCatalogUrl,
                                IsAppPackageEnabled: false
                            };

                            await CliExecuter.execute('spo listitem set', 'json', commandOptionsSet);
                            completed++;
                        }
                    } catch (e: any) {
                        Notifications.error(`Failed to disable '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${enabledApps.length} app(s) disabled.` });
            });

            Notifications.info(`Bulk disable completed: ${enabledApps.length} app(s) processed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message || e?.message;
            Notifications.error(message);
        }
    }

    /**
     * Installs all apps from the specified app catalog to a site.
     * If installing to a site collection app catalog, apps will first be copied from tenant catalog.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkInstallAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);
            const isSiteCollectionCatalog = !!appCatalogUrl;

            // Get apps from the correct catalog
            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info(`No apps found in the ${isSiteCollectionCatalog ? 'site collection' : 'tenant'} app catalog.`);
                return;
            }

            let siteUrl: string | undefined;
            if (!appCatalogUrl) {
                const relativeUrl = await window.showInputBox({
                    prompt: 'Enter the relative URL of the site where all apps will be installed',
                    ignoreFocusOut: true,
                    placeHolder: 'e.g., sites/sales or leave blank for root site',
                    validateInput: (input) => {
                        const trimmedInput = input.trim();

                        if (trimmedInput.startsWith('https://')) {
                            return 'Please provide a relative URL, not an absolute URL.';
                        }
                        if (trimmedInput.startsWith('/')) {
                            return 'Please provide a relative URL without a leading slash.';
                        }

                        return undefined;
                    }
                });

                if (relativeUrl === undefined) {
                    Notifications.warning('No site URL provided. Operation aborted.');
                    return;
                }

                siteUrl = `${EnvironmentInformation.tenantUrl}/${relativeUrl.trim()}`;
            } else {
                siteUrl = appCatalogUrl;
            }

            const catalogType = isSiteCollectionCatalog ? 'site collection' : 'tenant';
            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to install all ${apps.length} apps from ${catalogType} app catalog to site '${siteUrl}'?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk install operation cancelled.');
                return;
            }

            let completed = 0;
            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Installing ${apps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                for (const app of apps) {
                    try {
                        progress.report({ message: `Installing '${app.Title}'...`, increment: (1 / apps.length) * 100 });

                        const commandOptions: any = {
                            id: app.ID,
                            siteUrl: siteUrl,
                            ...(isSiteCollectionCatalog && {
                                appCatalogScope: 'sitecollection',
                                appCatalogUrl: appCatalogUrl
                            })
                        };

                        await CliExecuter.execute('spo app install', 'json', commandOptions);
                        completed++;
                    } catch (e: any) {
                        Notifications.error(`Failed to install '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${apps.length} app(s) installed.` });
            });

            Notifications.info(`Bulk install completed: ${completed} of ${apps.length} app(s) processed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message || e?.message;
            Notifications.error(message);
        }
    }

    /**
     * Uninstalls all apps from a site.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkUninstallAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);
            const isSiteCollectionCatalog = !!appCatalogUrl;

            // Get apps from the correct catalog (same one they were installed from)
            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info(`No apps found in the ${isSiteCollectionCatalog ? 'site collection' : 'tenant'} app catalog.`);
                return;
            }

            let siteUrl: string | undefined;
            if (!appCatalogUrl) {
                const relativeUrl = await window.showInputBox({
                    prompt: 'Enter the relative URL of the site where all apps will be uninstalled from',
                    ignoreFocusOut: true,
                    placeHolder: 'e.g., sites/sales or leave blank for root site',
                    validateInput: (input) => {
                        const trimmedInput = input.trim();

                        if (trimmedInput.startsWith('https://')) {
                            return 'Please provide a relative URL, not an absolute URL.';
                        }
                        if (trimmedInput.startsWith('/')) {
                            return 'Please provide a relative URL without a leading slash.';
                        }

                        return undefined;
                    }
                });

                if (relativeUrl === undefined) {
                    Notifications.warning('No site URL provided. Operation aborted.');
                    return;
                }

                siteUrl = `${EnvironmentInformation.tenantUrl}/${relativeUrl.trim()}`;
            } else {
                siteUrl = appCatalogUrl;
            }

            const catalogType = isSiteCollectionCatalog ? 'site collection' : 'tenant';
            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to uninstall all ${apps.length} apps from ${catalogType} app catalog on site '${siteUrl}'?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk uninstall operation cancelled.');
                return;
            }

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Uninstalling ${apps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                let completed = 0;
                for (const app of apps) {
                    try {
                        progress.report({ message: `Uninstalling '${app.Title}'...`, increment: (1 / apps.length) * 100 });

                        const commandOptions: any = {
                            id: app.ID,
                            siteUrl: siteUrl,
                            force: true,
                            ...(isSiteCollectionCatalog && {
                                appCatalogScope: 'sitecollection',
                                appCatalogUrl: appCatalogUrl
                            })
                        };

                        await CliExecuter.execute('spo app uninstall', 'json', commandOptions);
                        completed++;
                    } catch (e: any) {
                        Notifications.error(`Failed to uninstall '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${apps.length} app(s) uninstalled.` });
            });

            Notifications.info(`Bulk uninstall completed: ${apps.length} app(s) processed.`);

            // refresh the environmentTreeView
            await commands.executeCommand('spfx-toolkit.refreshAppCatalogTreeView');
        } catch (e: any) {
            const message = e?.error?.message || e?.message;
            Notifications.error(message);
        }
    }

    /**
     * Upgrades all apps on a site.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkUpgradeAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIActions.getAppCatalogUrlFromNode(node);
            const isTenantCatalog = !appCatalogUrl || (EnvironmentInformation.appCatalogUrls && appCatalogUrl === EnvironmentInformation.appCatalogUrls[0]);

            // Always get apps from tenant app catalog for upgrade
            const apps = await CliActions.getAppCatalogApps();

            if (!apps || apps.length === 0) {
                Notifications.info('No apps found in the tenant app catalog.');
                return;
            }

            let siteUrl: string = appCatalogUrl || '';

            if (isTenantCatalog) {
                const relativeUrl = await window.showInputBox({
                    prompt: 'Enter the relative URL of the site where all apps will be upgraded',
                    placeHolder: 'e.g., sites/sales or leave blank for root site',
                    validateInput: (input) => {
                        const trimmedInput = input.trim();

                        if (trimmedInput.startsWith('https://')) {
                            return 'Please provide a relative URL, not an absolute URL.';
                        }
                        if (trimmedInput.startsWith('/')) {
                            return 'Please provide a relative URL without a leading slash.';
                        }

                        return undefined;
                    }
                });

                if (relativeUrl === undefined) {
                    Notifications.warning('No site URL provided. Bulk upgrade aborted.');
                    return;
                }

                const tenantAppCatalogUrl = EnvironmentInformation.appCatalogUrls?.[0] || appCatalogUrl || '';
                siteUrl = `${new URL(tenantAppCatalogUrl).origin}/${relativeUrl.trim()}`;
            }

            const confirm = await window.showQuickPick(['Yes', 'No'], {
                title: `Are you sure you want to upgrade all ${apps.length} apps on site '${siteUrl}'?`,
                ignoreFocusOut: true,
                canPickMany: false
            });

            if (confirm !== 'Yes') {
                Notifications.warning('Bulk upgrade operation cancelled.');
                return;
            }

            await window.withProgress({
                location: ProgressLocation.Notification,
                title: `Upgrading ${apps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
                cancellable: false
            }, async (progress: Progress<{ message?: string; increment?: number }>) => {
                let completed = 0;
                for (const app of apps) {
                    try {
                        progress.report({ message: `Upgrading '${app.Title}'...`, increment: (1 / apps.length) * 100 });

                        const commandOptions: any = {
                            id: app.ID,
                            ...(isTenantCatalog
                                ? { siteUrl }
                                : { appCatalogScope: 'sitecollection', siteUrl })
                        };

                        await CliExecuter.execute('spo app upgrade', 'json', commandOptions);
                        completed++;
                    } catch (e: any) {
                        Notifications.error(`Failed to upgrade '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${apps.length} app(s) upgraded.` });
            });

            Notifications.info(`Bulk upgrade completed: ${apps.length} app(s) processed.`);
        } catch (e: any) {
            const message = e?.message || 'An unexpected error occurred during the bulk upgrade.';
            Notifications.error(message);
        }
    }
}