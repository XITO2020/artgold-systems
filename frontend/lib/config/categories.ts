import { ArtCategory } from 'T/artwork';

export const CATEGORY_CONFIG = {
  points: {
    // Cultural Heritage (High Points - Rare & Complex)
    african: { first: 25, subsequent: 10 },
    pacifikian: { first: 25, subsequent: 10 },
    oriental: { first: 25, subsequent: 10 },
    indian: { first: 25, subsequent: 10 },
    amerindian: { first: 25, subsequent: 10 },
    slavic: { first: 25, subsequent: 10 },
    // ... other categories
  } as const,

  validation: {
    minSubmissions: 1,
    maxSubmissions: 12,
    requiredFields: ['title', 'description', 'location', 'imageUrl'],
    allowedFormats: ['jpg', 'png', 'webp'],
    
    // Define allowed subcategories for each main category
    allowedSubcategories: {
      african: ['tribal', 'contemporary', 'traditional', 'masks'],
      pacifikian: ['polynesian', 'melanesian', 'micronesian'],
      oriental: ['ink', 'calligraphy', 'landscape', 'portrait'],
      // ... other categories
    },

    // Define relevant labels for category validation
    categoryLabels: {
      african: ['african', 'tribal', 'ethnic', 'indigenous'],
      pacifikian: ['pacific', 'oceanic', 'island', 'polynesian'],
      oriental: ['asian', 'ink', 'brush', 'calligraphy'],
      // ... other categories
    },

    // Define relevant labels for subcategory validation
    subcategoryLabels: {
      tribal: ['mask', 'ritual', 'ceremony', 'traditional'],
      contemporary: ['modern', 'abstract', 'urban', 'experimental'],
      calligraphy: ['writing', 'script', 'brush', 'characters'],
      // ... other subcategories
    }
  },

  display: {
    defaultLayout: 'grid',
    itemsPerPage: 12,
    sortOptions: ['newest', 'popular', 'value']
  }
};
