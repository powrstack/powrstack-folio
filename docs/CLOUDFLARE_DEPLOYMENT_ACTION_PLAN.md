# Cloudflare Workers Deployment - Action Plan

**Date:** November 29, 2025  
**Project:** PowrStack Portfolio (powrstack-folio)  
**Priority:** 🔴 CRITICAL  
**Estimated Effort:** 16-24 hours  
**Risk Level:** HIGH

---

## Table of Contents

1. [Strategic Approach](#strategic-approach)
2. [Phase 1: Immediate Fixes (Critical)](#phase-1-immediate-fixes-critical)
3. [Phase 2: Core Compatibility (High Priority)](#phase-2-core-compatibility-high-priority)
4. [Phase 3: Optimization (Medium Priority)](#phase-3-optimization-medium-priority)
5. [Phase 4: Enhancement (Low Priority)](#phase-4-enhancement-low-priority)
6. [Testing Strategy](#testing-strategy)
7. [Rollback Plan](#rollback-plan)
8. [Success Criteria](#success-criteria)

---

## Strategic Approach

### Decision Point: Next.js Version Strategy

You have **TWO MAIN PATHS** to choose from:

#### **Option A: Downgrade to Next.js 14.2.24** ⭐ RECOMMENDED

**Pros:**
- Guaranteed compatibility with @opennextjs/cloudflare 1.3.1
- Proven stable configuration
- Faster to implement (2-4 hours)
- Lower risk
- Well-documented

**Cons:**
- Lose Next.js 15 features (Turbopack improvements, etc.)
- Need to revert recent code that uses Next.js 15 features
- Less future-proof

**Effort:** 🔵 LOW (2-4 hours)  
**Risk:** 🟢 LOW  
**Recommendation:** ⭐ **DO THIS FIRST**

#### **Option B: Upgrade @opennextjs/cloudflare or Switch Adapter**

**Pros:**
- Keep Next.js 15 features
- More future-proof
- Latest framework capabilities

**Cons:**
- @opennextjs/cloudflare may not have Next.js 15 support yet
- Alternative: Use `@cloudflare/next-on-pages` (different architecture)
- Higher risk of bugs
- Longer implementation time (8-12 hours)
- May require significant refactoring

**Effort:** 🔴 HIGH (8-12 hours)  
**Risk:** 🟠 MODERATE-HIGH  
**Recommendation:** Consider for Phase 4 after stabilization

---

## Phase 1: Immediate Fixes (Critical)

**Timeline:** 4-6 hours  
**Must Complete Before Any Deployment Attempt**

### Task 1.1: Version Alignment (Option A - Recommended)

**Objective:** Downgrade to Next.js 14.2.24 for OpenNext compatibility

**Actions:**

```bash
# 1. Update package.json
```

**Changes to make:**

```json
{
  "dependencies": {
    "next": "14.2.24",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@opennextjs/cloudflare": "1.3.1",
    "eslint-config-next": "14.2.24"
  }
}
```

**Commands:**

```bash
# Remove node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Install correct versions
pnpm add next@14.2.24 react@18.3.1 react-dom@18.3.1
pnpm add -D eslint-config-next@14.2.24

# Verify installation
pnpm list next react react-dom
```

**Validation:**
- ✅ All packages resolve without peer dependency warnings
- ✅ `pnpm install` completes without errors
- ✅ Dev server starts: `pnpm dev`

**Rollback if needed:**

```bash
git checkout package.json pnpm-lock.yaml
pnpm install
```

---

### Task 1.2: Remove Filesystem Access from resumeLoader.js

**Objective:** Eliminate Node.js filesystem API usage in edge runtime

**File:** `src/lib/resumeLoader.js`

**Current problematic function (lines ~138-163):**

```javascript
async function loadResumeFromLocalFile() {
  // This entire function must be removed
}
```

**Action:** DELETE the entire `loadResumeFromLocalFile` function

**Update the main loader function:**

Find the line that calls `loadResumeFromLocalFile()` and remove it from the fallback chain.

**Current code (approximately line ~260-340):**

```javascript
export async function loadResumeData() {
  // ... cache checks ...
  
  // REMOVE THIS LINE:
  jsonResumeData = await loadResumeFromLocalFile();
  if (jsonResumeData) { /* ... */ }
  
  // Keep these:
  if (!jsonResumeData) {
    jsonResumeData = await fetchResumeFromPublicAsset(isDevelopment);
  }
  
  if (!jsonResumeData) {
    const result = await fetchResumeFromPreferredOrigins(isDevelopment);
    // ...
  }
  
  if (!jsonResumeData) {
    jsonResumeData = await fetchResumeFromConfiguredFallback(isDevelopment);
  }
}
```

**New fallback sequence:**

1. ~~Filesystem read~~ ❌ REMOVED
2. Public asset fetch (browser only) ✅
3. Preferred origins (server + browser) ✅
4. Configured remote URL (GitHub) ✅

**Testing:**

```bash
# Should work without fs access
NODE_ENV=production NEXT_RUNTIME=edge pnpm dev
# Verify no console errors about fs/promises
```

**Expected Result:**
- No import statements for 'fs/promises' or 'path' in bundle
- Resume loads from remote URL successfully
- No runtime errors in edge mode

---

### Task 1.3: Fix Image Optimization

**Objective:** Disable Next.js image optimization for Cloudflare Workers

**File:** `next.config.mjs`

**Current configuration (line ~48):**

```javascript
images: {
  unoptimized: false,  // ❌ CHANGE THIS
  // ... rest of config
}
```

**Change to:**

```javascript
images: {
  unoptimized: true,  // ✅ Disable optimization for Workers
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    // Keep all existing patterns
  ],
  // Remove these (not needed with unoptimized):
  // deviceSizes: [...],
  // imageSizes: [...],
  // qualities: [...],
  // minimumCacheTTL: 31536000,
}
```

**Alternative (Better for production):** Use Cloudflare Images

If you want optimized images:

```javascript
images: {
  loader: 'custom',
  loaderFile: './src/lib/cloudflareImageLoader.js',
}
```

Create `src/lib/cloudflareImageLoader.js`:

```javascript
export default function cloudflareImageLoader({ src, width, quality }) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${src}`
}
```

**Testing:**

```bash
# Build and check image URLs
pnpm build
# Check .next/server/app/page.html for image URLs
# Should be raw URLs or /cdn-cgi/image/* URLs
```

---

### Task 1.4: Fix Output Mode

**Objective:** Remove standalone output mode incompatible with Workers

**File:** `next.config.mjs`

**Current (line ~4):**

```javascript
const nextConfig = {
  output: 'standalone',  // ❌ REMOVE THIS
  // ...
}
```

**Change to:**

```javascript
const nextConfig = {
  // No output specified - let OpenNext handle it
  // OR conditionally:
  // output: process.env.CLOUDFLARE ? undefined : 'standalone',
  // ...
}
```

**Why:** The `standalone` output mode generates a Node.js server, which conflicts with Cloudflare Workers edge runtime.

---

### Task 1.5: Fix Build Scripts

**Objective:** Ensure consistent use of pnpm and correct package versions

**File:** `package.json`

**Current:**

```json
{
  "scripts": {
    "build:cloudflare": "next build && opennextjs-cloudflare build"
  }
}
```

**Change to:**

```json
{
  "scripts": {
    "build:cloudflare": "next build && pnpm exec opennextjs-cloudflare build",
    "deploy:worker": "pnpm run build:cloudflare && wrangler deploy",
    "preview:worker": "pnpm run build:cloudflare && wrangler dev"
  }
}
```

**File:** `build-cloudflare.sh` (line 18)

**Current:**

```bash
npx @opennextjs/cloudflare@latest build
```

**Change to:**

```bash
pnpm exec opennextjs-cloudflare build
```

**File:** `wrangler.jsonc`

**Current (line 27):**

```jsonc
"build": {
  "command": "npm run build:cloudflare"
}
```

**Change to:**

```jsonc
"build": {
  "command": "pnpm run build:cloudflare"
}
```

**Also update compatibility_date:**

```jsonc
"compatibility_date": "2024-11-29",  // Today's date, not future
```

---

### Task 1.6: Test Phase 1 Changes

**Objective:** Verify critical fixes work before proceeding

**Test Sequence:**

```bash
# 1. Clean build
rm -rf .next .open-next node_modules pnpm-lock.yaml
pnpm install

# 2. Verify versions
pnpm list next @opennextjs/cloudflare react

# 3. Test development build
pnpm dev
# Visit http://localhost:3000
# Check browser console for errors
# Verify images load
# Verify resume data loads

# 4. Test production build
pnpm build
# Should complete without errors

# 5. Test Cloudflare build
pnpm run build:cloudflare
# Should generate .open-next/ directory
# Check for .open-next/worker.js

# 6. Test local worker preview
pnpm run preview:worker
# Visit http://localhost:8787
# Verify site works
```

**Success Criteria:**
- ✅ No peer dependency warnings
- ✅ No filesystem access errors
- ✅ Images load (unoptimized)
- ✅ Resume data loads from remote URL
- ✅ `.open-next/worker.js` file exists
- ✅ Local worker preview serves pages

**If Phase 1 fails:** STOP - Do not proceed to Phase 2. Debug issues first.

---

## Phase 2: Core Compatibility (High Priority)

**Timeline:** 6-8 hours  
**Prerequisite:** Phase 1 must be complete and tested

### Task 2.1: Convert Components to Server Components

**Objective:** Reduce client bundle size and improve edge performance

**Current Problem:** 21+ components unnecessarily marked with `'use client'`

**Strategy:** Only these components NEED `'use client'`:
- Components using React hooks (useState, useEffect, etc.)
- Components using browser APIs (window, document, localStorage)
- Components with event handlers (onClick, onSubmit, etc.)
- Components using animation libraries (framer-motion)

**Components that should REMAIN client:**
- ✅ `AnimatedBackground.js` (uses framer-motion)
- ✅ `FloatingTechIcons.js` (uses framer-motion)
- ✅ `TypingAnimation.js` (uses useState, useEffect)
- ✅ `ContactForm.js` (uses form state, event handlers)
- ✅ `ThemeSwitcher.js` (uses localStorage, event handlers)
- ✅ `PerformanceMonitor.js` (uses browser APIs)
- ✅ `ServiceWorkerRegistration.js` (uses browser APIs)

**Components to CONVERT to server:**
- 🔄 `Hero.js` - Split into server wrapper + client interactive parts
- 🔄 `Header.js` - Server component with client ThemeSwitcher
- 🔄 `Footer.js` - Pure server component (no interactivity)
- 🔄 `BlogCard.js` - Server component
- 🔄 `BlogGrid.js` - Server component
- 🔄 `ProfileImage.js` - Server component
- 🔄 `SocialLinks.js` - Server component
- 🔄 `HeroStats.js` - Server component
- 🔄 `CertificationBadges.js` - Server component
- 🔄 `TimelineItem.js` - Server component
- 🔄 `EducationTimelineItem.js` - Server component

**Implementation Pattern:**

**Before (Hero.js):**

```javascript
'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Hero({ resumeData }) {
  const [isVisible, setIsVisible] = useState(false);
  // ...
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

**After (Hero.js):**

```javascript
// Remove 'use client' - this is now a server component
import Image from 'next/image';
import HeroClient from './HeroClient';

export default function Hero({ resumeData }) {
  // Server-side data processing
  const { personalInfo, about } = resumeData;
  
  return (
    <div>
      <div>Static content rendered on server</div>
      <HeroClient data={personalInfo} />
    </div>
  );
}
```

**New file (HeroClient.js):**

```javascript
'use client';

import { useState } from 'react';

export default function HeroClient({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  // Client-only interactivity
  return <div>{/* Interactive parts */}</div>;
}
```

**Priority Order:**

1. **High Impact (Do First):**
   - Footer.js - Easiest, no interactivity
   - BlogCard.js - Just displays data
   - BlogGrid.js - Just layout
   - SocialLinks.js - Just links
   - ProfileImage.js - Just image

2. **Medium Impact:**
   - Header.js - Extract ThemeSwitcher
   - Hero.js - Split into server + client parts
   - Timeline components - Pure data display

3. **Keep Client (Don't Change):**
   - ContactForm.js
   - TypingAnimation.js
   - AnimatedBackground.js
   - FloatingTechIcons.js
   - Theme/Performance components

**Testing After Each Conversion:**

```bash
pnpm dev
# Check that component still works
# Check browser console for hydration errors
# Check Network tab - fewer client chunks
```

**Expected Result:**
- Bundle size reduction: ~200-300KB
- Faster initial page load
- Better SEO (more server-rendered HTML)

---

### Task 2.2: Remove or Adapt Service Worker

**Objective:** Eliminate conflict between browser SW and Cloudflare Worker

**Options:**

**Option A: Remove Completely (Recommended for Workers)**

```javascript
// src/app/layout.js
// DELETE THIS LINE:
// import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";

// And remove from JSX:
// <ServiceWorkerRegistration />
```

**Why:** Cloudflare Workers provide edge caching. Browser service workers are redundant and add complexity.

**Option B: Keep but Disable on Workers**

```javascript
// src/app/layout.js
import dynamic from 'next/dynamic';

const ServiceWorkerRegistration = dynamic(
  () => import('../components/ServiceWorkerRegistration'),
  {
    ssr: false,
    loading: () => null,
  }
);

// In JSX:
{typeof window !== 'undefined' && !window.navigator.userAgent.includes('Cloudflare') && (
  <ServiceWorkerRegistration />
)}
```

**Also remove/update:**
- `public/sw.js` - Delete or adapt for offline-only features
- Cache headers for sw.js in next.config.mjs

**Testing:**

```bash
# Check that SW doesn't register
pnpm run preview:worker
# Open DevTools > Application > Service Workers
# Should be empty or disabled
```

---

### Task 2.3: Simplify Middleware

**Objective:** Reduce middleware complexity and potential edge runtime issues

**File:** `middleware.ts`

**Current:** Adds many headers and has complex CSP

**Simplified version:**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Essential security headers only
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Simplified CSP - let Cloudflare handle more complex rules
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +  // Simplified for edge
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https:;"
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Why:**
- Remove `'unsafe-eval'` to improve security
- Simplify CSP to reduce edge processing time
- Cloudflare provides additional security at CDN level

**Testing:**

```bash
pnpm run preview:worker
# Open DevTools > Network > select any page
# Check Response Headers
# Verify security headers present
```

---

### Task 2.4: Optimize masterConfig for Edge

**Objective:** Remove process.env access from config initialization

**File:** `src/masterConfig.js`

**Current (lines 9-14):**

```javascript
resumeOrigins: {
  development: process.env.NEXT_PUBLIC_RESUME_LOCAL_ORIGIN || "http://localhost:3000",
  production:
    process.env.NEXT_PUBLIC_RESUME_REMOTE_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://mdaburaihan.pro",
},
```

**Problem:** Direct process.env access at module level can cause issues in edge runtime.

**Solution:**

```javascript
// Function-based access instead of module-level
function getResumeOrigin(env) {
  if (env === 'development') {
    if (typeof process !== 'undefined') {
      return process.env.NEXT_PUBLIC_RESUME_LOCAL_ORIGIN || "http://localhost:3000";
    }
    return "http://localhost:3000";
  }
  
  if (typeof process !== 'undefined') {
    return process.env.NEXT_PUBLIC_RESUME_REMOTE_ORIGIN ||
           process.env.NEXT_PUBLIC_SITE_URL ||
           "https://mdaburaihan.pro";
  }
  return "https://mdaburaihan.pro";
}

const config = {
  // ... other config
  getResumeOrigin,  // Export function instead
};
```

**Update consumers:**

```javascript
// Before:
const origin = config.resumeOrigins.production;

// After:
const origin = config.getResumeOrigin(process.env.NODE_ENV);
```

---

### Task 2.5: Test Phase 2 Changes

**Test sequence:**

```bash
# 1. Full rebuild
rm -rf .next .open-next
pnpm build:cloudflare

# 2. Check bundle size
ls -lh .open-next/worker.js
# Should be <500KB if component conversions worked

# 3. Test worker locally
pnpm run preview:worker

# 4. Run tests
pnpm test

# 5. Check for errors
# - No hydration mismatches
# - No "use client" warnings for server components
# - No service worker conflicts
```

**Success Criteria:**
- ✅ Bundle size reduced by 30-50%
- ✅ All pages render correctly
- ✅ No hydration errors
- ✅ All tests pass
- ✅ Worker starts without errors

---

## Phase 3: Optimization (Medium Priority)

**Timeline:** 4-6 hours  
**Prerequisite:** Phase 2 complete, initial deployment successful

### Task 3.1: Optimize FontAwesome Bundle

**Current:** All icon packs imported

**File:** `src/lib/fontawesome.js`

**Current:**

```javascript
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);  // ❌ Imports 1000+ icons
```

**Optimized:**

```javascript
import { library } from '@fortawesome/fontawesome-svg-core';
// Import only icons you use
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faDownload,
  // ... list only icons actually used
} from '@fortawesome/free-solid-svg-icons';

import {
  faLinkedin,
  faGithub,
  faTwitter,
  // ... list only brands used
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faEnvelope,
  faPhone,
  // ... only used icons
);
```

**Find all used icons:**

```bash
# Search codebase for icon usage
grep -r "icon=" src/ | grep -oP 'icon="\K[^"]+' | sort -u
```

**Expected savings:** 150-200KB

---

### Task 3.2: Implement Edge Caching Strategy

**File:** `next.config.mjs`

**Add optimized cache headers:**

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        },
      ],
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
        },
      ],
    },
  ];
},
```

**File:** `wrangler.jsonc`

**Add cache configuration:**

```jsonc
{
  "r2_buckets": [
    // If you want to cache static assets in R2
  ],
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "your-kv-namespace-id",
      "preview_id": "your-preview-kv-namespace-id"
    }
  ]
}
```

---

### Task 3.3: Add Error Boundaries

**Create:** `src/components/ErrorBoundary.js`

```javascript
'use client';

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="hero min-h-screen bg-error">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Oops!</h1>
              <p className="py-6">Something went wrong. Please try again.</p>
              <button
                className="btn btn-primary"
                onClick={() => this.setState({ hasError: false })}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Use in layout:**

