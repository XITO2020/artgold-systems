import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
      "@ui": path.resolve(__dirname, "components", "ui")
      // si tu veux garder l’alias "ù":
      // "ù": path.resolve(__dirname, "components", "ui")
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false
    };
    return config;
  }
};

export default nextConfig;
