/** @type {import('next').NextConfig} */
const path = require('path');

// For development, we'll use a simpler config
const isDev = process.env.NODE_ENV === 'development';

// Simple config for development mode
const devConfig = {
  // Tell Next.js that the app is in the frontend directory
  dir: 'frontend',
  
  // Set the correct path for public files
  distDir: path.join('..', '.next'),
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ],
    unoptimized: true
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

// Use PWA only in production
let nextConfig = devConfig;

if (!isDev) {
  try {
    const withPWA = require('next-pwa');
    nextConfig = withPWA({
      dest: 'public',
      disable: false
    })(devConfig);
  } catch (e) {
    console.warn('next-pwa not found, continuing without PWA support');
  }
}

module.exports = nextConfig;