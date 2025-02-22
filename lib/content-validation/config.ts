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
        racyThreshold: 0.3,
        goreThreshold: 0.2,
        violenceThreshold: 0.3
      },
      hateSpeech: {
        threshold: 0.3,
        identityAttackThreshold: 0.2,
        threatThreshold: 0.4
      }
    },
    review: {
      minReviewers: 1,
      maxReviewTime: 24 * 60 * 60 * 1000, // 24 hours
      autoApproveScore: 0.9,
      autoRejectScore: 0.2
    }
  };