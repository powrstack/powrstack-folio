// src/lib/logger.js

/**
 * Smart logging utility that respects environment and debug flags
 * Automatically disabled in production unless debug mode is enabled
 * Works in both server and client environments
 */

const isDevelopment = process.env.NODE_ENV === 'development';

// Check for debug mode safely (only on client)
const getIsDebugMode = () => {
  if (typeof window === 'undefined') return false;
  try {
    return window.location.search.includes('debug=true') || 
           window.location.search.includes('debug=performance') ||
           localStorage.getItem('debug') === 'true';
  } catch {
    return false;
  }
};

const shouldLog = () => isDevelopment || (typeof window !== 'undefined' && getIsDebugMode());

// Create a logger that can be safely stripped in production
const logger = {
  log: (...args) => {
    if (shouldLog()) {
      console.log(...args);
    }
  },
  
  warn: (...args) => {
    if (shouldLog()) {
      console.warn(...args);
    }
  },
  
  error: (...args) => {
    // Always log errors, even in production, but safely
    try {
      console.error(...args);
    } catch (e) {
      // Silent fail if console is not available
    }
  },
  
  debug: (...args) => {
    if (typeof window !== 'undefined' && getIsDebugMode()) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  performance: (...args) => {
    if (shouldLog()) {
      console.log('[PERF]', ...args);
    }
  },
  
  cache: (...args) => {
    if (shouldLog()) {
      console.log('[CACHE]', ...args);
    }
  }
};

export default logger;
export { logger };
