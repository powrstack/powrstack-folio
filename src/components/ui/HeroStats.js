'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const HeroStats = memo(function HeroStats({ 
  resumeData, 
  technicalSkills, 
  certificationsByVendor,
  delay = 1.0 
}) {
  // Limit certifications to show only top 3 vendors to prevent overflow
  const topCertVendors = [...certificationsByVendor.entries()].slice(0, certificationsByVendor.size-1);
  
  return (
    <motion.div
      className="w-full flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-200">
        <div className="stat">
          <div className="stat-title">Experience</div>
          <div className="stat-value text-primary">
            {resumeData?.stats?.totalExperienceYears || 5}+
          </div>
          <div className="stat-desc">Years</div>
        </div>

        <div className="stat">
          <div className="stat-title">Projects</div>
          <div className="stat-value text-secondary">
            {/* {resumeData?.projects?.length || 20}+ */}
            25+
          </div>
          <div className="stat-desc">Worked</div>
        </div>

        <div className="stat">
          <div className="stat-title">Technologies</div>
          <div className="stat-value text-accent">
            {technicalSkills.length || 15}+
          </div>
          <div className="stat-desc">Skills</div>
        </div>

        {/* Show top certification vendors */}
        {topCertVendors.map(([vendor, certs], index) => (
          <div className="stat" key={vendor}>
            <div className="stat-title">Certifications</div>
            <div className="stat-value text-info">
              {certs.length}x
            </div>
            <div className="stat-desc">{vendor}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

export default HeroStats;
