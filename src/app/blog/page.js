import { Suspense } from 'react';
import { BlogContent } from '../../components/blog';
import { getCachedBlogPosts } from '../../lib/blogLoader';
import blogLoader from '../../lib/blogLoader';

export const metadata = {
  title: 'Blog & Articles | Portfolio',
  description: 'Insights, tutorials, and thoughts on software development, technology, and more.',
  openGraph: {
    title: 'Blog & Articles',
    description: 'Insights, tutorials, and thoughts on software development',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

async function loadBlogPosts() {
  try {
    // Use cached version for server-side rendering
    const posts = await getCachedBlogPosts(20);
    return posts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await loadBlogPosts();
  const config = blogLoader.getConfig();
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    }>
      <BlogContent initialPosts={posts} config={config} />
    </Suspense>
  );
}
