'use client';

import { useEffect, useState } from 'react';
import { logger } from '../lib/logger';
import config from '../masterConfig';

export default function PerformanceBudget() {
  const [metrics, setMetrics] = useState({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    budget: {
      lcp: config.performance?.thresholds?.lcp || 1400, // Target: < 1.4s
      fid: config.performance?.thresholds?.fid || 100,  // Target: < 100ms
      cls: config.performance?.thresholds?.cls || 0.1,  // Target: < 0.1
      fcp: 800,  // Target: < 800ms
      ttfb: 200  // Target: < 200ms
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const observers = [];

    try {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, fid: lastEntry.processingStart - lastEntry.startTime }));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);

      // FCP and TTFB from Navigation Timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        }
      });
      navObserver.observe({ entryTypes: ['paint'] });
      observers.push(navObserver);

      // TTFB from Navigation Timing
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        setMetrics(prev => ({ ...prev, ttfb }));
      }

    } catch (error) {
      logger.warn('Performance monitoring not fully supported:', error);
    }

    // Cleanup observers
    return () => {
      observers.forEach(observer => {
        try {
          observer.disconnect();
        } catch (e) {
          // Silent fail
        }
      });
    };
  }, []);

  // Function to get status color based on performance budget
  const getStatusColor = (value, budget) => {
    if (value === null) return 'text-gray-400';
    return value <= budget ? 'text-green-600' : 'text-red-600';
  };

  // Only show in development or when debug flag is set
  const shouldShow = process.env.NODE_ENV === 'development' || 
                    (typeof window !== 'undefined' && window.location.search.includes('debug=performance'));

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border text-xs font-mono z-50">
      <div className="font-bold mb-2 text-center">Performance Budget</div>
      <div className="space-y-1">
        <div className={`flex justify-between ${getStatusColor(metrics.lcp, metrics.budget.lcp)}`}>
          <span>LCP:</span>
          <span>{metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : '-'}</span>
          <span className="text-gray-400">(&lt;{metrics.budget.lcp}ms)</span>
        </div>
        <div className={`flex justify-between ${getStatusColor(metrics.fcp, metrics.budget.fcp)}`}>
          <span>FCP:</span>
          <span>{metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : '-'}</span>
          <span className="text-gray-400">(&lt;{metrics.budget.fcp}ms)</span>
        </div>
        <div className={`flex justify-between ${getStatusColor(metrics.fid, metrics.budget.fid)}`}>
          <span>FID:</span>
          <span>{metrics.fid ? `${metrics.fid.toFixed(0)}ms` : '-'}</span>
          <span className="text-gray-400">(&lt;{metrics.budget.fid}ms)</span>
        </div>
        <div className={`flex justify-between ${getStatusColor(metrics.cls, metrics.budget.cls)}`}>
          <span>CLS:</span>
          <span>{metrics.cls !== null ? metrics.cls.toFixed(3) : '-'}</span>
          <span className="text-gray-400">(&lt;{metrics.budget.cls})</span>
        </div>
        <div className={`flex justify-between ${getStatusColor(metrics.ttfb, metrics.budget.ttfb)}`}>
          <span>TTFB:</span>
          <span>{metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : '-'}</span>
          <span className="text-gray-400">(&lt;{metrics.budget.ttfb}ms)</span>
        </div>
      </div>
      
      {/* Overall Score */}
      <div className="mt-2 pt-2 border-t">
        <div className="text-center">
          <span className="font-bold">
            Overall: {
              metrics.lcp && metrics.lcp <= metrics.budget.lcp ? 
              '✅ PASS' : 
              metrics.lcp ? '❌ FAIL' : '⏳ LOADING'
            }
          </span>
        </div>
      </div>
    </div>
  );
}
