'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TimelineItem = memo(function TimelineItem({ experience, index, isLast, totalItems }) {
  const {
    company,
    position,
    title,
    startDate,
    endDate,
    duration,
    responsibilities = [],
    highlights = [],
    achievements = [],
    logo,
    location,
    summary,
    description,
    url: website
  } = experience;

  // Calculate color for this timeline item
  const colorGradients = [
    '#3b82f6, #8b5cf6', // blue to purple
    '#10b981, #14b8a6', // green to teal
    '#f97316, #ef4444', // orange to red
    '#8b5cf6, #ec4899', // purple to pink
    '#14b8a6, #3b82f6', // teal to blue
    '#6366f1, #8b5cf6'  // indigo to purple
  ];
  
  const iconColors = [
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-red-600', 
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-teal-500 to-blue-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600'
  ];
  
  const colorGradient = colorGradients[index % colorGradients.length];
  const iconColorClass = iconColors[index % iconColors.length];

  // Format dates
  const formattedDates = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const formatDate = (date) => {
      if (!date) return 'Not specified';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    };

    const startStr = formatDate(start);
    const endStr = end ? formatDate(end) : 'Present';
    
    // Calculate duration
    const endDateForCalc = end || new Date();
    const diffMonths = start ? 
      Math.round((endDateForCalc - start) / (1000 * 60 * 60 * 24 * 30.44)) : 0;
    
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    let calculatedDuration = '';
    if (start) {
      if (years > 0) calculatedDuration += `${years} yr${years > 1 ? 's' : ''}`;
      if (months > 0) {
        if (calculatedDuration) calculatedDuration += ' ';
        calculatedDuration += `${months} mo${months > 1 ? 's' : ''}`;
      }
      if (!calculatedDuration) calculatedDuration = '< 1 mo';
    } else {
      calculatedDuration = 'Duration not specified';
    }

    return {
      range: `${startStr} - ${endStr}`,
      duration: calculatedDuration
    };
  }, [startDate, endDate]);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  // Determine timeline side (alternating on larger screens, consistent on mobile)
  const isEven = index % 2 === 0;
  const timelineStart = isEven ? 'timeline-start md:text-end' : 'timeline-end';
  const timelineEnd = isEven ? 'timeline-end' : 'timeline-start md:text-start';

  console.log('', experience, index, isLast, totalItems);

  return (
    <motion.li 
      className="timeline-item"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      custom={index}
    >
      {/* Timeline line before (except for first item) */}
      {index > 0 && (
        <hr 
          className={iconColorClass.replace('bg-gradient-to-br', 'bg-gradient-to-r')}
          style={{
            background: `linear-gradient(to right, ${colorGradient})`,
          }}
        />
      )}

      {/* Company Logo */}
      <div className={`${timelineStart} mb-10`}>
        <div className="flex items-center justify-center md:justify-end">
          {logo ? (
            <Image
                  src={logo.startsWith('/') ? logo : `/${logo}`}
                  alt={`${company} logo`}
                  width={256}
                  height={128}
                  quality={75}
                  className="object-contain"
                />
          ) : (
            <div className="avatar placeholder">
              <div className="w-16 h-16 bg-neutral text-neutral-content flex items-center justify-center">
                <span className="text-xl font-bold">
                  {company?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="text-lg font-bold text-base-content mt-2 text-center md:text-right">
          {company}
        </div>
        {location && (
          <div className="text-sm text-base-content/60 text-center md:text-right">
            {location}
          </div>
        )}
      </div>

      {/* Timeline Connector */}
      <div className="timeline-middle">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${iconColorClass}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Experience Details */}
      <div className={`${timelineEnd} mb-10`}>
        <div className="timeline-box bg-base-200 shadow-lg">
          <div className="p-6">
            {/* Position & Dates */}
            <div className="mb-4">
              <h3 className="card-title text-xl text-primary mb-2">
                {position || title}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="badge badge-outline">
                  {formattedDates.range}
                </div>
                <div className="badge badge-primary badge-outline">
                  {formattedDates.duration}
                </div>
              </div>
            </div>

            {/* Summary/Description */}
            {(summary || description) && (
              <div className="mb-4">
                <p className="text-base-content/80 leading-relaxed">
                  {summary || description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {(responsibilities.length > 0 || achievements.length > 0) && (
              <div>
                <h4 className="font-semibold text-base-content mb-3">
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {(responsibilities.length > 0 ? responsibilities : achievements).map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-base-content/80 leading-relaxed">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Website Link - Always shows a button */}
            <div className="flex justify-end mt-4">
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Visit Company
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <button 
                  className="btn btn-outline btn-sm" 
                  disabled
                >
                  No Website Available
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline line after (except for last item) */}
      {!isLast && (
        <hr 
          className={iconColorClass.replace('bg-gradient-to-br', 'bg-gradient-to-r')}
          style={{
            background: `linear-gradient(to right, ${colorGradient})`,
          }}
        />
      )}
    </motion.li>
  );
});

export default TimelineItem;