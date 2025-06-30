# Configurable Background System

## Overview
The Hero section now supports configurable backgrounds through the `masterConfig.js` file. You can easily switch between animated backgrounds, static images, or a hybrid combination.

## Configuration Options

### Background Types

#### 1. Animated Background Only (Default)
```javascript
// src/masterConfig.js
background: {
  type: 'animated', // Pure animated background
  animated: {
    enabled: true,
    intensity: 'normal', // 'subtle' | 'normal' | 'intense'
  }
}
```

#### 2. Static Image Background
```javascript
// src/masterConfig.js
background: {
  type: 'image', // Static image only
  image: {
    src: "/images/your-background.jpg",
    overlay: true, // Add dark overlay for text readability
    overlayOpacity: 0.3, // 0.0 - 1.0
    quality: 85, // Image quality 1-100
    priority: true, // Preload for better LCP
  }
}
```

#### 3. Hybrid Background (Image + Animated)
```javascript
// src/masterConfig.js
background: {
  type: 'hybrid', // Both image and animated elements
  image: {
    src: "/images/your-background.jpg",
    overlay: true,
    overlayOpacity: 0.4, // Slightly more overlay for layered effect
    quality: 85,
    priority: true,
  },
  animated: {
    enabled: true,
    intensity: 'subtle', // Use subtle for better layering
  }
}
```

## Intensity Levels

### Subtle
- Lower opacity animated elements
- Minimal visual distraction
- Best for hybrid backgrounds or professional look

### Normal (Default)
- Balanced animated elements
- Good visibility without being overwhelming
- Ideal for pure animated backgrounds

### Intense
- Higher opacity and more prominent animations
- Bold visual impact
- Best for creative/artistic portfolios

## Quick Configuration Examples

### Example 1: Professional Look with Static Image
```javascript
background: {
  type: 'image',
  image: {
    src: "/images/professional-bg.jpg",
    overlay: true,
    overlayOpacity: 0.5,
    quality: 90,
    priority: true,
  }
}
```

### Example 2: Creative Portfolio with Intense Animation
```javascript
background: {
  type: 'animated',
  animated: {
    enabled: true,
    intensity: 'intense',
  }
}
```

### Example 3: Layered Design with Subtle Effects
```javascript
background: {
  type: 'hybrid',
  image: {
    src: "/images/subtle-texture.jpg",
    overlay: true,
    overlayOpacity: 0.2,
    quality: 80,
    priority: true,
  },
  animated: {
    enabled: true,
    intensity: 'subtle',
  }
}
```

### Example 4: Minimal Clean Design
```javascript
background: {
  type: 'animated',
  animated: {
    enabled: true,
    intensity: 'subtle',
  }
}
```

## Performance Considerations

### Image Backgrounds
- **Automatically preloaded** when `type` is 'image' or 'hybrid'
- **Next.js optimization** applies (WebP conversion, responsive sizing)
- **Service worker caching** can be added if needed

### Animated Backgrounds
- **CSS-based animations** for optimal performance
- **No JavaScript dependencies** for animations
- **Theme-aware colors** that adapt to daisyUI themes

### Hybrid Backgrounds
- **Smart layering** ensures animated elements appear above the image
- **Configurable overlay** prevents text readability issues
- **Optimized for mobile** performance

## Image Requirements

### Recommended Specifications
- **Format**: JPG, PNG, WebP, or AVIF
- **Dimensions**: Minimum 1920x1080 (Full HD)
- **File Size**: Under 500KB (Next.js will optimize further)
- **Aspect Ratio**: 16:9 or wider for better coverage

### File Placement
Place your background images in the `/public/images/` directory:
```
public/
  images/
    your-background.jpg
    professional-bg.jpg
    texture.png
```

## How It Works

### 1. Configuration Reading
The Hero component reads the background configuration from `masterConfig.js` and determines which background type to render.

### 2. Conditional Rendering
Based on the configuration:
- **Image backgrounds** use Next.js `Image` component with optimization
- **Animated backgrounds** render CSS-based animations
- **Hybrid mode** layers both with proper z-indexing

### 3. Performance Optimization
- **Critical Resource Preloader** conditionally preloads images based on configuration
- **Smart layering** ensures optimal visual hierarchy
- **Responsive sizing** adapts to different screen sizes

## Migration Guide

### From Current Setup
Your current configuration uses animated background only:
```javascript
// Current (default)
background: {
  type: 'animated',
  animated: {
    enabled: true,
    intensity: 'normal',
  }
}
```

### To Add Static Image
Simply change the type and add image configuration:
```javascript
// Updated
background: {
  type: 'image', // or 'hybrid'
  image: {
    src: "/images/your-image.jpg",
    overlay: true,
    overlayOpacity: 0.3,
    quality: 85,
    priority: true,
  }
}
```

## Troubleshooting

### Image Not Loading
1. Check file path in `/public/images/`
2. Verify image format is supported
3. Ensure file size is reasonable (< 2MB)

### Performance Issues
1. Reduce image quality setting
2. Use 'subtle' intensity for animations
3. Consider 'animated' only for mobile

### Text Readability
1. Increase `overlayOpacity` value
2. Use darker overlay colors
3. Adjust text colors in your theme

## Browser Support
- **Modern browsers**: Full support for all features
- **Older browsers**: Graceful degradation to static backgrounds
- **Mobile devices**: Optimized performance and bandwidth usage

The system is designed to be flexible, performant, and easy to configure while maintaining excellent visual quality across all devices and browsers.