```javascript
// src/app/layout.js
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

### Task 3.4: Implement Health Check Endpoint

**Create:** `src/app/api/health/route.js`

```javascript
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: process.env.NEXT_RUNTIME || 'unknown',
    version: process.env.npm_package_version || 'unknown',
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}
```

**Test:**

```bash
curl https://your-worker.workers.dev/api/health
```

---

### Task 3.5: Add Deployment Validation Script

**Create:** `scripts/validate-deployment.sh`

```bash
#!/bin/bash

WORKER_URL="${1:-http://localhost:8787}"

echo "🔍 Validating deployment at: $WORKER_URL"

# Test health endpoint
echo "Testing health check..."
curl -f "$WORKER_URL/api/health" || exit 1

# Test home page
echo "Testing home page..."
curl -f "$WORKER_URL/" || exit 1

# Test API routes
echo "Testing resume API..."
curl -f "$WORKER_URL/api/resume" || exit 1

# Test blog API
echo "Testing blog API..."
curl -f "$WORKER_URL/api/blog?source=dev&limit=5" || exit 1

echo "✅ All validation tests passed!"
```

**Make executable:**

```bash
chmod +x scripts/validate-deployment.sh
```

**Use after deployment:**

```bash
./scripts/validate-deployment.sh https://your-worker.workers.dev
```

---

## Phase 4: Enhancement (Low Priority)

**Timeline:** 2-4 hours  
**Can be deferred to post-launch**

### Task 4.1: Implement Observability

**Update:** `wrangler.jsonc`

```jsonc
{
  "observability": {
    "enabled": true,
    "tracing_sample_rate": 0.1,  // 10% sampling
    "logs": {
      "enabled": true
    }
  }
}
```

**Add structured logging:**

```javascript
// src/lib/logger.js - enhance for Workers
export const logger = {
  info: (message, data) => {
    console.log(JSON.stringify({ level: 'info', message, ...data }));
  },
  error: (message, error) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error.message,
      stack: error.stack 
    }));
  },
  // ...
};
```

---

### Task 4.2: Add Environment Configuration

**Create:** `.env.example`

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mdaburaihan.pro
NEXT_PUBLIC_RESUME_REMOTE_ORIGIN=https://mdaburaihan.pro

# Blog Configuration  
NEXT_PUBLIC_DEV_TO_USERNAME=yourusername
NEXT_PUBLIC_HASHNODE_USERNAME=yourusername

# Cloudflare Specific
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# Optional: Analytics
ANALYTICS_ID=your-analytics-id
```

