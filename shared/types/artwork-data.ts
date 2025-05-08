// types/artwork-data.ts

import { ArtCategory } from './artwork';

// Type pour la création d'un Artwork
export interface ArtworkCreateInput {
  id: string;
  title: string;
  serialNumber: string;
  qrCode: string;
  imageUrl: string;
  location: any; // Location est de type Json, donc on peut le laisser en `any` ou spécifier le type exact
  dimensions: any; // Dimensions également de type Json
  category: ArtCategory;
  points: number;
  isFirst: boolean;
}

// Type pour l'objet Artwork (tel que défini dans Prisma)
export interface ArtworkData {
  id: string;
  category: ArtCategory;
  artworkId?: string;
  isFirst?: boolean;
  points?: number;
}
