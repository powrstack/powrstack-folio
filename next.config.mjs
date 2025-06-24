/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Cloudflare Workers
  output: 'standalone',
  
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
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Define responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable optimization
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Disable image optimization for edge runtime compatibility
    unoptimized: false,
  },
  
  // Enable experimental features for better performance (simplified)
  experimental: {
    optimizePackageImports: ['@fortawesome/react-fontawesome'],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // External packages for server components
  serverExternalPackages: [],

  // Configure headers for Cloudflare
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
