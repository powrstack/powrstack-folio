'use client';

import { useState, useEffect } from 'react';

export default function SkillsSection({ skills, about }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Use detailed skills if available, otherwise fall back to skill names
  const skillsData = about?.skills || skills?.map(skill => ({ name: skill })) || [];

  if (!skillsData || skillsData.length === 0) {
    return null;
  }

  // Group skills by category (you can enhance this based on your data structure)
  const skillCategories = {
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript'],
    'DevOps & Cloud': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'GitLab CI', 'Containers', 'CI/CD'],
    'Monitoring': ['Grafana', 'InfluxDB', 'Telegraf', 'Monitoring'],
    'Infrastructure': ['Terraform', 'Ansible', 'Vagrant', 'Infrastructure as Code', 'Configuration Management'],
    'Other': []
  };

  // Create a map for better categorization
  const categorizedSkills = {
    'Languages': [],
    'DevOps & Cloud': [],
    'Monitoring': [],
    'Infrastructure': [],
    'Other': []
  };

  // Categorize skills
  skillsData.forEach(skillObj => {
    const skillName = typeof skillObj === 'string' ? skillObj : skillObj.name;
    let categorized = false;
    
    for (const [category, categoryKeywords] of Object.entries(skillCategories)) {
      if (categoryKeywords.some(keyword => skillName.toLowerCase().includes(keyword.toLowerCase()))) {
        categorizedSkills[category].push(skillObj);
        categorized = true;
        break;
      }
    }
    
    if (!categorized) {
      categorizedSkills['Other'].push(skillObj);
    }
  });

  // Remove empty categories
  Object.keys(categorizedSkills).forEach(key => {
    if (categorizedSkills[key].length === 0) {
      delete categorizedSkills[key];
    }
  });

  const getSkillIcon = (skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    const skillIcons = {
      'Java': '☕',
      'Python': '🐍',
      'JavaScript': '🟨',
      'TypeScript': '🔷',
      'Docker': '🐳',
      'Containers': '📦',
      'Kubernetes': '⚙️',
      'AWS': '☁️',
      'Jenkins': '🔧',
      'CI/CD': '🔄',
      'Monitoring': '📊',
      'Infrastructure as Code': '🏗️',
      'Configuration Management': '⚡',
      'Serverless': '⚡',
    };
    
    return skillIcons[skillName] || (skill.icon ? skill.icon : '�');
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Technologies and tools I work with to build scalable solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.entries(categorizedSkills).map(([category, categorySkills], categoryIndex) => (
            <div
              key={category}
              className={`transition-all duration-1000 delay-${categoryIndex * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                  {category}
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {categorySkills.map((skill, skillIndex) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    const skillDescription = typeof skill === 'object' ? skill.description : null;
                    
                    return (
                      <div
                        key={skillName}
                        className="group bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
                        title={skillDescription || skillName}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getSkillIcon(skill)}</span>
                            <div className="flex-1">
                              <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {skillName}
                              </span>
                              {skillDescription && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {skillDescription}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Skill level indicator (you can make this dynamic) */}
                          <div className="flex space-x-1 ml-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                  level <= (skillIndex % 3 + 3) // Random skill level for demo
                                    ? 'bg-blue-500 group-hover:bg-purple-500'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        <div className={`mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Continuous Learning
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Technology evolves rapidly, and I'm committed to staying current with the latest tools and best practices in DevOps and software engineering.
            </p>
            <div className="flex justify-center space-x-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{skillsData.length}+</div>
                <div className="text-sm text-blue-200">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">7+</div>
                <div className="text-sm text-blue-200">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">∞</div>
                <div className="text-sm text-blue-200">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
