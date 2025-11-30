'use client';

import dynamic from 'next/dynamic';

const HeroCTA = dynamic(() => import('../ui/HeroCTA'), {
  ssr: false,
  loading: () => (
    <div className="hidden lg:flex flex-row gap-4 justify-start animate-pulse">
      <div className="h-12 w-40 bg-base-300 rounded-lg"></div>
      <div className="h-12 w-40 bg-base-300 rounded-lg"></div>
    </div>
  ),
});

export default HeroCTA;
