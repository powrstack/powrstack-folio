'use client';

import { useState } from 'react';

export default function ProjectCard({ project, index }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getProjectImage = () => {
    if (imageError || !project.image) {
      // Generate a gradient based on project name
      const colors = [
        'from-blue-500 to-purple-600',
        'from-green-500 to-blue-600',
        'from-purple-500 to-pink-600',
        'from-yellow-500 to-red-600',
        'from-indigo-500 to-purple-600',
        'from-pink-500 to-rose-600',
      ];
      const gradientClass = colors[index % colors.length];
      
      return (
        <div className={`w-full h-48 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
          <div className="text-white text-center">
            <div className="text-4xl mb-2">🚀</div>
            <div className="text-lg font-semibold">{project.name}</div>
          </div>
        </div>
      );
    }

    return (
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-48 object-cover"
        onError={handleImageError}
      />
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
      {/* Project Image */}
      <figure className="relative overflow-hidden">
        {getProjectImage()}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      </figure>

      {/* Project Content */}
      <div className="card-body">
        <h3 className="card-title text-base-content group-hover:text-primary transition-colors duration-200">
          {project.name}
        </h3>
        
        <p className="text-base-content/70 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 3).map((tech, techIndex) => (
            <div
              key={techIndex}
              className="badge badge-secondary badge-outline"
            >
              {tech}
            </div>
          ))}
          {project.technologies?.length > 3 && (
            <div className="badge badge-ghost">
              +{project.technologies.length - 3} more
            </div>
          )}
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between text-xs text-base-content/60">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {project.startDate || 'Recent'}
          </span>
          
          {project.type && (
            <div className="badge badge-primary badge-sm">
              {project.type}
            </div>
          )}
        </div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-base-content mb-2">Key Features:</h4>
            <ul className="text-xs text-base-content/70 space-y-1">
              {project.highlights.slice(0, 2).map((highlight, highlightIndex) => (
                <li key={highlightIndex} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
