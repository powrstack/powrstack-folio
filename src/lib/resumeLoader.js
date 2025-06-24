import { transformResumeData } from './dataTransformer';
import config from '../masterConfig';

// Multi-layer cache for the resume data
let resumeDataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes for in-memory cache

// Browser storage cache key
const STORAGE_KEY = 'portfolio_resume_cache';
const STORAGE_TIMESTAMP_KEY = 'portfolio_resume_cache_timestamp';
const STORAGE_CACHE_DURATION = 1000 * 60 * 60; // 1 hour for browser storage

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
        console.log('Loading resume from browser cache');
        return JSON.parse(cachedData);
      } else {
        // Clear expired cache
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
      }
    }
  } catch (error) {
    console.warn('Failed to load from browser cache:', error);
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
    console.log('Resume data cached to browser storage');
  } catch (error) {
    console.warn('Failed to save to browser cache:', error);
    // Handle quota exceeded or other storage errors
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    } catch (clearError) {
      console.warn('Failed to clear storage:', clearError);
    }
  }
}

/**
 * Loads resume data with multi-layer caching for better performance
 * @returns {Promise<Object>} - Transformed resume data
 */
export async function loadResumeData() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Layer 1: Check in-memory cache first (fastest)
  if (resumeDataCache && cacheTimestamp && !isDevelopment) {
    const now = Date.now();
    if (now - cacheTimestamp < CACHE_DURATION) {
      console.log('Loading resume from memory cache');
      return resumeDataCache;
    }
  }
  
  // Layer 2: Check browser storage cache (fast)
  if (!isDevelopment) {
    const cachedData = getCachedDataFromStorage();
    if (cachedData) {
      // Update in-memory cache as well
      resumeDataCache = cachedData;
      cacheTimestamp = Date.now();
      return cachedData;
    }
  }

  try {
    // Layer 3: Fetch from GitHub (slowest, but most up-to-date)
    const resumeUrl = config.resumeUrl;
    
    console.log('Fetching resume from GitHub:', resumeUrl);
    
    const response = await fetch(resumeUrl, {
      // Use Next.js caching for server-side requests
      cache: isDevelopment ? 'no-store' : 'force-cache',
      next: { 
        revalidate: isDevelopment ? 0 : 900 // 15 minutes for Next.js cache
      },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Portfolio-App/1.0',
        'Cache-Control': isDevelopment ? 'no-cache' : 'public, max-age=900', // 15 minutes
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch resume data: ${response.status} ${response.statusText}`);
    }
    
    const jsonResumeData = await response.json();
    
    // Transform JSON Resume format to our component format
    const transformedData = transformResumeData(jsonResumeData);
    
    // Update all cache layers
    resumeDataCache = transformedData;
    cacheTimestamp = Date.now();
    
    // Save to browser storage for future visits (client-side only)
    if (!isDevelopment) {
      saveDataToStorage(transformedData);
    }
    
    console.log('Resume data fetched and cached');
    return transformedData;
  } catch (error) {
    console.error('Error loading resume data:', error);
    
    // Fallback: Try to use expired browser cache as last resort
    if (typeof window !== 'undefined') {
      try {
        const fallbackData = localStorage.getItem(STORAGE_KEY);
        if (fallbackData) {
          console.warn('Using expired cache as fallback');
          const parsedData = JSON.parse(fallbackData);
          resumeDataCache = parsedData;
          cacheTimestamp = Date.now();
          return parsedData;
        }
      } catch (fallbackError) {
        console.error('Fallback cache also failed:', fallbackError);
      }
    }
    
    // Throw error if all cache layers fail
    throw new Error(`Failed to load resume data: ${error.message}. Please check your internet connection and try again.`);
  }
}

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
      console.log('All resume caches cleared');
    } catch (error) {
      console.warn('Failed to clear browser cache:', error);
    }
  }
}

/**
 * Forces a fresh fetch of resume data, bypassing all caches
 * @returns {Promise<Object>} - Fresh resume data
 */
export async function refreshResumeData() {
  console.log('Force refreshing resume data...');
  
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
    
    // Update all caches with fresh data
    resumeDataCache = transformedData;
    cacheTimestamp = Date.now();
    saveDataToStorage(transformedData);
    
    console.log('Resume data refreshed successfully');
    return transformedData;
  } catch (error) {
    console.error('Failed to refresh resume data:', error);
    throw error;
  }
}

/**
 * Gets cache status information
 * @returns {Object} - Cache status details
 */
export function getCacheStatus() {
  const now = Date.now();
  const memoryValid = resumeDataCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION);
  
  let storageValid = false;
  let storageAge = null;
  
  if (typeof window !== 'undefined') {
    try {
      const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      if (timestamp) {
        const age = now - parseInt(timestamp);
        storageValid = age < STORAGE_CACHE_DURATION;
        storageAge = Math.floor(age / 1000 / 60); // age in minutes
      }
    } catch (error) {
      console.warn('Failed to check storage cache status:', error);
    }
  }
  
  return {
    memory: {
      valid: memoryValid,
      age: cacheTimestamp ? Math.floor((now - cacheTimestamp) / 1000 / 60) : null
    },
    storage: {
      valid: storageValid,
      age: storageAge
    }
  };
}
