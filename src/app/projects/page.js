import { loadResumeData } from '@/lib/resumeLoader';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilters from '@/components/ProjectFilters';
import Header from '@/components/Header';

export const metadata = {
  title: 'Projects - Abu Raihan Srabon',
  description: 'Explore the portfolio of projects by Abu Raihan Srabon - Full Stack Developer showcasing web applications, mobile apps, and technical solutions.',
};

export default async function ProjectsPage() {
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
              Featured
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 ml-4">
                Projects
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              A showcase of my technical projects, from web applications to mobile solutions. Each project represents a unique challenge solved with modern technologies.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                {transformedData.projects.length} Projects
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                Multiple Technologies
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                Open Source
              </span>
            </div>
          </div>
        </section>

        {/* Project Filters */}
        <section className="relative py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ProjectFilters projects={transformedData.projects} />
          </div>
        </section>

        {/* Projects Grid */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div id="projects-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transformedData.projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Used */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Technologies Used
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                The diverse tech stack powering these projects.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from(new Set(transformedData.projects.flatMap(p => p.technologies))).map((tech, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 text-center hover:bg-white/10 transition-all duration-200">
                  <span className="text-white font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GitHub Stats */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Open Source Contributions
                </h2>
                <p className="text-lg text-gray-300">
                  Find more of my work on GitHub and contribute to open source projects.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{transformedData.projects.length}+</div>
                  <div className="text-gray-300">Public Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                  <div className="text-gray-300">Commits This Year</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">10+</div>
                  <div className="text-gray-300">Languages Used</div>
                </div>
              </div>
              
              <div className="text-center">
                <a
                  href={transformedData.basics.profiles.find(p => p.network === 'GitHub')?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  View GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Have a Project in Mind?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Let's collaborate and bring your ideas to life with modern web technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Start a Project
                </a>
                <a
                  href="/experience"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  View Experience
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
