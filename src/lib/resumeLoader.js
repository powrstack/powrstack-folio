import { promises as fs } from 'fs';
import path from 'path';
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
    // Use config.resumeJson for the resume file path
    const filePath = path.join(process.cwd(), 'public', config.resumeJson);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const jsonResumeData = JSON.parse(fileContents);
    
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
