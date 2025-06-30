# Component Architecture Guide

This document outlines the organized component structure for maintainability and developer experience.

## 📁 Component Organization

```
src/components/
├── index.js                     # Main exports barrel file
├── Hero.js                      # Main landing component (root level)
├── ServiceWorkerRegistration.js # Service worker component (root level)
│
├── layout/                      # Layout & Navigation Components
│   ├── index.js                 # Layout exports
│   ├── Header.js                # Navigation header
│   └── Footer.js                # Site footer
│
├── ui/                          # Reusable UI Components
│   ├── index.js                 # UI exports
│   ├── AnimatedBackground.js    # Animated background effects
│   ├── TypingAnimation.js       # Text typing animation
│   └── ThemeSwitcher.js         # Theme selection component
│
├── blog/                        # Blog-Related Components
│   ├── index.js                 # Blog exports
│   ├── BlogCard.js              # Individual blog post card
│   ├── BlogContent.js           # Blog page main content
│   └── BlogGrid.js              # Blog posts grid layout
│
├── forms/                       # Form Components
│   ├── index.js                 # Form exports
│   └── ContactForm.js           # Contact form with validation
│
└── performance/                 # Performance & Optimization
    ├── index.js                 # Performance exports
    ├── PerformanceMonitor.js    # Real-time performance monitoring
    ├── PerformanceBudget.js     # Performance budget display
    └── CriticalResourcePreloader.js # Resource preloading optimization
```

## 🔗 Import Patterns

### ✅ Recommended Import Patterns

```javascript
// From main barrel file (best for external files)
import { Header, Footer } from '../components/layout';
import { BlogCard, BlogGrid } from '../components/blog';
import { PerformanceMonitor } from '../components/performance';

// From component-specific barrel (within same category)
import { BlogCard } from './';
import { Header } from './';

// Direct imports for main components
import Hero from '../components/Hero';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
```

### ❌ Avoid These Patterns

```javascript
// Don't skip the barrel files
import BlogCard from '../components/blog/BlogCard';
import Header from '../components/layout/Header';

// Don't import from wrong categories
import ContactForm from '../components/ContactForm'; // Should be: from '../components/forms'
```

## 📦 Component Categories

### **Layout Components** (`/layout/`)
Components that define the overall page structure and navigation.
- `Header.js` - Navigation, logo, theme switcher
- `Footer.js` - Site footer with links and copyright

### **UI Components** (`/ui/`)
Reusable interface elements and visual components.
- `AnimatedBackground.js` - Configurable animated background effects
- `TypingAnimation.js` - Text typing animation effect
- `ThemeSwitcher.js` - Theme selection dropdown

### **Blog Components** (`/blog/`)
Components specific to blog functionality.
- `BlogCard.js` - Individual blog post preview card
- `BlogContent.js` - Main blog page with posts grid
- `BlogGrid.js` - Responsive grid layout for blog posts

### **Form Components** (`/forms/`)
Form-related components with validation and interaction.
- `ContactForm.js` - Contact form with validation and submission

### **Performance Components** (`/performance/`)
Components for monitoring and optimizing performance.
- `PerformanceMonitor.js` - Real-time Web Vitals monitoring
- `PerformanceBudget.js` - Performance budget visualization
- `CriticalResourcePreloader.js` - Smart resource preloading

### **Root Level Components**
Core components that don't fit into categories or are used globally.
- `Hero.js` - Main landing page hero section
- `ServiceWorkerRegistration.js` - Service worker registration

## 🛠️ Adding New Components

### 1. Choose the Right Category
```javascript
// UI component example
src/components/ui/NewUIComponent.js

// Blog component example
src/components/blog/NewBlogComponent.js
```

### 2. Export from Category Index
```javascript
// In src/components/ui/index.js
export { default as NewUIComponent } from './NewUIComponent';
```

### 3. Add to Main Index (Optional)
```javascript
// In src/components/index.js - if needed globally
export * from './ui';
```

### 4. Follow Component Standards
```javascript
'use client'; // If client-side only

import { ComponentProps } from 'types'; // If using TypeScript

/**
 * Component description and purpose
 */
export default function ComponentName({ prop1, prop2 }) {
  // Component implementation
  return (
    <div className="component-styles">
      {/* Component content */}
    </div>
  );
}
```

## 🔄 Refactoring Guidelines

### Moving Components
1. Move component file to appropriate category folder
2. Update the category's `index.js` export
3. Update any direct imports in other files
4. Test all imports work correctly

### Category Changes
1. Evaluate if the component fits better in another category
2. Consider creating a new category if needed
3. Update documentation

## 📈 Benefits of This Structure

- **🔍 Discoverability**: Easy to find components by purpose
- **🧹 Maintainability**: Related components grouped together
- **🔄 Reusability**: Clear component responsibilities
- **🚀 Performance**: Easier to implement code splitting
- **👥 Team Collaboration**: Clear ownership and organization
- **📚 Documentation**: Self-documenting file structure

## 🏗️ Future Considerations

- Consider TypeScript interfaces for component categories
- Implement Storybook for component documentation
- Add component testing organized by category
- Create component generators for consistent structure
