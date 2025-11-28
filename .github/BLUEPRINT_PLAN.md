# PowrStack Portfolio - Reusable Blueprint Plan

> **Version**: 1.0.0  
> **Last Updated**: November 29, 2025  
> **Purpose**: Comprehensive architectural blueprint for replicating, extending, or understanding the portfolio system

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Foundation](#project-foundation)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Component System](#component-system)
5. [Configuration System](#configuration-system)
6. [Performance Strategy](#performance-strategy)
7. [Deployment Architecture](#deployment-architecture)
8. [Extension Patterns](#extension-patterns)
9. [Quality Assurance](#quality-assurance)
10. [Implementation Checklist](#implementation-checklist)

---

## 🏗️ Architecture Overview

### Technology Stack

```yaml
Framework: Next.js 15.5.4
  - App Router (src/app)
  - Server Components (default)
  - Client Components (marked with 'use client')
  - Node.js runtime (Cloudflare Workers compatible)

UI Layer: React 19.1.1
  - Server-side rendering
  - Hydration-critical pieces in client wrappers
  - Suspense boundaries for async data

Styling: Tailwind CSS 4.1.13 + daisyUI 5.1.25
  - No tailwind.config.js (Tailwind 4 native)
  - 30+ theme system via daisyUI
  - CSS variables for dynamic theming

Animation: Framer Motion 12.23.22
  - Configurable intensity levels
  - Performance-optimized animations
  - SSR-safe implementation

Deployment: Cloudflare Workers
  - OpenNext adapter v1.14.0
  - Node.js runtime with nodejs_compat
  - Edge-optimized delivery
```

### Architectural Principles

1. **Configuration-First**: Single source of truth (`masterConfig.js`)
2. **Data Layer Separation**: Resume/blog data flows through dedicated loaders
3. **Component Modularity**: Category-based organization with barrel exports
4. **Performance-Driven**: Sub-1.4s LCP target with intelligent preloading
5. **SSR-Safe**: Client-side features wrapped with proper hydration handling

---

## 🎯 Project Foundation

### 1. Directory Structure

```
project-root/
├── .github/
│   ├── copilot-instructions.md       # AI assistant guidance
│   ├── BLUEPRINT_PLAN.md             # This file
│   └── instructions/                  # Code review templates
│
├── docs/                              # Architecture documentation
│   ├── COMPONENT_ARCHITECTURE.md     # Component organization
│   ├── SSR_FIXES_REPORT.md          # SSR patterns
│   ├── CLOUDFLARE_*.md               # Deployment guides
│   └── ai_summary_docs/              # Feature documentation
│
├── public/
│   ├── resume.json                   # Resume data (JSON Resume schema)
│   ├── sw.js                         # Service worker
│   └── images/                       # Static assets
│
├── src/
│   ├── masterConfig.js               # Single source of truth
│   │
│   ├── app/                          # Next.js App Router
│   │   ├── layout.js                 # Root layout (server component)
│   │   ├── page.js                   # Home page (async data loading)
│   │   ├── globals.css               # Global styles + Tailwind
│   │   ├── blog/page.js              # Blog page
│   │   ├── education/page.js         # Education page
│   │   ├── experience/page.js        # Experience page
│   │   └── api/                      # API routes
│   │       ├── blog/route.js         # Blog aggregation
│   │       └── resume/route.js       # Resume data endpoint
│   │
│   ├── components/                   # Component library
│   │   ├── index.js                  # Main barrel export
│   │   ├── Hero.js                   # Landing hero (root level)
│   │   ├── ServiceWorkerRegistration.js
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── index.js
│   │   │   ├── Header.js             # Navigation
│   │   │   └── Footer.js             # Site footer
│   │   │
│   │   ├── ui/                       # UI components
│   │   │   ├── index.js
│   │   │   ├── AnimatedBackground.js
│   │   │   ├── ThemeSwitcher.js
│   │   │   ├── SocialLinks.js
│   │   │   ├── ProfileImage.js
│   │   │   ├── HeroContent.js
│   │   │   └── [10+ more UI components]
│   │   │
│   │   ├── blog/                     # Blog components
│   │   │   ├── index.js
│   │   │   ├── BlogCard.js
│   │   │   ├── BlogGrid.js
│   │   │   └── BlogContent.js
│   │   │
│   │   ├── forms/                    # Form components
│   │   │   ├── index.js
│   │   │   └── ContactForm.js
│   │   │
│   │   ├── performance/              # Performance tools
│   │   │   ├── index.js
│   │   │   ├── PerformanceMonitor.js
│   │   │   ├── PerformanceBudget.js
│   │   │   └── CriticalResourcePreloader.js
│   │   │
│   │   └── client/                   # Client wrappers
│   │       ├── ClientAnimatedBackground.js
│   │       ├── ClientPerformanceMonitor.js
│   │       └── [other client wrappers]
│   │
│   └── lib/                          # Core libraries
│       ├── resumeLoader.js           # Multi-layer resume loading
│       ├── dataTransformer.js        # JSON Resume transformer
│       ├── blogAdapter.js            # Multi-source blog adapter
│       ├── blogLoader.js             # Blog caching layer
│       ├── logger.js                 # Unified logging
│       └── fontawesome.js            # Icon configuration
│
├── test/                             # Test suite
│   ├── setupTests.js                 # Test environment
│   ├── resumeLoader.test.js
│   ├── transformer.test.js
│   └── fixtures/                     # Test data
│
├── next.config.mjs                   # Next.js configuration
├── middleware.ts                     # Next.js middleware
├── wrangler.jsonc                    # Cloudflare Workers config
├── build-cloudflare.sh               # Deployment script
├── vitest.config.mjs                 # Test configuration
└── package.json                      # Dependencies & scripts
```

### 2. Core Dependencies

```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "19.1.1",
    "react-dom": "19.1.1",
    "framer-motion": "12.23.22",
    "tailwindcss": "4.1.13",
    "daisyui": "5.1.25",
    "@fortawesome/fontawesome-svg-core": "^6.8.0",
    "@fortawesome/free-brands-svg-icons": "^6.8.0",
    "@fortawesome/free-regular-svg-icons": "^6.8.0",
    "@fortawesome/free-solid-svg-icons": "^6.8.0",
    "@fortawesome/react-fontawesome": "^0.2.2"
  },
  "devDependencies": {
    "@opennextjs/cloudflare": "^1.14.0",
    "wrangler": "^4.51.0",
    "vitest": "^3.2.4",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-config-next": "15.5.4"
  }
}
```

### 3. Build & Deployment Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "build:cloudflare": "bash build-cloudflare.sh",
    "preview:worker": "wrangler dev .open-next/worker.js --port 8787",
    "deploy:worker": "wrangler deploy .open-next/worker.js",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## 🔄 Data Flow Architecture

### Data Loading Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    masterConfig.js                          │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ Resume URLs  │  │ Blog APIs  │  │ Performance Cfg  │   │
│  └──────────────┘  └────────────┘  └──────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌──────────────────┐ ┌───────────┐ ┌──────────────────┐
│  resumeLoader.js │ │ blogLoader│ │ Component Config │
│                  │ │           │ │                  │
│  Multi-layer     │ │ Multi-src │ │ Theme, BG, etc   │
│  Caching:        │ │ Fetching  │ │                  │
│  1. Memory       │ │           │ │                  │
│  2. localStorage │ │ Cache TTL │ │                  │
│  3. Public asset │ │           │ │                  │
│  4. Remote URL   │ │           │ │                  │
└────────┬─────────┘ └─────┬─────┘ └────────┬─────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────┐
│           dataTransformer.js                         │
│  Normalizes JSON Resume → Component-friendly format  │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│              Server Components                       │
│  - layout.js (loads resume once)                    │
│  - page.js (shares promise via Suspense)            │
│  - Header/Footer (receives transformed data)        │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│           Client Components (hydrated)               │
│  - Hero (animations, interactions)                  │
│  - ThemeSwitcher (client-side only)                 │
│  - ContactForm (form handling)                      │
└──────────────────────────────────────────────────────┘
```

### Resume Data Flow

**1. Configuration (`masterConfig.js`)**

```javascript
export default {
  resumeJson: "/resume.json",
  resumeOrigins: {
    development: process.env.NEXT_PUBLIC_RESUME_LOCAL_ORIGIN,
    production: process.env.NEXT_PUBLIC_SITE_URL,
  },
  resumeCache: {
    enabled: false, // Disable for development
    memory: true,
    browserStorage: true,
  },
  resumeUrl: "https://raw.githubusercontent.com/user/repo/main/public/resume.json"
};
```

**2. Loading (`resumeLoader.js`)**

```javascript
// Multi-layer loading strategy
export async function loadResumeData() {
  // Layer 1: Memory cache (fastest)
  if (resumeDataCache && !isDevelopment) return resumeDataCache;
  
  // Layer 2: Browser localStorage (fast)
  const cached = getCachedDataFromStorage();
  if (cached) return cached;
  
  // Layer 3: Load based on environment
  if (isServer) {
    // Server: Try local filesystem first (Node.js runtime only)
    resumeJsonData = await loadResumeFromLocalFile();
  } else {
    // Client: Fetch from public asset
    resumeJsonData = await fetchResumeFromPublicAsset();
  }
  
  // Layer 4: Fallback to configured origins
  if (!resumeJsonData) {
    resumeJsonData = await fetchResumeFromPreferredOrigins();
  }
  
  // Layer 5: Last resort - remote URL
  if (!resumeJsonData) {
    resumeJsonData = await fetchResumeFromConfiguredFallback();
  }
  
  // Transform and cache
  const transformed = transformResumeData(resumeJsonData);
  return persistTransformedData(transformed);
}
```

**3. Transformation (`dataTransformer.js`)**

```javascript
// Converts JSON Resume schema to component format
export function transformResumeData(jsonResume) {
  return {
    personalInfo: {
      name: basics.name,
      title: basics.label,
      email: basics.email,
      profileImage: basics.image,
      social: extractSocialProfiles(basics.profiles)
    },
    experience: work.map(job => ({
      title: job.position,
      company: job.company,
      startDate: job.startDate,
      endDate: job.endDate,
      responsibilities: job.highlights,
      logo: job.logo
    })),
    skills: {
      technical: skills.filter(s => s.level >= 4),
      tools: skills.filter(s => s.keywords?.includes('tool'))
    },
    education: [...education],
    certifications: [...certificates],
    // Legacy support
    workExperience: [...work],
    basics: {...basics}
  };
}
```

**4. Consumption (Server Components)**

```javascript
// app/layout.js
export default async function RootLayout({ children }) {
  const resumeData = await loadResumeData(); // Server-side load
  
  return (
    <html lang="en">
      <body>
        <Header resumeData={resumeData} />
        <main>{children}</main>
        <Footer resumeData={resumeData} />
      </body>
    </html>
  );
}

// app/page.js
export default async function Home() {
  const resumeDataPromise = loadResumeData();
  
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroWithData resumeDataPromise={resumeDataPromise} />
    </Suspense>
  );
}

async function HeroWithData({ resumeDataPromise }) {
  const resumeData = await resumeDataPromise;
  return <Hero resumeData={resumeData} />;
}
```

### Blog Data Flow

**1. Adapter Pattern (`blogAdapter.js`)**

```javascript
// Base adapter interface
class BlogAdapter {
  async fetchPosts(limit) { /* implement */ }
  async fetchPost(id) { /* implement */ }
}

// Platform-specific implementations
class DevToBlogAdapter extends BlogAdapter {
  async fetchPosts(limit) {
    // Route through /api/blog to avoid CORS
    const response = await fetch(`/api/blog?source=dev&limit=${limit}`);
    return response.json();
  }
}

class HashnodeBlogAdapter extends BlogAdapter {
  async fetchPosts(limit) {
    // GraphQL query via API route
    const response = await fetch(`/api/blog?source=hashnode&limit=${limit}`);
    return response.json();
  }
}

// Service layer
export class BlogService {
  constructor(config) {
    this.adapters = {
      dev: new DevToBlogAdapter(config.sources.dev),
      hashnode: new HashnodeBlogAdapter(config.sources.hashnode)
    };
  }
  
  async fetchPosts(limit, source) {
    return this.adapters[source]?.fetchPosts(limit) || [];
  }
}
```

**2. API Routes (`app/api/blog/route.js`)**

```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || config.blog.primarySource;
  const limit = parseInt(searchParams.get('limit')) || 10;
  
  // Fetch from source-specific API
  switch (source) {
    case 'dev':
      return fetchDevToPosts(sourceConfig, limit);
    case 'hashnode':
      return fetchHashnodePosts(sourceConfig, limit);
  }
}

async function fetchDevToPosts(config, limit) {
  const response = await fetch(
    `${config.apiUrl}?username=${config.username}&per_page=${limit}`,
    { headers: { 'User-Agent': 'PowrStack-Folio/1.0' } }
  );
  return response.json();
}
```

**3. Client-Side Loading (`blogLoader.js`)**

```javascript
class BlogLoader {
  async getPosts(limit, source, useCache = true) {
    // Check cache first
    if (useCache && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }
    
    // Fetch via API
    const posts = await this.blogService.fetchPosts(limit, source);
    
    // Cache results
    this.cache.set(cacheKey, { data: posts, timestamp: Date.now() });
    return posts;
  }
}
```

---

## 🧩 Component System

### Component Organization Philosophy

```
Components are organized by PURPOSE, not by type:
- layout/    → Navigation, structure
- ui/        → Reusable interface elements
- blog/      → Blog-specific functionality
- forms/     → Form components with validation
- performance/ → Performance monitoring tools
- client/    → Client-side wrapper components
```

### Category-Based Structure

**1. Layout Components (`src/components/layout/`)**

```javascript
// Header.js - 'use client' (needs state for mobile menu)
export default function Header({ resumeData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="navbar">
      {/* Logo, navigation, theme switcher */}
      <ThemeSwitcher />
    </nav>
  );
}

// Footer.js - 'use client' (dynamic year)
export default function Footer({ resumeData }) {
  const [year, setYear] = useState(new Date().getFullYear());
  
  return (
    <footer className="footer">
      {/* Social links, copyright */}
    </footer>
  );
}

// layout/index.js - Barrel export
export { default as Header } from './Header';
export { default as Footer } from './Footer';
```

**2. UI Components (`src/components/ui/`)**

```javascript
// AnimatedBackground.js - Client component with framer-motion
'use client';
import { motion } from 'framer-motion';

export default function AnimatedBackground({ intensity = 'normal' }) {
  const styles = getIntensityStyles(intensity);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className={`absolute rounded-full ${styles.orbOpacity}`}
        animate={{ /* animation config */ }}
      />
    </div>
  );
}

// ThemeSwitcher.js - Client-only (localStorage, window)
'use client';
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(config.defaultTheme);
  
  useEffect(() => {
    // Load from localStorage, set HTML attribute
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return <select onChange={handleThemeChange}>...</select>;
}

// SocialLinks.js - Server component (can be, no client needs)
export default function SocialLinks({ profiles }) {
  return (
    <div className="flex gap-4">
      {profiles.map(profile => (
        <a key={profile.network} href={profile.url}>
          <FontAwesomeIcon icon={getIconForNetwork(profile.network)} />
        </a>
      ))}
    </div>
  );
}
```

**3. Blog Components (`src/components/blog/`)**

```javascript
// BlogContent.js - Server component with client wrapper
'use client';
import { useEffect, useState } from 'react';
import blogLoader from '@/lib/blogLoader';
import { BlogGrid } from './';

export default function BlogContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    blogLoader.getPosts(10).then(setPosts).finally(() => setLoading(false));
  }, []);
  
  if (loading) return <LoadingSkeleton />;
  return <BlogGrid posts={posts} />;
}

// BlogCard.js - Can be server component if no interactions
export default function BlogCard({ post }) {
  return (
    <div className="card">
      <img src={post.coverImage} alt={post.title} />
      <h3>{post.title}</h3>
      <p>{post.description}</p>
    </div>
  );
}

// BlogGrid.js - Server component (pure layout)
export default function BlogGrid({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => <BlogCard key={post.id} post={post} />)}
    </div>
  );
}
```

**4. Performance Components (`src/components/performance/`)**

```javascript
// PerformanceMonitor.js - 'use client' (PerformanceObserver API)
'use client';
export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          logger.performance('LCP:', entry.renderTime);
        }
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }, []);
  
  return null; // No UI rendering
}

