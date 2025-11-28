# 🚀 Deployment Guide - PowrStack Portfolio

Complete guide for deploying your portfolio to Cloudflare Workers.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Building for Production](#building-for-production)
5. [Cloudflare Workers Deployment](#cloudflare-workers-deployment)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)
8. [Post-Deployment](#post-deployment)

---

## ✅ Prerequisites

### Required Tools

```bash
# Node.js 18+ (check version)
node --version  # Should be v18.0.0 or higher

# pnpm (install if needed)
npm install -g pnpm

# Wrangler CLI (Cloudflare's deployment tool)
pnpm add -g wrangler

# Login to Cloudflare
wrangler login
```

### Cloudflare Account Setup

1. **Create Account**: Sign up at [cloudflare.com](https://dash.cloudflare.com/sign-up)
2. **Verify Email**: Check your email and verify your account
3. **Get Account ID**: 
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your domain or Workers
   - Copy your Account ID from the right sidebar

---

## ⚙️ Environment Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/powrstack-folio.git
cd powrstack-folio

# Install dependencies
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` file in the project root:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RESUME_LOCAL_ORIGIN=http://localhost:3000
NEXT_PUBLIC_RESUME_REMOTE_ORIGIN=https://yourdomain.com

# Optional: Blog API Keys
# DEV_TO_API_KEY=your_dev_to_api_key
# HASHNODE_API_KEY=your_hashnode_api_key
```

### 3. Configure Master Settings

Edit `src/masterConfig.js`:

```javascript
const config = {
  // Update with your GitHub repository URL
  resumeUrl: "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/resume.json",
  
  // Update blog usernames
  blog: {
    sources: {
      dev: {
        enabled: true,
        username: "your-dev-username", // Change this
        // ...
      },
      hashnode: {
        enabled: false, // Set to true if you use Hashnode
        username: "your-hashnode-username", // Change this
        // ...
      }
    }
  },
  
  // Configure your preferred theme
  defaultTheme: "corporate", // or any daisyUI theme
};
```

### 4. Customize Resume Data

Edit `public/resume.json` with your information:

```json
{
  "basics": {
    "name": "Your Name",
    "label": "Your Title",
    "email": "your.email@example.com",
    "phone": "+1234567890",
    "url": "https://yourwebsite.com",
    "summary": "Your professional summary...",
    "location": {
      "city": "Your City",
      "countryCode": "US"
    },
    "profiles": [
      {
        "network": "GitHub",
        "username": "yourhandle",
        "url": "https://github.com/yourhandle"
      }
    ]
  },
  "work": [
    // Your work experience
  ],
  "education": [
    // Your education
  ],
  "skills": [
    // Your skills
  ]
}
```

---

## 💻 Local Development

### Start Development Server

```bash
# Start Next.js development server with Turbopack
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Development Features

- **Hot Module Replacement**: Changes reflect instantly
- **Fast Refresh**: React components update without losing state
- **Turbopack**: Ultra-fast bundler for development

### Validate Configuration

Run the validation script before building:

```bash
# Run environment validation
node scripts/validate-env.js
```

This checks:
- ✅ Environment variables are set
- ✅ masterConfig.js is properly configured
- ✅ resume.json is valid JSON
- ✅ No placeholder values remain

---

## 🔨 Building for Production

### 1. Standard Next.js Build

```bash
# Build Next.js application
pnpm build
```

This creates optimized production build in `.next/` directory.

### 2. Cloudflare Workers Build

```bash
# Build for Cloudflare Workers
pnpm build:cloudflare
```

This:
1. Runs standard Next.js build
2. Converts build to Cloudflare Workers format using OpenNext
3. Generates `.open-next/worker.js` (the deployable worker)
4. Creates `.open-next/assets/` (static assets)

### 3. Preview Locally

Test the worker locally before deploying:

```bash
# Start local Cloudflare Workers emulator
pnpm preview:local
```

Visit [https://localhost:8787](https://localhost:8787)

**Important**: Use HTTPS locally to match production environment.

---

## 🌐 Cloudflare Workers Deployment

### Option 1: First-Time Deployment

#### Step 1: Configure Wrangler

Create/update `wrangler.jsonc`:

```jsonc
{
  "name": "your-portfolio-name", // Change this
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
  "vars": {
    "NEXT_PUBLIC_SITE_URL": "https://your-domain.com"
  }
}
```

#### Step 2: Deploy

```bash
# Deploy to Cloudflare Workers
pnpm deploy:worker
```

This deploys to `https://your-portfolio-name.workers.dev`

#### Step 3: Custom Domain (Optional)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Workers & Pages
3. Select your worker
4. Click "Triggers" tab
5. Add custom domain or route

### Option 2: Staging/Production Workflow

#### Configure Multiple Environments

Create `wrangler.jsonc` with environments:

```jsonc
{
  "name": "your-portfolio",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-11-29",
  "compatibility_flags": ["nodejs_compat", "nodejs_als"],
  
  "env": {
    "staging": {
      "name": "your-portfolio-staging",
      "vars": {
        "NEXT_PUBLIC_SITE_URL": "https://staging.yourdomain.com"
      }
    },
    "production": {
      "name": "your-portfolio",
      "vars": {
        "NEXT_PUBLIC_SITE_URL": "https://yourdomain.com"
      }
    }
  }
}
```

#### Deploy to Staging

```bash
# Deploy to staging environment
pnpm deploy:staging
```

#### Deploy to Production

```bash
# Full validation + production deployment
pnpm deploy:production
```

This script:
1. ✅ Runs linting (`pnpm lint`)
2. ✅ Runs tests (`pnpm test`)
3. ✅ Builds application (`pnpm build`)
4. ✅ Validates environment (`node scripts/validate-env.js`)
5. 🚀 Deploys to production

---

## 🔐 Environment Variables

### Setting Variables in Cloudflare

#### Via Wrangler CLI

```bash
# Set production environment variable
wrangler secret put NEXT_PUBLIC_SITE_URL --env production

# Set API key
wrangler secret put DEV_TO_API_KEY
```

#### Via Cloudflare Dashboard

1. Go to [Workers Dashboard](https://dash.cloudflare.com)
2. Select your worker
3. Go to **Settings** > **Variables**
4. Add environment variables
5. Click **Save**

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your production domain | `https://yourdomain.com` |
| `NEXT_PUBLIC_RESUME_REMOTE_ORIGIN` | Resume data origin | `https://yourdomain.com` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `DEV_TO_API_KEY` | Dev.to API key for blog posts |
| `HASHNODE_API_KEY` | Hashnode API key for blog posts |
| `NEXT_PUBLIC_GA_ID` | Google Analytics tracking ID |

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Fails

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next .open-next
pnpm install
pnpm build:cloudflare
```

#### 2. Worker Bundle Too Large

**Error**: `Worker exceeds 1MB limit`

**Solution**:
```bash
# Analyze bundle size
pnpm build:analyze

# Check what's included
ls -lh .open-next/worker.js
```

Optimization tips:
- Remove unused dependencies
- Use dynamic imports for large components
- Check `framer-motion` usage (consider lighter alternatives)

#### 3. Images Not Loading

**Error**: Images show broken or 404

**Solution**:
1. Check images exist in `public/images/`
2. Verify paths start with `/` (e.g., `/images/profile.jpg`)
3. Check `remotePatterns` in `next.config.mjs` for external images

#### 4. Blog Posts Not Fetching

**Error**: Blog section is empty

**Solution**:
1. Check `src/masterConfig.js` has correct usernames
2. Verify blog source is enabled (`enabled: true`)
3. Test API directly: `https://your-worker.workers.dev/api/blog?source=dev`
4. Check browser console for CORS errors

#### 5. Hydration Errors

**Error**: `Text content does not match server-rendered HTML`

**Solution**:
- Ensure client components have `'use client'` directive
- Check `ThemeSwitcher` and dynamic date displays
- See `docs/SSR_FIXES_REPORT.md` for patterns

#### 6. Deployment Fails

**Error**: `Authentication error` or `Account not found`

**Solution**:
```bash
# Re-authenticate with Cloudflare
wrangler logout
wrangler login

# Check account info
wrangler whoami
```

### Debug Mode

Enable debug logging in `src/lib/logger.js`:

```javascript
// Add ?debug=true to URL in browser
// e.g., https://yourdomain.com/?debug=true
```

---

## 🎉 Post-Deployment

### Verify Deployment

1. **Check Homepage**: Visit your deployed URL
2. **Test Navigation**: Click through all pages
3. **Check Blog**: Verify blog posts load
4. **Mobile Test**: Test on mobile devices
5. **Performance**: Run Lighthouse audit

### Performance Monitoring

#### Cloudflare Analytics

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your worker
3. View metrics:
   - Requests per second
   - Response time
   - Error rate
   - Bandwidth usage

#### Core Web Vitals

Enable performance monitoring in `src/masterConfig.js`:

```javascript
performance: {
  enableMonitor: true,
  enableBudget: true,
  thresholds: {
    lcp: 1400,  // Target: < 1.4s
    fid: 100,   // Target: < 100ms
    cls: 0.1    // Target: < 0.1
  }
}
```

### SEO Checklist

- [ ] Add your domain to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Verify Open Graph tags (share on social media to test)
- [ ] Check robots.txt: `https://yourdomain.com/robots.txt`
- [ ] Test structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)

### Security Headers

Verify security headers are set:

```bash
# Check headers
curl -I https://yourdomain.com

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build:cloudflare
      
      - name: Deploy
        run: pnpm deploy:worker
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 📚 Additional Resources

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Cloudflare Workers**: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/)
- **OpenNext**: [opennext.js.org](https://opennext.js.org/)
- **Wrangler CLI**: [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler/)

### Project Documentation

- [README.md](../README.md) - Project overview
- [BLUEPRINT_PLAN.md](./.github/BLUEPRINT_PLAN.md) - Architecture guide
- [COMPONENT_ARCHITECTURE.md](./docs/COMPONENT_ARCHITECTURE.md) - Component organization
- [CLOUDFLARE_DEPLOYMENT_ANALYSIS.md](./docs/CLOUDFLARE_DEPLOYMENT_ANALYSIS.md) - Detailed analysis

---

## 🆘 Need Help?

1. **Check Documentation**: Start with the docs in this repository
2. **Validation Script**: Run `node scripts/validate-env.js`
3. **View Logs**: Use `wrangler tail` to see live logs
4. **GitHub Issues**: Open an issue in the repository
5. **Cloudflare Community**: [community.cloudflare.com](https://community.cloudflare.com/)

---

**Last Updated**: November 29, 2025  
**Cloudflare Workers Runtime**: Node.js  
**OpenNext Version**: 1.14.0+  
**Next.js Version**: 15.5.4
