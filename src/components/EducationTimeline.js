'use client';

import { useState, useEffect } from 'react';

export default function EducationTimeline({ education }) {
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!education || education.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Educational Journey
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            My academic background and continuous learning path
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div
              key={index}
              className={`timeline-item transition-all duration-500 delay-${index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="card card-side bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                   onClick={() => setSelectedEducation(selectedEducation === index ? null : index)}
                   role="button"
                   tabIndex={0}
                   aria-expanded={selectedEducation === index}
                   aria-label={`${selectedEducation === index ? 'Collapse' : 'Expand'} details for ${edu.degree} at ${edu.institution}`}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                       e.preventDefault();
                       setSelectedEducation(selectedEducation === index ? null : index);
                     }
                   }}>
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    {/* Timeline indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`badge badge-lg w-12 h-12 rounded-full ${
                        selectedEducation === index ? 'badge-primary' : 'badge-outline'
                      }`}>
                        {index + 1}
                      </div>
                      {index < education.length - 1 && (
                        <div className="w-0.5 h-16 bg-base-300 mt-2"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <h3 className="card-title text-base-content">{edu.degree}</h3>
                        <div className="badge badge-secondary">{edu.year}</div>
                      </div>
                      
                      <div className="flex items-center text-base-content/70 mb-2">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-3a1 1 0 011-1h2a1 1 0 011 1v3m-6 0V9a1 1 0 011-1h2a1 1 0 011 1v12" />
                        </svg>
                        <span className="font-medium">{edu.institution}</span>
                      </div>
                      
                      {edu.description && (
                        <p className="text-base-content/60 text-sm">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedEducation === index && (
                <div className="collapse collapse-open bg-base-200 mt-4">
                  <div className="collapse-content">
                    {edu.courses && edu.courses.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Key Courses
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {edu.courses.map((course, courseIndex) => (
                            <div key={courseIndex} className="badge badge-outline badge-lg justify-start">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-base-content/50">
            Click on any education item to see detailed information
          </p>
        </div>
      </div>
    </section>
  );
}