**Create:** `src/lib/env.js`

```javascript
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://mdaburaihan.pro',
  devToUsername: process.env.NEXT_PUBLIC_DEV_TO_USERNAME,
  hashnodeUsername: process.env.NEXT_PUBLIC_HASHNODE_USERNAME,
  // Validation
  isValid: () => {
    return !!(env.siteUrl && env.devToUsername);
  },
};

if (typeof window === 'undefined' && !env.isValid()) {
  console.warn('⚠️  Some environment variables are not set');
}
```

---

### Task 4.3: Create Deployment Checklist

**Create:** `docs/DEPLOYMENT_CHECKLIST.md`

```markdown
# Pre-Deployment Checklist

## Before Building
- [ ] All tests pass (`pnpm test`)
- [ ] No TypeScript/ESLint errors (`pnpm lint`)
- [ ] Environment variables configured
- [ ] Version numbers updated

## Build Phase
- [ ] Clean build successful (`pnpm run build:cloudflare`)
- [ ] `.open-next/worker.js` exists
- [ ] Worker bundle <1MB compressed
- [ ] No build warnings about missing modules

## Local Testing
- [ ] Dev server works (`pnpm dev`)
- [ ] Worker preview works (`pnpm run preview:worker`)
- [ ] All pages render correctly
- [ ] API routes respond correctly
- [ ] Images load properly
- [ ] No console errors

## Pre-Production
- [ ] Health check endpoint responds
- [ ] Resume data loads from remote
- [ ] Blog posts load
- [ ] Forms submit successfully
- [ ] Analytics tracking works
- [ ] Security headers present

## Deployment
- [ ] Wrangler authentication configured
- [ ] Deploy to staging first
- [ ] Run validation script
- [ ] Monitor logs for 10 minutes
- [ ] Test from multiple locations
- [ ] Check performance metrics

## Post-Deployment
- [ ] Verify custom domain works
- [ ] Check SSL certificate
- [ ] Test error pages (404, 500)
- [ ] Monitor error rates
- [ ] Update DNS if needed
```

