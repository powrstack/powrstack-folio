'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function AboutHero({ resumeData }) {
  const [isVisible, setIsVisible] = useState(false);
  const { personalInfo, about } = resumeData;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 dark:bg-blue-900 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-200 dark:bg-purple-900 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Me
              </span>
            </h1>
            
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                {about?.bio || personalInfo?.summary || 'Passionate about technology and innovation.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Experience
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">7+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years in Software Engineering</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Specialization
                  </h3>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">DevOps</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">& System Architecture</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl">
                <Image
                  src={personalInfo?.profileImage || '/images/aburaihansrabon.svg'}
                  alt={personalInfo?.name || 'Profile'}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                DevOps Expert
              </div>
              <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce delay-500">
                Team Leader
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Projects Delivered', value: '50+', icon: '🚀' },
              { label: 'Technologies Mastered', value: '20+', icon: '⚡' },
              { label: 'Team Members Led', value: '15+', icon: '👥' },
              { label: 'System Uptime', value: '99.99%', icon: '📊' },
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
