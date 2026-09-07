export interface SiteAppCatalogExport {
  url: string;
  apps: Record<string, unknown>[];
  error?: string;
}
