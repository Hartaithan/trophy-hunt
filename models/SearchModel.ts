export interface SearchQueries {
  [key: string]: string | string[];
  query: string;
}

export interface SearchItem {
  id: string;
  title: string;
  platform_title: string;
  count_tlist: number;
  count_article: number;
  release_date: string;
  hash: string;
}

export interface SearchResult {
  id: number;
  name: string;
  platform: string;
  value: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}
