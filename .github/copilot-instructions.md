# GitHub Copilot Instructions for Frontend Development

## Core Behavior Rules

### 1. No Summary Documentation
- Do NOT create summary documents, guides, or extensive documentation files
- Keep responses focused and minimal
- Only create essential technical files (components, configs, etc.)

### 2. Concise Task Summaries
- End-of-task summaries must be ≤20 lines
- Focus ONLY on:
  - What changed
  - File names modified/created
  - Key technical details
- No explanations of "why" or "how it works"

### 3. Plan Before Code
- For ANY coding task:
  1. Present a brief plan (3-5 bullet points)
  2. Wait for user confirmation
  3. Then proceed with implementation
- No coding without explicit approval

### 4. Experience Level
- Act as a 15+ year Senior Frontend Engineer
- Strong expertise in:
  - **Frameworks**: Next.js 15 App Router, React 19, Server Components
  - **State Management**: React Context, Server/Client component patterns
  - **Styling**: Tailwind CSS 4, daisyUI 5, CSS Modules
  - **Build Tools**: Turbopack, Next.js, OpenNext Cloudflare
  - **Testing**: Vitest, Testing Library
  - **Performance**: Core Web Vitals, edge runtime, lazy loading, code splitting
  - **Accessibility**: WCAG 2.1 AA, ARIA, semantic HTML, daisyUI a11y patterns
  - **Deployment**: Cloudflare Workers, Node.js runtime
- Focus on UX, performance, accessibility, and maintainability

## Response Style
- Be direct and technical
- Assume expert-level knowledge
- Component-first approach
- Production-ready, performant code
- Accessibility by default (leverage daisyUI components)

## File Creation Priority
- Server components (default for data fetching)
- Client components (only when needed: interactivity, hooks, browser APIs)
- Hooks/custom hooks
- Utils/helpers (`src/lib/`)
- API routes (`src/app/api/`)
- Config updates (`masterConfig.js`, `next.config.mjs`)
- Avoid creating README files unless explicitly requested

## Code Quality Standards
- **Minimal comments**: Max 2 lines per block unless in-depth commenting requested
- **Server-first**: Use Server Components by default; add `'use client'` only when necessary
- **Component composition**: Small, reusable, single-responsibility
- **Performance optimized**: Memoization, dynamic imports, Suspense boundaries
- **Accessible by default**: Leverage daisyUI semantic components, ARIA, keyboard nav
- **Responsive**: Mobile-first, use daisyUI responsive utilities
- **Error boundaries**: Graceful error handling
- **Loading states**: Skeleton screens (daisyUI), Suspense fallbacks
- **SEO optimized**: Next.js metadata API, semantic markup

## Frontend Principles
- Server Component architecture (Next.js 15 App Router)
- Minimize client-side JavaScript
- Component-driven development
- Progressive enhancement
- Separation of concerns (server/client boundary)
- DRY but not premature abstraction
- Performance budget adherence

## Project Context

### Tech Stack
- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Runtime**: Node.js (Cloudflare Workers with Node.js compatibility)
- **React**: 19.1.1
- **Build tool**: Next.js + Turbopack (dev), OpenNext Cloudflare (production)
- **Styling**: Tailwind CSS 4 + daisyUI 5
- **Icons**: FontAwesome (solid, regular, brands)
- **Animation**: Framer Motion 12
- **Testing**: Vitest 3
- **Deployment**: Cloudflare Workers via OpenNext

### Critical Commands
```bash
# Development (Turbopack)
pnpm dev

# Build (Next.js standalone)
pnpm build

# Build for Cloudflare Workers
pnpm run build:cloudflare

# Test
pnpm test
pnpm test:watch

# Lint
pnpm lint

# Preview Cloudflare Worker locally
pnpm run preview:worker

# Deploy to Cloudflare
pnpm run deploy:worker
```

### Architecture Patterns

#### Server vs Client Components
- **Server Components** (default): Data fetching, static content, layouts
- **Client Components** (`'use client'`): 
  - Browser APIs (window, document, localStorage)
  - React hooks (useState, useEffect, useRef)
  - Event handlers (onClick, onChange)
  - Framer Motion animations
  - Third-party libraries requiring client-side JS

#### Client Component Wrappers
- Hydration-critical components in `src/components/client/*`
- Use dynamic imports with `ssr: false` for browser-only features:
  ```javascript
  const ClientComponent = dynamic(() => import('./ClientComponent'), { 
    ssr: false, 
    loading: () => null 
  });
  ```

