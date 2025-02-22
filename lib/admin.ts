export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
  permissions: string[];
}

export const ADMIN_PERMISSIONS = {
  REVIEW_ARTWORK: 'review_artwork',
  MANAGE_ARTICLES: 'manage_articles',
  MANAGE_USERS: 'manage_users',
} as const;

export function canModerateContent(user: AdminUser) {
  return user.permissions.includes(ADMIN_PERMISSIONS.REVIEW_ARTWORK);
}

export function canManageArticles(user: AdminUser) {
  return user.permissions.includes(ADMIN_PERMISSIONS.MANAGE_ARTICLES);
}

export function validateArtworkContent(artwork: any) {
  // Check for inappropriate content
  const flags = {
    sexual: false,
    violent: false,
    inappropriate: false,
  };

  // Implement content validation logic here
  // This could include AI-based content detection
  // and human review guidelines

  return {
    isValid: !Object.values(flags).some(Boolean),
    flags,
    reason: flags.sexual ? 'Sexual content detected' :
           flags.violent ? 'Violent content detected' :
           flags.inappropriate ? 'Inappropriate content detected' : null
  };
}