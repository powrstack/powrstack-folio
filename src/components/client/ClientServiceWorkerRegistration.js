"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const ServiceWorkerRegistration = dynamic(() => import('../ServiceWorkerRegistration'), { ssr: false, loading: () => null });

export default function ClientServiceWorkerRegistration(props) {
  return <ServiceWorkerRegistration {...props} />;
}
