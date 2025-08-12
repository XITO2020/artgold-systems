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
      "@ui": path.resolve(__dirname, "components", "ui"),
      "@t": path.resolve(__dirname, "types"),
      "@comp": path.resolve(__dirname, "components"),
      "@lib": path.resolve(__dirname, "lib"),
      "@hooks": path.resolve(__dirname, "hooks"),
      "@sections": path.resolve(__dirname, "components", "sections")
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
