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
}

export interface SearchResult {
  id: number;
  name: string;
  platform: string;
  url: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}
