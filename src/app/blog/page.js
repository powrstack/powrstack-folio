import { loadResumeData } from '@/lib/resumeLoader';
import BlogCard from '@/components/BlogCard';
import BlogFilters from '@/components/BlogFilters';
import Header from '@/components/Header';

export const metadata = {
  title: 'Blog & Articles - Abu Raihan Srabon',
  description: 'Read technical articles, tutorials, and insights by Abu Raihan Srabon - Full Stack Developer sharing knowledge about web development, programming, and technology.',
};

export default async function BlogPage() {
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
              Blog &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 ml-4">
                Articles
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Sharing knowledge, insights, and experiences in web development, programming best practices, and emerging technologies.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                {transformedData.publications.length} Articles
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                Technical Insights
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                Development Tips
              </span>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {transformedData.publications.length > 0 && (
          <section className="relative py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Featured Article</h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-4xl mb-2">📝</div>
                          <div className="text-sm font-medium">Featured</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <div className="mb-4">
                        <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm mb-2">
                          {transformedData.publications[0].type || 'Article'}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {transformedData.publications[0].name}
                      </h3>
                      
                      <p className="text-gray-300 mb-6 line-clamp-3">
                        {transformedData.publications[0].summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          {transformedData.publications[0].releaseDate}
                        </div>
                        
                        {transformedData.publications[0].url && (
                          <a
                            href={transformedData.publications[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                          >
                            Read Article
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Filters */}
        <section className="relative py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <BlogFilters articles={transformedData.publications} />
          </div>
        </section>

        {/* Articles Grid */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div id="articles-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transformedData.publications.map((article, index) => (
                <BlogCard key={index} article={article} index={index} />
              ))}
            </div>
            
            {transformedData.publications.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-4">Articles Coming Soon</h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  I'm working on creating valuable content about web development, programming best practices, and technology insights. Stay tuned!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Topics I Write About */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Topics I Write About
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Exploring various aspects of modern web development and software engineering.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '⚛️',
                  title: 'React & Next.js',
                  description: 'Modern React patterns, Next.js features, and performance optimization'
                },
                {
                  icon: '🚀',
                  title: 'Web Performance',
                  description: 'Optimization techniques, Core Web Vitals, and fast loading strategies'
                },
                {
                  icon: '🔧',
                  title: 'Development Tools',
                  description: 'Productivity tools, workflows, and development best practices'
                },
                {
                  icon: '💾',
                  title: 'Backend & APIs',
                  description: 'API design, database optimization, and server-side development'
                },
                {
                  icon: '🎨',
                  title: 'UI/UX Design',
                  description: 'Design systems, accessibility, and user experience principles'
                },
                {
                  icon: '☁️',
                  title: 'Cloud & DevOps',
                  description: 'Deployment strategies, cloud services, and infrastructure'
                },
                {
                  icon: '📱',
                  title: 'Mobile Development',
                  description: 'Responsive design, PWAs, and mobile-first approaches'
                },
                {
                  icon: '🔒',
                  title: 'Security',
                  description: 'Web security best practices and secure coding techniques'
                }
              ].map((topic, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{topic.title}</h3>
                  <p className="text-gray-300 text-sm">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Stay Updated
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Get notified when I publish new articles and share insights about web development.
                </p>
                
                <div className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-3">
                    No spam, unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Let's Connect
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Have questions about any of my articles or want to discuss a topic? I'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Get in Touch
                </a>
                <a
                  href={transformedData.basics.profiles.find(p => p.network === 'Twitter')?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Follow on Twitter
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
