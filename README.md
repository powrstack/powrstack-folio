# 🚀 PowrStack Portfolio Template

A modern, feature-rich developer portfolio template built with **Next.js 15**, **Tailwind CSS 4**, and **daisyUI 5**. This template includes a dynamic blog system, beautiful animations, and is fully customizable through configuration files.

## ✨ Features

- **🎨 Modern Design**: Clean, responsive design with smooth animations using Framer Motion
- **📱 Fully Responsive**: Mobile-first design that looks great on all devices
- **🌙 Dark Mode**: Built-in theme switching with 30+ daisyUI themes
- **📝 Dynamic Blog System**: Multi-source blog integration (Dev.to, Hashnode, Medium)
- **📊 JSON Resume Compatible**: Uses standard JSON Resume schema for easy data management
- **⚡ High Performance**: Server-side rendering, caching, and optimized images
- **🎯 SEO Optimized**: Meta tags, Open Graph, and Twitter Cards
- **♿ Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **🔧 Easy Configuration**: Single config file for all customizations

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
  // Resume data file
  resumeJson: "resume.json",
  
  // Background image
  landingBackground: "/images/your-background.jpg",
  
  // Theme settings
  defaultTheme: "light", // or "dark", "cupcake", etc.
  enableRandomTheme: false,
  
  // Blog configuration
  blog: {
    primarySource: "dev",
    sources: {
      dev: {
        enabled: true,
        username: "your_dev_username", // Replace with your Dev.to username
        // ... other settings
      }
    }
  }
};
```

### 4. Update Your Resume Data

Edit `public/resume.json` with your information (see [Configuration Guide](#-configuration-guide) below).

### 5. Add Your Images

Replace these images in the `public/images/` folder:
- `profile.jpg` - Your profile photo
- `your-background.jpg` - Hero background image
- Add any project images

### 6. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your portfolio!

## ⚙️ Configuration Guide

### 📄 Master Configuration (`src/masterConfig.js`)

This is the main configuration file for your portfolio:

#### Basic Settings
```javascript
const config = {
  // Path to resume JSON file (relative to public/)
  resumeJson: "resume.json",
  
  // Hero background image (relative to public/ or full URL)
  landingBackground: "/images/your-background.jpg",
  
  // Default theme (must match a valid daisyUI theme)
  defaultTheme: "light", // Options: light, dark, cupcake, bumblebee, etc.
  
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

### 🖼️ Image Setup

#### Required Images
1. **Profile Image**: `public/images/profile.jpg` (500x500px recommended)
2. **Background Image**: `public/images/your-background.jpg` (1920x1080px recommended)
3. **Favicon**: `public/images/favicon/` (generated from favicon.ico)

#### Project Images
Add project screenshots to `public/images/projects/`:
- Use consistent aspect ratios (16:9 recommended)
- Optimize images for web (WebP format preferred)

#### Certification Badges
Add certification badges to `public/images/certs/`:
- PNG format with transparent backgrounds
- Square aspect ratio (200x200px recommended)

## 🛠️ Development

### Project Structure
```
powrstack-folio/
├── src/
│   ├── app/
│   │   ├── globals.css           # Global styles
│   │   ├── layout.js             # Root layout
│   │   ├── page.js               # Home page
│   │   ├── blog/
│   │   │   └── page.js           # Blog page
│   │   └── api/
│   │       └── blog/             # Blog API routes
│   ├── components/
│   │   ├── Hero.js               # Hero section
│   │   ├── BlogCard.js           # Blog post card
│   │   ├── BlogGrid.js           # Blog posts grid
│   │   ├── ContactForm.js        # Contact form
│   │   └── [other components]
│   ├── lib/
│   │   ├── resumeLoader.js       # Resume data loader
│   │   ├── blogAdapter.js        # Blog sources adapter
│   │   ├── blogLoader.js         # Blog data loader
│   │   └── fontawesome.js        # FontAwesome config
│   └── masterConfig.js           # Main configuration
├── public/
│   ├── resume.json               # Your resume data
│   └── images/                   # Your images
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

#### Blog Posts Not Loading
1. Check your username in `masterConfig.js`
2. Verify the blog source is enabled
3. Check browser console for API errors

#### Images Not Displaying
1. Ensure images are in the `public/images/` folder
2. Check file paths in `resume.json`
3. Verify image formats (JPG, PNG, WebP)

#### Theme Not Working
1. Check theme name in `masterConfig.js`
2. Ensure it matches a valid daisyUI theme
3. Clear browser cache

#### Build Errors
1. Run `pnpm lint` to check for code issues
2. Verify all required dependencies are installed
3. Check Node.js version compatibility

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

## 📞 Contact

For questions or support:
- GitHub Issues: [Create an issue](https://github.com/your-username/powrstack-folio/issues)
- Email: your.email@example.com

---

**Happy coding! 🚀**
