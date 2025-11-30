'use client';

import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogGridFilters = memo(function BlogGridFilters({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  selectedSource,
  setSelectedSource,
  sortBy,
  setSortBy,
  allTags,
  allSources,
  clearFilters
}) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search posts..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-square btn-primary">
            <FontAwesomeIcon icon={['fas', 'search']} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Tag Filter */}
        <select
          className="select select-bordered select-sm"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          className="select select-bordered select-sm"
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
          className="select select-bordered select-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Latest</option>
          <option value="title">Title</option>
          <option value="reactions">Popular</option>
          <option value="readTime">Quick Reads</option>
        </select>

        {/* Clear Filters */}
        {(searchQuery || selectedTag || selectedSource || sortBy !== 'date') && (
          <button
            onClick={clearFilters}
            className="btn btn-ghost btn-sm"
          >
            <FontAwesomeIcon icon={['fas', 'times']} className="mr-2" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
});

export default BlogGridFilters;
