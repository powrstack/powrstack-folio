// src/components/CriticalResourcePreloader.js
'use client';

import { useEffect } from 'react';
import logger from '../lib/logger';

export default function CriticalResourcePreloader({ resumeData }) {
  useEffect(() => {
    // Preload critical images immediately for sub-1.4s LCP
    const criticalImages = [
      resumeData?.personalInfo?.profileImage,
      '/images/image-1.jpg', // Hero background
      '/images/profile.jpg', // Fallback profile image
    ].filter(Boolean);

    criticalImages.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      
      // Add performance tracking for LCP candidates
      if (index === 0) {
        link.onload = () => {
          performance.mark(`lcp-candidate-loaded-${Date.now()}`);
        };
      }
      
      document.head.appendChild(link);
    });

    // Preload critical fonts with immediate priority
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.href = 'https://fonts.gstatic.com/s/geist/v1/UcC73FwrK3iLTeHuS_fjRNFu2bJGDA.woff2';
    fontLink.crossOrigin = 'anonymous';
    fontLink.fetchPriority = 'high';
    document.head.appendChild(fontLink);

    // Preload resume data if not already loaded
    const resumeLink = document.createElement('link');
    resumeLink.rel = 'preload';
    resumeLink.as = 'fetch';
    resumeLink.href = 'https://raw.githubusercontent.com/powrstack/powrstack-folio/refs/heads/main/public/resume.json';
    resumeLink.crossOrigin = 'anonymous';
    resumeLink.fetchPriority = 'high';
    document.head.appendChild(resumeLink);

    // Warm up service worker cache immediately
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.open('portfolio-critical-v2').then(cache => {
        criticalImages.forEach(url => {
          cache.match(url).then(response => {
            if (!response) {
              fetch(url, { priority: 'high' }).then(fetchResponse => {
                if (fetchResponse.ok) {
                  cache.put(url, fetchResponse.clone());
                }
              }).catch(() => {}); // Silent fail
            }
          });
        });
      }).catch(() => {}); // Silent fail if SW not available
    }

    // Advanced performance monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Monitor LCP specifically
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (lastEntry && lastEntry.startTime) {
            logger.performance(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
            
            // Log warning if LCP exceeds target
            if (lastEntry.startTime > 1400) {
              logger.warn(`⚠️ LCP (${lastEntry.startTime.toFixed(2)}ms) exceeds 1.4s target`);
            } else {
              logger.performance(`✅ LCP (${lastEntry.startTime.toFixed(2)}ms) within 1.4s target`);
            }
          }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor resource loading times
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name.includes('/images/') && entry.duration > 500) {
              logger.warn(`Slow image load: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });

        // Cleanup observers after 10 seconds
        setTimeout(() => {
          lcpObserver.disconnect();
          resourceObserver.disconnect();
        }, 10000);
        
      } catch (e) {
        logger.debug('Performance monitoring not fully supported in this browser');
      }
    }

    // Cleanup function to remove preload links after use
    return () => {
      setTimeout(() => {
        const preloadLinks = document.querySelectorAll('link[rel="preload"]');
        preloadLinks.forEach(link => {
          if (link.href.includes('/images/') || 
              link.href.includes('resume.json') || 
              link.type === 'font/woff2') {
            link.remove();
          }
        });
      }, 5000); // Remove after 5 seconds to free up memory
    };
  }, [resumeData]);

  return null;
}
