export class EnvironmentInformation {
  private static _appCatalogUrl: string | undefined = undefined;
  private static _account: string | undefined = undefined;

  public static get appCatalogUrl(): string | undefined {
    return this._appCatalogUrl;
  }

  public static set appCatalogUrl(value: string | undefined) {
    this._appCatalogUrl = value;
  }

  public static get account(): string | undefined {
    return this._appCatalogUrl;
  }

  public static set account(value: string | undefined) {
    this._appCatalogUrl = value;
  }

  public static reset() {
    this._appCatalogUrl = undefined;
    this._account = undefined;
  }
}