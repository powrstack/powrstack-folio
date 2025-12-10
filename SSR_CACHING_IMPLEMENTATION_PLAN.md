# 🔍 SSR Caching Implementation Plan
## Render-Heavy Components Breakdown & Optimization Strategy

**Generated:** December 10, 2025  
**Target:** LCP < 500ms, Bundle Size -81%, Lighthouse Score 97+

---

## 📊 Executive Summary

### Current Performance Bottlenecks
- **Hero.js (463 lines)**: Dual-layout rendering, 7 client components, heavy animations
- **BlogGrid.js (455 lines)**: 100+ lines state management, complex filtering logic
- **BlogCard.js (294 lines)**: Framer Motion animations, dynamic image loading
- **Header.js (124 lines)**: Client-side hydration for static navigation
- **ThemeSwitcher.js (150 lines)**: 32 themes with localStorage operations

### Optimization Potential
- ✅ **80% of Hero.js** can be SSR cached (layouts, stats, content)
- ✅ **60% of BlogGrid.js** can be extracted to Server Components (filtering UI skeleton)
- ✅ **70% of BlogCard.js** can be server-rendered (metadata, layout structure)
- ✅ **90% of Header.js** can be Server Component (navigation links)
- ✅ **40% of ThemeSwitcher.js** can be optimized (reduce client bundle)

### Expected Results
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **LCP** | 800ms | 420ms | **-47.5%** ✅ |
| **Bundle Size** | 199KB | 38KB | **-81%** ✅ |
| **TBT** | 320ms | 80ms | **-75%** ✅ |
| **Lighthouse** | 87 | 97 | **+10 pts** ✅ |

---

## 🎯 Implementation Roadmap

### Phase 1: Critical Path (Week 1) - Hero.js & BlogGrid.js

#### Task 1.1: Hero.js Refactor → ServerHeroLayout + ClientInteractiveLayer
**Priority:** CRITICAL  
**Impact:** LCP 800ms → 550ms (-31%)  
**Bundle Savings:** -27KB

**Files to Create:**
1. `src/components/hero/ServerHeroLayout.js` - Main server component
2. `src/components/hero/ServerHeroContent.js` - Static content section
3. `src/components/hero/ServerHeroStats.js` - Cached stats component
4. `src/components/hero/HeroProfileSection.js` - Profile display
5. `src/components/hero/SocialLinksStatic.js` - Static social links
6. `src/components/hero/ClientInteractiveLayer.js` - Client interactions only

**Implementation Steps:**
```bash
# 1. Create server component base
touch src/components/hero/ServerHeroLayout.js

# 2. Add unstable_cache for hero data
# Cache duration: 1 hour (3600s)
# Tags: ['hero'] for revalidation

# 3. Extract client-only features
touch src/components/hero/ClientInteractiveLayer.js

# 4. Update page.js to use ServerHeroLayout
# Replace: <Hero resumeData={resumeData} />
# With: <ServerHeroLayout resumeData={resumeData} />
```

**Code Template:**
```javascript
// src/components/hero/ServerHeroLayout.js
import { unstable_cache } from 'next/cache';

const getCachedHeroData = unstable_cache(
  async (resumeData) => ({
    personalInfo: resumeData.personalInfo,
    summary: resumeData.summary,
    roles: resumeData.roles,
    stats: {
      experience: resumeData.workExperience.length,
      skills: resumeData.technicalSkills.length,
      certifications: resumeData.certifications.length,
      education: resumeData.education.length,
    }
  }),
  ['hero-data'],
  { revalidate: 3600, tags: ['hero'] }
);

export default async function ServerHeroLayout({ resumeData }) {
  const heroData = await getCachedHeroData(resumeData);
  
  return (
    <section className="hero min-h-screen relative">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16 max-w-7xl">
        {/* Unified responsive layout - no mobile/desktop duplication */}
        <div className="flex-1 w-full lg:w-auto">
          <HeroProfileSection data={heroData.personalInfo} />
          <ServerHeroStats stats={heroData.stats} />
          <SocialLinksStatic links={heroData.personalInfo.profiles} />
        </div>
        
        <div className="flex-1 w-full lg:w-auto">
          <ServerHeroContent data={heroData} />
        </div>
      </div>
      
      {/* Only interactive elements are client-side */}
      <ClientInteractiveLayer />
    </section>
  );
}
```

