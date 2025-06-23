'use client';

import { useState, useEffect } from 'react';

export default function ProjectFilters({ projects }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique technologies and types
  const allTechnologies = [...new Set(projects.flatMap(p => p.technologies || []))];
  const allTypes = [...new Set(projects.map(p => p.type).filter(Boolean))];

  const filters = [
    { id: 'all', label: 'All Projects', count: projects.length },
    ...allTypes.map(type => ({
      id: type.toLowerCase().replace(/\s+/g, '-'),
      label: type,
      count: projects.filter(p => p.type === type).length
    })),
    ...allTechnologies.slice(0, 5).map(tech => ({
      id: tech.toLowerCase().replace(/\s+/g, '-'),
      label: tech,
      count: projects.filter(p => p.technologies?.includes(tech)).length
    }))
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    filterProjects(filterId, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    filterProjects(activeFilter, term);
  };

  const filterProjects = (filter, search) => {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    const projectCards = Array.from(projectsGrid.children);
    
    projectCards.forEach((card, index) => {
      const project = projects[index];
      let shouldShow = true;

      // Apply filter
      if (filter !== 'all') {
        const filterLabel = filters.find(f => f.id === filter)?.label;
        if (filterLabel) {
          shouldShow = project.type === filterLabel || 
                      project.technologies?.includes(filterLabel);
        }
      }

      // Apply search
      if (search && shouldShow) {
        const searchLower = search.toLowerCase();
        shouldShow = project.name.toLowerCase().includes(searchLower) ||
                    project.description.toLowerCase().includes(searchLower) ||
                    project.technologies?.some(tech => 
                      tech.toLowerCase().includes(searchLower)
                    );
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
    // Initialize all projects as visible
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      Array.from(projectsGrid.children).forEach(card => {
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
            placeholder="Search projects..."
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
                aria-label="Clear category filter"
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
                aria-label="Clear search"
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
