'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function AboutHero({ resumeData }) {
  const [isVisible, setIsVisible] = useState(false);
  const { personalInfo, about, projects } = resumeData;
  
  // Extract key expertise areas from projects keywords and skills
  const getKeyExpertise = () => {
    const allKeywords = [];
    
    // Get keywords from projects
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        if (project.technologies) {
          allKeywords.push(...project.technologies);
        }
      });
    }
    
    // Get top skills
    if (about?.skillNames) {
      allKeywords.push(...about.skillNames.slice(0, 5));
    }
    
    // Count occurrences and get top expertise areas
    const keywordCount = {};
    allKeywords.forEach(keyword => {
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });
    
    // Sort by frequency and get top 2
    const sortedKeywords = Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([keyword]) => keyword);
    
    return sortedKeywords.length >= 2 ? sortedKeywords : 
           personalInfo?.title ? [personalInfo.title.split('/')[0].trim(), personalInfo.title.split('/')[1]?.trim() || 'Expert'] :
           ['Developer', 'Expert'];
  };

  const expertiseAreas = getKeyExpertise();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero min-h-screen bg-gradient-to-br from-base-100 to-base-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
      
      <div className="hero-content container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content mb-6">
              About{' '}
              <span className="text-primary">
                Me
              </span>
            </h1>
            
            <div className="space-y-6 text-lg text-base-content/70 leading-relaxed">
              <p>
                {about?.bio || personalInfo?.summary || 'Passionate about technology and innovation.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content">
                      Experience
                    </h3>
                    <p className="text-3xl font-bold text-primary">7+</p>
                    <p className="text-sm text-base-content/60">Years in Software Engineering</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content">
                      Specialization
                    </h3>
                    <p className="text-lg font-semibold text-secondary">DevOps</p>
                    <p className="text-sm text-base-content/60">& System Architecture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="avatar">
                <div className="w-80 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
                  <Image
                    src={personalInfo?.profileImage || '/images/aburaihansrabon.svg'}
                    alt={personalInfo?.name || 'Profile'}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="badge badge-primary badge-lg absolute -top-4 -right-4 shadow-lg animate-bounce">
                {expertiseAreas[0]}
              </div>
              <div className="badge badge-secondary badge-lg absolute -bottom-4 -left-4 shadow-lg animate-bounce delay-500">
                {expertiseAreas[1]}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-100 w-full">
            {[
              { label: 'Projects Delivered', value: '50+', icon: '🚀' },
              { label: 'Technologies Mastered', value: '20+', icon: '⚡' },
              { label: 'Team Members Led', value: '15+', icon: '👥' },
              { label: 'System Uptime', value: '99.99%', icon: '📊' },
            ].map((stat, index) => (
              <div key={index} className="stat">
                <div className="stat-figure text-3xl">{stat.icon}</div>
                <div className="stat-value text-primary">{stat.value}</div>
                <div className="stat-title">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