**Success Criteria:**
- ✅ No duplicate mobile/desktop layouts (300+ lines removed)
- ✅ Hero data cached with 1-hour TTL
- ✅ Only 1 client component instead of 7
- ✅ LCP reduces to ~550ms

---

#### Task 1.2: BlogGrid.js Refactor → Server Filtering + Micro Clients
**Priority:** CRITICAL  
**Impact:** TBT 320ms → 150ms (-53%)  
**Bundle Savings:** -30KB

**Files to Create:**
1. `src/components/blog/ServerBlogFilterSkeleton.js` - Filter UI skeleton
2. `src/components/blog/ServerBlogGrid.js` - Main grid server component
3. `src/components/blog/filters/ClientSearchInput.js` - Search input only
4. `src/components/blog/filters/ClientTagSelect.js` - Tag dropdown
5. `src/components/blog/filters/ClientSourceSelect.js` - Source dropdown
6. `src/components/blog/filters/ClientSortControls.js` - Sort controls

**Implementation Steps:**
```bash
# 1. Create filter components directory
mkdir -p src/components/blog/filters

# 2. Extract filter options caching
# Cache duration: 30 minutes (1800s)
# Tags: ['blog'] for revalidation

# 3. Convert filtering logic to URL search params
# Use: useSearchParams() + router.push()
# Instead of: useState() hooks

# 4. Replace Framer Motion with CSS Grid transitions
# Remove: motion.div, AnimatePresence
# Add: CSS transition classes
```

**Code Template:**
```javascript
// src/components/blog/ServerBlogFilterSkeleton.js
import { unstable_cache } from 'next/cache';

const getCachedFilterOptions = unstable_cache(
  async (posts) => ({
    tags: [...new Set(posts.flatMap(p => p.tags))].sort(),
    sources: [...new Set(posts.map(p => p.source))].sort(),
    postCount: posts.length,
  }),
  ['blog-filters'],
  { revalidate: 1800, tags: ['blog'] }
);

export default async function ServerBlogFilterSkeleton({ posts }) {
  const options = await getCachedFilterOptions(posts);
  
  return (
    <div className="card bg-base-200 shadow-lg mb-8">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Filter & Search</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ClientSearchInput />
          <ClientTagSelect tags={options.tags} />
          <ClientSourceSelect sources={options.sources} />
          <ClientSortControls />
        </div>
        
        <div className="mt-4 pt-4 border-t border-base-300">
          <div className="stats shadow bg-base-100">
            <div className="stat place-items-center">
              <div className="stat-title">Total Posts</div>
              <div className="stat-value text-sm">{options.postCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

```javascript
// src/components/blog/filters/ClientSearchInput.js
'use client';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClientSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('q') || '');
  
  const handleSearch = (newValue) => {
    setValue(newValue);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (newValue) {
        params.set('q', newValue);
      } else {
        params.delete('q');
      }
      router.push(`/blog?${params.toString()}`, { scroll: false });
    });
  };
  
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Search articles</span>
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <svg className="w-4 h-4 opacity-70">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search posts..."
          className="grow"
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          disabled={isPending}
        />
        {value && (
          <button onClick={() => handleSearch('')} className="btn btn-ghost btn-xs">
            ×
          </button>
        )}
      </label>
    </div>
  );
}
```

**Success Criteria:**
- ✅ Filter options cached for 30 minutes
- ✅ URL-based filtering (SEO + shareable)
- ✅ No Framer Motion in grid
- ✅ Progressive enhancement (works without JS)

---

### Phase 2: High Impact (Week 2) - BlogCard.js & Header.js

#### Task 2.1: BlogCard.js Refactor → ServerBlogCard + ClientShareButton
**Priority:** HIGH  
**Impact:** Render time -85% (35ms → 5ms)  
**Bundle Savings:** -99KB (9 cards)

**Files to Create:**
1. `src/components/blog/ServerBlogCard.js` - Main server card
2. `src/components/blog/ClientShareButton.js` - Share button only
3. `src/components/blog/BlogCardImage.js` - Optimized image component

**Implementation Steps:**
```bash
# 1. Remove motion.article wrapper
# Replace with: <article className="...">

