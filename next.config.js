const withPWA = require('next-pwa')({
  dest: 'public',
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./styles'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'conspix.tv', 'sorcery.exposed', 'images.unsplash.com'],
    optimized: true,
  },
  i18n: {
    defaultLocale: 'fr',
    locales: [
    "am", "ar", "bn", "bo", "cs", "de", 
    "gr", "en", "es", "fi", "fr", "ga", 
    "ha", "hi", "hr", "hu", "id", "is", 
    "it", "ja", "kk", "km", "ko", "mn", 
    "ms", "nl", "pl", "pt", "ps", "ro", 
    "ru", "se", "sk", "sw", "th", "tr", 
    "ur", "wo", "xh", "yo", "zh", "zu"
  ],
    localeDetection: false,
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
  },
  env: {
    NAIM_API_URL: process.env.NAIM_API_URL,
    NAIM_API_KEY: process.env.NAIM_API_KEY,
  },
};

module.exports = withPWA(nextConfig);