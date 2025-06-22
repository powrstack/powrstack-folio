import { loadResumeData } from '@/lib/resumeLoader';
import WorkExperienceTimeline from '@/components/WorkExperienceTimeline';
import Header from '@/components/Header';


export const metadata = {
  title: 'Experience - Abu Raihan Srabon',
  description: 'Professional work experience and career journey of Abu Raihan Srabon - Full Stack Developer.',
};

export default async function ExperiencePage() {
  const transformedData = await loadResumeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header resumeData={transformedData} />
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Professional
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 ml-4">
                Experience
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              A comprehensive overview of my professional journey, skills developed, and impact made across different organizations and projects.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                {transformedData.workExperience.length} Positions
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                {transformedData.stats.totalExperience} Experience
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                {transformedData.skills.technical.length + transformedData.skills.tools.length} Technologies
              </span>
            </div>
          </div>
        </section>

        {/* Work Experience Timeline */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Career Timeline
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Explore my professional journey through interactive timeline showcasing roles, responsibilities, and achievements.
              </p>
            </div>
            <WorkExperienceTimeline workExperience={transformedData.workExperience} />
          </div>
        </section>

        {/* Skills Overview */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Technical Expertise
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Technologies and tools I've mastered throughout my career journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Technical Skills */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {transformedData.skills.technical.map((skill, index) => (
                    <span key={index} className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Frameworks */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Tools & Frameworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {transformedData.skills.tools.map((skill, index) => (
                    <span key={index} className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {transformedData.skills.soft.map((skill, index) => (
                    <span key={index} className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Let's Work Together
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Interested in my experience and skills? Let's discuss how I can contribute to your next project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Get In Touch
                </a>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  View Projects
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
