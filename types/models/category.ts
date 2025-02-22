import { ArtistCategorySubmission } from '@prisma/client';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  
  // Relations
  submissions?: ArtistCategorySubmission[];
}

export interface ArtistCategorySubmission {
  id: number;
  userId: string;
  imageUrl: string;
  categoryId: number;
  points: number;
  isFirst: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user?: User;
  category?: Category;
}