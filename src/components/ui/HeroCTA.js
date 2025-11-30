'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroCTA = memo(function HeroCTA({ onContactShow }) {
  return (
    <div className="hidden lg:flex flex-row gap-4 justify-start animate-fade-in-up">
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
          className="flex items-center"
        >
          Read Blog
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </motion.span>
      </Link>
    </div>
  );
});

export default HeroCTA;
