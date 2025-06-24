// masterConfig.js
// Centralized config for resume, background, and other site-wide settings

const config = {
  // Path to the resume JSON file (relative to public/)
  resumeJson: "resume.json",

  // Background image for the landing/home page (relative to public/ or full URL)
  landingBackground: "/images/image-1.jpg",

  // Default daisyUI theme (must match a valid daisyUI theme name)
  defaultTheme: "light", // Options: 'light', 'dark', 'cupcake', 'bumblebee', etc.

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

  // Deployment configuration
  deployment: {
    // Current deployment platform
    platform: "cloudflare", // Options: 'vercel', 'cloudflare', 'netlify', 'local'
    
    // Base URLs for different environments
    baseUrls: {
      development: "http://localhost:3000",
      production: {
        cloudflare: process.env.CF_PAGES_URL || process.env.CLOUDFLARE_PAGES_URL,
        vercel: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        netlify: process.env.DEPLOY_PRIME_URL || process.env.URL,
        custom: process.env.CUSTOM_BASE_URL
      }
    }
  },

  // Add more config options as needed
};

export default config;
