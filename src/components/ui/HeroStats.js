'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const HeroStats = memo(function HeroStats({ 
  resumeData, 
  technicalSkills, 
  certificationsByVendor,
  isDesktop = false,
  delay = 1.0 
}) {
  const containerClass = "stats shadow w-full grid grid-cols-3 sm:grid-cols-6 lg:max-w-2xl lg:mx-0 mx-auto";
  const valueClass = "text-xl lg:text-2xl font-bold";
  const titleClass = "text-xs lg:text-sm";

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className={containerClass}>
        <div className="stat">
          <div className={`stat-value text-primary ${valueClass}`}>
            {resumeData?.stats?.totalExperience?.length || 5}+
          </div>
          <div className={`stat-title ${titleClass}`}>Years Exp</div>
        </div>

        <div className="stat">
          <div className={`stat-value text-secondary ${valueClass}`}>
            {resumeData?.projects?.length || 20}+
          </div>
          <div className={`stat-title ${titleClass}`}>Projects</div>
        </div>

        <div className="stat">
          <div className={`stat-value text-accent ${valueClass}`}>
            {technicalSkills.length || 15}+
          </div>
          <div className={`stat-title ${titleClass}`}>Tech Stack</div>
        </div>

        {/* Certifications by Vendor */}
        {[...certificationsByVendor.entries()].slice(0, 15).map(([vendor, certs], index) => (
          <div className="stat" key={vendor}>
            <div className={`stat-value text-info ${valueClass}`}>
              {certs.length}x
            </div>
            <div className={`stat-title ${titleClass}`}>{vendor}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

export default HeroStats;
