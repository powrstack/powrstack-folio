'use client';

import { useState, useEffect } from 'react';

export default function BlogFilters({ articles }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique types and keywords
  const allTypes = [...new Set(articles.map(a => a.type).filter(Boolean))];
  const allKeywords = [...new Set(articles.flatMap(a => a.keywords || []))];

  const filters = [
    { id: 'all', label: 'All Articles', count: articles.length },
    ...allTypes.map(type => ({
      id: type.toLowerCase().replace(/\s+/g, '-'),
      label: type,
      count: articles.filter(a => a.type === type).length
    })),
    ...allKeywords.slice(0, 6).map(keyword => ({
      id: keyword.toLowerCase().replace(/\s+/g, '-'),
      label: `#${keyword}`,
      count: articles.filter(a => a.keywords?.includes(keyword)).length
    }))
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    filterArticles(filterId, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    filterArticles(activeFilter, term);
  };

  const filterArticles = (filter, search) => {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;

    const articleCards = Array.from(articlesGrid.children);
    
    articleCards.forEach((card, index) => {
      const article = articles[index];
      let shouldShow = true;

      // Apply filter
      if (filter !== 'all') {
        const filterLabel = filters.find(f => f.id === filter)?.label;
        if (filterLabel) {
          if (filterLabel.startsWith('#')) {
            // Keyword filter
            const keyword = filterLabel.substring(1);
            shouldShow = article.keywords?.includes(keyword);
          } else {
            // Type filter
            shouldShow = article.type === filterLabel;
          }
        }
      }

      // Apply search
      if (search && shouldShow) {
        const searchLower = search.toLowerCase();
        shouldShow = article.name.toLowerCase().includes(searchLower) ||
                    article.summary.toLowerCase().includes(searchLower) ||
                    article.keywords?.some(keyword => 
                      keyword.toLowerCase().includes(searchLower)
                    ) ||
                    article.publisher?.toLowerCase().includes(searchLower);
      }

      // Show/hide with animation
      if (shouldShow) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };

  useEffect(() => {
    // Initialize all articles as visible
    const articlesGrid = document.getElementById('articles-grid');
    if (articlesGrid) {
      Array.from(articlesGrid.children).forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.transition = 'all 0.3s ease-in-out';
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="form-control max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`btn btn-sm gap-2 ${
              activeFilter === filter.id
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            {filter.label}
            <div className="badge badge-sm">
              {filter.count}
            </div>
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex justify-center">
        <div className="join">
          <button className="btn btn-sm join-item btn-active">
            Latest
          </button>
          <button className="btn btn-sm join-item btn-outline">
            Popular
          </button>
          <button className="btn btn-sm join-item btn-outline">
            Oldest
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeFilter !== 'all' || searchTerm) && (
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="text-sm text-base-content/60">Active filters:</span>
          {activeFilter !== 'all' && (
            <div className="badge badge-primary gap-2">
              {filters.find(f => f.id === activeFilter)?.label}
              <button
                onClick={() => handleFilterChange('all')}
                className="text-primary-content hover:text-primary-content/80"
              >
                ×
              </button>
            </div>
          )}
          {searchTerm && (
            <div className="badge badge-secondary gap-2">
              "{searchTerm}"
              <button
                onClick={() => handleSearchChange('')}
                className="text-secondary-content hover:text-secondary-content/80"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
