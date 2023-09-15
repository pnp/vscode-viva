export class EnvironmentInformation {
  private static _appCatalogUrls: string[] | undefined = undefined;
  private static _account: string | undefined = undefined;

  public static get appCatalogUrls(): string[] | undefined {
    return this._appCatalogUrls;
  }

  public static set appCatalogUrls(value: string[] | undefined) {
    this._appCatalogUrls = value;
  }

  public static get account(): string | undefined {
    return this._account;
  }

  public static set account(value: string | undefined) {
    this._account = value;
  }

  public static reset() {
    this._appCatalogUrls = undefined;
    this._account = undefined;
  }
}