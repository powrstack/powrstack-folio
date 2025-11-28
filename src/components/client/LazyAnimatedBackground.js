'use client';

import dynamic from 'next/dynamic';

// Aggressively lazy-load AnimatedBackground - pure visual, not critical
const AnimatedBackground = dynamic(() => import('../ui/AnimatedBackground'), {
  ssr: false,
  loading: () => null // No loading state needed
});

export default function LazyAnimatedBackground(props) {
  return <AnimatedBackground {...props} />;
}
