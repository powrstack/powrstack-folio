'use client';

import dynamic from 'next/dynamic';

// Aggressively lazy-load FloatingTechIcons - pure decoration
const FloatingTechIcons = dynamic(() => import('../ui/FloatingTechIcons'), {
  ssr: false,
  loading: () => null // No loading state - it's decorative
});

export default function LazyFloatingTechIcons(props) {
  // Don't render if no skills
  if (!props.technicalSkills || props.technicalSkills.length === 0) return null;
  
  return <FloatingTechIcons {...props} />;
}
