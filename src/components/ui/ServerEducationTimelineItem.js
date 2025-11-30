import { memo, useMemo } from 'react';
import Image from 'next/image';

const ServerEducationTimelineItem = memo(function ServerEducationTimelineItem({ item, index, isLast }) {
  const {
    institution,
    studyType,
    area,
    startDate,
    endDate,
    gpa,
    courses = [],
    description,
    location,
  } = item;

  // Calculate colors for this timeline item
  const educationColors = [
    '#3b82f6, #1d4ed8', // blue gradient
    '#10b981, #059669', // emerald gradient
    '#8b5cf6, #7c3aed', // violet gradient
    '#f59e0b, #d97706', // amber gradient
    '#ef4444, #dc2626', // red gradient
    '#06b6d4, #0891b2', // cyan gradient
  ];
  
  const colorGradient = educationColors[index % educationColors.length];
  
  const iconColors = [
    'bg-gradient-to-br from-blue-500 to-blue-700',
    'bg-gradient-to-br from-emerald-500 to-emerald-700',
    'bg-gradient-to-br from-violet-500 to-violet-700',
    'bg-gradient-to-br from-amber-500 to-amber-700',
    'bg-gradient-to-br from-red-500 to-red-700',
    'bg-gradient-to-br from-cyan-500 to-cyan-700',
  ];
  
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
    
    return {
      range: `${startStr} - ${endStr}`,
    };
  }, [startDate, endDate]);

  // Determine timeline side
  const isEven = index % 2 === 0;
  const timelineStart = isEven ? 'timeline-start md:text-end' : 'timeline-end';
  const timelineEnd = isEven ? 'timeline-end' : 'timeline-start md:text-start';

  // Education icon
  const getIcon = () => {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
      </svg>
    );
  };

  return (
    <li className="timeline-item animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Timeline line before */}
      {index > 0 && (
        <hr 
          style={{
            background: `linear-gradient(to right, ${colorGradient})`,
          }}
        />
      )}

      {/* Institution Info */}
      <div className={`${timelineStart} mb-10`}>
        <div className="text-lg font-bold text-base-content mb-2 text-center md:text-right">
          {institution}
        </div>
        {location && (
          <div className="text-sm text-base-content/60 text-center md:text-right">
            {location}
          </div>
        )}
        {formattedDates.range && (
          <div className="text-sm text-primary font-semibold text-center md:text-right mt-1">
            {formattedDates.range}
          </div>
        )}
      </div>

      {/* Timeline Connector */}
      <div className="timeline-middle">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${iconColorClass}`}>
          {getIcon()}
        </div>
      </div>

      {/* Education Details */}
      <div className={`${timelineEnd} mb-10`}>
        <div className="timeline-box bg-base-200 shadow-lg">
          <div className="p-6">
            {/* Title */}
            <div className="mb-4">
              <h3 className="card-title text-xl text-primary mb-2">
                {`${studyType} in ${area}`}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="badge badge-info badge-outline">
                  {studyType}
                </div>
                {gpa && (
                  <div className="badge badge-success badge-outline">
                    GPA: {gpa}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="mb-4">
                <p className="text-base-content/80 leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Courses */}
            {courses.length > 0 && (
              <div>
                <h4 className="font-semibold text-base-content mb-3">
                  Key Courses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {courses.map((course, courseIndex) => (
                    <div 
                      key={courseIndex} 
                      className="badge badge-outline badge-sm"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline line after */}
      {!isLast && (
        <hr 
          style={{
            background: `linear-gradient(to right, ${colorGradient})`,
          }}
        />
      )}
    </li>
  );
});

export default ServerEducationTimelineItem;
