/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  serverExternalPackages: ['@solana/wallet-adapter-react-ui'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Alias propres
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
      '@comp': path.resolve(__dirname, 'components'),
      '@comp/_partials': path.resolve(__dirname, 'components/_partials'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@ui': path.resolve(__dirname, 'components/ui'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@t': path.resolve(__dirname, '../shared/types'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@tfront': path.resolve(__dirname, 'types')
    };

    // Fallbacks node (si nécessaires)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // ❌ NE PAS ajouter de rules .css / .scss ici
    // Next s’en occupe. (Garder uniquement ce webpack callback pour les alias.)

    return config;
  },
};

module.exports = nextConfig;
