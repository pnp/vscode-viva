import { ExtensionContext, commands, env } from 'vscode';
import { TelemetryReporter } from '@vscode/extension-telemetry';
import { Commands } from '../constants';

export const TELEMETRY_EVENTS = {
    // accountTreeView
    [Commands.login]: 'Login',
    [Commands.logout]: 'Logout',

    // tasksTreeView
    [Commands.gulpBuildProject]: 'Gulp Build Project',
    [Commands.gulpBundleProject]: 'Gulp Bundle Project',
    [Commands.gulpCleanProject]: 'Gulp Clean Project',
    [Commands.gulpDeployToAzureStorage]: 'Gulp Deploy to Azure Storage',
    [Commands.gulpPackageProject]: 'Gulp Package Project',
    [Commands.gulpPublishProject]: 'Gulp Publish Project',
    [Commands.gulpServeProject]: 'Gulp Serve Project',
    [Commands.gulpTestProject]: 'Gulp Test Project',
    [Commands.gulpTrustDevCert]: 'Gulp Trust Dev Cert',
    [Commands.executeTerminalCommand]: 'Execute Terminal Command',

    [Commands.heftBuildProject]: 'Heft Build Project',
    [Commands.heftCleanProject]: 'Heft Clean Project',
    [Commands.heftDeployToAzureStorage]: 'Heft Deploy to Azure Storage',
    [Commands.heftEjectProject]: 'Heft Eject Project',
    [Commands.heftPackageProject]: 'Heft Package Project',
    [Commands.heftPublishProject]: 'Heft Publish Project',
    [Commands.heftStartProject]: 'Heft Start Project',
    [Commands.heftTestProject]: 'Heft Test Project',
    [Commands.heftTrustDevCert]: 'Heft Trust Dev Cert',

    // actionsTreeView
    [Commands.upgradeProject]: 'Upgrade Project',
    [Commands.validateProject]: 'Validate Project',
    [Commands.renameProject]: 'Rename Project',
    [Commands.increaseVersion]: 'Increase Project Version',
    [Commands.grantAPIPermissions]: 'Grant API Permissions',
    [Commands.deployProject]: 'Deploy Project',
    [Commands.setFormCustomizer]: 'Set Form Customizer',
    [Commands.pipeline]: 'Scaffold CI/CD Workflow',
    [Commands.addToProject]: 'Add Component to Project',
    [Commands.samplesGallery]: 'View Samples Gallery',
    [Commands.openCopilot]: 'Use @spfx in GitHub Copilot',
    [Commands.createProject]: 'Create New Project',
    [Commands.checkDependencies]: 'Validate Local Setup',
    [Commands.installDependencies]: 'Install Dependencies',

    // environmentTreeView
    [Commands.addTenantAppCatalog]: 'Add Tenant App Catalog',
    [Commands.removeTenantWideExtension]: 'Remove Tenant Wide Extension',
    [Commands.enableTenantWideExtension]: 'Enable Tenant Wide Extension',
    [Commands.disableTenantWideExtension]: 'Disable Tenant Wide Extension',
    [Commands.updateTenantWideExtension]: 'Update Tenant Wide Extension',
    [Commands.copyAppCatalogApp]: 'Copy App',
    [Commands.deployAppCatalogApp]: 'Deploy App',
    [Commands.disableAppCatalogApp]: 'Disable App',
    [Commands.enableAppCatalogApp]: 'Enable App',
    [Commands.installAppCatalogApp]: 'Install App',
    [Commands.moveAppCatalogApp]: 'Move App',
    [Commands.removeAppCatalogApp]: 'Remove App',
    [Commands.retractAppCatalogApp]: 'Retract App',
    [Commands.uninstallAppCatalogApp]: 'Uninstall App',
    [Commands.upgradeAppCatalogApp]: 'Upgrade App',
    [Commands.addSiteAppCatalog]: 'Add Site App Catalog',
    [Commands.removeSiteAppCatalog]: 'Remove Site App Catalog',
} as const;

export class TelemetryService {
    private static instance: TelemetryService;
    public reporter: TelemetryReporter | undefined;
    private static isInternalCall: boolean = false;

    private constructor() { }

    public static getInstance(): TelemetryService {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }

        return TelemetryService.instance;
    }

    public initialize(context: ExtensionContext, connectionString: string): void {
        if (!this.reporter) {
            this.reporter = new TelemetryReporter(connectionString);
            context.subscriptions.push(this.reporter);
        }
    }

    public sendEvent(eventName: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void {
        if (this.reporter && env.isTelemetryEnabled) {
            this.reporter.sendTelemetryEvent(eventName, properties, measurements);
        }
    }

    public sendErrorEvent(eventName: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void {
        if (this.reporter && env.isTelemetryEnabled) {
            this.reporter.sendTelemetryErrorEvent(eventName, properties, measurements);
        }
    }

    public dispose(): void {
        if (this.reporter) {
            this.reporter.dispose();
        }
    }

    /**
     * A command handler with telemetry tracking.
     * @param commandIdOrEventName The command ID to be referenced from TELEMETRY_EVENTS, or a custom event name
     * @param originalCommand The original command
     * @param properties Properties to include in telemetry
     * @param measurements Measurements to include in telemetry
     * @returns A wrapped handler that sends telemetry before executing the original handler
     */
    public static withTelemetry(commandIdOrEventName: string, originalCommand: Function, properties?: Record<string, string>, measurements?: Record<string, number>) {
        const eventName = TELEMETRY_EVENTS[commandIdOrEventName] || commandIdOrEventName;

        return async (...args: any[]) => {
            const telemetryService = TelemetryService.getInstance();

            if (telemetryService.reporter && !TelemetryService.isInternalCall) {
                const telemetryProperties: Record<string, string> = { ...properties };

                // additional properties for npm scripts
                if (originalCommand.name === 'runCommand' && args[0] && typeof args[0] === 'string') {
                    const npmCommand = args[0] as string;
                    if (npmCommand.startsWith('npm run ')) {
                        telemetryProperties.script = npmCommand.replace('npm run ', '');
                    }
                }

                telemetryService.sendEvent(eventName, telemetryProperties, measurements);
            }

            // to avoid twice tracking triggered by clean, build, bundle, etc. which internally calls executeTerminalCommand
            TelemetryService.isInternalCall = true;
            try {
                return await originalCommand(...args);
            } finally {
                TelemetryService.isInternalCall = false;
            }
        };
    }
}
