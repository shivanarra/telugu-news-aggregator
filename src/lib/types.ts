export type Category =
  | "top"
  | "politics"
  | "cinema"
  | "sports"
  | "business"
  | "tech"
  | "state"
  | "national"
  | "international";

export interface SourceConfig {
  id: string;
  name: string;
  homepage: string;
  logo?: string; // path under /public
  feeds: Array<{
    url: string;
    categories: Category[];
  }>
}

export interface ArticleItem {
  id: string; // stable hash
  sourceId: string;
  sourceName: string;
  title: string;
  summary?: string;
  url: string;
  image?: string;
  publishedAt?: string; // ISO string
  categories: Category[];
}

export interface AggregatedResult {
  articles: ArticleItem[];
  fetchedAt: string; // ISO
}