// CriticalResourcePreloader.js - Client useEffect
'use client';
export default function CriticalResourcePreloader() {
  useEffect(() => {
    const criticalImages = [
      config.background?.image?.src,
      '/images/profile.jpg'
    ].filter(Boolean);
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);
  
  return null;
}
```

**5. Client Wrappers (`src/components/client/`)**

```javascript
// ClientAnimatedBackground.js - Dynamic import wrapper
'use client';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(
  () => import('../ui/AnimatedBackground'),
  { ssr: false, loading: () => null }
);

export default function ClientAnimatedBackground(props) {
  return <AnimatedBackground {...props} />;
}
```

### Barrel Export Pattern

```javascript
// src/components/index.js - Main barrel export

// Category exports
export * from './layout';
export * from './ui';
export * from './blog';
export * from './forms';
export * from './performance';

// Root level components
export { default as Hero } from './Hero';
export { default as ServiceWorkerRegistration } from './ServiceWorkerRegistration';

// Namespace exports for grouped imports
export const Layout = {
  Header: require('./layout/Header').default,
  Footer: require('./layout/Footer').default,
};

export const UI = {
  AnimatedBackground: require('./ui/AnimatedBackground').default,
  ThemeSwitcher: require('./ui/ThemeSwitcher').default,
  // ... more UI components
};

// Usage examples:
// import { Header, Footer } from '@/components/layout';
// import Hero from '@/components';
// import { Layout, UI } from '@/components';
```

### Import Best Practices

```javascript
// ✅ GOOD - Category-specific imports
import { Header, Footer } from '@/components/layout';
import { BlogCard, BlogGrid } from '@/components/blog';
import { PerformanceMonitor } from '@/components/performance';

// ✅ GOOD - Direct root component import
import Hero from '@/components/Hero';

// ✅ GOOD - Namespace import when multiple from category
import { UI } from '@/components';
const { ThemeSwitcher, AnimatedBackground } = UI;

// ❌ BAD - Bypassing barrel exports
import Header from '@/components/layout/Header';
import BlogCard from '@/components/blog/BlogCard';

// ❌ BAD - Importing from wrong category
import ContactForm from '@/components/ContactForm'; // Should be from '@/components/forms'
```

---

## ⚙️ Configuration System

### Master Configuration (`masterConfig.js`)

**Single Source of Truth Architecture**

```javascript
// src/masterConfig.js
const config = {
  // ===== RESUME DATA SOURCES =====
  resumeJson: "/resume.json",
  resumeOrigins: {
    development: process.env.NEXT_PUBLIC_RESUME_LOCAL_ORIGIN || "http://localhost:3000",
    production: process.env.NEXT_PUBLIC_RESUME_REMOTE_ORIGIN || "https://yourdomain.com",
  },
  resumeCache: {
    enabled: false, // Set to true for production
    memory: true,
    browserStorage: true,
  },
  resumeUrl: "https://raw.githubusercontent.com/user/repo/main/public/resume.json",

  // ===== BACKGROUND SYSTEM =====
  background: {
    type: 'animated', // 'animated' | 'image' | 'hybrid'
    
    // Image configuration (for 'image' or 'hybrid' types)
    image: {
      src: "/images/your-background.jpg",
      overlay: true,
      overlayOpacity: 0.3,
      quality: 85,
      priority: true,
    },
    
    // Animation configuration (for 'animated' or 'hybrid' types)
    animated: {
      enabled: true,
      intensity: 'normal', // 'subtle' | 'normal' | 'intense'
    }
  },

  // ===== THEME SYSTEM =====
  defaultTheme: "corporate",
  enableRandomTheme: false,

  // ===== BLOG SYSTEM =====
  blog: {
    primarySource: "dev",
    sources: {
      dev: {
        enabled: true,
        username: "your-dev-username",
        apiUrl: "https://dev.to/api/articles",
        rssUrl: "https://dev.to/feed/your-username",
        profileUrl: "https://dev.to/your-username"
      },
      hashnode: {
        enabled: false,
        username: "your-hashnode-username",
        publicationId: "your-publication-id",
        apiUrl: "https://gql.hashnode.com"
      },
      medium: {
        enabled: false,
        username: "your-medium-username",
        rssUrl: "https://medium.com/feed/@your-username"
      }
    }
  },

  // ===== PERFORMANCE MONITORING =====
  performance: {
    enableMonitor: false,
    enableBudget: false,
    thresholds: {
      lcp: 1400,
      fid: 100,
      cls: 0.1
    }
  }
};

export default config;
```

### Configuration Patterns

**1. Environment-Aware Loading**

```javascript
// resumeLoader.js
function getResumeOrigin() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const env = isDevelopment ? 'development' : 'production';
  return config.resumeOrigins[env];
}
```

**2. Conditional Feature Enablement**

```javascript
// app/layout.js
export default async function RootLayout({ children }) {
  const resumeData = await loadResumeData();
  
  return (
    <html>
      <body>
        {config.performance?.enableMonitor && <PerformanceMonitor />}
        {config.performance?.enableBudget && <PerformanceBudget />}
        {/* ... */}
      </body>
    </html>
  );
}
```

**3. Background Type Switching**

```javascript
// Hero.js
const backgroundConfig = config.background || { type: 'animated' };
const shouldShowImage = backgroundConfig.type === 'image' || backgroundConfig.type === 'hybrid';
const shouldShowAnimated = backgroundConfig.type === 'animated' || backgroundConfig.type === 'hybrid';

