export class EnvironmentInformation {
  private static _appCatalogUrls: string[] | undefined = undefined;
  private static _tenantUrl: string | undefined = undefined;
  private static _account: string | undefined = undefined;
  private static _tenantId: string | undefined = undefined;
  private static _clientId: string | undefined = undefined;

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

  public static get tenantUrl(): string | undefined {
    return this._tenantUrl;
  }

  public static set tenantUrl(value: string | undefined) {
    this._tenantUrl = value;
  }

  public static get tenantId(): string | undefined {
    return this._tenantId;
  }

  public static set tenantId(value: string | undefined) {
    this._tenantId = value;
  }

  public static get clientId(): string | undefined {
    return this._clientId;
  }

  public static set clientId(value: string | undefined) {
    this._clientId = value;
  }

  public static reset() {
    this._appCatalogUrls = undefined;
    this._account = undefined;
    this._tenantId = undefined;
    this._clientId = undefined;
  }
}