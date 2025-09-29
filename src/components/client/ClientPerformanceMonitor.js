"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const PerformanceMonitor = dynamic(() => import('../performance/PerformanceMonitor'), { ssr: false, loading: () => null });

export default function ClientPerformanceMonitor(props) {
  return <PerformanceMonitor {...props} />;
}
