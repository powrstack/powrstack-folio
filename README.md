# 🚀 PowrStack Portfolio Template

A modern, high-performance developer portfolio template built with **Next.js 15**, **Tailwind CSS 4**, and **daisyUI 5**. Features a dynamic blog system, configurable animated backgrounds, optimized image loading, and comprehensive performance monitoring.

## ✨ Key Features

- **🎨 Modern Design**: Clean, responsive design with configurable animated backgrounds
- **📱 Fully Responsive**: Mobile-first design optimized for all devices
- **🌙 Theme System**: 30+ daisyUI themes with intelligent theme switching
- **📝 Multi-Source Blog**: Integrated blog system (Dev.to, Hashnode, Medium)
- **📊 JSON Resume**: Standard JSON Resume schema compatibility
- **⚡ Performance Optimized**: Sub-1.4s LCP with smart image optimization
- **🎯 SEO Excellence**: Advanced meta tags, Open Graph, and structured data
- **♿ Accessibility First**: WCAG compliant with full keyboard navigation
- **🖼️ Smart Image Loading**: Conditional preloading and Next.js optimization
- **🎛️ Configurable Backgrounds**: Animated, static, or hybrid background modes
- **📊 Performance Monitoring**: Real-time LCP tracking and resource optimization
- **🔧 Zero-Config Setup**: Single configuration file for everything

## 🚀 Performance Features

### Image Optimization
- **Smart Preloading**: Only loads images when actually needed
- **Conditional Loading**: Configurable background image loading
- **Next.js Optimization**: Automatic WebP/AVIF conversion and responsive sizing
- **Bandwidth Savings**: Eliminates unnecessary large image loads

### Background System
- **Animated Backgrounds**: CSS-based animations with adjustable intensity
- **Static Images**: High-quality backgrounds with overlay controls
- **Hybrid Mode**: Layered combination of images and animations
- **Performance Aware**: Only loads resources based on selected mode

### Monitoring & Analytics
- **LCP Tracking**: Real-time Largest Contentful Paint monitoring
- **Resource Monitoring**: Slow loading resource detection
- **Performance Budgets**: Automated performance threshold warnings
- **Smart Caching**: Service worker integration for critical resources

## 🚀 Quick Start

### 1. Clone or Download

