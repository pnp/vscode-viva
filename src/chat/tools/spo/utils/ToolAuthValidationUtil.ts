import { LanguageModelTextPart, LanguageModelToolResult } from 'vscode';
import { AuthProvider } from '../../../../providers/AuthProvider';


export const validateAuth = async () : Promise<LanguageModelToolResult | boolean> => {
    const authInstance = AuthProvider.getInstance();
    const account = await authInstance.getAccount();
    if (!account) {
        return new LanguageModelToolResult([new LanguageModelTextPart('The SPFx Toolkit tools are only available when you are signed in to your Microsoft 365 tenant. Please sign in first.')]);
    }

    return true;
};