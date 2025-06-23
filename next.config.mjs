/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
    // Configure external image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2fltix0v2e0sb.cloudfront.net',
        port: '',
        pathname: '/dev-badge.svg',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // Define responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable optimization
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
};

export default nextConfig;