```bash
# Clone the repository
git clone https://github.com/your-username/powrstack-folio.git
cd powrstack-folio

# Or download as ZIP and extract
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Configure Your Portfolio

Edit `src/masterConfig.js` with your settings:

```javascript
const config = {
  // Resume data source
  resumeJson: "resume.json",
  resumeUrl: "https://raw.githubusercontent.com/your-username/your-repo/main/public/resume.json",
  
  // Configurable Background System
  background: {
    type: 'animated', // 'animated' | 'image' | 'hybrid'
    image: {
      src: "/images/your-background.jpg",
      overlay: true,
      overlayOpacity: 0.3,
      quality: 85,
      priority: true,
    },
    animated: {
      enabled: true,
      intensity: 'normal', // 'subtle' | 'normal' | 'intense'
    }
  },
  
  // Theme settings
  defaultTheme: "corporate",
  enableRandomTheme: false,
  
  // Blog configuration
  blog: {
    primarySource: "dev",
    sources: {
      dev: {
        enabled: true,
        username: "your_dev_username",
        // ... other settings
      }
    }
  }
};
```

### 4. Update Your Resume Data

Edit `public/resume.json` with your information (see [Configuration Guide](#-configuration-guide) below).

### 5. Configure Your Background

Choose your preferred background style in `src/masterConfig.js`:

**Option 1: Animated Background (Default)**
```javascript
background: {
  type: 'animated',
  animated: {
    enabled: true,
    intensity: 'normal',
  }
}
```

**Option 2: Static Image Background**
```javascript
background: {
  type: 'image',
  image: {
    src: "/images/your-background.jpg",
    overlay: true,
    overlayOpacity: 0.3,
    quality: 85,
    priority: true,
  }
}
```

**Option 3: Hybrid (Image + Animation)**
```javascript
background: {
  type: 'hybrid',
  image: {
    src: "/images/your-background.jpg",
    overlay: true,
    overlayOpacity: 0.4,
    quality: 85,
    priority: true,
  },
  animated: {
    enabled: true,
    intensity: 'subtle',
  }
}
```

### 6. Add Your Images (Optional)

If using image backgrounds, add to the `public/images/` folder:
- `your-background.jpg` - Hero background image (1920x1080px recommended)
- `profile.jpg` - Your profile photo (500x500px recommended)

### 7. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your portfolio!

## ⚙️ Configuration Guide

### 🎛️ Background Configuration (`src/masterConfig.js`)

The template features a flexible background system with three modes:

#### Animated Background (Default)
```javascript
background: {
  type: 'animated',
  animated: {
    enabled: true,
    intensity: 'normal', // 'subtle' | 'normal' | 'intense'
  }
}
```

**Benefits:**
- Zero bandwidth usage for background
- Dynamic, theme-aware animations
- Excellent mobile performance
- No image loading delays

#### Static Image Background
```javascript
background: {
  type: 'image',
  image: {
    src: "/images/your-background.jpg",
    overlay: true, // Adds dark overlay for text readability
    overlayOpacity: 0.3, // 0.0 - 1.0
    quality: 85, // Image quality 1-100
    priority: true, // Preload for faster LCP
  }
}
```

**Benefits:**
- Professional, branded appearance
- Next.js automatic optimization
- Responsive image loading
- Smart preloading only when needed

#### Hybrid Background
```javascript
background: {
  type: 'hybrid',
  image: {
    src: "/images/your-background.jpg",
    overlay: true,
    overlayOpacity: 0.4,
    quality: 85,
    priority: true,
  },
  animated: {
    enabled: true,
    intensity: 'subtle', // Use 'subtle' for best layering
  }
}
```

**Benefits:**
- Rich, layered visual experience
- Combines branding with dynamic elements
- Configurable overlay for perfect balance

### 📄 Master Configuration

This is the main configuration file for your portfolio:

#### Basic Settings
```javascript
const config = {
  // Resume data sources
  resumeJson: "resume.json", // Local file in public/
  resumeUrl: "https://raw.githubusercontent.com/user/repo/main/public/resume.json", // Remote source
  
  // Background system (see Background Configuration above)
  background: {
    type: 'animated', // 'animated' | 'image' | 'hybrid'
    // ... background settings
  },
  
  // Default theme (must match a valid daisyUI theme)
  defaultTheme: "corporate", // light, dark, cupcake, bumblebee, etc.
  
  // Enable random theme on each page load
  enableRandomTheme: false,
};
```

#### Blog Configuration
```javascript
blog: {
  // Primary blog source
  primarySource: "dev", // "dev", "hashnode", or "medium"
  
  sources: {
    dev: {
      enabled: true,
      username: "your_dev_username",
      apiUrl: "https://dev.to/api/articles",
      rssUrl: "https://dev.to/feed/your_dev_username",
      profileUrl: "https://dev.to/your_dev_username"
    },
    hashnode: {
      enabled: false, // Set to true to enable
      username: "your_hashnode_username",
      publicationId: "your_publication_id",
      apiUrl: "https://gql.hashnode.com/",
      profileUrl: "https://your_username.hashnode.dev"
    },
    medium: {
      enabled: false, // Set to true to enable
      username: "your_medium_username",
      rssUrl: "https://medium.com/feed/@your_medium_username",
      profileUrl: "https://medium.com/@your_medium_username"
    }
  },
  
  // Display settings
  postsPerPage: 9,
  showFeaturedPost: true,
  showReadTime: true,
  showTags: true,
  showPublishDate: true
}
```

### 📋 Resume Data (`public/resume.json`)

Update this file with your personal information using the JSON Resume format:

#### Personal Information
```json
{
  "personalInfo": {
    "name": "Your Name",
    "title": "Your Job Title",
    "email": "your.email@example.com",
    "phone": "+1 (555) 123-4567",
    "website": "https://yourwebsite.com",
    "location": "Your City, Country",
    "profileImage": "/images/profile.jpg",
    "summary": "Your professional summary...",
    "social": {
      "github": "https://github.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourprofile",
      "dev": "https://dev.to/yourusername"
    }
  }
}
```

#### Work Experience
```json
{
  "workExperience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "2020-01",
      "endDate": "present",
      "location": "City, Country",
      "description": "Job description...",
      "highlights": ["Achievement 1", "Achievement 2"],
      "technologies": ["React", "Node.js", "AWS"]
    }
  ]
}
```

#### Skills & Technologies
```json
{
  "skills": {
    "technical": [
      {
        "name": "JavaScript",
        "level": "Expert",
        "category": "Programming Languages"
      }
    ]
  }
}
```

#### Projects
```json
{
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description...",
      "technologies": ["React", "Node.js"],
      "githubUrl": "https://github.com/user/repo",
      "liveUrl": "https://project-demo.com",
      "image": "/images/project-screenshot.jpg"
    }
  ]
}
```

#### Certifications
```json
{
  "certifications": [
    {
      "name": "Certification Name",
      "vendor": "Issuing Organization",
      "date": "2023-06",
      "credentialId": "ABC123",
      "badgeImage": "/images/certs/badge.png"
    }
  ]
}
```

### 🎨 Theme Customization

#### Available Themes
The template includes 30+ daisyUI themes:
- **Light themes**: `light`, `cupcake`, `bumblebee`, `emerald`, `corporate`
- **Dark themes**: `dark`, `synthwave`, `halloween`, `forest`, `black`
- **Colorful themes**: `retro`, `cyberpunk`, `valentine`, `aqua`, `neon`

#### Custom Theme
You can create your own theme by adding to `src/app/globals.css`:

```css
@plugin "daisyui/theme" {
  name: "mytheme";
  default: true;
  color-scheme: light;
  
  --color-primary: oklch(55% 0.3 240);
  --color-secondary: oklch(70% 0.25 200);
  /* ... other color variables */
}
```

### 🖼️ Image Optimization

The template includes advanced image optimization features:

#### Smart Loading
- **Conditional Preloading**: Images only preload when actually used
- **Background-Aware**: Only loads background images when configured
- **Priority Loading**: Critical images load first for better LCP
- **Responsive Sizing**: Automatic size optimization for different devices

#### Next.js Integration
- **Automatic Optimization**: WebP/AVIF conversion and compression
- **Responsive Images**: Multiple sizes generated automatically
- **Lazy Loading**: Non-critical images load on scroll
- **Blur Placeholders**: Smooth loading transitions

#### Performance Monitoring
- **LCP Tracking**: Real-time monitoring of Largest Contentful Paint
- **Resource Alerts**: Warnings for slow-loading images
- **Performance Budgets**: Automated performance threshold checks

#### Image Requirements
```javascript
// Recommended specifications
Profile Images: 500x500px, < 200KB
Background Images: 1920x1080px, < 500KB
Project Images: 1200x800px, < 300KB
Certification Badges: 200x200px, < 50KB

