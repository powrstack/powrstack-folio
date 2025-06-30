'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BlogCard } from './';

/**
 * BlogGrid component to display a grid of blog posts with filtering and pagination
 */
export default function BlogGrid({ 
  posts = [], 
  loading = false, 
  error = null,
  showFeatured = true,
  showFilters = true,
  showPagination = true,
  postsPerPage = 9,
  className = ''
}) {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Get unique tags and sources
  const allTags = [...new Set(posts.flatMap(post => post.tags))].sort();
  const allSources = [...new Set(posts.map(post => post.source))].sort();

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Apply source filter
    if (selectedSource) {
      filtered = filtered.filter(post => post.source === selectedSource);
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'reactions':
        filtered.sort((a, b) => b.stats.reactions - a.stats.reactions);
        break;
      case 'readTime':
        filtered.sort((a, b) => a.readingTimeMinutes - b.readingTimeMinutes);
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [posts, searchQuery, selectedTag, selectedSource, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Get featured post (first post)
  const featuredPost = showFeatured && posts.length > 0 ? posts[0] : null;
  const nonFeaturedPosts = showFeatured && posts.length > 0 ? paginatedPosts.filter(post => post.id !== featuredPost.id) : paginatedPosts;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedSource('');
    setSortBy('date');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-base-content">Loading Articles</h3>
            <p className="text-base-content/60">Fetching the latest blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="alert alert-error shadow-lg">
          <div>
            <FontAwesomeIcon icon={['fas', 'exclamation-triangle']} className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Error Loading Posts</h3>
              <div className="text-xs">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="hero min-h-64">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={['fas', 'blog']} className="w-10 h-10 text-base-content/30" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Articles Found</h3>
              <p className="text-base-content/60 mb-6">Check back later for new content!</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Filters */}
      {showFilters && (
        <motion.div
          className="card bg-base-200 shadow-lg mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">
              <FontAwesomeIcon icon={['fas', 'filter']} className="w-5 h-5 text-primary" />
              Filter & Search
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Search */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Search articles</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <FontAwesomeIcon icon={['fas', 'search']} className="w-4 h-4 opacity-70" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="grow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="btn btn-ghost btn-xs btn-circle"
                    >
                      <FontAwesomeIcon icon={['fas', 'times']} className="w-3 h-3" />
                    </button>
                  )}
                </label>
              </div>

              {/* Tag Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Filter by tag</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>#{tag}</option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Filter by source</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                >
                  <option value="">All Sources</option>
                  {allSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              {/* Sort & Clear */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Sort by</span>
                </label>
                <div className="join">
                  <select
                    className="select select-bordered join-item flex-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="reactions">Reactions</option>
                    <option value="readTime">Read Time</option>
                  </select>
                  <button
                    onClick={clearFilters}
                    className="btn btn-outline join-item"
                    disabled={!searchQuery && !selectedTag && !selectedSource && sortBy === 'date'}
                    title="Clear all filters"
                  >
                    <FontAwesomeIcon icon={['fas', 'times']} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedTag || selectedSource) && (
              <div className="mt-4 pt-4 border-t border-base-300">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-base-content/70">Active filters:</span>
                  {searchQuery && (
                    <div className="badge badge-primary gap-2">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')}>
                        <FontAwesomeIcon icon={['fas', 'times']} className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedTag && (
                    <div className="badge badge-secondary gap-2">
                      #{selectedTag}
                      <button onClick={() => setSelectedTag('')}>
                        <FontAwesomeIcon icon={['fas', 'times']} className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedSource && (
                    <div className="badge badge-accent gap-2">
                      {selectedSource}
                      <button onClick={() => setSelectedSource('')}>
                        <FontAwesomeIcon icon={['fas', 'times']} className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-base-300">
              <div className="stats stats-horizontal shadow bg-base-100">
                <div className="stat place-items-center">
                  <div className="stat-title">Showing</div>
                  <div className="stat-value text-sm">{filteredPosts.length}</div>
                  <div className="stat-desc">of {posts.length} posts</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={['fas', 'star']} className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Featured Article</h2>
          </div>
          <BlogCard post={featuredPost} featured={true} />
        </motion.div>
      )}

      {/* Posts Grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key="posts-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {nonFeaturedPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants} className="h-full">
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            className="hero min-h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="hero-content text-center">
              <div className="max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={['fas', 'search']} className="w-10 h-10 text-base-content/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Articles Found</h3>
                <p className="text-base-content/60 mb-6">
                  No articles match your current filters. Try adjusting your search criteria.
                </p>
                <button onClick={clearFilters} className="btn btn-primary gap-2">
                  <FontAwesomeIcon icon={['fas', 'refresh']} className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Page Info */}
          <div className="text-sm text-base-content/70">
            Page {currentPage} of {totalPages} ({filteredPosts.length} articles)
          </div>
          
          {/* Pagination Controls */}
          <div className="join">
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              <FontAwesomeIcon icon={['fas', 'angles-left']} className="w-4 h-4" />
            </button>
            
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              title="Previous page"
            >
              <FontAwesomeIcon icon={['fas', 'chevron-left']} className="w-4 h-4" />
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  className={`join-item btn ${currentPage === page ? 'btn-active' : 'btn-outline'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              <FontAwesomeIcon icon={['fas', 'chevron-right']} className="w-4 h-4" />
            </button>
            
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              <FontAwesomeIcon icon={['fas', 'angles-right']} className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
