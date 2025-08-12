
export const VALIDATION_CONFIG = {
  artwork: {
    minDimensions: { width: 800, height: 800 },
    maxDimensions: { width: 8000, height: 8000 },
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  content: {
    aiDetection: {
      threshold: 0.7,
      warningThreshold: 0.5
    },
    explicit: {
      adultThreshold: 0.4,
      racyThreshold: 0.3
    }
  }
};
