'use client';

import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

const SocialLinks = memo(function SocialLinks({ 
  socialData, 
  size = 'md', 
  delay = 0.6 
}) {
  if (!socialData) return null;

  // Parse responsive size classes
  const sizeClass = size.includes('lg:') ? size : `text-2xl btn-${size}`;
  const iconSizeClass = size.includes('lg') ? 'w-5 h-5 lg:w-6 lg:h-6' : 'w-5 h-5';

  return (
    <div className="flex justify-center space-x-4">
      {socialData.github && (
        <motion.a
          href={socialData.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-circle btn-outline ${sizeClass} hover:btn-primary`}
          aria-label="Visit GitHub profile"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay }}
        >
          <FontAwesomeIcon 
            icon={['fab', 'github']} 
            className={iconSizeClass}
          />
        </motion.a>
      )}

      {socialData.linkedin && (
        <motion.a
          href={socialData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-circle btn-outline ${sizeClass} hover:btn-secondary`}
          aria-label="Visit LinkedIn profile"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.1 }}
        >
          <FontAwesomeIcon 
            icon={['fab', 'linkedin']} 
            className={iconSizeClass}
          />
        </motion.a>
      )}

      {socialData.dev && (
        <motion.a
          href={socialData.dev}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-circle btn-outline ${sizeClass} hover:btn-accent`}
          aria-label="Visit DEV Community profile"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.2 }}
        >
          <FontAwesomeIcon 
            icon={['fab', 'dev']} 
            className={iconSizeClass}
          />
        </motion.a>
      )}
    </div>
  );
});

export default SocialLinks;
