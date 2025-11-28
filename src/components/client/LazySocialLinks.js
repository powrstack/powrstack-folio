'use client';

import dynamic from 'next/dynamic';

// Lazy-load SocialLinks with skeleton
const SocialLinks = dynamic(() => import('../ui/SocialLinks'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center space-x-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="btn btn-circle btn-outline animate-pulse">
          <div className="w-5 h-5 bg-base-300 rounded-full"></div>
        </div>
      ))}
    </div>
  )
});

export default function LazySocialLinks(props) {
  return <SocialLinks {...props} />;
}
