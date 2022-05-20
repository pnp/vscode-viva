export interface Sample {
  name: string;
  source: string;
  title: string;
  shortDescription: string;
  url: string;
  longDescription: string[];
  creationDateTime: string;
  updateDateTime: string;
  products: string[];
  metadata: Metadatum[];
  thumbnails: Thumbnail[];
  authors: Author[];
  references: Reference[];
}

export interface Reference {
  name: string;
  description: string;
  url: string;
}

export interface Author {
  gitHubAccount: string;
  pictureUrl: string;
  name: string;
  company?: string;
  twitter?: string;
}

export interface Thumbnail {
  type: string;
  order: number;
  url: string;
  alt: string;
}

export interface Metadatum {
  key: string;
  value: string;
}