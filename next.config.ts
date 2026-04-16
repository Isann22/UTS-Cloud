import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optimize for faster builds
  reactStrictMode: true,
  // Reduce unnecessary recompilation
  experimental: {
    optimizePackageImports: ['react-leaflet', 'leaflet'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uts-cloud-bucket.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
