'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const FloatingTechIcons = memo(function FloatingTechIcons({ 
  technicalSkills, 
  isDesktop = false,
  delay = 1.2 
}) {
  if (!technicalSkills || technicalSkills.length === 0) return null;

  const skillsToShow = isDesktop ? technicalSkills.slice(0, 6) : technicalSkills.slice(0, 4);
  const badgeSize = isDesktop ? 'badge-lg' : 'badge-sm';

  return (
    <div className="absolute inset-0 pointer-events-none">
      {skillsToShow.map((tech, index) => {
        const techStyle = isDesktop 
          ? {
              top: `${20 + (index * 15)}%`,
              left: index % 2 === 0 ? '10%' : '90%',
            }
          : {
              top: `${25 + (index * 20)}%`,
              left: index % 2 === 0 ? '5%' : '95%',
            };

        const animationOffset = isDesktop ? -10 : -5;

        return (
          <motion.div
            key={tech.name}
            className={`absolute badge badge-primary ${badgeSize}`}
            style={techStyle}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, animationOffset, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: delay + (index * 0.1) },
              scale: { 
                duration: 0.5, 
                delay: delay + (index * 0.1), 
                type: "spring", 
                stiffness: 200 
              },
              y: {
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut"
              }
            }}
            whileHover={{ scale: 1.1 }}
          >
            {tech.name}
          </motion.div>
        );
      })}
    </div>
  );
});

export default FloatingTechIcons;
