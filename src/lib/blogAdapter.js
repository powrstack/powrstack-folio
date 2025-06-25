// Blog adapters for different sources (Dev.to, Hashnode, Medium, etc.)
import { logger } from './logger.js';

/**
 * Base blog adapter interface
 */
class BlogAdapter {
  constructor(config) {
    this.config = config;
  }

  async fetchPosts(limit = 10) {
    throw new Error('fetchPosts method must be implemented');
  }

  async fetchPost(id) {
    throw new Error('fetchPost method must be implemented');
  }

  formatPost(post) {
    throw new Error('formatPost method must be implemented');
  }
}

/**
 * Dev.to blog adapter
 */
class DevToBlogAdapter extends BlogAdapter {
  constructor(config) {
    super(config);
    this.baseUrl = config.apiUrl || 'https://dev.to/api/articles';
  }

  async fetchPosts(limit = 10) {
    try {
      // Use the API route to avoid CORS issues
      const url = `/api/blog?source=dev&limit=${limit}${this.config.username ? `&username=${this.config.username}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      logger.error('Error fetching Dev.to posts:', error);
      return [];
    }
  }

  async fetchPost(id) {
    try {
      const response = await fetch(`/api/blog/${id}?source=dev`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const data = await response.json();
      return data.post || null;
    } catch (error) {
      logger.error('Error fetching Dev.to post:', error);
      return null;
    }
  }

  formatPost(post) {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      content: post.body_html || post.body_markdown,
      slug: post.slug,
      url: post.url,
      canonicalUrl: post.canonical_url,
      coverImage: post.cover_image || post.social_image,
      publishedAt: new Date(post.published_at),
      readingTimeMinutes: post.reading_time_minutes,
      tags: post.tag_list || [],
      author: {
        name: post.user?.name,
        username: post.user?.username,
        profileImage: post.user?.profile_image,
        url: `https://dev.to/${post.user?.username}`
      },
      stats: {
        reactions: post.public_reactions_count,
        comments: post.comments_count,
        views: post.page_views_count
      },
      source: 'dev.to'
    };
  }
}

/**
 * Hashnode blog adapter
 */
class HashnodeBlogAdapter extends BlogAdapter {
  constructor(config) {
    super(config);
    this.baseUrl = config.apiUrl || 'https://gql.hashnode.com/';
  }

  async fetchPosts(limit = 10) {
    try {
      // Use the API route to avoid CORS issues
      const url = `/api/blog?source=hashnode&limit=${limit}${this.config.username ? `&username=${this.config.username}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      logger.error('Error fetching Hashnode posts:', error);
      return [];
    }
  }

  async fetchPost(id) {
    try {
      const response = await fetch(`/api/blog/${id}?source=hashnode`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const data = await response.json();
      return data.post || null;
    } catch (error) {
      logger.error('Error fetching Hashnode post:', error);
      return null;
    }
  }

  formatPost(post) {
    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      description: post.brief,
      content: post.content?.html || post.content?.markdown,
      slug: post.slug,
      url: post.url,
      canonicalUrl: post.url,
      coverImage: post.coverImage?.url,
      publishedAt: new Date(post.publishedAt),
      readingTimeMinutes: post.readTimeInMinutes,
      tags: post.tags?.map(tag => tag.name) || [],
      author: {
        name: post.author?.name,
        username: post.author?.username,
        profileImage: post.author?.profilePicture,
        url: `https://hashnode.com/@${post.author?.username}`
      },
      stats: {
        reactions: post.reactionCount,
        comments: post.responseCount,
        views: post.views
      },
      source: 'hashnode'
    };
  }
}

/**
 * Medium blog adapter (RSS-based)
 */
class MediumBlogAdapter extends BlogAdapter {
  constructor(config) {
    super(config);
    this.rssUrl = config.rssUrl;
  }

  async fetchPosts(limit = 10) {
    try {
      // Use the API route for Medium RSS parsing
      const url = `/api/blog?source=medium&limit=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      logger.error('Error fetching Medium posts:', error);
      return [];
    }
  }

  async fetchPost(id) {
    try {
      const response = await fetch(`/api/blog/${id}?source=medium`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const data = await response.json();
      return data.post || null;
    } catch (error) {
      logger.error('Error fetching Medium post:', error);
      return null;
    }
  }

  formatPost(post) {
    return {
      id: post.id || post.guid,
      title: post.title,
      description: post.description || post.contentSnippet,
      content: post.content,
      slug: post.slug || this.generateSlug(post.title),
      url: post.link,
      canonicalUrl: post.link,
      coverImage: post.thumbnail,
      publishedAt: new Date(post.pubDate),
      readingTimeMinutes: this.estimateReadingTime(post.content),
      tags: post.categories || [],
      author: {
        name: post.creator || this.config.username,
        username: this.config.username,
        profileImage: null,
        url: this.config.profileUrl
      },
      stats: {
        reactions: 0,
        comments: 0,
        views: 0
      },
      source: 'medium'
    };
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  estimateReadingTime(content) {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

/**
 * Blog adapter factory
 */
export class BlogAdapterFactory {
  static create(source, config) {
    switch (source.toLowerCase()) {
      case 'dev':
      case 'dev.to':
        return new DevToBlogAdapter(config);
      case 'hashnode':
        return new HashnodeBlogAdapter(config);
      case 'medium':
        return new MediumBlogAdapter(config);
      default:
        throw new Error(`Unsupported blog source: ${source}`);
    }
  }
}

/**
 * Blog service for managing multiple sources
 */
export class BlogService {
  constructor(config) {
    this.config = config;
    this.adapters = new Map();
    this.initializeAdapters();
  }

  initializeAdapters() {
    Object.entries(this.config.sources).forEach(([source, sourceConfig]) => {
      if (sourceConfig.enabled) {
        try {
          const adapter = BlogAdapterFactory.create(source, sourceConfig);
          this.adapters.set(source, adapter);
        } catch (error) {
          logger.error(`Failed to initialize ${source} adapter:`, error);
        }
      }
    });
  }

  async fetchPosts(limit = 10, source = null) {
    const targetSource = source || this.config.primarySource;
    const adapter = this.adapters.get(targetSource);
    
    if (!adapter) {
      logger.error(`No adapter found for source: ${targetSource}`);
      return [];
    }

    return await adapter.fetchPosts(limit);
  }

  async fetchPost(id, source = null) {
    const targetSource = source || this.config.primarySource;
    const adapter = this.adapters.get(targetSource);
    
    if (!adapter) {
      logger.error(`No adapter found for source: ${targetSource}`);
      return null;
    }

    return await adapter.fetchPost(id);
  }

  async fetchAllPosts(limit = 10) {
    const allPosts = [];
    
    for (const [source, adapter] of this.adapters.entries()) {
      try {
        const posts = await adapter.fetchPosts(limit);
        allPosts.push(...posts);
      } catch (error) {
        logger.error(`Error fetching posts from ${source}:`, error);
      }
    }

    // Sort by publish date (newest first)
    return allPosts.sort((a, b) => b.publishedAt - a.publishedAt);
  }

  getAvailableSources() {
    return Array.from(this.adapters.keys());
  }
}

export default BlogService;
