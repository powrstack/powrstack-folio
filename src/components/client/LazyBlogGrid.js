'use client';

import dynamic from 'next/dynamic';

// Aggressively lazy-load BlogGrid
const BlogGrid = dynamic(() => import('../blog/BlogGrid'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
            <div className="h-48 bg-base-300"></div>
            <div className="card-body">
              <div className="h-6 bg-base-300 rounded mb-2"></div>
              <div className="h-4 bg-base-300 rounded mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
});

export default function LazyBlogGrid(props) {
  return <BlogGrid {...props} />;
}
