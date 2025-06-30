'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TypingAnimation from './TypingAnimation';

const HeroContent = memo(function HeroContent({ 
  personalInfo, 
  roles,
  onContactShow,
  isDesktop = false,
  showDescription = true,
  showCTA = true
}) {
  const titleClass = isDesktop 
    ? "text-7xl font-bold text-base-content leading-tight"
    : "text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-base-content leading-tight";
  
  const subtitleClass = isDesktop
    ? "text-3xl font-semibold text-base-content/80 mt-4 h-12"
    : "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-base-content/80 mt-4 h-10 sm:h-12 lg:h-12";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Title and Name */}
      <div className={isDesktop ? "mb-6" : "mb-4 lg:mb-6"}>
        <motion.h1
          className={titleClass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hi, I'm{' '}
          <span className="text-primary">
            {personalInfo?.name || 'Developer'}
          </span>
        </motion.h1>
        
        <motion.div
          className={subtitleClass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TypingAnimation roles={roles} />
        </motion.div>
      </div>

      {/* Description/Summary - Conditionally show based on props */}
      {showDescription && (
        <motion.div
          className="hidden lg:block text-lg text-base-content/70 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {personalInfo?.summary ?
            personalInfo.summary.split('\n').map((line, index) => (
              <p key={index} className={index > 0 ? 'mt-4' : ''}>
                {line}
              </p>
            )) :
            <p>Passionate about creating innovative solutions and building scalable applications that make a difference.</p>
          }
        </motion.div>
      )}

      {/* CTA Buttons - Conditionally show based on props */}
      {showCTA && (
        <motion.div
          className="hidden lg:flex flex-row gap-4 justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={onContactShow}
            className="btn btn-primary btn-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>

          <Link
            href="/blog"
            className="btn btn-outline btn-lg"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Blog
            </motion.span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
});

export default HeroContent;
