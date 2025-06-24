#!/bin/bash

# Build script for Cloudflare Workers deployment
set -e

echo "🚀 Building PowrStack Portfolio for Cloudflare Workers..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next .open-next

# Build Next.js application
echo "📦 Building Next.js application..."
npm run build

# Build for Cloudflare Workers using OpenNext
echo "☁️ Building for Cloudflare Workers..."
npx @opennextjs/cloudflare@latest build

echo "✅ Build completed successfully!"
echo ""
echo "📁 Output directory: .open-next/"
echo "🌐 Worker file: .open-next/worker.js"
echo "📂 Assets directory: .open-next/assets/"
echo ""
echo "🚀 To deploy:"
echo "  - For Cloudflare Pages: npm run deploy"
echo "  - For Cloudflare Workers: npm run deploy:worker"
echo "  - For local preview (Pages): npm run preview"
echo "  - For local preview (Worker): npm run preview:worker"