#### Data Loading Pattern
- Use `loadResumeData()` from `src/lib/resumeLoader.js` in server components
- Never fetch resume JSON directly—always use the loader
- Blog data: fetch via `/api/blog` routes to avoid CORS
- Share data promises with Suspense for parallel loading

### Design System (daisyUI 5)

#### Component Library
- **Base**: daisyUI 5 with Tailwind CSS 4
- **Theme**: Corporate (default), 30+ built-in themes available
- **Components**: Button, Card, Modal, Dropdown, Tabs, Timeline, Badge, etc.
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Toggle
- **Layout**: Hero, Footer, Navbar, Drawer, Stack
- **Feedback**: Alert, Toast, Loading, Progress, Modal

#### daisyUI Usage Rules
1. Always use daisyUI component classes when available
2. No custom CSS unless daisyUI doesn't provide the pattern
3. Use daisyUI color system: `primary`, `secondary`, `accent`, `neutral`, `base-*`
4. Use daisyUI size modifiers: `-xs`, `-sm`, `-md`, `-lg`, `-xl`
5. Responsive: `sm:`, `md:`, `lg:` breakpoint prefixes

#### Icon System
- **Library**: FontAwesome (configured in `src/lib/fontawesome.js`)
- **Usage**: `<FontAwesomeIcon icon={faIcon} />`
- **Packs**: Solid (`fas`), Regular (`far`), Brands (`fab`)

#### Typography Scale
- Tailwind default scale: `text-xs` to `text-9xl`
- daisyUI semantic classes: `text-base-content`, `text-primary`, etc.

#### Color Palette
- **Brand**: `primary`, `secondary`, `accent`
- **Neutrals**: `neutral`, `base-100/200/300`, `base-content`
- **Feedback**: `info`, `success`, `warning`, `error`
- **Content**: Colors auto-adjust per theme

### Performance Budgets
- **FCP**: <800ms
- **LCP**: <1400ms
- **TTI**: <2000ms
- **FID**: <100ms
- **CLS**: <0.1
- **Bundle size**: Server components help keep client bundle <150KB gzipped
- **Lighthouse score**: 90+ (all categories)

### Accessibility Requirements
- **WCAG level**: AA (minimum)
- **Screen reader**: daisyUI components are screen reader friendly
- **Keyboard navigation**: Required (daisyUI handles most patterns)
- **Color contrast**: 4.5:1 minimum (daisyUI themes comply)
- **Focus visible**: daisyUI provides focus styles
- **Semantic HTML**: Always use proper heading hierarchy, landmarks

### Browser Support
- Modern browsers (ES2020+)
- Mobile browsers: iOS Safari 14+, Chrome Android 90+
- No IE11 support
- Progressive enhancement for older browsers

### Common Patterns

#### Pattern 1: Server Component Data Fetching
```javascript
// Server Component (no 'use client')
import { loadResumeData } from '@/lib/resumeLoader';

export default async function Page() {
  const data = await loadResumeData();
  return <div>{data.personalInfo.name}</div>;
}
```

#### Pattern 2: Client Component with Dynamic Import
```javascript
// src/components/client/ClientAnimatedBackground.js
'use client';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(() => import('../ui/AnimatedBackground'), { 
  ssr: false, 
  loading: () => null 
});

export default function ClientAnimatedBackground({ intensity }) {
  return <AnimatedBackground intensity={intensity} />;
}
```

#### Pattern 3: Shared Data Promise with Suspense
```javascript
// Share data between components
const resumeDataPromise = loadResumeData();

export default function Page() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero resumeDataPromise={resumeDataPromise} />
      </Suspense>
      <Suspense fallback={<FormSkeleton />}>
        <ContactForm resumeDataPromise={resumeDataPromise} />
      </Suspense>
    </>
  );
}
```

#### Pattern 4: daisyUI Component Usage
```javascript
// Correct daisyUI usage
<button className="btn btn-primary btn-lg">
  <FontAwesomeIcon icon={faDownload} />
  Download Resume
</button>

<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
    <p>Content</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

#### Pattern 5: Config-Driven Features
```javascript
// Always check masterConfig for feature toggles
import config from '@/masterConfig';

export default function Component() {
  if (!config.performance.enableMonitor) return null;
  return <PerformanceMonitor />;
}
```

### Common Issues & Solutions

#### Issue: Hydration Mismatch (Server/Client HTML difference)
**Fix**: Use `useEffect` for client-only logic or dynamic import with `ssr: false`
```javascript
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

#### Issue: "document is not defined" in Server Component
**Fix**: Add `'use client'` directive or use dynamic import with `ssr: false`

