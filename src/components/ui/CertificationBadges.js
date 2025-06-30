'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CertificationBadges = memo(function CertificationBadges({ 
  certifications, 
  size = 'sm', 
  delay = 1.2 
}) {
  if (!certifications || certifications.length === 0) return null;

  // Parse responsive size classes
  const isResponsive = size.includes('lg:');
  const badgeSize = isResponsive 
    ? 'w-12 h-12 lg:w-16 lg:h-16' 
    : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  const imageSize = isResponsive ? 40 : size === 'lg' ? 48 : 40;

  return (
    <div className="w-full">
      <motion.h3 
        className="text-lg font-semibold text-base-content mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
      >
        Certifications
      </motion.h3>
      <div className="flex flex-wrap justify-center gap-3 max-w-sm lg:max-w-md mx-auto">
        {certifications.map((cert, index) => {
          return (
            <motion.div
              key={`${cert.name}-${index}`}
              className="tooltip"
              data-tip={`${cert.name} - ${cert.vendor || cert.issuer}`}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + (index * 0.1),
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {cert.badgeImage ? (
                <div className={`${badgeSize} rounded-lg overflow-hidden shadow-lg bg-base-200 p-1 hover:shadow-xl transition-shadow`}>
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <Image
                      src={cert.badgeImage}
                      alt={`${cert.name} certification badge`}
                      width={imageSize}
                      height={imageSize}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      sizes={`${imageSize}px`}
                      quality={90}
                      unoptimized={false}
                    />
                  </a>
                </div>
              ) : (
                <div className={`${badgeSize} rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full flex items-center justify-center">
                    <span className="text-primary-content font-bold text-xs text-center px-1">
                      {cert.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                    </span>
                  </a>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default CertificationBadges;
