import { loadResumeData } from '@/lib/resumeLoader';
import BlogCard from '@/components/BlogCard';
import BlogFilters from '@/components/BlogFilters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata() {
  try {
    const resumeData = await loadResumeData();
    const { personalInfo } = resumeData;
    
    return {
      title: `Blog & Articles - ${personalInfo.name}`,
      description: `Read technical articles, tutorials, and insights by ${personalInfo.name} - ${personalInfo.title} sharing knowledge about web development, programming, and technology.`,
    };
  } catch (error) {
    return {
      title: "Blog & Articles - Developer Portfolio",
      description: "Read technical articles, tutorials, and insights sharing knowledge about web development, programming, and technology.",
    };
  }
}

export default async function BlogPage() {
  const transformedData = await loadResumeData();

  return (
    <div className="min-h-screen bg-base-100">
      <Header resumeData={transformedData} />
      
      {/* Hero Section */}
      <section className="hero min-h-[50vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-base-content mb-6">
              Blog &
              <span className="text-primary ml-2">Articles</span>
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              Sharing knowledge, insights, and experiences in web development, programming best practices, and emerging technologies.
            </p>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-value text-primary">{transformedData.publications?.length || 0}</div>
                <div className="stat-title">Articles</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">Tech</div>
                <div className="stat-title">Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {transformedData.publications?.length > 0 && (
        <section className="py-20 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-base-content mb-4">Featured Article</h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                      <div className="aspect-video bg-primary/20 rounded-xl flex items-center justify-center">
                        <div className="text-primary text-center">
                          <div className="text-4xl mb-2">📝</div>
                          <div className="text-sm font-medium">Featured</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-2/3">
                      <div className="mb-4">
                        <span className="badge badge-primary">
                          {transformedData.publications[0].type || 'Article'}
                        </span>
                      </div>
                      
                      <h3 className="card-title text-2xl lg:text-3xl mb-4">
                        {transformedData.publications[0].name}
                      </h3>
                      
                      <p className="text-base-content/70 mb-6">
                        {transformedData.publications[0].summary}
                      </p>
                      
                      <div className="card-actions justify-between items-center">
                        <div className="text-sm text-base-content/60">
                          {transformedData.publications[0].releaseDate}
                        </div>
                        
                        {transformedData.publications[0].url && (
                          <a
                            href={transformedData.publications[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
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
          </div>
        </section>
      )}

      {/* Blog Filters */}
      <section className="py-8 bg-base-100">
        <div className="container mx-auto px-4">
          <BlogFilters articles={transformedData.publications} />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 bg-base-100">
        <div className="container mx-auto px-4">
          <div id="articles-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transformedData.publications?.map((article, index) => (
              <BlogCard key={index} article={article} index={index} />
            )) || (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-base-content mb-4">Articles Coming Soon</h3>
                <p className="text-base-content/70 max-w-md mx-auto">
                  I'm working on creating valuable content about web development, programming best practices, and technology insights. Stay tuned!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Topics I Write About */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Topics I Write About
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
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
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200">
                <div className="card-body">
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="card-title text-lg">{topic.title}</h3>
                  <p className="text-base-content/70 text-sm">{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <h2 className="card-title text-2xl md:text-3xl justify-center mb-4">
                  Stay Updated
                </h2>
                <p className="text-lg text-base-content/70 mb-8">
                  Get notified when I publish new articles and share insights about web development.
                </p>
                
                <div className="max-w-md mx-auto">
                  <div className="join w-full">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input input-bordered join-item flex-1"
                    />
                    <button className="btn btn-primary join-item">
                      Subscribe
                    </button>
                  </div>
                  
                  <p className="text-xs text-base-content/60 mt-3">
                    No spam, unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl md:text-3xl justify-center mb-4">
                  Let's Connect
                </h2>
                <p className="text-lg text-base-content/70 mb-8">
                  Have questions about any of my articles or want to discuss a topic? I'd love to hear from you.
                </p>
                <div className="card-actions justify-center gap-4">
                  <a
                    href="/#contact"
                    className="btn btn-primary"
                  >
                    Get in Touch
                  </a>
                  <a
                    href={transformedData.basics?.profiles?.find(p => p.network === 'Twitter')?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Follow on Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer resumeData={transformedData} />
    </div>
  );
}
