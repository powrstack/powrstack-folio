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
      <div className="relative max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
            }`}
          >
            {filter.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeFilter === filter.id
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-gray-400'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-1">
          <div className="flex space-x-1">
            <button className="px-3 py-1 text-sm text-white bg-white/10 rounded-md">
              Latest
            </button>
            <button className="px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
              Popular
            </button>
            <button className="px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
              Oldest
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeFilter !== 'all' || searchTerm) && (
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          {activeFilter !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              {filters.find(f => f.id === activeFilter)?.label}
              <button
                onClick={() => handleFilterChange('all')}
                className="ml-2 text-blue-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              "{searchTerm}"
              <button
                onClick={() => handleSearchChange('')}
                className="ml-2 text-purple-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
