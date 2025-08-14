export type AccessClaims = {
    sub: string;                // user.id
    email?: string | null;
    isAdmin?: boolean;
    status?: string;            // "ACTIVE" | "FROZEN" | "BANNED"
    roles: string[];            // ex: ["buyer", "creator"]
    discord?: { verified?: boolean; roles?: string[] };
  
    // champs JWT standard si tu les gardes
    iat?: number;
    exp?: number;
  };
  
  // Alias lisible pour ce qu’on met dans req.user
  export type AuthUser = AccessClaims;
  