# 2. Use CSS transitions instead of Framer Motion
# Add to globals.css:
# .card { transition: all 0.3s ease; }
# .card:hover { box-shadow: ...; }

# 3. Isolate share functionality
touch src/components/blog/ClientShareButton.js

# 4. Pre-optimize images at build time
# Use Next.js Image with priority={featured}
```

**Code Template:**
```javascript
// src/components/blog/ServerBlogCard.js
import Image from 'next/image';
import Link from 'next/link';
import ClientShareButton from './ClientShareButton';

export default async function ServerBlogCard({ post, featured = false }) {
  return (
    <article className={`card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 ${
      featured ? 'lg:card-side' : 'h-full flex flex-col'
    }`}>
      {post.coverImage && (
        <figure className={`relative ${featured ? 'lg:w-1/2' : 'h-48'} overflow-hidden bg-base-200`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            width={featured ? 600 : 400}
            height={featured ? 400 : 300}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            loading={featured ? "eager" : "lazy"}
            priority={featured}
            quality={80}
          />
          
          <div className="absolute top-3 right-3">
            <div className="badge badge-primary">{post.source}</div>
          </div>
        </figure>
      )}
      
      <div className="card-body">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="badge badge-outline badge-sm hover:badge-primary transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
        
        <h2 className="card-title text-xl line-clamp-2">
          <Link href={post.url} target="_blank" rel="noopener noreferrer">
            {post.title}
          </Link>
        </h2>
        
        <p className="text-base-content/70 line-clamp-3">{post.description}</p>
        
        <div className="card-actions justify-between items-center mt-auto pt-4">
          <Link href={post.url} className="btn btn-primary btn-sm">
            Read Article
          </Link>
          <ClientShareButton url={post.url} title={post.title} />
        </div>
      </div>
    </article>
  );
}
```

```javascript
// src/components/blog/ClientShareButton.js
'use client';

export default function ClientShareButton({ url, title }) {
  const handleShare = async () => {
    if (typeof navigator !== 'undefined') {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    }
  };
  
  return (
    <button
      onClick={handleShare}
      className="btn btn-ghost btn-sm btn-circle"
      title="Share article"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  );
}
```

**Success Criteria:**
- ✅ Card structure SSR cached
- ✅ Share button only ~1KB
- ✅ No Framer Motion dependency
- ✅ CSS hover effects instead

---

#### Task 2.2: Header.js Refactor → ServerHeader + ClientMobileMenu
**Priority:** HIGH  
**Impact:** Hydration -75% (40ms → 10ms)  
**Bundle Savings:** -3KB

**Files to Create:**
1. `src/components/layout/ServerHeader.js` - Main header server component
2. `src/components/layout/ClientMobileMenu.js` - Mobile menu only
3. `src/components/layout/ClientThemeSwitcher.js` - Isolated theme switcher

**Implementation Steps:**
```bash
# 1. Convert navigation links to Server Component
# All <Link> components can be server-rendered

# 2. Keep theme switcher as client component
# Already exists, just import it

# 3. Extract mobile menu to client component
touch src/components/layout/ClientMobileMenu.js

# 4. Remove useEffect hydration workaround
# No more mounted state needed
```

**Code Template:**
```javascript
// src/components/layout/ServerHeader.js
import Link from 'next/link';
import ClientThemeSwitcher from './ClientThemeSwitcher';
import ClientMobileMenu from './ClientMobileMenu';

export default async function ServerHeader({ resumeData }) {
  const { personalInfo } = resumeData;
  const displayName = personalInfo?.name?.split(' ').slice(0, 3).join(' ') || 'Portfolio';
  
  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm h-16 min-h-16 px-4">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-lg sm:text-xl font-bold text-primary">
          {displayName}
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/" className="btn btn-ghost">Home</Link></li>
          <li><Link href="/experience" className="btn btn-ghost">Experience</Link></li>
          <li><Link href="/education" className="btn btn-ghost">Education</Link></li>
          <li><Link href="/blog" className="btn btn-ghost">Blog</Link></li>
        </ul>
      </div>

      <div className="navbar-end flex items-center space-x-2">
        <ClientThemeSwitcher />
        
        <div className="hidden lg:flex space-x-2">
          <a
            href="/Md_Abu_Raihan_Srabon_Resume.pdf"
            download
            className="btn btn-outline"
          >
            Download CV
          </a>
          <a href={`mailto:${personalInfo?.email}`} className="btn btn-primary">
            Contact Me
          </a>
        </div>

        <ClientMobileMenu email={personalInfo?.email} />
      </div>
    </header>
  );
}
```

**Success Criteria:**
- ✅ Navigation pre-rendered (instant)
- ✅ No hydration mismatch
- ✅ Only 2 client components (theme + mobile)

---

### Phase 3: Polish (Week 3) - ThemeSwitcher & Caching Audit

#### Task 3.1: ThemeSwitcher Optimization → Lazy Theme Loading
**Priority:** MEDIUM  
**Impact:** Bundle -2KB  
**Bundle Savings:** -2KB

**Files to Create:**
1. `src/components/ui/OptimizedThemeSwitcher.js` - Optimized version
2. `src/components/ui/allThemes.js` - Lazy-loaded theme list

**Implementation Steps:**
```bash
# 1. Extract full theme list to separate file
touch src/components/ui/allThemes.js

