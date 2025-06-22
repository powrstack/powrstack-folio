import { promises as fs } from 'fs';
import path from 'path';
import { transformResumeData } from './dataTransformer';

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
    const filePath = path.join(process.cwd(), 'public', 'resume.json');
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
    
    // Return fallback data if main data fails to load
    const fallbackData = {
      personalInfo: {
        name: "Md. Abu Raihan Srabon",
        title: "Software/DevOps Engineer",
        tagline: "Building exceptional digital experiences",
        email: "mdaburaihansrabon@gmail.com",
        phone: "+8801827073009",
        location: "Dhaka, Bangladesh",
        website: "https://aburaihan-dev.github.io",
        profileImage: "/images/aburaihansrabon.svg",
        summary: "Experienced DevOps Engineer with over seven years in software engineering and team leadership. Specializing in DevOps transformations, system architecture, and automation.",
        cvUrl: "/resume.pdf",
        social: {
          github: "https://github.com/aburaihan-dev",
          linkedin: "https://www.linkedin.com/in/mdaburaihan",
          dev: "https://dev.to/msrabon"
        }
      },
      about: {
        bio: "Experienced DevOps Engineer with over seven years in software engineering and team leadership.",
        skills: ["Java", "Docker", "Jenkins", "Python", "AWS", "Kubernetes"],
        interests: ["Tech-Lover", "Gaming", "Photography", "Travel"]
      }
    };
    
    // Cache the fallback data too
    resumeDataCache = fallbackData;
    cacheTimestamp = Date.now();
    
    return fallbackData;
  }
}

/**
 * Clears the resume data cache (useful for development)
 */
export function clearResumeDataCache() {
  resumeDataCache = null;
  cacheTimestamp = null;
}
