'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimelineItem from './TimelineItem';

const WorkExperienceTimeline = memo(function WorkExperienceTimeline({ resumeData }) {
  const workExperiences = useMemo(() => {
    if (!resumeData?.workExperience) return [];
    
    // Sort by start date (newest first)
    return [...resumeData.workExperience].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate) : new Date('1970-01-01');
      const dateB = b.startDate ? new Date(b.startDate) : new Date('1970-01-01');
      return dateB - dateA;
    });
  }, [resumeData?.workExperience]);

  if (!workExperiences.length) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/60">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <p className="text-lg">No work experience data available</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
        {workExperiences.map((experience, index) => (
          <TimelineItem
            key={`${experience.company}-${experience.startDate}-${index}`}
            experience={experience}
            index={index}
            isLast={index === workExperiences.length - 1}
            totalItems={workExperiences.length}
          />
        ))}
      </ul>
    </motion.div>
  );
});

export default WorkExperienceTimeline;