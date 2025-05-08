export type BlogTheme = 
  | 'art-market'
  | 'technology'
  | 'community'
  | 'tutorials'
  | 'announcements'
  | 'market-analysis'
  | 'artist-spotlight'
  | 'token-updates';

export type BlogCategory =
  | 'news'
  | 'guide'
  | 'analysis'
  | 'interview'
  | 'feature'
  | 'update';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  theme: BlogTheme;
  category: BlogCategory;
  date: string;
  author: {
    name: string;
    image: string;
  };
  image: string;
  readTime: number;
  slug: string;
}