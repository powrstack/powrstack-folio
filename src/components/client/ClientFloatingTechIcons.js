"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const FloatingTechIcons = dynamic(() => import('../ui/FloatingTechIcons'), { ssr: false, loading: () => null });

export default function ClientFloatingTechIcons(props) {
  return <FloatingTechIcons {...props} />;
}
