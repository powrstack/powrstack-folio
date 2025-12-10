import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { transformResumeData } from './dataTransformer';
import config from '../masterConfig';
import logger from './logger';

// Multi-layer cache for the resume data
let resumeDataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes for in-memory cache

// Browser storage cache key
const STORAGE_KEY = 'portfolio_resume_cache';
const STORAGE_TIMESTAMP_KEY = 'portfolio_resume_cache_timestamp';
const STORAGE_CACHE_DURATION = 1000 * 60 * 60; // 1 hour for browser storage

const LOCAL_RESUME_PATH = config.resumeJson?.startsWith('/')
  ? config.resumeJson
  : `/${config.resumeJson || 'resume.json'}`;

function getCacheConfig() {
  const resumeCache = config.resumeCache || {};
  const enabled = resumeCache.enabled !== false;
  const memory = enabled && resumeCache.memory !== false;
  const browserStorage = enabled && resumeCache.browserStorage !== false;
  return { enabled, memory, browserStorage };
}

function getEnvValue(key) {
  if (typeof process === 'undefined' || !process?.env) {
    return undefined;
  }
  return process.env[key];
}

async function getRuntimeOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  try {
    const headerList = await headers();
    if (!headerList) return null;

    const forwardedProto = headerList.get('x-forwarded-proto');
    const forwardedHost = headerList.get('x-forwarded-host');
    const host = forwardedHost || headerList.get('host');

    if (!host) {
      return null;
    }

    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const protocol = forwardedProto || (isLocalhost ? 'http' : 'https');

    return `${protocol}://${host}`;
  } catch (error) {
    // headers() can throw when invoked outside a request context (e.g., build time)
    logger.debug('Runtime origin detection failed:', error);
    return null;
  }
}

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return null;
  const trimmed = origin.trim();
  if (!trimmed) return null;

  // Add protocol if missing
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`.replace(/\/$/, '');
  }

  return trimmed.replace(/\/$/, '');
}

async function getCandidateOrigins(isDevelopment) {
  const candidates = new Set();

  const runtimeOrigin = normalizeOrigin(await getRuntimeOrigin());
  if (runtimeOrigin) {
    candidates.add(runtimeOrigin);
  }

  const envOrigins = [
    getEnvValue('NEXT_PUBLIC_RESUME_BASE_URL'),
    getEnvValue('RESUME_BASE_URL'),
    getEnvValue('NEXT_PUBLIC_RESUME_REMOTE_ORIGIN'),
    getEnvValue('RESUME_REMOTE_ORIGIN'),
    getEnvValue('NEXT_PUBLIC_SITE_URL'),
    getEnvValue('SITE_URL'),
    getEnvValue('VERCEL_URL') ? `https://${getEnvValue('VERCEL_URL')}` : undefined,
  ];

  envOrigins.forEach((origin) => {
    const normalized = normalizeOrigin(origin);
    if (normalized) {
      candidates.add(normalized);
    }
  });

  if (isDevelopment) {
    const devOrigin = normalizeOrigin(config.resumeOrigins?.development);
    if (devOrigin) {
      candidates.add(devOrigin);
    }
  } else {
    const prodOrigin = normalizeOrigin(config.resumeOrigins?.production);
    if (prodOrigin) {
      candidates.add(prodOrigin);
    }
  }

  return Array.from(candidates);
}

function persistTransformedData(data, source, isDevelopment) {
  const cacheConfig = getCacheConfig();

  if (cacheConfig.memory && !isDevelopment) {
    resumeDataCache = data;
    cacheTimestamp = Date.now();
  } else {
    resumeDataCache = cacheConfig.memory && !isDevelopment ? data : null;
    cacheTimestamp = cacheConfig.memory && !isDevelopment ? Date.now() : null;
  }

  if (cacheConfig.browserStorage && !isDevelopment && typeof window !== 'undefined') {
    saveDataToStorage(data);
  }

  if (source) {
    logger.cache(`Resume data loaded from ${source}`);
  }

  return data;
}

