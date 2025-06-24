'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BlogCard from './BlogCard';

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
        <div className="flex justify-center items-center min-h-64">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <span className="ml-4 text-lg">Loading blog posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="alert alert-error">
          <FontAwesomeIcon icon={['fas', 'exclamation-triangle']} className="w-5 h-5" />
          <span>Error loading blog posts: {error}</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-12">
          <FontAwesomeIcon icon={['fas', 'blog']} className="w-16 h-16 text-base-content/30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
          <p className="text-base-content/60">Check back later for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Filters */}
      {showFilters && (
        <motion.div
          className="bg-base-200 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="form-control flex-1">
              <div className="input-group">
                <span>
                  <FontAwesomeIcon icon={['fas', 'search']} className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="input input-bordered flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Tag Filter */}
            <select
              className="select select-bordered w-full lg:w-auto"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              className="select select-bordered w-full lg:w-auto"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="">All Sources</option>
              {allSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="select select-bordered w-full lg:w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="reactions">Sort by Reactions</option>
              <option value="readTime">Sort by Read Time</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="btn btn-ghost btn-sm"
              disabled={!searchQuery && !selectedTag && !selectedSource && sortBy === 'date'}
            >
              <FontAwesomeIcon icon={['fas', 'times']} className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedTag || selectedSource) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <div className="badge badge-primary gap-2">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <FontAwesomeIcon icon={['fas', 'times']} className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedTag && (
                <div className="badge badge-secondary gap-2">
                  Tag: {selectedTag}
                  <button onClick={() => setSelectedTag('')}>
                    <FontAwesomeIcon icon={['fas', 'times']} className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedSource && (
                <div className="badge badge-accent gap-2">
                  Source: {selectedSource}
                  <button onClick={() => setSelectedSource('')}>
                    <FontAwesomeIcon icon={['fas', 'times']} className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="text-sm text-base-content/60 mt-2">
            Showing {filteredPosts.length} of {posts.length} posts
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
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={['fas', 'star']} className="w-5 h-5 text-yellow-500" />
            Featured Post
          </h2>
          <BlogCard post={featuredPost} featured={true} />
        </motion.div>
      )}

      {/* Posts Grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key="posts-grid"
            className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
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
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FontAwesomeIcon icon={['fas', 'search']} className="w-16 h-16 text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-base-content/60 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={['fas', 'chevron-left']} className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={['fas', 'chevron-right']} className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
