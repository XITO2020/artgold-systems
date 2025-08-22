
/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ],
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Configuration des alias de chemins
    config.resolve.alias = {
      ...config.resolve.alias,
      '@comp': path.resolve(__dirname, 'components'),
      '@lib': path.resolve(__dirname, 'lib')
    };

    // Configuration pour les modules natifs
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Désactiver le cache pour le développement
    if (!isServer) {
      config.cache = false;
    }

    return config;
  },
  // Désactiver le cache complet pour le développement
  cache: false
};

module.exports = nextConfig;
