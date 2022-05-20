export interface NpmLs {
  name: string;
  dependencies: Dependencies;
}

export interface Dependencies {
  [dependency: string]: Generatorcode;
}

export interface Generatorcode {
  version: string;
}