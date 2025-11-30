'use client';

import dynamic from 'next/dynamic';

const BlogGridFilters = dynamic(() => import('../blog/BlogGridFilters'), {
  ssr: false,
  loading: () => (
    <div className="mb-8 animate-pulse">
      <div className="h-10 bg-base-300 rounded w-full mb-4"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-base-300 rounded w-24"></div>
        <div className="h-8 bg-base-300 rounded w-24"></div>
        <div className="h-8 bg-base-300 rounded w-24"></div>
      </div>
    </div>
  ),
});

export default BlogGridFilters;
