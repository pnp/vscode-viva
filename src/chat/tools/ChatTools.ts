import { lm } from 'vscode';
import { Subscription } from '../../models';
import { Extension } from '../../services/dataType/Extension';
import { SharePointSiteAdd } from './spo/SiteAdd';

export class ChatTools {
    public static register() {
        const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

        subscriptions.push(
            lm.registerTool('spo_site_add', new SharePointSiteAdd())
        );
    }
}