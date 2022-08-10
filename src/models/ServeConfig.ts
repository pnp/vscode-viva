export interface ServeConfig {
  '$schema': string;
  port: number;
  https: boolean;
  initialPage?: string;
  serveConfigurations: ServeConfigurations;
}

export interface ServeConfigurations {
  [key: string]: ServeConfiguration;
}

export interface ServeConfiguration {
  pageUrl: string;
  customActions: any;
}