---

## Testing Strategy

### Unit Tests

**Update existing tests:**

```bash
# Run existing tests
pnpm test

# Add new tests for edge runtime
```

**Create:** `test/edge-runtime.test.js`

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Edge Runtime Compatibility', () => {
  beforeEach(() => {
    process.env.NEXT_RUNTIME = 'edge';
  });

  it('should not import filesystem modules', async () => {
    const { loadResumeData } = await import('../src/lib/resumeLoader');
    // Should not throw
    expect(loadResumeData).toBeDefined();
  });

  it('should load resume from remote', async () => {
    const { loadResumeData } = await import('../src/lib/resumeLoader');
    const data = await loadResumeData();
    expect(data).toHaveProperty('personalInfo');
  });
});
```

### Integration Tests

**Local Worker Testing:**

```bash
# Terminal 1: Start worker
pnpm run preview:worker

# Terminal 2: Run tests
curl http://localhost:8787/
curl http://localhost:8787/api/health
curl http://localhost:8787/api/resume
```

### Performance Tests

**Create:** `scripts/performance-test.sh`

```bash
#!/bin/bash

URL="${1:-http://localhost:8787}"

echo "🚀 Testing performance..."

# Test cold start
echo "Cold start test..."
curl -w "@curl-format.txt" -o /dev/null -s "$URL/"

