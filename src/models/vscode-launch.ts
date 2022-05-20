export interface VSCodeLaunch {
  version: string;
  configurations: Configuration[];
}

export interface Configuration {
  name: string;
  request: string;
  url: string;
}