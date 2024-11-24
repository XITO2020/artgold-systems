export interface ArtworkMetadata {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    thumbnailUrl: string;
    artist: string;
    price: number;
    currency: string;
    category: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface GalleryCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    theme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    layout: 'grid' | 'masonry' | 'carousel';
    featuredImage: string;
  }
  
  export interface TabButtonProps {
    variant?: 'default' | 'outline' | 'secondary';
    size?: 'default' | 'sm' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    active?: boolean;
  }
  
  export interface ColorFilter {
    name: string;
    value: string;
    label: string;
  }
  
  export const COLOR_FILTERS: ColorFilter[] = [
    { name: 'red', value: '#FF0075', label: 'Rouge' },
    { name: 'blue', value: '#22a2FF', label: 'Bleu' },
    { name: 'green', value: '#0ade50', label: 'Vert' },
    { name: 'yellow', value: '#FFFF00', label: 'Jaune' },
    { name: 'purple', value: '#610075', label: 'Violet' },
    { name: 'orange', value: '#FFA500', label: 'Orange' },
    { name: 'pink', value: '#FFC0CB', label: 'Rose' },
    { name: 'brown', value: '#621212', label: 'Marron' },
    { name: 'gray', value: '#808090', label: 'Gris' },
    { name: 'black', value: '#010010', label: 'Noir' },
    { name: 'white', value: '#FFFFDF', label: 'Blanc' }
  ];