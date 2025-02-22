/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  }
};

module.exports = withPWA(nextConfig);