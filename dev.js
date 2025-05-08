#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting development server from frontend directory...');

// Create a temporary next.config.js in the frontend directory
const frontendDir = path.join(__dirname, 'frontend');
const configPath = path.join(frontendDir, 'next.config.js');

// Create a very simple config that just includes necessary settings
const tempConfig = `
/** @type {import('next').NextConfig} */
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

module.exports = nextConfig;
`;

// Write config to frontend directory
fs.writeFileSync(configPath, tempConfig);

try {
  // Set development environment
  process.env.NODE_ENV = 'development';
  
  // Run Next.js development server directly in the frontend directory
  execSync('npx next dev', { 
    stdio: 'inherit',
    cwd: frontendDir
  });
} catch (error) {
  console.error('Error starting development server:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary config if it exists
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}
