import { ArtworkValidation, ArtworkPurchase, User } from '@prisma/client';

export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  serialNumber: string;
  qrCode: string;
  category: string;
  imageUrl: string;
  location: ArtworkLocation;
  dimensions: ArtworkDimensions;
  weight: ArtworkWeight;
  materials: string[];
  technique: string | null;
  story: string | null;
  creationDate: Date;
  artistId: string;
  currentValue: number;
  totalLikes: number;
  status: ArtworkStatus;
  points: number;
  isFirst: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  artist?: User;
  validations?: ArtworkValidation[];
  purchases?: ArtworkPurchase[];
}

export interface ArtworkLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ArtworkDimensions {
  width: number;
  height: number;
  unit: 'cm' | 'inches';
}

export interface ArtworkWeight {
  value: number;
  unit: 'kg' | 'lbs';
}

export type ArtworkStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';