# Test warm start (5 requests)
echo "Warm start test..."
for i in {1..5}; do
  curl -w "@curl-format.txt" -o /dev/null -s "$URL/"
  sleep 1
done
```

**Create:** `curl-format.txt`

```
time_namelookup:    %{time_namelookup}\n
time_connect:       %{time_connect}\n
time_appconnect:    %{time_appconnect}\n
time_pretransfer:   %{time_pretransfer}\n
time_redirect:      %{time_redirect}\n
time_starttransfer: %{time_starttransfer}\n
time_total:         %{time_total}\n
```

---

## Rollback Plan

### Immediate Rollback (if deployment fails)

**Option 1: Revert to Previous Version**

```bash
# If using Cloudflare dashboard
# Go to Workers & Pages > Your Worker > Deployments
# Click "Rollback" on last working version

# If using Wrangler CLI
wrangler rollback [VERSION]
```

**Option 2: Quick Fix Deploy**

```bash
# Revert code changes
git revert HEAD
git push

# Rebuild and redeploy
pnpm run build:cloudflare
wrangler deploy
```

### Git Rollback

```bash
# Create rollback branch
git checkout -b rollback/cloudflare-fixes

# Reset to last working commit
git reset --hard <LAST_WORKING_COMMIT>

# Force push (careful!)
git push origin rollback/cloudflare-fixes --force
```

### Canary Deployment Strategy

**Gradual rollout:**

```jsonc
// wrangler.jsonc
{
  "routes": [
    {
      "pattern": "mdaburaihan.pro",
      "custom_domain": true
    }
  ],
  // Deploy to staging first
  "vars": {
    "ENVIRONMENT": "staging"
  }
}
```

**Steps:**

1. Deploy to `staging-worker.workers.dev`
2. Test thoroughly for 24 hours
3. Monitor error rates
4. Gradually route traffic: 10% → 50% → 100%
5. Keep old worker running as backup

---

## Success Criteria

### Phase 1 Success Metrics

- ✅ Build completes without errors
- ✅ No peer dependency warnings
- ✅ `.open-next/worker.js` generated
- ✅ Worker bundle <1MB
- ✅ Local preview works
- ✅ No filesystem access errors

### Phase 2 Success Metrics

- ✅ All pages render correctly
- ✅ API routes functional
- ✅ Images display properly
- ✅ Resume data loads
- ✅ Blog posts load
- ✅ Forms work
- ✅ Bundle size <500KB
- ✅ No hydration errors
- ✅ All tests pass

### Production Success Metrics

- ✅ Deployment completes successfully
- ✅ Health check returns 200
- ✅ All pages accessible
- ✅ Cold start <500ms
- ✅ Warm response time <100ms
- ✅ Error rate <1%
- ✅ Uptime >99.9%
- ✅ Custom domain works
- ✅ SSL certificate valid

### Performance Targets

- **Cold Start:** <500ms (p95)
- **Warm Request:** <100ms (p95)
- **Time to First Byte:** <200ms
- **Largest Contentful Paint:** <2.5s
- **First Input Delay:** <100ms
- **Cumulative Layout Shift:** <0.1

---

## Risk Mitigation

### High-Risk Activities

1. **Version downgrade (Task 1.1)**
   - **Risk:** Breaking changes in Next.js 14 vs 15
   - **Mitigation:** Test thoroughly, keep React 18 compatible code
   - **Rollback:** Revert package.json, reinstall

2. **Component conversion (Task 2.1)**
   - **Risk:** Hydration errors, broken functionality
   - **Mitigation:** Convert one component at a time, test after each
   - **Rollback:** Revert individual component files

3. **Image optimization change (Task 1.3)**
   - **Risk:** Images don't load, layout shift
   - **Mitigation:** Test all image URLs, check network tab
   - **Rollback:** Revert next.config.mjs images section

### Monitoring During Deployment

**Watch for:**
- Error spike in logs
- Increased response times
- Failed health checks
- Client-side JavaScript errors
- Image loading failures

**Monitoring commands:**

```bash
# Watch Worker logs
wrangler tail

