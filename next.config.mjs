/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output mode specified - let OpenNext handle it for Node.js runtime
  
  images: {
    // Enable modern image formats for 30-50% smaller files
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
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimized device sizes for 90% of users
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1920],
    imageSizes: [16, 24, 32, 48, 64, 90, 96, 128, 192, 256, 320, 400, 512, 640],
    qualities: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    // Aggressive caching for instant repeat loads
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Enable optimization for ultra-fast loading
    unoptimized: false,
    // Reduce memory usage on large images
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable experimental features for ultra-fast performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', '@fortawesome/react-fontawesome', 'framer-motion'],
    optimizeServerReact: true,
    serverMinification: true,
  },
  
  // Compiler optimizations for sub-1.4s LCP
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-testid$'] } : false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // External packages for server components
  serverExternalPackages: ['sharp'],

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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
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
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
