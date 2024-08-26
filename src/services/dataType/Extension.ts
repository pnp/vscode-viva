import { ExtensionContext, ExtensionMode, SecretStorage } from 'vscode';


export class Extension {
  private static instance: Extension;

  private constructor(private ctx: ExtensionContext) {}

  /**
   * Gets the instance of the Extension class.
   * If an instance doesn't exist, it creates a new one using the provided ExtensionContext.
   * @param ctx - The ExtensionContext object.
   * @returns The instance of the Extension class.
   */
  public static getInstance(ctx?: ExtensionContext): Extension {
    if (!Extension.instance && ctx) {
      Extension.instance = new Extension(ctx);
    }

    return Extension.instance;
  }

  /**
   * Gets the name of the extension.
   * @returns The name of the extension.
   */
  public get name(): string {
    return this.ctx.extension.packageJSON.name;
  }

  /**
   * Gets the display name of the extension.
   * @returns The display name as a string.
   */
  public get displayName(): string {
    return this.ctx.extension.packageJSON.displayName;
  }

  /**
   * Gets the version of the extension.
   * @returns The version string.
   */
  public get version(): string {
    return this.ctx.extension.packageJSON.version;
  }

  /**
   * Determines whether the extension is running in production mode.
   * @returns True if the extension is running in production mode, false otherwise.
   */
  public get isProductionMode(): boolean {
    return this.ctx.extensionMode === ExtensionMode.Production;
  }

  /**
   * Returns the subscriptions of the Extension.
   * @returns An array of disposable objects representing the subscriptions.
   */
  public get subscriptions(): { dispose(): any; }[] {
    return this.ctx.subscriptions;
  }

  /**
   * Gets the secret storage.
   * @returns The secret storage.
   */
  public get secrets(): SecretStorage {
    return this.ctx.secrets;
  }

  /**
   * Gets the path of the extension.
   * @returns The path of the extension.
   */
  public get extensionPath(): string {
    return this.ctx.extensionPath;
  }
}