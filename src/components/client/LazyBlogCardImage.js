'use client';

import dynamic from 'next/dynamic';

const BlogCardImage = dynamic(() => import('./BlogCardImage'), {
  ssr: true,
  loading: () => (
    <div className="h-48 bg-base-300 animate-pulse"></div>
  ),
});

export default BlogCardImage;
