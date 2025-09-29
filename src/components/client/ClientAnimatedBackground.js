"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const AnimatedBackground = dynamic(() => import('../ui/AnimatedBackground'), { ssr: false, loading: () => null });

export default function ClientAnimatedBackground(props) {
  return <AnimatedBackground {...props} />;
}
