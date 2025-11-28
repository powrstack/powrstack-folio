# ⚡ Quick Start Guide

Get your PowrStack Portfolio running in **5 minutes**.

---

## 🚀 Fast Track Setup

### 1. Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/yourusername/powrstack-folio.git
cd powrstack-folio

# Install dependencies with pnpm
pnpm install

# If you don't have pnpm:
npm install -g pnpm
```

### 2. Configure Basics (2 min)

#### Edit `src/masterConfig.js`:

```javascript
const config = {
  // Change these URLs
  resumeUrl: "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/resume.json",
  
  // Change blog username
  blog: {
    sources: {
      dev: {
        username: "your-dev-username", // ← Change this
      }
    }
  },
  
  // Choose your theme
  defaultTheme: "corporate", // or 'dark', 'light', 'cupcake', etc.
};
```

#### Edit `public/resume.json`:

Replace placeholder values with your info:
- Name, email, title
- Work experience
- Skills
- Education

### 3. Run Development Server (1 min)

```bash
# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎨 Quick Customizations

### Change Theme

Edit `src/masterConfig.js`:

```javascript
defaultTheme: "dark", // Try: corporate, cupcake, bumblebee, synthwave
```

### Change Background

Edit `src/masterConfig.js`:

```javascript
background: {
  type: 'animated', // Options: 'animated', 'image', 'hybrid'
  animated: {
    intensity: 'normal', // 'subtle', 'normal', 'intense'
  }
}
```

### Add Your Photo

1. Add image to `public/images/profile.jpg`
2. Update `public/resume.json`:

```json
{
  "basics": {
    "image": "/images/profile.jpg"
  }
}
```

---

## 📦 Production Build

### Build for Next.js

```bash
pnpm build
pnpm start
```

### Build for Cloudflare Workers

```bash
# Install Cloudflare CLI
pnpm add -g wrangler

# Login to Cloudflare
wrangler login

# Build and deploy
pnpm build:cloudflare
pnpm deploy:worker
```

Your site will be live at `https://your-project.workers.dev`

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
pnpm dev -- --port 3001
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Resume Not Loading

1. Check `public/resume.json` is valid JSON
2. Verify no syntax errors (commas, brackets)
3. Use [JSONLint](https://jsonlint.com/) to validate

---

## 📚 Next Steps

Once running, explore these features:

- [ ] **Blog Integration** - Connect Dev.to, Hashnode, or Medium
- [ ] **Custom Domain** - Add your domain in Cloudflare
- [ ] **Analytics** - Add Google Analytics or Plausible
- [ ] **SEO** - Submit to Google Search Console
- [ ] **Performance** - Run Lighthouse audit

---

## 📖 Detailed Guides

- **Full Setup**: [README.md](./README.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Architecture**: [.github/BLUEPRINT_PLAN.md](./.github/BLUEPRINT_PLAN.md)
- **Components**: [docs/COMPONENT_ARCHITECTURE.md](./docs/COMPONENT_ARCHITECTURE.md)

---

## 🆘 Need Help?

1. **Validate Environment**: `node scripts/validate-env.js`
2. **Check Logs**: Look for errors in terminal
3. **Documentation**: Read the full [README.md](./README.md)
4. **Issues**: Open issue on GitHub

---

**That's it!** You now have a blazing-fast portfolio. 🚀

**Build Time**: 2-5 minutes  
**First Run**: ~30 seconds  
**LCP Target**: < 1.4 seconds