return (
  <section className="hero">
    {shouldShowImage && <BackgroundImage {...backgroundConfig.image} />}
    {shouldShowAnimated && <AnimatedBackground {...backgroundConfig.animated} />}
  </section>
);
```

### JSON Resume Schema (`public/resume.json`)

```json
{
  "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json",
  "basics": {
    "name": "Your Name",
    "label": "Software Engineer",
    "image": "/images/profile.jpg",
    "email": "you@example.com",
    "phone": "+1234567890",
    "url": "https://yourwebsite.com",
    "summary": "Your professional summary...",
    "location": {
      "city": "Your City",
      "countryCode": "US",
      "region": "State"
    },
    "profiles": [
      {
        "network": "GitHub",
        "username": "yourhandle",
        "url": "https://github.com/yourhandle"
      }
    ],
    "x_tagline": "Custom tagline for hero section"
  },
  "work": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "url": "https://company.com",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "summary": "Job description",
      "highlights": [
        "Achievement 1",
        "Achievement 2"
      ],
      "location": "City, State",
      "logo": "/images/certs/company-logo.png"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "area": "Computer Science",
      "studyType": "Bachelor",
      "startDate": "2015-09-01",
      "endDate": "2019-05-31",
      "score": "3.8",
      "courses": ["Course 1", "Course 2"]
    }
  ],
  "certificates": [
    {
      "name": "Certification Name",
      "date": "2023-06-15",
      "issuer": "Issuing Organization",
      "url": "https://verify-cert-url.com",
      "logo": "/images/certs/cert-logo.png"
    }
  ],
  "skills": [
    {
      "name": "JavaScript",
      "level": "Expert",
      "keywords": ["ES6+", "TypeScript", "Node.js"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "highlights": ["Feature 1", "Feature 2"],
      "keywords": ["React", "Next.js"],
      "startDate": "2022-01-01",
      "url": "https://project-url.com",
      "type": "Web Application"
    }
  ]
}
```

---

## 🚀 Performance Strategy

### Performance Targets

```
Target Metrics (based on actual implementation):
- LCP (Largest Contentful Paint): < 1.4s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- TTFB (Time to First Byte): < 200ms
- FCP (First Contentful Paint): < 800ms
```

### 1. Image Optimization

**Conditional Preloading Pattern**

```javascript
// app/layout.js
export default async function RootLayout({ children }) {
  // Only preload if background type requires it
  const shouldPreloadBackgroundImage =
    (config.background?.type === 'image' || config.background?.type === 'hybrid') &&
    config.background.image?.src;
  
  const backgroundPreloadSrc = shouldPreloadBackgroundImage 
    ? config.background.image.src 
    : null;

  return (
    <html>
      <head>
        {/* Critical resource hints */}
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        
        {/* Conditional background preload */}
        {backgroundPreloadSrc && (
          <link
            rel="preload"
            as="image"
            href={backgroundPreloadSrc}
            fetchPriority="high"
          />
        )}
        
        {/* Profile image preload */}
        <link
          rel="preload"
          as="image"
          href="/images/profile.jpg"
          fetchPriority="high"
        />
      </head>
      {/* ... */}
    </html>
  );
}
```

**Next.js Image Optimization**

```javascript
// next.config.mjs
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'media2.dev.to' }
    ]
  }
};
```

### 2. Code Splitting

**Dynamic Imports**

```javascript
// app/page.js
import dynamic from 'next/dynamic';

