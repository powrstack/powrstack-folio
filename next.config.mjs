/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output mode specified - let OpenNext handle it for Node.js runtime
  
  // Disable Next.js image optimization for Cloudflare Workers
  // Cloudflare Workers don't support the Sharp library required for image optimization
  images: {
    unoptimized: true,
  },
  
  // Enable experimental features for ultra-fast performance
  experimental: {
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic pages
      static: 180, // 3 minutes for static pages
    },
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
