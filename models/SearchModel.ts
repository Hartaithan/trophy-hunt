export interface ISearchQueries {
  [key: string]: string | string[];
  query: string;
}

export interface ISearchItem {
  id: string;
  title: string;
  platform_title: string;
  count_tlist: number;
  count_article: number;
  release_date: string;
}

export interface ISearchResult {
  id: number;
  name: string;
  platform: string;
  url: string;
}

export interface ISearchResponse {
  query: string;
  results: ISearchResult[];
}
