import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import config from '../../../masterConfig';
import { logger } from '../../../lib/logger';

// Get blog configuration
const blogConfig = config.blog;

/**
 * GET /api/blog - Fetch blog posts from configured sources
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || blogConfig.primarySource;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const username = searchParams.get('username');

    // Validate source
    if (!blogConfig.sources[source] || !blogConfig.sources[source].enabled) {
      return NextResponse.json(
        { error: `Blog source '${source}' is not enabled or configured` },
        { status: 400 }
      );
    }

    const sourceConfig = blogConfig.sources[source];
    let posts = [];

    switch (source) {
      case 'dev':
        posts = await fetchDevToPosts(sourceConfig, limit, username);
        break;
      case 'hashnode':
        posts = await fetchHashnodePosts(sourceConfig, limit, username);
        break;
      case 'medium':
        posts = await fetchMediumPosts(sourceConfig, limit, username);
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported blog source: ${source}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      posts,
      source,
      total: posts.length,
      limit
    });

  } catch (error) {
    logger.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

/**
 * Fetch posts from Dev.to with caching
 */
const fetchDevToPosts = unstable_cache(
  async (config, limit, username) => {
    const targetUsername = username || config.username;
    const url = targetUsername 
      ? `${config.apiUrl}?username=${targetUsername}&per_page=${limit}`
      : `${config.apiUrl}?per_page=${limit}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PowrStack-Folio/1.0',
        'Accept': 'application/json',
      },
      next: {
        revalidate: 900 // 15 minutes
      }
    });

    if (!response.ok) {
      throw new Error(`Dev.to API error: ${response.status} ${response.statusText}`);
    }

    const posts = await response.json();
    
    return posts.map(post => ({
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
        reactions: post.public_reactions_count || 0,
        comments: post.comments_count || 0,
        views: post.page_views_count || 0
      },
      source: 'dev.to'
    }));
  },
  ['dev-to-posts'],
  {
    revalidate: 900, // 15 minutes
    tags: ['blog', 'dev-to']
  }
);

/**
 * Fetch posts from Hashnode
 */
async function fetchHashnodePosts(config, limit, username) {
  const targetUsername = username || config.username;
  
  const query = `
    query GetUserPosts($username: String!, $page: Int!, $pageSize: Int!) {
      user(username: $username) {
        posts(page: $page, pageSize: $pageSize) {
          edges {
            node {
              id
              title
              brief
              slug
              url
              coverImage {
                url
              }
              publishedAt
              readTimeInMinutes
              tags {
                name
                slug
              }
              author {
                name
                username
                profilePicture
              }
              reactionCount
              responseCount
              views
            }
          }
        }
      }
    }
  `;

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PowrStack-Folio/1.0',
    },
    body: JSON.stringify({
      query,
      variables: {
        username: targetUsername,
        page: 1,
        pageSize: limit
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Hashnode GraphQL error: ${data.errors[0]?.message}`);
  }

  const posts = data.data?.user?.posts?.edges || [];
  
  return posts.map(edge => {
    const post = edge.node;
    return {
      id: post.id,
      title: post.title,
      description: post.brief,
      content: null, // Content not available in list query
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
        reactions: post.reactionCount || 0,
        comments: post.responseCount || 0,
        views: post.views || 0
      },
      source: 'hashnode'
    };
  });
}

/**
 * Fetch posts from Medium (placeholder implementation)
 * Note: Medium doesn't have a public API, so this would require RSS parsing
 */
async function fetchMediumPosts(config, limit, username) {
  // This is a placeholder - Medium RSS parsing would need to be implemented
  // using a library like 'rss-parser' or similar
  throw new Error('Medium integration not yet implemented. Please use RSS parsing.');
}
