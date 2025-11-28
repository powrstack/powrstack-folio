import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Use Node.js runtime for Cloudflare Workers compatibility
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  
  // Security headers for Cloudflare Workers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Add CSP header for security
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data: https:; " +
    "connect-src 'self' https://dev.to https://gql.hashnode.com https://api.github.com; " +
    "frame-src 'none'; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
