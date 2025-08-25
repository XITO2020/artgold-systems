/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**' }
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@solana/wallet-adapter-react-ui'],
    serverActions: true
  },
  webpack: (config, { isServer }) => {
    // Configuration des alias
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

    // Fallbacks pour les modules Node.js côté client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib')
      };
    }

    return config;
  },
};

module.exports = nextConfig;
