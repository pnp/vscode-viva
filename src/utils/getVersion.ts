import { parseYoRc } from './parseYoRc';
import { parsePackageJson } from './parsePackageJson';


export const getVersion = async (): Promise<string | undefined> => {
    const yoRc = await parseYoRc();
    if (yoRc?.['@microsoft/generator-sharepoint']?.version) {
        return yoRc['@microsoft/generator-sharepoint'].version;
    }

    const packageJson = await parsePackageJson();
    const spCoreLibVersion = packageJson?.dependencies?.['@microsoft/sp-core-library'];

    if (spCoreLibVersion) {
        return spCoreLibVersion.replace(/[\^~>=<]/g, '');
    }

    return undefined;
};