// Non-critical components loaded after initial paint
const ContactForm = dynamic(
  () => import('../components/forms/ContactForm'),
  {
    loading: () => <div className="skeleton h-96" />,
    ssr: false // Client-side only if needed
  }
);

const PerformanceMonitor = dynamic(
  () => import('../components/performance/PerformanceMonitor'),
  { ssr: false }
);
```

**Route-Level Code Splitting**

```
Each route automatically code-splits:
- /          → page.js + Hero + ContactForm
- /blog      → blog/page.js + BlogContent
- /education → education/page.js + EducationTimeline
- /experience → experience/page.js + ExperienceTimeline
```

### 3. Caching Strategy

**Multi-Layer Resume Cache**

```javascript
// resumeLoader.js
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function loadResumeData() {
  // Layer 1: Memory (instant)
  if (resumeDataCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return resumeDataCache;
  }
  
  // Layer 2: localStorage (fast)
  const cached = localStorage.getItem('portfolio_resume_cache');
  if (cached) {
    const timestamp = parseInt(localStorage.getItem('portfolio_resume_cache_timestamp'));
    if (Date.now() - timestamp < CACHE_DURATION) {
      return JSON.parse(cached);
    }
  }
  
  // Layer 3: Fetch and cache
  const data = await fetchResumeData();
  resumeDataCache = data;
  cacheTimestamp = Date.now();
  localStorage.setItem('portfolio_resume_cache', JSON.stringify(data));
  localStorage.setItem('portfolio_resume_cache_timestamp', Date.now().toString());
  
  return data;
}
```

**Service Worker Cache**

```javascript
// public/sw.js
const CACHE_NAME = 'portfolio-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/images/profile.jpg',
  '/_next/static/css/app.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first for API, cache-first for static assets
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
  } else {
    event.respondWith(cacheFirst(event.request));
  }
});
```

### 4. Server-Side Rendering

**Suspense Boundaries**

```javascript
// app/page.js
export default async function Home() {
  // Start loading immediately
  const resumeDataPromise = loadResumeData();
  
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroWithData resumeDataPromise={resumeDataPromise} />
      </Suspense>
      
      <Suspense fallback={<FormSkeleton />}>
        <ContactFormWithData resumeDataPromise={resumeDataPromise} />
      </Suspense>
    </>
  );
}

