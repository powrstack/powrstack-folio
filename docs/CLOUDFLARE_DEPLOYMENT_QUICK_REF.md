# Cloudflare Deployment - Quick Reference

## TL;DR - What's Wrong

🔴 **CRITICAL ISSUES:**
1. Next.js 15.5.4 incompatible with @opennextjs/cloudflare 1.3.1 (expects 14.2.24)
2. Filesystem access code in resumeLoader.js breaks on Cloudflare Workers
3. Image optimization requires Next.js server (not available on Workers)

🟠 **HIGH PRIORITY:**
1. Too many client components (21+) bloating bundle size
2. Build scripts using wrong package manager (npm vs pnpm)
3. Service Worker conflicts with Cloudflare Worker
4. Output mode set to 'standalone' (Node.js oriented)

## Quick Fix Checklist

### ⚡ Immediate Actions (4-6 hours)

- [ ] **Downgrade Next.js** to 14.2.24
  ```bash
  pnpm add next@14.2.24 react@18.3.1 react-dom@18.3.1
  ```

- [ ] **Remove filesystem code** from `src/lib/resumeLoader.js`
  - Delete `loadResumeFromLocalFile()` function
  - Remove it from fallback chain

- [ ] **Fix image optimization** in `next.config.mjs`
  ```javascript
  images: { unoptimized: true }
  ```

- [ ] **Remove output mode** from `next.config.mjs`
  ```javascript
  // Delete this line:
  // output: 'standalone',
  ```

- [ ] **Fix build scripts** to use pnpm consistently
  ```json
  "build:cloudflare": "next build && pnpm exec opennextjs-cloudflare build"
  ```

- [ ] **Test build**
  ```bash
  rm -rf .next .open-next
  pnpm run build:cloudflare
  pnpm run preview:worker
  ```

### 🔄 Follow-up Actions (6-8 hours)

- [ ] Convert 10-15 components from client to server
- [ ] Remove ServiceWorkerRegistration from layout
- [ ] Simplify middleware CSP
- [ ] Optimize FontAwesome (import only used icons)

## File Changes Summary

| File | Change | Priority |
|------|--------|----------|
| `package.json` | Downgrade Next.js to 14.2.24, React to 18.3.1 | 🔴 Critical |
| `src/lib/resumeLoader.js` | Remove filesystem access code | 🔴 Critical |
| `next.config.mjs` | Set `unoptimized: true`, remove `output: 'standalone'` | 🔴 Critical |
| `wrangler.jsonc` | Fix build command to use pnpm, update compatibility date | 🔴 Critical |
| `build-cloudflare.sh` | Use pnpm instead of npx | 🟠 High |
| Components (21 files) | Remove 'use client' where not needed | 🟠 High |
| `src/app/layout.js` | Remove ServiceWorkerRegistration | 🟠 High |
| `middleware.ts` | Simplify CSP | 🟡 Medium |

## Test Commands

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml .next .open-next
pnpm install

# Verify versions
pnpm list next @opennextjs/cloudflare react

# Dev test
pnpm dev

# Production build test
pnpm build

# Cloudflare build test
pnpm run build:cloudflare

# Local worker test
pnpm run preview:worker

# Deploy
pnpm run deploy:worker
```

## Expected Build Output

✅ **Success looks like:**
```
✓ Compiled successfully
✓ Generated .open-next/worker.js (450KB)
✓ Worker preview running at http://localhost:8787
✓ No filesystem errors
✓ No peer dependency warnings
```

❌ **Failure looks like:**
```
✗ Error: Cannot find module 'fs/promises'
✗ Error: Unsupported Next.js version 15.5.4
✗ Error: Invalid peer dependency
✗ Error: Script too large (>1MB)
```

## Root Causes

1. **Version Mismatch**: OpenNext v1.3.1 doesn't support Next.js 15
2. **Runtime Assumptions**: Code assumes Node.js filesystem available
3. **Architecture Confusion**: Mixed Node.js (standalone) and Edge runtime
4. **Bundle Bloat**: Too many client components increasing size

## Recommended Path

**Phase 1 (Do First):** Fix critical issues
- Downgrade to Next.js 14.2.24
- Remove filesystem code
- Fix image optimization
- Test local build

**Phase 2 (Do Next):** Optimize
- Convert components to server
- Reduce bundle size
- Test deployment

**Phase 3 (Optional):** Enhance
- Add monitoring
- Improve caching
- Update documentation

## Success Metrics

- ✅ Build completes without errors
- ✅ Worker bundle < 1MB compressed
- ✅ Local preview works at localhost:8787
- ✅ Health check returns 200
- ✅ All pages render correctly
- ✅ Cold start < 500ms
- ✅ Error rate < 1%

## Need Help?

1. Read full analysis: `docs/CLOUDFLARE_DEPLOYMENT_ANALYSIS.md`
2. Read action plan: `docs/CLOUDFLARE_DEPLOYMENT_ACTION_PLAN.md`
3. Check OpenNext docs: https://opennext.js.org/cloudflare
4. Check Cloudflare Workers docs: https://developers.cloudflare.com/workers/

## Emergency Rollback

```bash
# Revert all changes
git reset --hard HEAD~1

# Or rollback via Cloudflare dashboard
# Workers & Pages > Your Worker > Deployments > Rollback
```

---

**Start with Phase 1. Don't skip steps. Test after each change. Good luck! 🚀**
