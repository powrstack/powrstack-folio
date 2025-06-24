import { transformResumeData } from './dataTransformer';
import config from '../masterConfig';

// Cache for the resume data
let resumeDataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes in development

/**
 * Loads resume data with caching for better performance
 * @returns {Promise<Object>} - Transformed resume data
 */
export async function loadResumeData() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check if we have cached data that's still valid
  if (resumeDataCache && cacheTimestamp && !isDevelopment) {
    const now = Date.now();
    if (now - cacheTimestamp < CACHE_DURATION) {
      return resumeDataCache;
    }
  }

  try {
    // Fetch resume.json as a static resource from public directory
    // Use absolute URL for server-side environments
    const getBaseUrl = () => {
      const isDev = process.env.NODE_ENV === 'development';
      
      if (isDev) {
        return config.deployment.baseUrls.development;
      }
      
      // Get base URL based on deployment platform
      const platform = config.deployment.platform;
      const productionUrls = config.deployment.baseUrls.production;
      
      let baseUrl;
      switch (platform) {
        case 'cloudflare':
          baseUrl = productionUrls.cloudflare || productionUrls.custom;
          break;
        case 'vercel':
          baseUrl = productionUrls.vercel;
          break;
        case 'netlify':
          baseUrl = productionUrls.netlify;
          break;
        default:
          baseUrl = productionUrls.custom;
      }
      
      // Fallback to a default URL if still undefined
      if (!baseUrl) {
        baseUrl = 'https://mdaburaihan.pro'; // Use your domain as fallback
      }
      
      return baseUrl;
    };
    
    const baseUrl = getBaseUrl();
    const resumeUrl = `${baseUrl}/${config.resumeJson}`;
    
    console.log('Fetching resume from:', resumeUrl); // Debug log
    
    const response = await fetch(resumeUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch resume data: ${response.status} ${response.statusText}`);
    }
    
    const jsonResumeData = await response.json();
    
    // Transform JSON Resume format to our component format
    const transformedData = transformResumeData(jsonResumeData);
    
    // Cache the data
    resumeDataCache = transformedData;
    cacheTimestamp = Date.now();
    
    return transformedData;
  } catch (error) {
    console.error('Error loading resume data:', error);
    
    // Throw error instead of returning fallback data
    // This ensures the application is completely data-driven from resume.json
    throw new Error(`Failed to load resume data: ${error.message}. Please ensure public/resume.json exists and is valid.`);
  }
}

/**
 * Clears the resume data cache (useful for development)
 */
export function clearResumeDataCache() {
  resumeDataCache = null;
  cacheTimestamp = null;
}
