'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { logger } from '../lib/logger';

export default function SuperOptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false, 
  className = "",
  sizes = "100vw",
  quality = 85,
  placeholder = "blur",
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  
  // Generate data URL for blur placeholder
  const shimmer = (w, h) => `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stop-color="#f3f4f6" />
          <stop stop-color="#e5e7eb" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
  `;
  
  const toBase64 = (str) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (priority) link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, priority]);

  // Fallback error handling
  const handleError = () => {
    logger.warn(`Failed to load image: ${src}`);
    setImgSrc('/images/placeholder.jpg'); // Fallback image
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`transition-all duration-300 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        style={{
          objectFit: 'cover',
          ...(priority && { fetchPriority: 'high' })
        }}
        {...props}
      />
      
      {/* Loading indicator for non-priority images */}
      {!isLoaded && !priority && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
    </div>
  );
}
