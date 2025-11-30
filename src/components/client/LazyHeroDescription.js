'use client';

import dynamic from 'next/dynamic';

const HeroDescription = dynamic(() => import('../ui/HeroDescription'), {
  ssr: false,
  loading: () => (
    <div className="hidden lg:block mb-8 animate-pulse">
      <div className="h-4 bg-base-300 rounded w-full mb-3"></div>
      <div className="h-4 bg-base-300 rounded w-5/6 mb-3"></div>
      <div className="h-4 bg-base-300 rounded w-4/6"></div>
    </div>
  ),
});

export default HeroDescription;
