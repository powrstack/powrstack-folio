'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import BlogGrid from '../../components/BlogGrid';
import blogLoader from '../../lib/blogLoader';

export default function BlogPage() {
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
      console.error('Error loading blog posts:', err);
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
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="hero-content container mx-auto px-4">
          <div className="text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-base-content mb-6">
                <span className="text-primary">Blog</span> & Articles
              </h1>
              <p className="text-xl lg:text-2xl text-base-content/70 mb-8 leading-relaxed">
                Insights, tutorials, and thoughts on software development, technology, and more.
              </p>
              
              {/* Blog Sources */}
              {config && (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {Object.entries(config.sources)
                    .filter(([_, sourceConfig]) => sourceConfig.enabled)
                    .map(([source, sourceConfig]) => (
                      <motion.a
                        key={source}
                        href={sourceConfig.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
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
                          className="w-4 h-4 mr-2" 
                        />
                        {source === 'dev' ? 'Dev.to' : 
                         source === 'hashnode' ? 'Hashnode' :
                         source === 'medium' ? 'Medium' : source}
                      </motion.a>
                    ))}
                </div>
              )}

              {/* Stats */}
              <motion.div
                className="stats stats-horizontal shadow-lg bg-base-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="stat">
                  <div className="stat-value text-primary text-2xl">
                    {posts.length}
                  </div>
                  <div className="stat-title">Total Articles</div>
                </div>
                
                <div className="stat">
                  <div className="stat-value text-secondary text-2xl">
                    {blogLoader.getAvailableSources().length}
                  </div>
                  <div className="stat-title">Sources</div>
                </div>
                
                <div className="stat">
                  <div className="stat-value text-accent text-2xl">
                    {posts.reduce((total, post) => total + (post.stats.reactions || 0), 0)}
                  </div>
                  <div className="stat-title">Total Reactions</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Header with Refresh */}
          <div className="flex justify-between items-center mb-8">
            <motion.h2
              className="text-3xl font-bold text-base-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Latest Posts
            </motion.h2>
            
            <motion.button
              onClick={handleRefresh}
              className="btn btn-ghost btn-sm"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FontAwesomeIcon 
                icon={['fas', 'refresh']} 
                className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
              />
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

          {/* Additional Information */}
          {!loading && posts.length > 0 && (
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="divider">
                <FontAwesomeIcon icon={['fas', 'rss']} className="w-5 h-5 text-primary" />
              </div>
              <p className="text-base-content/60 mt-4">
                Want to stay updated? Follow me on my blog platforms for the latest content!
              </p>
              <div className="flex justify-center gap-4 mt-4">
                {config && Object.entries(config.sources)
                  .filter(([_, sourceConfig]) => sourceConfig.enabled)
                  .map(([source, sourceConfig]) => (
                    <a
                      key={source}
                      href={sourceConfig.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      Subscribe on {source === 'dev' ? 'Dev.to' : 
                                 source === 'hashnode' ? 'Hashnode' :
                                 source === 'medium' ? 'Medium' : source}
                    </a>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
