"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const PerformanceBudget = dynamic(() => import('../performance/PerformanceBudget'), { ssr: false, loading: () => null });

export default function ClientPerformanceBudget(props) {
  return <PerformanceBudget {...props} />;
}
