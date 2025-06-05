import { lm } from 'vscode';
import { Subscription } from '../../models';
import { Extension } from '../../services/dataType/Extension';
import { SharePointAppInstall, SharePointAppList, SharePointListAdd, SharePointListGet, SharePointListRemove, SharePointPageAdd, SharePointSiteAdd, SharePointSiteGet, SharePointSiteRemove } from './spo/index';
import { SharePointFrameworkProjectUpgrade } from './spfx';


export class ChatTools {
    public static register() {
        const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

        subscriptions.push(
            lm.registerTool('spo_app_list', new SharePointAppList())
        );
        subscriptions.push(
            lm.registerTool('spo_app_install', new SharePointAppInstall())
        );
        subscriptions.push(
            lm.registerTool('spo_list_add', new SharePointListAdd())
        );
        subscriptions.push(
            lm.registerTool('spo_list_get', new SharePointListGet())
        );
        subscriptions.push(
            lm.registerTool('spo_list_remove', new SharePointListRemove())
        );
        subscriptions.push(
            lm.registerTool('spo_page_add', new SharePointPageAdd())
        );
        subscriptions.push(
            lm.registerTool('spo_site_add', new SharePointSiteAdd())
        );
        subscriptions.push(
            lm.registerTool('spo_site_remove', new SharePointSiteRemove())
        );
        subscriptions.push(
            lm.registerTool('spo_site_get', new SharePointSiteGet())
        );
        subscriptions.push(
            lm.registerTool('upgrade_spfx_project', new SharePointFrameworkProjectUpgrade())
        );
    }
}