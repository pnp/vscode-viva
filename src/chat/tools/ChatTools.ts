import { lm } from 'vscode';
import { Subscription } from '../../models';
import { Extension } from '../../services/dataType/Extension';
import { SharePointAppInstall, SharePointAppInstanceList, SharePointAppList, SharePointAppUninstall, SharePointAppUpgrade, SharePointListAdd, SharePointListGet, SharePointListRemove, SharePointPageAdd, SharePointSiteAdd, SharePointSiteGet, SharePointSiteRemove } from './spo/index';
import { SharePointFrameworkProjectUpgrade } from './spfx';


export class ChatTools {
    public static register() {
        const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

        subscriptions.push(
            lm.registerTool('install_spo_app', new SharePointAppInstall())
        );
        subscriptions.push(
            lm.registerTool('list_spo_app_instances', new SharePointAppInstanceList())
        );
        subscriptions.push(
            lm.registerTool('list_spo_app', new SharePointAppList())
        );
        subscriptions.push(
            lm.registerTool('uninstall_spo_app', new SharePointAppUninstall())
        );
        subscriptions.push(
            lm.registerTool('upgrade_spo_app', new SharePointAppUpgrade())
        );
        subscriptions.push(
            lm.registerTool('add_spo_list', new SharePointListAdd())
        );
        subscriptions.push(
            lm.registerTool('get_spo_list', new SharePointListGet())
        );
        subscriptions.push(
            lm.registerTool('remove_spo_list', new SharePointListRemove())
        );
        subscriptions.push(
            lm.registerTool('add_spo_page', new SharePointPageAdd())
        );
        subscriptions.push(
            lm.registerTool('spo_site_add', new SharePointSiteAdd())
        );
        subscriptions.push(
            lm.registerTool('spo_site_get', new SharePointSiteGet())
        );
        subscriptions.push(
            lm.registerTool('spo_site_remove', new SharePointSiteRemove())
        );
        subscriptions.push(
            lm.registerTool('upgrade_spfx_project', new SharePointFrameworkProjectUpgrade())
        );
    }
}