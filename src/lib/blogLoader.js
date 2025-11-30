import { unstable_cache } from 'next/cache';
import config from '../masterConfig';
import { BlogService } from './blogAdapter';
import { logger } from './logger.js';

/**
 * Blog loader utility to fetch and cache blog posts
 */
class BlogLoader {
  constructor() {
    this.blogService = new BlogService(config.blog);
    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Get cache key for posts
   */
  getCacheKey(source, limit) {
    return `posts_${source || 'default'}_${limit}`;
  }

  /**
   * Check if cache is valid
   */
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.cacheExpiry;
  }

  /**
   * Get posts from cache or fetch new ones
   */
  async getPosts(limit = 10, source = null, useCache = true) {
    const cacheKey = this.getCacheKey(source, limit);
    
    // Return cached data if valid and caching is enabled
    if (useCache && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      // Fetch new posts
      const posts = await this.blogService.fetchPosts(limit, source);
      
      // Cache the results
      if (useCache) {
        this.cache.set(cacheKey, {
          data: posts,
          timestamp: Date.now()
        });
      }

      return posts;
    } catch (error) {
      logger.error('Error loading blog posts:', error);
      
      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        logger.warn('Returning expired cache data due to fetch error');
        return this.cache.get(cacheKey).data;
      }
      
      return [];
    }
  }

  /**
   * Get a single post by ID
   */
  async getPost(id, source = null) {
    const cacheKey = `post_${source || 'default'}_${id}`;
    
    // Return cached data if valid
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      const post = await this.blogService.fetchPost(id, source);
      
      // Cache the result
      if (post) {
        this.cache.set(cacheKey, {
          data: post,
          timestamp: Date.now()
        });
      }

      return post;
    } catch (error) {
      logger.error('Error loading blog post:', error);
      
      // Return cached data if available
      if (this.cache.has(cacheKey)) {
        logger.warn('Returning expired cache data due to fetch error');
        return this.cache.get(cacheKey).data;
      }
      
      return null;
    }
  }

  /**
   * Get posts from all sources
   */
  async getAllPosts(limit = 10, useCache = true) {
    const cacheKey = `all_posts_${limit}`;
    
    // Return cached data if valid and caching is enabled
    if (useCache && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      const posts = await this.blogService.fetchAllPosts(limit);
      
      // Cache the results
      if (useCache) {
        this.cache.set(cacheKey, {
          data: posts,
          timestamp: Date.now()
        });
      }

      return posts;
    } catch (error) {
      logger.error('Error loading all blog posts:', error);
      
      // Return cached data if available
      if (this.cache.has(cacheKey)) {
        logger.warn('Returning expired cache data due to fetch error');
        return this.cache.get(cacheKey).data;
      }
      
      return [];
    }
  }

  /**
   * Get featured posts (first N posts)
   */
  async getFeaturedPosts(limit = 3, source = null) {
    const posts = await this.getPosts(limit, source);
    return posts.slice(0, limit);
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit = 5, source = null) {
    const posts = await this.getPosts(limit * 2, source); // Fetch more to have options
    return posts
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, limit);
  }

  /**
   * Search posts by title or tags
   */
  async searchPosts(query, limit = 10, source = null) {
    const posts = await this.getPosts(limit * 2, source); // Fetch more for better search results
    const searchTerm = query.toLowerCase();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ).slice(0, limit);
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag, limit = 10, source = null) {
    const posts = await this.getPosts(limit * 2, source);
    const tagLower = tag.toLowerCase();
    
    return posts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase() === tagLower)
    ).slice(0, limit);
  }

  /**
   * Get available blog sources
   */
  getAvailableSources() {
    return this.blogService.getAvailableSources();
  }

  /**
   * Get blog configuration
   */
  getConfig() {
    return config.blog;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const stats = {
      totalEntries: this.cache.size,
      entries: []
    };

    for (const [key, value] of this.cache.entries()) {
      stats.entries.push({
        key,
        timestamp: value.timestamp,
        age: Date.now() - value.timestamp,
        expired: !this.isCacheValid(key)
      });
    }

    return stats;
  }
}

// Create singleton instance
const blogLoader = new BlogLoader();

// Cached version of getAllPosts for server-side use with Next.js cache
export const getCachedBlogPosts = unstable_cache(
  async (limit = 20) => {
    try {
      return await blogLoader.getAllPosts(limit, false); // Don't use internal cache
    } catch (error) {
      logger.error('Error in getCachedBlogPosts:', error);
      return [];
    }
  },
  ['blog-posts'], // Cache key
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['blog']
  }
);

export default blogLoader;

// Export individual functions for convenience
export const {
  getPosts,
  getPost,
  getAllPosts,
  getFeaturedPosts,
  getRecentPosts,
  searchPosts,
  getPostsByTag,
  getAvailableSources,
  getConfig,
  clearCache,
  getCacheStats
} = blogLoader;
