/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // ajoute ici d'autres domaines d'images si besoin
    ],
    unoptimized: true,
  },

  // Ces libs ESM ont parfois besoin d'être transpilées côté Next
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets',
    '@walletconnect/solana-adapter',
    '@walletconnect/universal-provider',
    '@walletconnect/logger',
  ],

  webpack: (config) => {
    // Fallbacks Node pour le bundle frontend
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Évite que WalletConnect/Pino tente d'inclure ces modules Node uniquement
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'pino-pretty': false,
      'sonic-boom': false,
    };

    return config;
  },
};

module.exports = nextConfig;
