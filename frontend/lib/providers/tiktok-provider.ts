import { OAuthProvider } from "next-auth/providers/oauth";

// Définissez les types pour les options et le profil
interface TikTokProviderOptions {
  clientId: string;
  clientSecret: string;
}

interface TikTokProfile {
  open_id: string;
  display_name: string;
  avatar_url: string;
}

export default function TikTokProvider(options: TikTokProviderOptions) {
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    authorization: {
      url: "https://www.tiktok.com/auth/authorize",
      params: {
        scope: "user.info",
        response_type: "code",
      },
    },
    token: "https://open-api.tiktok.com/oauth/token/",
    userinfo: "https://open-api.tiktok.com/oauth/userinfo/",
    profile(profile: TikTokProfile) {
      return {
        id: profile.open_id,
        name: profile.display_name,
        image: profile.avatar_url,
      };
    },
    options,
  };
}
