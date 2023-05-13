export interface Sample {
  name: string;
  title: string;
  url: string;
  description: string;
  image: string;
  authors: Author[];
  tags: string[];
  createDate: string;
  updateDate: string;
}

export interface Author {
  name: string;
  pictureUrl: string;
}