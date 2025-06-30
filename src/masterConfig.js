// masterConfig.js
// Centralized config for resume, background, and other site-wide settings

const config = {
  // Path to the resume JSON file (relative to public/ for local, or full URL for remote)
  resumeJson: "resume.json",
  
  // Remote resume URL (GitHub raw URL)
  resumeUrl: "https://raw.githubusercontent.com/powrstack/powrstack-folio/refs/heads/main/public/resume.json",
  // resumeUrl: "https://raw.githubusercontent.com/aburaihan-dev/aburaihan-dev.github.io/refs/heads/dev/src/resume.json",

  // Background configuration
  background: {
    // Background type: 'animated', 'image', or 'hybrid'
    type: 'animated', // 'animated' | 'image' | 'hybrid'
    
    // Static image background (only used when type is 'image' or 'hybrid')
    image: {
      src: "/images/image-1.jpg", // Path to background image
      overlay: true, // Add dark overlay for better text readability
      overlayOpacity: 0.3, // Overlay opacity (0.0 - 1.0)
      quality: 85, // Image quality (1-100)
      priority: true, // Preload image for faster LCP
    },
    
    // Animated background settings (used when type is 'animated' or 'hybrid')
    animated: {
      enabled: true, // Enable/disable animated elements
      intensity: 'intense', // 'subtle' | 'normal' | 'intense'
    }
  },

  // Default daisyUI theme (must match a valid daisyUI theme name)
  defaultTheme: "corporate", // Options: 'light', 'dark', 'cupcake', 'bumblebee', etc.

  // Enable random theme on load
  enableRandomTheme: false, // Set to true to enable random theme on each page load

  // Blog configuration
  blog: {
    // Primary blog source (dev, hashnode, medium, etc.)
    primarySource: "dev",
    
    // Blog source configurations
    sources: {
      dev: {
        enabled: true,
        username: "msrabon", // Replace with your Dev.to username - using "ben" as example
        apiUrl: "https://dev.to/api/articles",
        rssUrl: "https://dev.to/feed/msrabon", // Replace with your Dev.to RSS feed
        profileUrl: "https://dev.to/msrabon" // Replace with your Dev.to profile URL
      },
      hashnode: {
        enabled: false,
        username: "your_hashnode_username",
        publicationId: "your_publication_id",
        apiUrl: "https://gql.hashnode.com/",
        profileUrl: "https://your_username.hashnode.dev"
      },
      medium: {
        enabled: false,
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
  },

  // Performance monitoring configuration
  performance: {
    // Enable/disable performance monitoring components
    // Set enableMonitor to false to completely disable performance monitoring overlay
    // Set enableBudget to false to disable performance budget display
    enableMonitor: false, // PerformanceMonitor component (real-time Web Vitals)
    enableBudget: false,  // PerformanceBudget component (visual budget indicators)
    
    // Performance thresholds (in milliseconds)
    // These values are used for budget calculations and warnings
    thresholds: {
      lcp: 1400,  // Largest Contentful Paint target (ms)
      fid: 100,   // First Input Delay target (ms)
      cls: 0.1    // Cumulative Layout Shift target (score)
    }
  },

  // Add more config options as needed
};

export default config;