async function loadResumeFromLocalFile(isDevelopment) {
  // In Cloudflare Workers and edge runtime, we can't use filesystem
  // Instead, fetch from the public asset directly on the server
  if (typeof window !== 'undefined') {
    return null;
  }

  try {
    // Construct the URL to the public asset
    const runtimeOrigin = await getRuntimeOrigin();
    
    // If we can't determine origin, try using localhost for development
    let baseUrl = runtimeOrigin;
    if (!baseUrl && isDevelopment) {
      baseUrl = 'http://localhost:3000';
    }
    
    if (!baseUrl) {
      logger.debug('Cannot determine runtime origin for server-side resume loading');
      return null;
    }

    const resumeUrl = `${baseUrl}${LOCAL_RESUME_PATH}`;
    logger.cache('Loading resume from public asset (server-side):', resumeUrl);

    const response = await fetch(resumeUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Portfolio-App/1.0 (Server)',
      }
    });

    if (!response.ok) {
      logger.debug(`Server-side resume fetch failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    logger.cache('Loaded resume from public asset (server-side)');
    return data;
  } catch (error) {
    logger.debug('Failed to load resume from public asset (server-side):', error);
    return null;
  }
}

async function fetchResumeFromPublicAsset(isDevelopment) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const response = await fetch(LOCAL_RESUME_PATH, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    logger.cache('Loaded resume from public asset');
    return await response.json();
  } catch (error) {
    logger.warn('Failed to fetch resume from public asset:', error);
    return null;
  }
}

async function fetchResumeFromPreferredOrigins(isDevelopment) {
  const origins = await getCandidateOrigins(isDevelopment);

  if (!origins.length) {
    return null;
  }

  const requestPath = LOCAL_RESUME_PATH.startsWith('/')
    ? LOCAL_RESUME_PATH
    : `/${LOCAL_RESUME_PATH}`;

  for (const origin of origins) {
    const url = `${origin}${requestPath}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Portfolio-App/1.0',
        }
      });

      if (!response.ok) {
        logger.warn(`Resume request to ${url} failed: ${response.status} ${response.statusText}`);
        continue;
      }

      logger.cache(`Loaded resume from origin: ${origin}`);
      const data = await response.json();
      return { data, origin };
    } catch (error) {
      logger.warn(`Failed to load resume from origin ${origin}:`, error);
    }
  }

  return null;
}

async function fetchResumeFromConfiguredFallback(isDevelopment) {
  const resumeUrl = config.resumeUrl;

  if (!resumeUrl) {
    throw new Error('Remote resume URL is not configured.');
  }

  logger.cache('Fetching resume from configured remote URL:', resumeUrl);

  const response = await fetch(resumeUrl, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Portfolio-App/1.0',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch resume data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { data, origin: resumeUrl };
}
/**
 * Gets cached data from browser storage (localStorage)
 * @returns {Object|null} - Cached resume data or null
 */
function getCachedDataFromStorage() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(STORAGE_KEY);
    const cachedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    
    if (cachedData && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp < STORAGE_CACHE_DURATION) {
        logger.cache('Loading resume from browser cache');
        return JSON.parse(cachedData);
      } else {
        // Clear expired cache
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
      }
    }
  } catch (error) {
    logger.warn('Failed to load from browser cache:', error);
    // Clear corrupted cache
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  }
  
  return null;
}

/**
 * Saves data to browser storage (localStorage)
 * @param {Object} data - Resume data to cache
 */
function saveDataToStorage(data) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    logger.cache('Resume data cached to browser storage');
  } catch (error) {
    logger.warn('Failed to save to browser cache:', error);
    // Handle quota exceeded or other storage errors
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    } catch (clearError) {
      logger.warn('Failed to clear storage:', clearError);
    }
  }
}

/**
 * Internal function for loading resume data (without caching wrappers)
 * @returns {Promise<Object>} - Transformed resume data
 */
