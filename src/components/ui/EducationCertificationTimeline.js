'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import EducationTimelineItem from './EducationTimelineItem';

const EducationCertificationTimeline = memo(function EducationCertificationTimeline({ resumeData }) {
  const timelineData = useMemo(() => {
    const items = [];
    
    // Add only education items
    if (resumeData?.education) {
      resumeData.education.forEach(edu => {
        items.push({
          ...edu,
          type: 'education',
          startDate: edu.startDate,
          endDate: edu.endDate,
          sortDate: new Date(edu.endDate || edu.startDate || '1970-01-01'),
        });
      });
    }
    
    // Sort by end date first, then start date (newest first)
    return items.sort((a, b) => {
      const aEndDate = new Date(a.endDate || a.startDate || '1970-01-01');
      const bEndDate = new Date(b.endDate || b.startDate || '1970-01-01');
      if (aEndDate.getTime() !== bEndDate.getTime()) {
        return bEndDate - aEndDate;
      }
      const aStartDate = new Date(a.startDate || '1970-01-01');
      const bStartDate = new Date(b.startDate || '1970-01-01');
      return bStartDate - aStartDate;
    });
  }, [resumeData]);

  if (!timelineData.length) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/60">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-lg">No education or training data available</p>
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
        {timelineData.map((item, index) => (
          <EducationTimelineItem
            key={`${item.type}-${item.institution}-${item.startDate}-${index}`}
            item={item}
            index={index}
            isLast={index === timelineData.length - 1}
            totalItems={timelineData.length}
          />
        ))}
      </ul>
    </motion.div>
  );
});

export default EducationCertificationTimeline;