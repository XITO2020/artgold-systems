import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des images
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    unoptimized: true
  },
  
  // Configuration de webpack
  webpack: (config, { isServer }) => {
    // Configuration des alias
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
      "@ui": path.resolve(__dirname, "components", "ui"),
      "@t": path.resolve(__dirname, "types"),
      "@comp": path.resolve(__dirname, "components"),
      "@lib": path.resolve(__dirname, "lib"),
      "@hooks": path.resolve(__dirname, "hooks"),
      "@sections": path.resolve(__dirname, "components", "sections")
    };

    // Configuration des fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false
    };

    return config;
  },
  
  // Configuration expérimentale minimale
  experimental: {
    optimizeCss: process.env.NODE_ENV === 'production',
  },
  
  // Options pour les fichiers SASS/SCSS
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  
  // Extensions de pages supportées
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configuration du compilateur
  compiler: {
    // Activer la suppression des logs en production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // Activer les émotions pour le style
    emotion: true
  },
  
  // Configuration Babel minimale
  babel: {
    presets: ['next/babel'],
    plugins: [
      ['@emotion/babel-plugin', { sourceMap: process.env.NODE_ENV !== 'production' }]
    ]
  }
};

export default nextConfig;
