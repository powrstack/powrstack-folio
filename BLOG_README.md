# Blog Integration Documentation

This portfolio supports fetching and displaying blog posts from multiple sources like Dev.to, Hashnode, and Medium.

## Configuration

Blog settings are configured in `src/masterConfig.js` under the `blog` object:

```javascript
blog: {
  // Primary blog source (dev, hashnode, medium, etc.)
  primarySource: "dev",
  
  // Blog source configurations
  sources: {
    dev: {
      enabled: true,
      username: "your_dev_username", // Replace with your Dev.to username
      apiUrl: "https://dev.to/api/articles",
      rssUrl: "https://dev.to/feed/your_dev_username",
      profileUrl: "https://dev.to/your_dev_username"
    },
    // ... other sources
  },
  
  // Display settings
  postsPerPage: 9,
  showFeaturedPost: true,
  showReadTime: true,
  showTags: true,
  showPublishDate: true
}
```

## Supported Blog Sources

### 1. Dev.to
- **Status**: ✅ Fully implemented
- **Features**: Posts, reactions, comments, reading time, tags
- **Setup**: Just add your Dev.to username to the config

### 2. Hashnode
- **Status**: ✅ Implemented (disabled by default)
- **Features**: Posts, reactions, comments, reading time, tags
- **Setup**: Add your Hashnode username and publication ID

### 3. Medium
- **Status**: ⚠️ Placeholder (RSS parsing needed)
- **Features**: Would support posts via RSS feed parsing
- **Setup**: Requires RSS parsing implementation

## Features

### Blog Page (`/blog`)
- Displays posts from all enabled sources
- Featured post section
- Advanced filtering and search
- Pagination
- Responsive design with daisyUI components

### Components
- **BlogCard**: Individual post display component
- **BlogGrid**: Grid layout with filtering and pagination
- **BlogLoader**: Caching and data management

### API Routes
- `GET /api/blog` - Fetch posts from configured sources
- `GET /api/blog/[id]` - Fetch individual post by ID

### Caching
- Built-in caching system (15-minute expiry)
- Fallback to cached data on API failures
- Manual cache clearing functionality

## Customization

### Adding New Blog Sources
1. Update `masterConfig.js` with new source configuration
2. Add adapter in `src/lib/blogAdapter.js`
3. Add API handling in `src/app/api/blog/route.js`

### Styling
- Uses daisyUI components for consistent theming
- Custom CSS animations in `globals.css`
- Responsive design with Tailwind CSS

### Display Options
- Configure posts per page
- Toggle featured post display
- Show/hide metadata (reading time, tags, etc.)
- Filter by tags and sources

## Getting Started

1. **Configure your blog sources** in `src/masterConfig.js`
2. **Replace placeholder usernames** with your actual usernames
3. **Enable/disable sources** as needed
4. **Customize display settings** to match your preferences

## Example Dev.to Configuration

```javascript
dev: {
  enabled: true,
  username: "ben", // Your Dev.to username
  apiUrl: "https://dev.to/api/articles",
  rssUrl: "https://dev.to/feed/ben",
  profileUrl: "https://dev.to/ben"
}
```

## Error Handling

The blog system includes comprehensive error handling:
- Graceful fallbacks when APIs are unavailable
- Cached data fallback on network errors
- User-friendly error messages
- Loading states and skeleton screens

## Performance

- Client-side caching reduces API calls
- Lazy loading for images
- Optimized with Next.js Image component
- Responsive images with proper sizing

## SEO

- Proper meta tags for blog posts
- Structured data for better search visibility
- Canonical URLs to original blog posts
- Social sharing integration