async function _loadResumeDataInternal() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const cacheConfig = getCacheConfig();
  
  // Layer 1: Check in-memory cache first (fastest)
  if (cacheConfig.memory && resumeDataCache && cacheTimestamp && !isDevelopment) {
    const now = Date.now();
    if (now - cacheTimestamp < CACHE_DURATION) {
      logger.cache('Loading resume from memory cache');
      return resumeDataCache;
    }
  }
  
  // Layer 2: Check browser storage cache (fast)
  if (cacheConfig.browserStorage && !isDevelopment) {
    const cachedData = getCachedDataFromStorage();
    if (cachedData) {
      return persistTransformedData(cachedData, 'browser-cache', isDevelopment);
    }
  }

  try {
    let source = null;
    let resumeJsonData = null;

    if (typeof window === 'undefined') {
      resumeJsonData = await loadResumeFromLocalFile(isDevelopment);
      if (resumeJsonData) {
        source = 'local-file';
      }
    } else {
      resumeJsonData = await fetchResumeFromPublicAsset(isDevelopment);
      if (resumeJsonData) {
        source = 'public-asset';
      }
    }

    if (!resumeJsonData) {
      const originResult = await fetchResumeFromPreferredOrigins(isDevelopment);
      if (originResult?.data) {
        resumeJsonData = originResult.data;
        source = `origin:${originResult.origin}`;
      }
    }

    if (!resumeJsonData) {
      const fallbackResult = await fetchResumeFromConfiguredFallback(isDevelopment);
      resumeJsonData = fallbackResult.data;
      source = `remote:${fallbackResult.origin}`;
    }

    const transformedData = transformResumeData(resumeJsonData);
    return persistTransformedData(transformedData, source, isDevelopment);
  } catch (error) {
    logger.error('Error loading resume data:', error);
    
    // Fallback: Try to use expired browser cache as last resort
    if (cacheConfig.browserStorage && typeof window !== 'undefined') {
      try {
        const fallbackData = localStorage.getItem(STORAGE_KEY);
        if (fallbackData) {
          logger.warn('Using expired cache as fallback');
          const parsedData = JSON.parse(fallbackData);
          return persistTransformedData(parsedData, 'browser-cache-expired', isDevelopment);
        }
      } catch (fallbackError) {
        logger.error('Fallback cache also failed:', fallbackError);
      }
    }
    
    // Throw error if all cache layers fail
    throw new Error(`Failed to load resume data: ${error.message}. Please check your internet connection and try again.`);
  }
}

// Cached version with Next.js unstable_cache for Cloudflare Workers
const _loadResumeDataCached = unstable_cache(
  async () => {
    return await _loadResumeDataInternal();
  },
  ['resume-data'],
  {
    revalidate: 3600, // 1 hour cache
    tags: ['resume']
  }
);

/**
 * Loads resume data with multi-layer caching for better performance
 * Uses React cache() for request deduplication and Next.js unstable_cache for server-side caching
 * @returns {Promise<Object>} - Transformed resume data
 */
export const loadResumeData = cache(async () => {
  const cacheConfig = getCacheConfig();
  
  // If caching is disabled, always fetch fresh
  if (!cacheConfig.enabled) {
    return await _loadResumeDataInternal();
  }
  
  // Use Next.js cache for server-side optimization
  return await _loadResumeDataCached();
});

/**
 * Clears all resume data caches (useful for development or cache invalidation)
 */
export function clearResumeDataCache() {
  // Clear in-memory cache
  resumeDataCache = null;
  cacheTimestamp = null;
  
  // Clear browser storage cache
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
      logger.cache('All resume caches cleared');
    } catch (error) {
      logger.warn('Failed to clear browser cache:', error);
    }
  }
}

/**
 * Forces a fresh fetch of resume data, bypassing all caches
 * @returns {Promise<Object>} - Fresh resume data
 */
export async function refreshResumeData() {
  logger.cache('Force refreshing resume data...');
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Clear all caches first
  clearResumeDataCache();
  
  // Fetch fresh data
  try {
    const response = await fetch(config.resumeUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Portfolio-App/1.0',
        'Cache-Control': 'no-cache',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fresh resume data: ${response.status} ${response.statusText}`);
    }
    
    const jsonResumeData = await response.json();
    const transformedData = transformResumeData(jsonResumeData);

    logger.cache('Resume data refreshed successfully');
    return persistTransformedData(transformedData, 'manual-refresh', isDevelopment);
  } catch (error) {
    logger.error('Failed to refresh resume data:', error);
    throw error;
  }
}

/**
 * Gets cache status information
 * @returns {Object} - Cache status details
 */
export function getCacheStatus() {
  const now = Date.now();
  const cacheConfig = getCacheConfig();
  const memoryValid = cacheConfig.memory && resumeDataCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION);
  
  let storageValid = false;
  let storageAge = null;
  
  if (cacheConfig.browserStorage && typeof window !== 'undefined') {
    try {
      const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      if (timestamp) {
        const age = now - parseInt(timestamp);
        storageValid = age < STORAGE_CACHE_DURATION;
        storageAge = Math.floor(age / 1000 / 60); // age in minutes
      }
    } catch (error) {
      logger.warn('Failed to check storage cache status:', error);
    }
  }
  
  return {
    enabled: cacheConfig.enabled,
    memory: {
      valid: memoryValid,
      age: memoryValid && cacheTimestamp ? Math.floor((now - cacheTimestamp) / 1000 / 60) : null
    },
    storage: {
      valid: storageValid,
      age: storageValid ? storageAge : null
    }
  };
}
