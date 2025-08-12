export const PROVIDERS = {
    auth: {
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        config: {
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET
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
      }
    },
  
    payment: {
      stripe: {
        name: 'Stripe',
        type: 'card',
        fees: 0.029, // 2.9%
        fixedFee: 0.30, // $0.30
        config: {
          publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          secretKey: process.env.STRIPE_SECRET_KEY,
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
        }
      },
      paypal: {
        name: 'PayPal',
        type: 'wallet',
        fees: 0.035, // 3.5%
        fixedFee: 0.49, // $0.49
        config: {
          clientId: process.env.PAYPAL_CLIENT_ID,
          clientSecret: process.env.PAYPAL_CLIENT_SECRET,
          webhookId: process.env.PAYPAL_WEBHOOK_ID
        }
      },
      monero: {
        name: 'Monero',
        type: 'crypto',
        fees: 0.001, // 0.1%
        config: {
          walletRpcUrl: process.env.MONERO_WALLET_RPC_URL,
          username: process.env.MONERO_WALLET_USERNAME,
          password: process.env.MONERO_WALLET_PASSWORD
        }
      }
    },
  
    storage: {
      s3: {
        name: 'Amazon S3',
        type: 'cloud',
        config: {
          region: process.env.AWS_REGION,
          bucket: process.env.UPLOAD_BUCKET_NAME,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
          }
        }
      },
      supabase: {
        name: 'Supabase Storage',
        type: 'cloud',
        config: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          bucket: 'artworks'
        }
      }
    },
  
    notification: {
      email: {
        name: 'Email',
        type: 'smtp',
        config: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
          },
          from: process.env.EMAIL_FROM
        }
      },
      push: {
        name: 'Web Push',
        type: 'push',
        config: {
          publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          privateKey: process.env.VAPID_PRIVATE_KEY,
          subject: 'mailto:support@tabascoin.com'
        }
      }
    }
  } as const;
  
  // Helper types
  export type AuthProvider = keyof typeof PROVIDERS.auth;
  export type PaymentProvider = keyof typeof PROVIDERS.payment;
  export type StorageProvider = keyof typeof PROVIDERS.storage;
  export type NotificationProvider = keyof typeof PROVIDERS.notification;
  
  // Helper functions
  export const getAuthProvider = (provider: AuthProvider) => PROVIDERS.auth[provider];
  export const getPaymentProvider = (provider: PaymentProvider) => PROVIDERS.payment[provider];
  export const getStorageProvider = (provider: StorageProvider) => PROVIDERS.storage[provider];
  export const getNotificationProvider = (provider: NotificationProvider) => PROVIDERS.notification[provider];