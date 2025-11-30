'use client';

import dynamic from 'next/dynamic';

const HeaderActions = dynamic(() => import('../layout/HeaderActions'), {
  ssr: false,
  loading: () => (
    <div className="hidden lg:flex space-x-2">
      <div className="h-10 w-32 bg-base-300 rounded animate-pulse"></div>
      <div className="h-10 w-28 bg-base-300 rounded animate-pulse"></div>
    </div>
  ),
});

export default HeaderActions;
