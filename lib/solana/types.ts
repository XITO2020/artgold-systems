export interface StoryMetadata {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  url: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface ArtworkMetadata {
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  medium: string;
  materials: string[];
}

export interface TokenCreationResult {
  signature: string;
  metadata: {
    story: StoryMetadata;
    artwork: ArtworkMetadata;
    tokenType: string;
    version: string;
  };
}