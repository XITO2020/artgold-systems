export const AUTH_PROVIDERS = {
    google: {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      config: {
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        authorization: {
          params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code"
          }
        }
      }
    },
    discord: {
      id: 'discord',
      name: 'Discord',
      type: 'oauth',
      config: {
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        scope: 'identify email guilds guilds.members.read'
      }
    },
    twitter: {
      id: 'twitter',
      name: 'Twitter',
      type: 'oauth',
      config: {
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        version: '2.0'
      }
    },
    tiktok: {
      id: 'tiktok',
      name: 'TikTok',
      type: 'oauth',
      config: {
        clientId: process.env.TIKTOK_CLIENT_ID,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET
      }
    },
    instagram: {
      id: 'instagram',
      name: 'Instagram',
      type: 'oauth',
      config: {
        clientId: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
      }
    },
    email: {
      id: 'email',
      name: 'Email',
      type: 'email',
      config: {
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
          }
        },
        from: process.env.EMAIL_FROM,
        maxAge: 24 * 60 * 60 // 24 hours
      }
    }
  } as const;
  
  export type AuthProvider = keyof typeof AUTH_PROVIDERS;
  export type AuthProviderConfig = typeof AUTH_PROVIDERS[AuthProvider]['config'];
  
  export function getAuthProviderConfig(provider: AuthProvider): AuthProviderConfig {
    return AUTH_PROVIDERS[provider].config;
  }