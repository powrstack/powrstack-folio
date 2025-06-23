'use client';

import { useState } from 'react';

export default function SkillsSection({ about, skills }) {
  // Since the resume.json doesn't have categories, we'll create logical categories
  // based on common skill patterns
  const createSkillCategories = (skillsArray) => {
    const categories = {
      'Programming Languages': [],
      'Cloud & Infrastructure': [],
      'DevOps & Automation': [],
      'Databases': [],
      'Tools & Frameworks': [],
      'Other': []
    };

    skillsArray?.forEach(skill => {
      const skillName = skill.name.toLowerCase();
      const skillDesc = skill.description?.toLowerCase() || '';
      
      if (['java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust'].some(lang => skillName.includes(lang))) {
        categories['Programming Languages'].push(skill);
      } else if (['aws', 'azure', 'gcp', 'cloud', 'ec2', 's3', 'lambda'].some(cloud => skillName.includes(cloud) || skillDesc.includes(cloud))) {
        categories['Cloud & Infrastructure'].push(skill);
      } else if (['ci/cd', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'containers', 'monitoring'].some(devops => skillName.includes(devops) || skillDesc.includes(devops))) {
        categories['DevOps & Automation'].push(skill);
      } else if (['database', 'sql', 'mongodb', 'postgresql', 'mysql', 'redis'].some(db => skillName.includes(db) || skillDesc.includes(db))) {
        categories['Databases'].push(skill);
      } else if (['spring', 'react', 'angular', 'vue', 'express', 'django', 'flask'].some(framework => skillName.includes(framework) || skillDesc.includes(framework))) {
        categories['Tools & Frameworks'].push(skill);
      } else {
        categories['Other'].push(skill);
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  };

  const [activeCategory, setActiveCategory] = useState('all');
  const groupedSkills = createSkillCategories(about?.skills);
  const skillCategories = Object.keys(groupedSkills);
  const categories = skillCategories.length > 1 ? ['all', ...skillCategories] : [];
  
  // Filter skills based on active category
  const filteredSkills = activeCategory === 'all' 
    ? about?.skills || []
    : groupedSkills[activeCategory] || [];

  return (
    <section id="skills" className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Technologies and tools I work with to build exceptional solutions
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="tabs tabs-boxed">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`tab tab-lg ${activeCategory === category ? 'tab-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'all' ? 'All Skills' : category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skills Display */}
        {activeCategory === 'all' ? (
          // Show all skills grouped by category
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-semibold text-base-content mb-6 text-center">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categorySkills.map((skill, index) => (
                    <div
                      key={`${skill.name}-${index}`}
                      className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="card-body p-6 text-center">
                        {skill.icon && (
                          <div className="text-4xl mb-4 text-primary">
                            <i className={skill.icon}></i>
                          </div>
                        )}
                        <h4 className="card-title text-lg font-semibold text-base-content justify-center">
                          {skill.name}
                        </h4>
                        {skill.description && (
                          <p className="text-sm text-base-content/70 mt-2">
                            {skill.description}
                          </p>
                        )}
                        {skill.level && (
                          <div className="badge badge-primary badge-outline mt-3">
                            {skill.level}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show filtered skills for specific category
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="card-body p-6 text-center">
                  {skill.icon && (
                    <div className="text-4xl mb-4 text-primary">
                      <i className={skill.icon}></i>
                    </div>
                  )}
                  <h4 className="card-title text-lg font-semibold text-base-content justify-center">
                    {skill.name}
                  </h4>
                  {skill.description && (
                    <p className="text-sm text-base-content/70 mt-2">
                      {skill.description}
                    </p>
                  )}
                  {skill.level && (
                    <div className="badge badge-primary badge-outline mt-3">
                      {skill.level}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback if no skills data */}
        {(!about?.skills || about.skills.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-xl text-base-content/70">
              Skills data not available. Please check your resume.json file.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
