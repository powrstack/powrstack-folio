'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import blogLoader from '../../lib/blogLoader';
import { logger } from '../../lib/logger';

// Aggressively lazy-load BlogGrid
const BlogGrid = dynamic(() => import('./BlogGrid'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
            <div className="h-48 bg-base-300"></div>
            <div className="card-body">
              <div className="h-6 bg-base-300 rounded mb-2"></div>
              <div className="h-4 bg-base-300 rounded mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
});

export default function BlogContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  library.add(fab, fas);

  useEffect(() => {
    loadBlogPosts();
    setConfig(blogLoader.getConfig());
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load posts from all enabled sources
      const blogPosts = await blogLoader.getAllPosts(20);
      setPosts(blogPosts);
    } catch (err) {
      logger.error('Error loading blog posts:', err);
      setError(err.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    blogLoader.clearCache();
    loadBlogPosts();
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Hero Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-primary">Blog</span> & 
                <span className="text-secondary ml-2">Articles</span>
              </h1>
              
              {/* Hero Description */}
              <p className="text-lg md:text-xl lg:text-2xl text-base-content/70 leading-relaxed max-w-3xl mx-auto">
                Insights, tutorials, and thoughts on software development, technology, and more.
              </p>
              
              {/* Blog Sources - Improved with better DaisyUI styling */}
              {config && (
                <div className="flex flex-wrap justify-center gap-3 py-4">
                  {Object.entries(config.sources)
                    .filter(([_, sourceConfig]) => sourceConfig.enabled)
                    .map(([source, sourceConfig]) => (
                      <motion.a
                        key={source}
                        href={sourceConfig.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm hover:btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FontAwesomeIcon 
                          icon={
                            source === 'dev' ? ['fab', 'dev'] :
                            source === 'hashnode' ? ['fas', 'blog'] :
                            source === 'medium' ? ['fab', 'medium'] :
                            ['fas', 'blog']
                          } 
                          className="w-4 h-4" 
                        />
                        {source === 'dev' ? 'Dev.to' : 
                         source === 'hashnode' ? 'Hashnode' :
                         source === 'medium' ? 'Medium' : source}
                      </motion.a>
                    ))}
                </div>
              )}

              {/* Stats - Improved with better responsive design */}
              <motion.div
                className="stats stats-vertical sm:stats-horizontal shadow-lg bg-base-200/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="stat place-items-center">
                  <div className="stat-title">Total Articles</div>
                  <div className="stat-value text-primary">
                    {posts.length}
                  </div>
                  <div className="stat-desc">Published posts</div>
                </div>
                
                <div className="stat place-items-center">
                  <div className="stat-title">Sources</div>
                  <div className="stat-value text-secondary">
                    {blogLoader.getAvailableSources().length}
                  </div>
                  <div className="stat-desc">Blog platforms</div>
                </div>
                
                <div className="stat place-items-center">
                  <div className="stat-title">Reactions</div>
                  <div className="stat-value text-accent">
                    {posts.reduce((total, post) => total + (post.stats.reactions || 0), 0)}
                  </div>
                  <div className="stat-desc">Total engagement</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header with Refresh */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-base-content">
                Latest Posts
              </h2>
              <p className="text-base-content/60 mt-2">
                Stay updated with my latest thoughts and tutorials
              </p>
            </motion.div>
            
            <motion.button
              onClick={handleRefresh}
              className={`btn btn-outline btn-sm gap-2 ${loading ? 'loading' : ''}`}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {!loading && (
                <FontAwesomeIcon 
                  icon={['fas', 'refresh']} 
                  className="w-4 h-4" 
                />
              )}
              Refresh
            </motion.button>
          </div>

          {/* Blog Grid */}
          <BlogGrid
            posts={posts}
            loading={loading}
            error={error}
            showFeatured={config?.showFeaturedPost}
            showFilters={true}
            showPagination={true}
            postsPerPage={config?.postsPerPage || 9}
          />

          {/* Call to Action Section */}
          {!loading && posts.length > 0 && (
            <motion.div
              className="card bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="card-body text-center py-12">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={['fas', 'rss']} className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="card-title text-2xl lg:text-3xl justify-center mb-4">
                  Stay Connected
                </h3>
                
                <p className="text-base-content/70 text-lg max-w-2xl mx-auto mb-8">
                  Want to stay updated with my latest articles and insights? Follow me on your favorite platform!
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  {config && Object.entries(config.sources)
                    .filter(([_, sourceConfig]) => sourceConfig.enabled)
                    .map(([source, sourceConfig]) => (
                      <a
                        key={source}
                        href={sourceConfig.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-outline hover:btn-primary gap-2"
                      >
                        <FontAwesomeIcon 
                          icon={
                            source === 'dev' ? ['fab', 'dev'] :
                            source === 'hashnode' ? ['fas', 'blog'] :
                            source === 'medium' ? ['fab', 'medium'] :
                            ['fas', 'blog']
                          } 
                          className="w-4 h-4" 
                        />
                        Follow on {source === 'dev' ? 'Dev.to' : 
                                  source === 'hashnode' ? 'Hashnode' :
                                  source === 'medium' ? 'Medium' : source}
                      </a>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
