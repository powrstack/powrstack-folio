'use client';

import dynamic from 'next/dynamic';

// Lazy-load CertificationBadges with skeleton
const CertificationBadges = dynamic(() => import('../ui/CertificationBadges'), {
  ssr: false,
  loading: () => (
    <div className="w-full">
      <div className="h-6 bg-base-300 rounded w-32 mx-auto mb-4 animate-pulse"></div>
      <div className="flex flex-wrap justify-center gap-3 max-w-sm lg:max-w-md mx-auto">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-12 h-12 lg:w-16 lg:h-16 bg-base-300 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  )
});

export default function LazyCertificationBadges(props) {
  // Don't render if no certifications
  if (!props.certifications || props.certifications.length === 0) return null;
  
  return <CertificationBadges {...props} />;
}
