export type ArtCategory = 
  | 'ecologicalplan'
  | 'medieval'
  | 'fantaisy'
  | 'textil'
  | 'architecture'
  | 'sculpture'
  | 'invention'
  | 'characterdesign'
  | 'comics'
  | 'schoolsketch'
  | 'manga'
  | 'photography'
  | 'portrait'
  | 'realisticXIX'
  | 'realisticXX'
  | 'realisticXXI'
  | 'african'
  | 'pacifikian'
  | 'oriental'
  | 'indian'
  | 'amerindian'
  | 'slavic'
  | 'abstract'
  | 'paper'
  | 'calligraphy'
  | 'inked'
  | 'sketches'
  | 'objects'
  | 'creatures'
  | 'tricot'
  | 'onwood'
  | 'cake'
  | 'oil'
  | 'acrylic'
  | 'pencil'
  | 'watercolor'
  | 'other';
    
    

export const ACCEPTED_FILE_TYPES = {
  images: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/tiff',
    'image/bmp',
    'image/gif',
    'image/svg+xml'
  ],
  maxSize: 20 * 1024 * 1024, // 20MB
  minDimensions: {
    width: 800,
    height: 800
  },
  maxDimensions: {
    width: 8000,
    height: 8000
  }
};

export interface ArtworkMetadata {
  id: string;
  title: string;
  artist: string;
  creationDate: Date;
  level: number;
  category: ArtCategory;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    country: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth?: number;
    unit: 'cm' | 'inches';
  };
  weight: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  materials: string[];
  technique: string;
  story?: string;
  exif?: {
    camera?: string;
    lens?: string;
    settings?: string;
    software?: string;
  };
  preservation: {
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    storage: string;
    restoration?: string;
  };
  authentication: {
    verified: boolean;
    method: string;
    date: Date;
    verifier: string;
  };
  valueDistribution: {
    creator: {
      address: string;
      share: number; // Always 10%
    };
    owner: {
      address: string;
      share: number; // Always 80%
    };
    possessor: {
      address: string;
      location: string;
    };
    buyers: Array<{
      address: string;
      purchaseDate: Date;
    }>;
  };
  history: Array<{
    date: Date;
    event: 'created' | 'transferred' | 'liked' | 'purchased';
    from?: string;
    to?: string;
    value?: number;
  }>;
  totalLikes: number;
  currentValue: number;
  serialNumber: string;
  qrCode: string;
}