# 2. Load only 5 most common themes initially
# light, dark, cupcake, corporate, synthwave

# 3. Lazy load full list on dropdown open
# Use dynamic import: import('./allThemes')

# 4. Test localStorage error handling
```

**Code Template:**
```javascript
// src/components/ui/allThemes.js
export default [
  { name: 'light', displayName: 'Light', icon: '💡' },
  { name: 'dark', displayName: 'Dark', icon: '🌙' },
  { name: 'cupcake', displayName: 'Cupcake', icon: '🧁' },
  { name: 'bumblebee', displayName: 'Bumblebee', icon: '🐝' },
  // ... 28 more themes
];
```

```javascript
// src/components/ui/OptimizedThemeSwitcher.js
'use client';
import { useState, useEffect } from 'react';

const defaultThemes = [
  { name: 'light', displayName: 'Light', icon: '💡' },
  { name: 'dark', displayName: 'Dark', icon: '🌙' },
  { name: 'cupcake', displayName: 'Cupcake', icon: '🧁' },
  { name: 'corporate', displayName: 'Corporate', icon: '🏢' },
  { name: 'synthwave', displayName: 'Synthwave', icon: '🌈' },
];

export default function OptimizedThemeSwitcher() {
  const [allThemes, setAllThemes] = useState(defaultThemes);
  const [currentTheme, setCurrentTheme] = useState('light');
  
  const loadAllThemes = async () => {
    if (allThemes.length <= 5) {
      const fullList = await import('./allThemes').then(m => m.default);
      setAllThemes(fullList);
    }
  };
  
  return (
    <details className="dropdown dropdown-end" onClick={loadAllThemes}>
      {/* ... */}
    </details>
  );
}
```

**Success Criteria:**
- ✅ Initial bundle: 5 themes (~0.5KB)
- ✅ Full list loads on demand

---

#### Task 3.2: Caching Layer Audit
**Priority:** MEDIUM  
**Impact:** Cache hit rate 90%+

**Implementation Steps:**
```bash
# 1. Add revalidation tags to all cached components
# Tags: ['hero', 'blog', 'stats', 'resume']