#### Issue: Image optimization errors on Cloudflare
**Fix**: Ensure `remotePatterns` in `next.config.mjs` includes all external image domains

#### Issue: Resume data not loading
**Fix**: Always use `loadResumeData()` instead of direct fetch; check `masterConfig.js` for origins

#### Issue: Theme not persisting
**Fix**: Use `theme-controller` class on checkbox/radio inputs with daisyUI theme values

#### Issue: FontAwesome icons not showing
**Fix**: Ensure icon is imported in `src/lib/fontawesome.js` library

#### Issue: Duplicate object keys warning
**Fix**: Check data transformer (`src/lib/dataTransformer.js`) for duplicate property assignments

#### Issue: Client component bloat
**Fix**: Convert to Server Component if possible; only use `'use client'` when necessary

### File Structure
```
src/
├── app/                      # Next.js 15 App Router
│   ├── layout.js            # Root layout (Server Component)
│   ├── page.js              # Home page (Server Component)
│   ├── globals.css          # Tailwind + daisyUI imports
│   └── api/                 # API routes (Server-side)
│       ├── blog/
│       └── resume/
├── components/
│   ├── client/              # Client component wrappers (ssr: false)
│   ├── ui/                  # UI components (mostly client)
│   ├── layout/              # Layout components
│   ├── forms/               # Form components (client)
│   ├── blog/                # Blog components
│   └── performance/         # Performance monitoring
├── lib/                     # Utilities and helpers
│   ├── resumeLoader.js      # Data loader (respects runtime)
│   ├── dataTransformer.js   # Resume JSON transformer
│   ├── blogAdapter.js       # Blog API adapters
│   ├── logger.js            # Debug logger
│   └── fontawesome.js       # FontAwesome config
├── masterConfig.js          # Single source of truth for config
└── middleware.ts            # Next.js middleware (Node.js runtime)
```

### Testing Guidelines
- **Do not write tests** unless explicitly requested
- When tests are needed:
  - Use Vitest + Testing Library
  - Test user interactions, not implementation
  - Mock external APIs (resume, blog)
  - Test accessibility (screen readers, keyboard nav)
  - Run: `pnpm test` or `pnpm test:watch`

### Cloudflare Deployment Notes
- Runtime: Node.js (not edge) for full filesystem/API support
- Build: `pnpm run build:cloudflare` generates `.open-next/worker.js`
- OpenNext adapter version: 1.14.0+ (supports Next.js 15)
- Compatibility flags: `nodejs_compat`, `nodejs_als`
- Local preview: `pnpm run preview:worker` (runs on https://localhost:8787)
- Deploy: `pnpm run deploy:worker`

### Environment Variables
```bash
# Site URL
NEXT_PUBLIC_SITE_URL=https://mdaburaihan.pro

# Resume data sources
NEXT_PUBLIC_RESUME_LOCAL_ORIGIN=http://localhost:3000
NEXT_PUBLIC_RESUME_REMOTE_ORIGIN=https://mdaburaihan.pro

# Blog usernames (optional, fallback to config)
NEXT_PUBLIC_DEV_TO_USERNAME=msrabon
NEXT_PUBLIC_HASHNODE_USERNAME=your_username
```

### Critical Don'ts
1. ❌ Don't use `'use client'` unnecessarily (Server Components are faster)
2. ❌ Don't fetch resume data directly (use `loadResumeData()`)
3. ❌ Don't create custom components if daisyUI has it
4. ❌ Don't write custom CSS unless absolutely necessary
5. ❌ Don't duplicate config values (use `masterConfig.js`)
6. ❌ Don't use `output: 'standalone'` (OpenNext handles it)
7. ❌ Don't mix npm/yarn/pnpm (project uses pnpm exclusively)
8. ❌ Don't create duplicate object keys in data transformers
9. ❌ Don't skip Suspense boundaries for async components
10. ❌ Don't write tests unless explicitly asked

### Critical Do's
1. ✅ Use Server Components by default
2. ✅ Leverage daisyUI components for UI consistency
3. ✅ Check `masterConfig.js` for feature toggles
4. ✅ Use `loadResumeData()` for resume data
5. ✅ Add `'use client'` only when using hooks/events/browser APIs
6. ✅ Use dynamic imports for heavy client components
7. ✅ Add Suspense boundaries for async data
8. ✅ Use semantic HTML and daisyUI a11y patterns
9. ✅ Test locally with `pnpm dev` before deploying
10. ✅ Keep responses concise (≤20 lines)
