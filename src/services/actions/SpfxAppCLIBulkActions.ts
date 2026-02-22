import { commands, Progress, ProgressLocation, window } from 'vscode';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { Commands, ContextKeys } from '../../constants';
import { ActionTreeItem } from '../../providers/ActionTreeDataProvider';
import { Notifications } from '../dataType/Notifications';
import { CliExecuter } from '../executeWrappers/CliCommandExecuter';
import { EnvironmentInformation } from '../dataType/EnvironmentInformation';
import { CliActions } from './CliActions';
import { Logger } from '../dataType/Logger';


export class SpfxAppCLIBulkActions {

    public static registerCommands() {
        const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

        subscriptions.push(
            commands.registerCommand(Commands.bulkDeployAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkDeployAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkRetractAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkRetractAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkRemoveAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkRemoveAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkEnableAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkEnableAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkDisableAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkDisableAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkInstallAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkInstallAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkUninstallAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkUninstallAppCatalogApps(node))
        );
        subscriptions.push(
            commands.registerCommand(Commands.bulkUpgradeAppCatalogApps, (node: ActionTreeItem) => SpfxAppCLIBulkActions.bulkUpgradeAppCatalogApps(node))
        );
    }

    /**
     * Deploys all non-deployed apps in the specified app catalog.
     *
     * @param node The tree item representing the app catalog.
     */
    public static async bulkDeployAppCatalogApps(node: ActionTreeItem) {
        try {
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);

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
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);

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
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);

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
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);

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
                        await SpfxAppCLIBulkActions.updateAppPackageEnabledStatus(app, appCatalogUrl, true);
                        completed++;
                    } catch (e: any) {
                        Notifications.error(`Failed to enable '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${disabledApps.length} app(s) enabled.` });
            });

            Notifications.info(`Bulk enable completed: ${disabledApps.length} app(s) processed.`);

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
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);

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
                        await SpfxAppCLIBulkActions.updateAppPackageEnabledStatus(app, appCatalogUrl, false);
                        completed++;
                    } catch (e: any) {
                        Notifications.error(`Failed to disable '${app.Title}': ${e?.error?.message || e?.message}`);
                    }
                }

                progress.report({ message: `Completed: ${completed} of ${enabledApps.length} app(s) disabled.` });
            });

            Notifications.info(`Bulk disable completed: ${enabledApps.length} app(s) processed.`);

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
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);
            const isSiteCollectionCatalog = !!appCatalogUrl;

            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info(`No apps found in the ${isSiteCollectionCatalog ? 'site collection' : 'tenant'} app catalog.`);
                return;
            }

                await SpfxAppCLIBulkActions.performBulkAppSiteAction(
                    apps,
                    appCatalogUrl,
                    isSiteCollectionCatalog,
                    'install',
                    'spo app install',
                    (app, siteUrl, isSiteCollectionCatalogParam, appCatalogUrlParam) => ({
                        id: app.ID,
                        siteUrl: siteUrl,
                        ...(isSiteCollectionCatalogParam && {
                            appCatalogScope: 'sitecollection',
                            appCatalogUrl: appCatalogUrlParam
                        })
                    })
                );

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
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);
            const isSiteCollectionCatalog = !!appCatalogUrl;
            const apps = await CliActions.getAppCatalogApps(appCatalogUrl);

            if (!apps || apps.length === 0) {
                Notifications.info(`No apps found in the ${isSiteCollectionCatalog ? 'site collection' : 'tenant'} app catalog.`);
                return;
            }

            await SpfxAppCLIBulkActions.performBulkAppSiteAction(
                apps,
                appCatalogUrl,
                isSiteCollectionCatalog,
                'uninstall',
                'spo app uninstall',
                (app, siteUrl, isSiteCollectionCatalogParam, appCatalogUrlParam) => ({
                    id: app.ID,
                    siteUrl: siteUrl,
                    force: true,
                    ...(isSiteCollectionCatalogParam && {
                        appCatalogScope: 'sitecollection',
                        appCatalogUrl: appCatalogUrlParam
                    })
                })
            );

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
            const appCatalogUrl = SpfxAppCLIBulkActions.getAppCatalogUrlFromNode(node);
            const isTenantCatalog = !appCatalogUrl || (EnvironmentInformation.appCatalogUrls && appCatalogUrl === EnvironmentInformation.appCatalogUrls[0]);

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

    /**
     * Updates the IsAppPackageEnabled status for an app in the app catalog.
     *
     * @param app The app to update.
     * @param appCatalogUrl The app catalog URL.
     * @param isEnabled Whether to enable or disable the app.
     */
    private static async updateAppPackageEnabledStatus(
        app: any,
        appCatalogUrl: string | undefined,
        isEnabled: boolean
    ): Promise<void> {
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
                IsAppPackageEnabled: isEnabled
            };

            await CliExecuter.execute('spo listitem set', 'json', commandOptionsSet);
        }
    }

    /**
     * Performs a bulk action that requires a target site URL (install/uninstall/upgrade).
     * Handles prompting for relative site URL when needed, confirmation, progress reporting and execution.
     */
    private static async performBulkAppSiteAction(
        apps: any[],
        appCatalogUrl: string | undefined,
        isSiteCollectionCatalog: boolean,
        actionVerb: string,
        cliCommand: string,
        buildCommandOptions: (app: any, siteUrl: string, isSiteCollectionCatalog: boolean, appCatalogUrl?: string) => any
    ): Promise<void> {
        let siteUrl: string | undefined;

        if (!appCatalogUrl) {
            const relativeUrl = await window.showInputBox({
                prompt: `Enter the relative URL of the site where all apps will be ${actionVerb}ed`,
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
            title: `Are you sure you want to ${actionVerb} all ${apps.length} apps from ${catalogType} app catalog to site '${siteUrl}'?`,
            ignoreFocusOut: true,
            canPickMany: false
        });

        if (confirm !== 'Yes') {
            Notifications.warning(`Bulk ${actionVerb} operation cancelled.`);
            return;
        }

        let completed = 0;
        await window.withProgress({
            location: ProgressLocation.Notification,
            title: `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} ${apps.length} app(s)... Check [output window](command:${Commands.showOutputChannel}) to follow the progress.`,
            cancellable: false
        }, async (progress: Progress<{ message?: string; increment?: number }>) => {
            for (const app of apps) {
                try {
                    progress.report({ message: `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} '${app.Title}'...`, increment: (1 / apps.length) * 100 });

                    const commandOptions: any = buildCommandOptions(app, siteUrl as string, isSiteCollectionCatalog, appCatalogUrl);
                    await CliExecuter.execute(cliCommand, 'json', commandOptions);
                    completed++;
                } catch (e: any) {
                    Notifications.error(`Failed to ${actionVerb} '${app.Title}': ${e?.error?.message || e?.message}`);
                }
            }

            progress.report({ message: `Completed: ${completed} of ${apps.length} app(s) ${actionVerb}ed.` });
        });

        Notifications.info(`Bulk ${actionVerb} completed: ${completed} of ${apps.length} app(s) processed.`);
    }

    /**
     * Helper method to extract app catalog URL from a tree node.
     */
    private static getAppCatalogUrlFromNode(node: ActionTreeItem): string | undefined {
        if (node.command?.arguments?.[0]) {
            const urlString = node.command.arguments[0] as string;
            return urlString;
        }
        return undefined;
    }
}