// Supported formats: JPG, PNG, WebP, AVIF
// Next.js will automatically optimize and convert
```

### 🖼️ Image Setup (Legacy Documentation)

#### Required Images
1. **Profile Image**: `public/images/profile.jpg` (500x500px recommended)
2. **Background Image**: Only required if using `type: 'image'` or `type: 'hybrid'`
3. **Favicon**: `public/images/favicon/` (auto-generated from favicon.ico)

#### Optional Images
#### Optional Images
**Project Screenshots**: Add to `public/images/projects/`
- Use consistent aspect ratios (16:9 recommended)
- Optimize for web delivery (Next.js will handle conversion)

**Certification Badges**: Add to `public/images/certs/`
- PNG format with transparent backgrounds
- Square aspect ratio (200x200px recommended)

**Background Images**: Add to `public/images/` (only if using image backgrounds)
- High resolution (1920x1080px minimum)
- Landscape orientation works best
- Will be automatically optimized by Next.js

## 🛠️ Development & Performance

### Performance Features

#### Critical Resource Preloader
The template includes intelligent resource preloading:
```javascript
// Automatically preloads based on configuration
- Profile images (when available)
- Background images (when type: 'image' or 'hybrid')
- Critical fonts for faster text rendering
- Resume data for instant navigation
```

#### Performance Monitoring
```javascript
// Built-in monitoring includes:
- LCP (Largest Contentful Paint) tracking
- Resource loading time analysis
- Performance budget warnings
- Automatic cleanup of preload links
```

#### Build Optimizations
```javascript
// Production builds include:
- Automatic image optimization and conversion
- Code splitting and tree shaking
- CSS purging and minification
- Service worker for critical resource caching
```

### Project Structure
```
powrstack-folio/
├── src/
│   ├── app/
│   │   ├── globals.css           # Global styles with daisyUI
│   │   ├── layout.js             # Root layout with metadata
│   │   ├── page.js               # Home page with performance optimization
│   │   ├── blog/
│   │   │   └── page.js           # Dynamic blog page
│   │   └── api/
│   │       └── blog/             # Blog API routes
│   ├── components/
│   │   ├── Hero.js               # Hero with configurable backgrounds
│   │   ├── AnimatedBackground.js # Configurable animated background
│   │   ├── BlogCard.js           # Optimized blog post cards
│   │   ├── BlogGrid.js           # Responsive blog grid
│   │   ├── ContactForm.js        # Contact form with validation
│   │   ├── CriticalResourcePreloader.js # Smart resource preloading
│   │   └── [other components]
│   ├── lib/
│   │   ├── resumeLoader.js       # Resume data with caching
│   │   ├── blogAdapter.js        # Multi-source blog adapter
│   │   ├── blogLoader.js         # Optimized blog data loading
│   │   ├── logger.js             # Performance logging
│   │   └── fontawesome.js        # Icon configuration
│   └── masterConfig.js           # Main configuration file
├── public/
│   ├── resume.json               # Your resume data (JSON Resume format)
│   ├── sw.js                     # Service worker for caching
│   └── images/                   # Optimized images
│       ├── profile.jpg           # Your profile photo
│       ├── projects/             # Project screenshots
│       ├── certs/                # Certification badges
│       └── favicon/              # Favicon files
├── CONFIGURABLE_BACKGROUND_GUIDE.md # Background system documentation
├── IMAGE_OPTIMIZATION_REPORT.md     # Image optimization details
├── IMAGE_REMOVAL_REPORT.md          # Performance optimization log
└── [config files]
```

### Adding New Blog Sources

1. **Update masterConfig.js**:
```javascript
sources: {
  newSource: {
    enabled: true,
    username: "your_username",
    apiUrl: "https://api.newsource.com",
    profileUrl: "https://newsource.com/your_username"
  }
}
```

2. **Extend BlogAdapter** in `src/lib/blogAdapter.js`:
```javascript
class NewSourceBlogAdapter extends BlogAdapter {
  async fetchPosts(limit = 10) {
    // Implementation for new source
  }
}
```

3. **Add to Factory**:
```javascript
case 'newsource':
  return new NewSourceBlogAdapter(config);
