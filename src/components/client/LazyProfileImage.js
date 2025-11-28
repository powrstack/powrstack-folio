'use client';

import dynamic from 'next/dynamic';

// Lazy-load ProfileImage with skeleton
const ProfileImage = dynamic(() => import('../ui/ProfileImage'), {
  ssr: false,
  loading: () => (
    <div className="relative inline-block">
      <div className="avatar mb-4 lg:mb-8 animate-pulse">
        <div className="w-48 sm:w-56 md:w-64 lg:w-80 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-300">
        </div>
      </div>
    </div>
  )
});

export default function LazyProfileImage(props) {
  return <ProfileImage {...props} />;
}
