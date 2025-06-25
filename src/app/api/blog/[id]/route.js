import { NextResponse } from 'next/server';
import config from '../../../../masterConfig';
import { logger } from '../../../../lib/logger';

// Get blog configuration
const blogConfig = config.blog;

/**
 * GET /api/blog/[id] - Fetch a single blog post by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || blogConfig.primarySource;

    // Validate source
    if (!blogConfig.sources[source] || !blogConfig.sources[source].enabled) {
      return NextResponse.json(
        { error: `Blog source '${source}' is not enabled or configured` },
        { status: 400 }
      );
    }

    const sourceConfig = blogConfig.sources[source];
    let post = null;

    switch (source) {
      case 'dev':
        post = await fetchDevToPost(sourceConfig, id);
        break;
      case 'hashnode':
        post = await fetchHashnodePost(sourceConfig, id);
        break;
      case 'medium':
        post = await fetchMediumPost(sourceConfig, id);
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported blog source: ${source}` },
          { status: 400 }
        );
    }

    if (!post) {
      return NextResponse.json(
        { error: `Post with ID '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ post, source });

  } catch (error) {
    logger.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

/**
 * Fetch a single post from Dev.to
 */
async function fetchDevToPost(config, id) {
  const response = await fetch(`${config.apiUrl}/${id}`, {
    headers: {
      'User-Agent': 'PowrStack-Folio/1.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Dev.to API error: ${response.status} ${response.statusText}`);
  }

  const post = await response.json();
  
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
      reactions: post.public_reactions_count || 0,
      comments: post.comments_count || 0,
      views: post.page_views_count || 0
    },
    source: 'dev.to'
  };
}

/**
 * Fetch a single post from Hashnode
 */
async function fetchHashnodePost(config, id) {
  const query = `
    query GetPost($id: String!) {
      post(id: $id) {
        id
        title
        brief
        content {
          html
          markdown
        }
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
  `;

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PowrStack-Folio/1.0',
    },
    body: JSON.stringify({
      query,
      variables: { id }
    })
  });

  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Hashnode GraphQL error: ${data.errors[0]?.message}`);
  }

  const post = data.data?.post;
  
  if (!post) {
    return null;
  }

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
      reactions: post.reactionCount || 0,
      comments: post.responseCount || 0,
      views: post.views || 0
    },
    source: 'hashnode'
  };
}

/**
 * Fetch a single post from Medium (placeholder implementation)
 */
async function fetchMediumPost(config, id) {
  // This is a placeholder - Medium doesn't have a public API
  throw new Error('Medium integration not yet implemented. Please use RSS parsing.');
}