# 2. Create cache invalidation API route
touch src/app/api/revalidate/route.js

# 3. Test cache behavior
# - Check .next/cache directory
# - Monitor Cloudflare cache analytics
# - Verify revalidation on resume.json update

# 4. Document cache strategy in README
```

**Code Template:**
```javascript
// src/app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { tags, secret } = await request.json();
  
  // Validate secret key
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }
  
  // Revalidate specified tags
  for (const tag of tags) {
    revalidateTag(tag);
  }
  
  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}

// Usage:
// POST /api/revalidate
// Body: { "tags": ["hero", "blog"], "secret": "..." }
```

**Success Criteria:**
- ✅ All components have cache tags
- ✅ Revalidation API working
- ✅ Cache hit rate >90%

---

## 📁 File Structure After Implementation

```
src/
├── app/
│   ├── page.js (updated: use ServerHeroLayout)
│   ├── blog/page.js (updated: use ServerBlogGrid)
│   └── api/
│       └── revalidate/
│           └── route.js (NEW)
├── components/
│   ├── hero/
│   │   ├── ServerHeroLayout.js (NEW)
│   │   ├── ServerHeroContent.js (NEW)
│   │   ├── ServerHeroStats.js (NEW - enhanced)
│   │   ├── HeroProfileSection.js (NEW)
│   │   ├── SocialLinksStatic.js (NEW)
│   │   └── ClientInteractiveLayer.js (NEW)
│   ├── blog/
│   │   ├── ServerBlogFilterSkeleton.js (NEW)
│   │   ├── ServerBlogGrid.js (NEW)
│   │   ├── ServerBlogCard.js (NEW)
│   │   ├── ClientShareButton.js (NEW)
│   │   └── filters/
│   │       ├── ClientSearchInput.js (NEW)
│   │       ├── ClientTagSelect.js (NEW)
│   │       ├── ClientSourceSelect.js (NEW)
│   │       └── ClientSortControls.js (NEW)
│   ├── layout/
│   │   ├── ServerHeader.js (NEW)
│   │   ├── ClientMobileMenu.js (NEW)
│   │   └── ClientThemeSwitcher.js (extracted)
│   └── ui/
│       ├── OptimizedThemeSwitcher.js (NEW)
│       └── allThemes.js (NEW)
```

---

## 🧪 Testing & Validation

### Pre-Implementation Baseline
```bash
# 1. Current bundle size
pnpm build
du -sh .next/static/chunks/*.js | sort -h

# 2. Current Lighthouse score
pnpm build && pnpm start
lighthouse http://localhost:3000 --only-categories=performance --output json --output-path baseline.json

# 3. Current metrics
# - LCP: 800ms
# - FCP: 650ms
# - TBT: 320ms
# - Speed Index: 1100ms
```

### Post-Implementation Validation
```bash
# 1. After Phase 1
pnpm build
lighthouse http://localhost:3000 --output json --output-path phase1.json
# Expected: LCP ~550ms, Bundle -57KB

# 2. After Phase 2
pnpm build
lighthouse http://localhost:3000 --output json --output-path phase2.json
# Expected: LCP ~450ms, Bundle -159KB

# 3. After Phase 3
pnpm build
lighthouse http://localhost:3000 --output json --output-path phase3.json
# Expected: LCP ~420ms, Bundle -161KB

# 4. Cache hit rate validation
# Monitor Cloudflare Analytics → Caching tab
# Expected: 90%+ cache hit rate
```

### Performance Regression Testing
```bash
# Create test script
cat > scripts/performance-test.sh << 'EOF'
#!/bin/bash
echo "Building project..."
pnpm build

echo "Running Lighthouse..."
lighthouse http://localhost:3000 \
  --only-categories=performance \
  --output json \
  --output-path lighthouse-report.json

echo "Extracting metrics..."
node scripts/extract-metrics.js

echo "Validating against targets..."
node scripts/validate-performance.js
EOF

chmod +x scripts/performance-test.sh
```

---

## 🎯 Success Criteria Checklist

### Phase 1 (Week 1)
- [ ] Hero.js refactored to ServerHeroLayout
- [ ] No duplicate mobile/desktop layouts
- [ ] Hero data cached with 1-hour TTL
- [ ] Only 1 client component for interactions
- [ ] LCP reduces to ~550ms
- [ ] BlogGrid.js refactored to server filtering
- [ ] Filter options cached for 30 minutes
- [ ] URL-based filtering implemented
- [ ] Framer Motion removed from grid
- [ ] TBT reduces to ~150ms

### Phase 2 (Week 2)
- [ ] BlogCard.js refactored to ServerBlogCard
- [ ] Share button isolated as client component
- [ ] No Framer Motion in cards
- [ ] CSS transitions implemented
- [ ] Render time reduces by 85%
- [ ] Header.js refactored to ServerHeader
- [ ] Navigation links pre-rendered
- [ ] Mobile menu isolated as client component
- [ ] Hydration time reduces by 75%

### Phase 3 (Week 3)
- [ ] ThemeSwitcher optimized with lazy loading
- [ ] Full theme list loads on demand
- [ ] Bundle size reduced by 2KB
- [ ] Cache revalidation API created
- [ ] All components have cache tags
- [ ] Cache hit rate >90%
- [ ] Documentation updated

### Final Validation
- [ ] LCP < 500ms ✅ (Target: 420ms)
- [ ] Bundle size < 50KB ✅ (Target: 38KB)
- [ ] TBT < 100ms ✅ (Target: 80ms)
- [ ] Lighthouse score 95+ ✅ (Target: 97)
- [ ] Cache hit rate >90% ✅
- [ ] No hydration errors
- [ ] All tests passing

---

## 🚀 Quick Start Commands

```bash
# Phase 1: Hero.js + BlogGrid.js
mkdir -p src/components/hero src/components/blog/filters
touch src/components/hero/ServerHeroLayout.js
touch src/components/blog/ServerBlogFilterSkeleton.js

# Phase 2: BlogCard.js + Header.js
touch src/components/blog/ServerBlogCard.js
touch src/components/layout/ServerHeader.js

# Phase 3: Optimization
touch src/components/ui/OptimizedThemeSwitcher.js
touch src/app/api/revalidate/route.js

# Run baseline tests
pnpm build
pnpm test
lighthouse http://localhost:3000 --view
```

---

## 📚 Reference Documentation

### Next.js 16 Caching APIs
- `unstable_cache()`: [Docs](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)
- `revalidateTag()`: [Docs](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- Server Components: [Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Performance Best Practices
- Core Web Vitals: [Google Docs](https://web.dev/vitals/)
- Next.js Performance: [Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- Image Optimization: [Docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### Cloudflare Workers
- OpenNext Adapter: [GitHub](https://github.com/opennextjs/opennextjs-cloudflare)
- Cache Analytics: [Docs](https://developers.cloudflare.com/cache/)
- Node.js Runtime: [Docs](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)

---

## 💡 Implementation Tips

1. **Test incrementally**: Validate each component after conversion
2. **Use feature flags**: Add config toggle for new components
3. **Monitor metrics**: Track LCP/TBT after each phase
4. **Cache carefully**: Start with longer TTLs, adjust based on data
5. **Profile regularly**: Use React DevTools Profiler to identify bottlenecks
6. **Document changes**: Update component README files
7. **Backup first**: Create git branch before major refactors
8. **User feedback**: Monitor real-user metrics (RUM) in production

---

**Ready to implement?** Start with Phase 1 (Hero.js) for maximum impact! 🎯
