import { workspace } from 'vscode';


export interface PackageJson {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    [key: string]: any;
}

export const parsePackageJson = async (): Promise<PackageJson | undefined> => {
    try {
        const files = await workspace.findFiles('package.json', '**/node_modules/**');

        if (!files || files.length === 0) {
            return undefined;
        }

        const packageJsonFile = files[0];
        const content = await workspace.openTextDocument(packageJsonFile.fsPath).then(doc => doc.getText());

        if (!content) {
            return undefined;
        }

        const packageJson: PackageJson = JSON.parse(content);
        return packageJson;
    } catch (error) {
        return undefined;
    }
};