# Check analytics
wrangler pages deployment list

# Monitor health
watch -n 5 'curl -s https://your-worker.workers.dev/api/health | jq'
```

---

## Timeline Summary

| Phase | Duration | Risk | Effort |
|-------|----------|------|--------|
| **Phase 1** | 4-6 hours | 🔴 Critical | 🔵 Medium |
| **Phase 2** | 6-8 hours | 🟠 High | 🔴 High |
| **Phase 3** | 4-6 hours | 🟡 Medium | 🔵 Medium |
| **Phase 4** | 2-4 hours | 🟢 Low | 🔵 Low |
| **Testing** | 4 hours | 🔴 Critical | 🔵 Medium |
| **Total** | **20-28 hours** | | |

### Recommended Schedule

**Day 1 (8 hours):**
- Morning: Phase 1 (Tasks 1.1-1.6)
- Afternoon: Test Phase 1, start Phase 2

**Day 2 (8 hours):**
- Morning: Phase 2 (Tasks 2.1-2.5)
- Afternoon: Test Phase 2, deploy to staging

**Day 3 (4-6 hours):**
- Morning: Phase 3 (optimization)
- Afternoon: Production deployment + monitoring

**Day 4+ (Optional):**
- Phase 4 enhancements
- Documentation updates
- Performance tuning

---

## Next Steps

1. **Review this plan** with your team
2. **Choose version strategy** (Option A recommended)
3. **Set up staging environment** in Cloudflare
4. **Create backup** of current codebase
5. **Begin Phase 1** when ready
6. **Report progress** after each phase

---

## Support Resources

- [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Next.js 14 Docs](https://nextjs.org/docs/14/)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)

---

**Good luck with the deployment! 🚀**
