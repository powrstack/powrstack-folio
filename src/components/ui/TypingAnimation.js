'use client';

import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const TypingAnimation = memo(function TypingAnimation({ roles = [], className = '' }) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;

    const currentRole = roles[currentRoleIndex];
    
    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting) {
      // Typing forward
      if (displayText.length < currentRole.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length + 1));
        }, Math.random() * 80 + 60); // Natural typing variation
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
      }
    } else {
      // Deleting backward
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 30); // Faster deletion
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next role
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }
  }, [displayText, isDeleting, isPaused, currentRoleIndex, roles]);

  return (
    <div className={className}>
      I'm a{' '}
      <span className="text-secondary">
        <motion.span
          key={displayText}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.1,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {displayText}
        </motion.span>
        <motion.span
          animate={{ 
            opacity: [1, 0.3, 1]
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="ml-1 inline-block text-secondary font-light"
        >
          |
        </motion.span>
      </span>
    </div>
  );
});

export default TypingAnimation;
