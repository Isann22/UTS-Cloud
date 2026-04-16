import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optimize for faster builds
  reactStrictMode: true,
  // Reduce unnecessary recompilation
  experimental: {
    optimizePackageImports: ['react-leaflet', 'leaflet'],
  },
};

export default nextConfig;
