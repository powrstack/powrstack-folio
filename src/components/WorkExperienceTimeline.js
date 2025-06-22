'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WorkExperienceTimeline({ experience }) {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Professional Journey
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            My career progression and key achievements in professional software development
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {experience.map((exp, index) => (
            <div
              key={index}
              className={`transition-all duration-500 delay-${index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="card card-side bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                   onClick={() => setSelectedExperience(selectedExperience === index ? null : index)}>
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    {/* Company Logo/Timeline indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`avatar placeholder ${
                        selectedExperience === index ? 'ring ring-primary ring-offset-base-100 ring-offset-2' : ''
                      }`}>
                        <div className="bg-primary text-primary-content rounded-full w-12">
                          <span className="text-xs font-bold">
                            {exp.company.split(' ').map(word => word[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                      </div>
                      {index < experience.length - 1 && (
                        <div className="w-0.5 h-16 bg-base-300 mt-2"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div>
                          <h3 className="card-title text-base-content">{exp.title}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="badge badge-secondary">{exp.duration}</div>
                          {exp.location && (
                            <div className="text-sm text-base-content/60">📍 {exp.location}</div>
                          )}
                        </div>
                      </div>
                      
                      {exp.description && (
                        <p className="text-base-content/60 text-sm">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedExperience === index && (
                <div className="collapse collapse-open bg-base-100 mt-4 shadow-lg">
                  <div className="collapse-content">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                      {/* Left Column - Technologies */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-base-content mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <div key={techIndex} className="badge badge-outline">
                                {tech}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Right Column - Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Key Achievements
                          </h4>
                          <div className="space-y-3">
                            {exp.achievements.map((achievement, achievementIndex) => (
                              <div key={achievementIndex} className="alert alert-success">
                                <svg className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-base-content/50">
            Click on any experience item to explore the details
          </p>
        </div>
      </div>
    </section>
  );
}
