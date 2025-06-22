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
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Educational Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            My academic background and continuous learning path
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 dark:from-blue-800 dark:via-purple-800 dark:to-blue-800 transform -translate-y-1/2 rounded-full"></div>

          {/* Timeline Items */}
          <div className="flex justify-between items-center relative">
            {education.map((edu, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Timeline Node */}
                <div
                  className="relative cursor-pointer group"
                  onMouseEnter={() => setSelectedEducation(index)}
                  onMouseLeave={() => setSelectedEducation(null)}
                  onClick={() => setSelectedEducation(selectedEducation === index ? null : index)}
                >
                  {/* Node Circle */}
                  <div className={`w-12 h-12 rounded-full border-4 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 hover:scale-110 ${
                    selectedEducation === index
                      ? 'border-blue-500 shadow-blue-500/50'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                  }`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      selectedEducation === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-gray-700 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Year Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full border">
                      {edu.year}
                    </span>
                  </div>

                  {/* Institution Name (Always Visible) */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center max-w-48">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 leading-tight">
                      {edu.institution}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {edu.degree}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Information Panel */}
        {selectedEducation !== null && (
          <div className="mt-16 transition-all duration-500 ease-in-out">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-gray-600">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {education[selectedEducation].degree}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-3a1 1 0 011-1h2a1 1 0 011 1v3m-6 0V9a1 1 0 011-1h2a1 1 0 011 1v12" />
                      </svg>
                      <span className="font-medium">{education[selectedEducation].institution}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6z" />
                      </svg>
                      <span className="font-medium">{education[selectedEducation].year}</span>
                    </div>
                    
                    {education[selectedEducation].description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                        {education[selectedEducation].description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Courses */}
                {education[selectedEducation].courses && education[selectedEducation].courses.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Key Courses
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {education[selectedEducation].courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">{course}</span>
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
            Click or hover over the timeline points to see detailed information
          </p>
        </div>
      </div>
    </section>
  );
}
