# powrstack-folio AI quickstart

## Architecture snapshot
- Next.js 15 App Router with mostly server components; hydration-critical pieces live in `src/components/client/*` wrappers (dynamic import + `ssr:false`).
- `src/masterConfig.js` is the single source of truth for resume sources, cache toggles, blog providers, background modes, and theme defaults.
- Resume data flows through `src/lib/resumeLoader.js` (local file → public asset → configured origins → remote fallback) then `transformResumeData` normalizes it for components and metadata.
- Blog data is brokered by `src/lib/blogAdapter.js` + `src/lib/blogLoader.js`; each adapter expects to go through the `/api/blog` routes to avoid CORS.

## Data & caching rules
- Always call `loadResumeData()` on the server (layouts, pages, API) instead of fetching JSON directly; it honors `resumeCache` (memory/localStorage) and `resumeOrigins` environment hints.
- Respect the edge guardrails in `resumeLoader`—filesystem reads are disabled under `process.env.NEXT_RUNTIME === 'edge'`.
- When touching resume transforms, keep the JSON Resume schema expectations (`basics`, `work`, `skills`, etc.) and the legacy `workExperience`/`skills` fallbacks in place.
- Blog adapters rely on `config.blog.sources`; enable/disable providers there and keep Medium marked as "not implemented" unless RSS parsing is added.

## UI & performance patterns
- `src/app/layout.js` preloads critical assets only when `config.background` requests them; keep background detection and theme logic in sync with the config file.
- The home page (`src/app/page.js`) shares a single `resumeDataPromise` between `Hero` and `ContactForm` via Suspense—reuse this approach for additional sections to avoid duplicate fetches.
- `src/components/performance/CriticalResourcePreloader.js` and `ServiceWorkerRegistration` manage preload links and SW warmup; update both when introducing new critical assets.
- Styling is Tailwind CSS 4 + daisyUI 5 (see `src/app/globals.css`); no `tailwind.config`—declare new utilities via CSS or Tailwind directives.

## Logging, tests, and tooling
- Do not write any tests unless explicitly asked to do so.
- Use the provided `logger` helper; plain `console.*` is stripped in production and defeats the debug toggles (`?debug=true`).
- Vitest drives the unit suite in `test/`; run `pnpm test` (or `pnpm test:watch`) with setup from `test/setupTests.js` (fetch + localStorage polyfills).
- Preferred workflows: `pnpm dev` (Turbopack), `pnpm lint`, `pnpm build`, and `pnpm start` for production verification. Cloudflare deployments rely on `pnpm run build:cloudflare`.

## Response guidelines
- Keep responses concise and focused on the task at hand.
- Do not create lengthy summaries or documentation unless specifically requested.
- Avoid showing detailed progress reports or implementation summaries after completing tasks.
- Focus on direct answers and code implementation rather than explanatory content.

## Integrations & docs
- External APIs: Dev.to and Hashnode via server-side fetch inside `/api/blog`; provide proper `User-Agent` headers and pass usernames through query params.
- Images are optimized through Next.js `remotePatterns`; add new domains in `next.config.mjs` and keep cache headers aligned with Cloudflare expectations.
- `docs/` holds performance and architecture reports (background, SSR, mobile) that should stay consistent with code changes—update them alongside major refactors.
