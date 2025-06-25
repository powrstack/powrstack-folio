'use client';

import { useEffect } from 'react';
import logger from '../lib/logger';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          logger.debug('SW registered: ', registration);
        })
        .catch((registrationError) => {
          logger.error('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return null;
}
