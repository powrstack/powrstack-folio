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
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            My career progression and key achievements in software engineering and DevOps
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative overflow-x-auto pb-8">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 dark:from-green-800 dark:via-blue-800 dark:to-purple-800 transform -translate-y-1/2 rounded-full min-w-max"></div>

          {/* Timeline Items */}
          <div className="flex justify-between items-center relative min-w-max space-x-16 px-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Timeline Node */}
                <div
                  className="relative cursor-pointer group"
                  onMouseEnter={() => setSelectedExperience(index)}
                  onMouseLeave={() => setSelectedExperience(null)}
                  onClick={() => setSelectedExperience(selectedExperience === index ? null : index)}
                >
                  {/* Company Logo Circle */}
                  <div className={`w-16 h-16 rounded-full border-4 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 hover:scale-110 overflow-hidden ${
                    selectedExperience === index
                      ? 'border-blue-500 shadow-blue-500/50'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                  }`}>
                    <div className="w-full h-full flex items-center justify-center">
                      {/* Company Logo or Initial */}
                      <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {exp.company.split(' ').map(word => word[0]).join('').substring(0, 2)}
                      </div>
                    </div>
                  </div>

                  {/* Duration Label */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm">
                      {exp.duration}
                    </span>
                  </div>

                  {/* Position and Company (Always Visible) */}
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-center max-w-56">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {exp.location}
                      </p>
                    )}
                  </div>

                  {/* Hover Indicator */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 ${
                    selectedExperience === index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Information Panel */}
        {selectedExperience !== null && (
          <div className="mt-16 transition-all duration-500 ease-in-out">
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-gray-600">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4"></div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {experience[selectedExperience].title}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                      {experience[selectedExperience].company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {experience[selectedExperience].duration}
                  </span>
                  {experience[selectedExperience].location && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      📍 {experience[selectedExperience].location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Description and Technologies */}
                <div className="space-y-6">
                  {experience[selectedExperience].description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Role Overview
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {experience[selectedExperience].description}
                      </p>
                    </div>
                  )}

                  {experience[selectedExperience].technologies && experience[selectedExperience].technologies.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience[selectedExperience].technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Achievements */}
                {experience[selectedExperience].achievements && experience[selectedExperience].achievements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Key Achievements
                    </h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {experience[selectedExperience].achievements.map((achievement, achievementIndex) => (
                        <div
                          key={achievementIndex}
                          className="flex items-start space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click or hover over the timeline points to explore my professional experience
          </p>
        </div>
      </div>
    </section>
  );
}