// Share the same promise to avoid duplicate fetches
async function HeroWithData({ resumeDataPromise }) {
  const resumeData = await resumeDataPromise;
  return <Hero resumeData={resumeData} />;
}
```

**SSR-Safe Patterns**

```javascript
// Avoid hydration mismatches
export default function Component() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Return consistent server and initial client render
  if (!mounted) {
    return <div>Loading...</div>;
  }
  
  // Client-only features after mount
  return <ClientFeature />;
}
```

### 5. Performance Monitoring

**Real-Time LCP Tracking**

```javascript
// components/performance/PerformanceMonitor.js
'use client';

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          const lcp = entry.renderTime || entry.loadTime;
          logger.performance(`LCP: ${lcp}ms`);
          
          if (lcp > config.performance.thresholds.lcp) {
            logger.warn(`LCP exceeded threshold: ${lcp}ms > ${config.performance.thresholds.lcp}ms`);
          }
        }
      }
    });
    
    observer.observe({
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']
    });
    
    return () => observer.disconnect();
  }, []);
  
  return null; // No UI
}
```

---

## 🌐 Deployment Architecture

### Cloudflare Workers Setup

**1. OpenNext Configuration**

```javascript
// open-next.config.ts
export default {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      incrementalCache: 'dummy',
    },
  },
};
```

**2. Wrangler Configuration**

```jsonc
// wrangler.jsonc
{
  "name": "powrstack-folio",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-11-29",
  "compatibility_flags": [
    "nodejs_compat",
    "nodejs_als"
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "observability": {
    "enabled": true
  }
}
```

**3. Middleware Configuration**

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

export const runtime = 'nodejs'; // Critical for Cloudflare Workers

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```

**4. Build Script**

```bash
#!/bin/bash
# build-cloudflare.sh

echo "Building Next.js app..."
pnpm build

echo "Building Cloudflare Worker with OpenNext..."
pnpm exec opennextjs-cloudflare build

echo "Build complete! Worker ready at .open-next/worker.js"
```

**5. Deployment Commands**

```bash
# Local preview
pnpm run preview:worker

# Deploy to production
pnpm run deploy:worker

# Deploy with environment variables
wrangler deploy .open-next/worker.js \
  --var NEXT_PUBLIC_SITE_URL:https://yourdomain.com \
  --var NEXT_PUBLIC_RESUME_REMOTE_ORIGIN:https://yourdomain.com
```

### Environment Variables

```env
# Development
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RESUME_LOCAL_ORIGIN=http://localhost:3000

# Production (set in Wrangler or Cloudflare dashboard)
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_RESUME_REMOTE_ORIGIN=https://yourdomain.com
```

---

## 🔌 Extension Patterns

### Adding a New Page

```javascript
// 1. Create page file
// src/app/projects/page.js
import { loadResumeData } from '@/lib/resumeLoader';
import { ProjectGrid } from '@/components/ui';

export default async function ProjectsPage() {
  const resumeData = await loadResumeData();
  const projects = resumeData.projects || [];
  
  return (
    <main className="container mx-auto px-4 py-16">
      <h1>My Projects</h1>
      <ProjectGrid projects={projects} />
    </main>
  );
}

// 2. Add navigation link
// src/components/layout/Header.js
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' }, // New
  { href: '/experience', label: 'Experience' },
];
```

### Adding a New Component Category

```javascript
// 1. Create category folder
// src/components/animations/

// 2. Create components
// src/components/animations/FadeIn.js
export default function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// 3. Create barrel export
// src/components/animations/index.js
export { default as FadeIn } from './FadeIn';
export { default as SlideIn } from './SlideIn';

// 4. Update main index
// src/components/index.js
export * from './animations';

// 5. Use component
import { FadeIn } from '@/components/animations';
```

### Adding a New Blog Source

```javascript
// 1. Add config
// src/masterConfig.js
blog: {
  sources: {
    ghost: {
      enabled: true,
      apiUrl: "https://yourblog.ghost.io",
      apiKey: process.env.GHOST_API_KEY
    }
  }
}

// 2. Create adapter
// src/lib/blogAdapter.js
class GhostBlogAdapter extends BlogAdapter {
  async fetchPosts(limit) {
    const response = await fetch(
      `/api/blog?source=ghost&limit=${limit}`
    );
    return response.json();
  }
}

// 3. Add API route handler
// src/app/api/blog/route.js
async function fetchGhostPosts(config, limit) {
  const response = await fetch(
    `${config.apiUrl}/ghost/api/v3/content/posts/?key=${config.apiKey}&limit=${limit}`
  );
  const data = await response.json();
  return data.posts.map(formatGhostPost);
}

// Add to switch statement
case 'ghost':
  posts = await fetchGhostPosts(sourceConfig, limit);
  break;

// 4. Register adapter
// src/lib/blogAdapter.js
export class BlogService {
  initializeAdapters() {
    this.adapters.ghost = new GhostBlogAdapter(config.sources.ghost);
  }
}
```

### Adding a New Data Source

```javascript
// 1. Add config
// src/masterConfig.js
const config = {
  portfolioData: {
    url: "https://api.example.com/portfolio",
    cache: {
      enabled: true,
      ttl: 300000 // 5 minutes
    }
  }
};

// 2. Create loader
// src/lib/portfolioLoader.js
export async function loadPortfolioData() {
  // Similar pattern to resumeLoader
  if (cache.has('portfolio') && cache.isValid('portfolio')) {
    return cache.get('portfolio');
  }
  
  const response = await fetch(config.portfolioData.url);
  const data = await response.json();
  cache.set('portfolio', data);
  return data;
}

// 3. Create API route (optional)
// src/app/api/portfolio/route.js
export async function GET() {
  const data = await loadPortfolioData();
  return NextResponse.json(data);
}

// 4. Use in components
// src/app/portfolio/page.js
export default async function PortfolioPage() {
  const data = await loadPortfolioData();
  return <PortfolioGrid items={data} />;
}
```

---

## ✅ Quality Assurance

### Testing Strategy

**1. Unit Tests (Vitest)**

```javascript
// test/resumeLoader.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadResumeData, clearResumeDataCache } from '@/lib/resumeLoader';

describe('resumeLoader', () => {
  beforeEach(() => {
    clearResumeDataCache();
    vi.clearAllMocks();
  });
  
  it('loads data from fetch and caches it', async () => {
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResume)
    }));
    
    const data = await loadResumeData();
    expect(data).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // Second call should use cache
    const data2 = await loadResumeData();
    expect(data2).toEqual(data);
    // Fetch not called again due to cache
  });
  
  it('falls back to localStorage when fetch fails', async () => {
    localStorage.setItem('portfolio_resume_cache', JSON.stringify(mockData));
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
    
    const data = await loadResumeData();
    expect(data).toEqual(mockData);
  });
});
```

**2. Test Setup**

```javascript
// test/setupTests.js
import { vi } from 'vitest';

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock fetch
global.fetch = vi.fn();

// Mock Next.js image
vi.mock('next/image', () => ({
  default: (props) => <img {...props} />
}));
```

**3. Component Tests**

```javascript
// test/components/Hero.test.js
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

describe('Hero', () => {
  const mockResumeData = {
    personalInfo: {
      name: 'Test User',
      title: 'Developer'
    },
    skills: { technical: [] },
    certifications: []
  };
  
  it('renders hero content', () => {
    render(<Hero resumeData={mockResumeData} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });
  
  it('shows animated background when configured', () => {
    config.background.type = 'animated';
    render(<Hero resumeData={mockResumeData} />);
    expect(screen.queryByAltText('Hero background')).not.toBeInTheDocument();
  });
});
```

### Linting & Code Quality

```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

### Build Validation

```bash
# Full validation workflow
pnpm lint          # ESLint checks
pnpm test          # Run test suite
pnpm build         # Next.js build
pnpm build:cloudflare  # Cloudflare build

# Check for build errors
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed"
  exit 1
fi
```

---

## 📝 Implementation Checklist

### Phase 1: Foundation Setup

```
□ Initialize Next.js 15 project with App Router
□ Install core dependencies (React 19, Tailwind 4, daisyUI 5)
□ Configure Tailwind CSS (globals.css with @import "tailwindcss")
□ Set up project structure (src/app, src/components, src/lib)
□ Create masterConfig.js with basic settings
□ Configure next.config.mjs for image optimization
□ Set up environment variables (.env.local)
```

### Phase 2: Data Layer

```
□ Create public/resume.json (JSON Resume schema)
□ Implement resumeLoader.js with multi-layer caching
□ Implement dataTransformer.js for schema normalization
□ Create /api/resume route for programmatic access
□ Test resume loading in development mode
□ Implement blogAdapter.js with adapter pattern
□ Implement blogLoader.js with caching
□ Create /api/blog route for CORS-free fetching
□ Configure blog sources in masterConfig.js
```

### Phase 3: Component Library

```
□ Create component folder structure (layout, ui, blog, forms, performance)
□ Implement barrel exports (index.js in each folder)
□ Create layout components (Header, Footer)
□ Create Hero component with configurable backgrounds
□ Implement AnimatedBackground with intensity levels
□ Create ThemeSwitcher component
□ Implement blog components (BlogCard, BlogGrid, BlogContent)
□ Create ContactForm with validation
□ Implement performance monitoring components
□ Create client wrapper components for SSR-unsafe features
```

### Phase 4: Pages & Routes

```
□ Configure app/layout.js (root layout with theme, metadata)
□ Implement app/page.js (home page with Suspense)
□ Create blog/page.js for blog listing
□ Create education/page.js for education timeline
□ Create experience/page.js for work history
□ Implement generateMetadata for SEO
□ Add structured data (JSON-LD)
□ Configure Open Graph and Twitter meta tags
```

### Phase 5: Performance Optimization

```
□ Implement CriticalResourcePreloader
□ Configure conditional image preloading
□ Set up service worker (public/sw.js)
□ Implement PerformanceMonitor component
□ Configure performance budgets
□ Optimize images with Next.js Image component
□ Test Core Web Vitals (LCP, FID, CLS)
□ Verify sub-1.4s LCP target
```

### Phase 6: Cloudflare Deployment

```
□ Install @opennextjs/cloudflare (latest)
□ Create open-next.config.ts
□ Configure wrangler.jsonc
□ Update middleware.ts with runtime = 'nodejs'
□ Create build-cloudflare.sh script
□ Test local build: pnpm build
□ Test Cloudflare build: pnpm build:cloudflare
□ Preview worker: pnpm preview:worker
□ Deploy to staging: wrangler deploy --env staging
□ Verify deployment and test functionality
□ Deploy to production: pnpm deploy:worker
```

### Phase 7: Testing & Quality

```
□ Set up Vitest configuration
□ Create test/setupTests.js with mocks
□ Write unit tests for resumeLoader
□ Write unit tests for dataTransformer
□ Write component tests for key components
□ Configure ESLint with Next.js rules
□ Run linting: pnpm lint
□ Run tests: pnpm test
□ Verify build: pnpm build
```

### Phase 8: Documentation

```
□ Create README.md with setup instructions
□ Document masterConfig.js options
□ Write component usage guide
□ Document data flow architecture
□ Create troubleshooting guide
□ Document deployment process
□ Create CHANGELOG.md
□ Write contribution guidelines (if open source)
```

---

## 🎓 Learning Resources

### Key Concepts to Understand

1. **Next.js 15 App Router**
   - Server Components vs Client Components
   - Async Server Components
   - Suspense boundaries
   - Metadata API
   - Route handlers (API routes)

2. **React 19**
   - Server Components
   - `use` hook for promises
   - Concurrent rendering
   - Automatic batching

3. **Tailwind CSS 4**
   - No config file approach
   - CSS-first configuration
   - Native cascade layers
   - Container queries

4. **daisyUI 5**
   - Theme system
   - Component classes
   - Utility-first approach
   - CSS variable theming

5. **Cloudflare Workers**
   - Node.js runtime compatibility
   - OpenNext adapter
   - Edge computing concepts
   - Wrangler CLI

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

**Issue: Hydration Mismatch**
```
Solution: Ensure SSR and client render match
- Use useState with initial value matching SSR
- Wrap client-only code in useEffect
- Use 'use client' directive appropriately
```

**Issue: Image Not Loading**
```
Solution: Check configuration
1. Verify image exists in public/images/
2. Check remotePatterns in next.config.mjs
3. Ensure correct path (starts with /)
4. Check browser console for errors
```

**Issue: Blog Posts Not Fetching**
```
Solution: Check API configuration
1. Verify blog source is enabled in masterConfig.js
2. Check username is correct
3. Test API endpoint directly: /api/blog?source=dev
4. Check CORS headers in API route
```

**Issue: Performance Budget Warnings**
```
Solution: Optimize resources
1. Check LCP element (should be < 1.4s)
2. Reduce image sizes
3. Minimize JavaScript bundle
4. Enable caching
5. Use 'animated' background instead of images
```

**Issue: Cloudflare Build Failing**
```
Solution: Check compatibility
1. Ensure Node.js runtime is specified
2. Verify @opennextjs/cloudflare version (>= 1.14.0)
3. Check compatibility_flags in wrangler.jsonc
4. Test local build first: pnpm build
```

---

## 📚 Additional Documentation

- [Component Architecture Guide](./COMPONENT_ARCHITECTURE.md)
- [SSR Fixes Report](./SSR_FIXES_REPORT.md)
- [Cloudflare Deployment Guide](./CLOUDFLARE_DEPLOYMENT_ACTION_PLAN.md)
- [Performance Optimization](./ai_summary_docs/FINAL_OPTIMIZATION_REPORT.md)
- [Background Configuration](./ai_summary_docs/CONFIGURABLE_BACKGROUND_GUIDE.md)

---

## 🤝 Contributing

When extending this blueprint:

1. **Follow the established patterns** (configuration-first, barrel exports, SSR-safe)
2. **Document new features** in both code and docs
3. **Test thoroughly** (unit tests, build tests, deployment tests)
4. **Update this blueprint** when making architectural changes
5. **Maintain backwards compatibility** where possible

---

## 📄 License

This blueprint is designed for reusable portfolios. Adapt it to your needs while maintaining attribution to the original architecture patterns.

---

**Generated**: November 29, 2025  
**Version**: 1.0.0  
**Repository**: powrstack-folio  
**Maintainer**: PowrStack Team
