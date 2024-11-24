export const GALLERY_CATEGORIES = {
  CULTURAL_HERITAGE: {
    PACIFIKIAN: {
      id: 'pacifikian',
      name: 'Pacific Islander Art',
      slug: 'pacifikian',
      description: 'Traditional and contemporary Pacific Islands cultural artworks',
      theme: {
        background: 'bg-blue-50',
        text: 'text-blue-900',
        accent: 'border-teal-600'
      },
      layout: 'masonry',
      featuredImage: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8'
    },
    ORIENTAL: {
      id: 'oriental',
      name: 'Oriental Art',
      slug: 'oriental',
      description: 'Traditional East Asian artistic expressions',
      theme: {
        background: 'bg-red-50',
        text: 'text-red-900',
        accent: 'border-red-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1578321272125-4e4c4c3643c5'
    },
    AMERINDIAN: {
      id: 'amerindian',
      name: 'Native American Art',
      slug: 'amerindian',
      description: 'Indigenous American artistic traditions',
      theme: {
        background: 'bg-amber-50',
        text: 'text-amber-900',
        accent: 'border-amber-600'
      },
      layout: 'masonry',
      featuredImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66'
    },
    AFRICAN: {
      id: 'afrikan',
      name: 'African Art',
      slug: 'african',
      description: 'Traditional and contemporary African artistic expressions',
      theme: {
        background: 'bg-orange-50',
        text: 'text-orange-900',
        accent: 'border-orange-600'
      },
      layout: 'masonry',
      featuredImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'
    },
    INDIAN: {
      id: 'indian',
      name: 'Indian Art',
      slug: 'indian',
      description: 'Classical and contemporary Indian artistic traditions',
      theme: {
        background: 'bg-purple-50',
        text: 'text-purple-900',
        accent: 'border-purple-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1582560474992-385ebb9b29be'
    },
    CHINESE: {
      id: 'chinese',
      name: 'Chinese Art',
      slug: 'chinese',
      description: 'Traditional and modern Chinese artistic expressions',
      theme: {
        background: 'bg-rose-50',
        text: 'text-rose-900',
        accent: 'border-rose-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1578321272125-4e4c4c3643c5'
    }
  },
  CONTEMPORARY: {
    ECOLOGICAL_PLANS: {
      id: 'ecological-plans',
      name: 'Ecological Plans',
      slug: 'ecological-plans',
      description: 'Environmental and architectural designs',
      theme: {
        background: 'bg-green-50',
        text: 'text-green-900',
        accent: 'border-green-600'
      },
      layout: 'horizontal',
      featuredImage: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715'
    },
    SCULPTURE: {
      id: 'sculpture',
      name: 'Sculpture',
      slug: 'sculpture',
      description: '3D artworks and sculptures',
      theme: {
        background: 'bg-stone-50',
        text: 'text-stone-900',
        accent: 'border-stone-600'
      },
      layout: 'masonry',
      featuredImage: 'https://images.unsplash.com/photo-1544531586-c5a8e52b9d4e'
    },
    INVENTION: {
      id: 'invention',
      name: 'Invention Sketches',
      slug: 'invention',
      description: 'Technical drawings and invention concepts',
      theme: {
        background: 'bg-zinc-50',
        text: 'text-zinc-900',
        accent: 'border-zinc-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1581091226825-c6a89e7e4801'
    }
  },
  ILLUSTRATION: {
    CHARACTER_DESIGN: {
      id: 'character-design',
      name: 'Character Design',
      slug: 'character-design',
      description: 'Original character designs and concepts',
      theme: {
        background: 'bg-violet-50',
        text: 'text-violet-900',
        accent: 'border-violet-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968'
    },
    COMICS: {
      id: 'comics',
      name: 'Comics',
      slug: 'comics',
      description: 'Comic strips and graphic narratives',
      theme: {
        background: 'bg-yellow-50',
        text: 'text-yellow-900',
        accent: 'border-yellow-600'
      },
      layout: 'horizontal',
      featuredImage: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d'
    },
    MANGA: {
      id: 'manga',
      name: 'Manga',
      slug: 'manga',
      description: 'Japanese-style manga artwork',
      theme: {
        background: 'bg-pink-50',
        text: 'text-pink-900',
        accent: 'border-pink-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1578950435899-d1c1bf932ab2'
    }
  },
  TRADITIONAL: {
    SCHOOL_SKETCH: {
      id: 'school-sketch',
      name: 'School Sketches',
      slug: 'school-sketch',
      description: 'Academic and classroom sketches',
      theme: {
        background: 'bg-sky-50',
        text: 'text-sky-900',
        accent: 'border-sky-600'
      },
      layout: 'masonry',
      featuredImage: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968'
    },
    LANDSCAPE: {
      id: 'landscape',
      name: 'Landscape',
      slug: 'landscape',
      description: 'Natural and urban landscapes',
      theme: {
        background: 'bg-emerald-50',
        text: 'text-emerald-900',
        accent: 'border-emerald-600'
      },
      layout: 'masonry',
      featuredImage: 'https://images.unsplash.com/photo-1578950435899-d1c1bf932ab2'
    },
    PORTRAIT: {
      id: 'portrait',
      name: 'Portrait',
      slug: 'portrait',
      description: 'Portrait artworks',
      theme: {
        background: 'bg-indigo-50',
        text: 'text-indigo-900',
        accent: 'border-indigo-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1544531586-c5a8e52b9d4e'
    },
    REALISTICXIX: {
      id: 'realisticXIX',
      name: 'Pre-1900 Realistic',
      slug: 'realistic-xix',
      description: 'Classical realistic artworks before 1900',
      theme: {
        background: 'bg-neutral-50',
        text: 'text-neutral-900',
        accent: 'border-neutral-600'
      },
      layout: 'grid',
      featuredImage: 'https://images.unsplash.com/photo-1581091226825-c6a89e7e4801'
    }
  }
} as const;

export type GalleryCategory = keyof typeof GALLERY_CATEGORIES;
export type SubCategory<T extends GalleryCategory> = keyof typeof GALLERY_CATEGORIES[T];

export interface CategoryTheme {
  background: string;
  text: string;
  accent: string;
}

export interface CategoryLayout {
  type: 'grid' | 'masonry' | 'horizontal';
  columns?: number;
  gap?: number;
}