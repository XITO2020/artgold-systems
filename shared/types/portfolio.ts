export type PortfolioCategory = 'illustrations' | 'comics' | 'videos' | 'graphics' | '3d';
export type PortfolioItemType = 'image' | 'video' | '3d';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: PortfolioCategory;
  type: PortfolioItemType;
  url: string;
  thumbnail: string | null;
  series: string | null;
  order: number;
  duration: number | null;
  modelFormat: string | null;
  likes: number;
  views: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: PortfolioComment[];
  user?: {
    name: string | null;
    image: string | null;
  };
}

export interface PortfolioComment {
  id: string;
  content: string;
  userId: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface PortfolioLike {
  userId: string;
  itemId: string;
  createdAt: Date;
}