```

### Custom Components

Create new components in `src/components/`:
```javascript
'use client';

import { motion } from 'framer-motion';

export default function CustomComponent({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card bg-base-100"
    >
      {/* Your component content */}
    </motion.div>
  );
}
```

## 📚 Documentation

### Configuration Guides
- **[Configurable Background Guide](CONFIGURABLE_BACKGROUND_GUIDE.md)** - Complete background system documentation
- **[Image Optimization Report](IMAGE_OPTIMIZATION_REPORT.md)** - Performance optimization details
- **[Image Removal Report](IMAGE_REMOVAL_REPORT.md)** - Bandwidth optimization log

### Performance Reports
The template includes detailed documentation of all optimizations:
- Image loading strategies
- Background configuration options
- Performance monitoring setup
- Critical resource preloading

## 📚 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Testing
pnpm test         # Run tests (if configured)

# Dependencies
pnpm install      # Install dependencies
pnpm update       # Update dependencies
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify
1. Build the project: `pnpm build`
2. Deploy the `out/` folder to Netlify

### Other Platforms
The project works on any platform that supports Next.js:
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## 🔧 Troubleshooting

### Common Issues

#### Background Not Displaying
1. Check `background.type` in `masterConfig.js`
2. Verify image path in `background.image.src`
3. Ensure image exists in `public/images/`
4. Check browser console for loading errors

#### Performance Issues
1. **Slow LCP**: Check if large images are loading unnecessarily
2. **High Bandwidth**: Consider using `type: 'animated'` instead of images
3. **Build Errors**: Run `pnpm build` to check for optimization issues
4. Monitor performance with built-in tracking

#### Blog Posts Not Loading
1. Check your username in `masterConfig.js`
2. Verify the blog source is enabled
3. Check browser console for API errors
4. Verify API endpoints are accessible

#### Images Not Displaying
1. Ensure images are in the `public/images/` folder
2. Check file paths in `resume.json` and `masterConfig.js`
3. Verify image formats (JPG, PNG, WebP supported)
4. Check if Next.js Image optimization is working

#### Theme Not Working
1. Check theme name in `masterConfig.js`
2. Ensure it matches a valid daisyUI theme
3. Clear browser cache and rebuild
4. Verify daisyUI CSS is loading

#### Build Errors
1. Run `pnpm lint` to check for code issues
2. Verify all required dependencies are installed
3. Check Node.js version compatibility (16+ recommended)
4. Clear `.next` folder and rebuild

### Performance Debugging

#### Check LCP Performance
```javascript
// Open browser console to see:
"✅ LCP (1250ms) within 1.4s target"
// or
"⚠️ LCP (1600ms) exceeds 1.4s target"
```

#### Monitor Resource Loading
```javascript
// Console will show warnings for slow resources:
"Slow image load: /images/large-image.jpg (850ms)"
```

#### Background Configuration Test
```javascript
// Test different background configurations:
// 1. Set type: 'animated' for fastest loading
// 2. Set type: 'image' to test image loading
// 3. Set type: 'hybrid' for combined effect
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💖 Support

If you find this template helpful:
- ⭐ Star the repository
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features or improvements
- 📢 Share with other developers
- 📊 Share your performance results

### Performance Results
Users report achieving:
- **LCP < 1.4s**: Consistently fast loading
- **95+ Lighthouse Score**: Excellent performance metrics
- **Zero Layout Shift**: Stable visual experience
- **Optimized Images**: 60-80% bandwidth savings

## 📞 Contact

For questions or support:
- GitHub Issues: [Create an issue](https://github.com/your-username/powrstack-folio/issues)
- Discussions: Share your configurations and results
- Email: your.email@example.com

### Community Contributions
- Background configurations from users
- Performance optimization tips
- Custom component examples
- Blog source integrations

---

**Happy coding! 🚀**

*Built with performance and developer experience in mind.*
