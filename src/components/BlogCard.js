'use client';

import { useState } from 'react';

export default function BlogCard({ article, index }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getArticleImage = () => {
    if (imageError || !article.image) {
      // Generate a gradient based on article type or title
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
            <div className="text-4xl mb-2">
              {article.type === 'Tutorial' ? '📚' : 
               article.type === 'Guide' ? '🗺️' : 
               article.type === 'Review' ? '⭐' : '📝'}
            </div>
            <div className="text-sm font-medium">{article.type || 'Article'}</div>
          </div>
        </div>
      );
    }

    return (
      <img
        src={article.image}
        alt={article.name}
        className="w-full h-48 object-cover"
        onError={handleImageError}
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getReadingTime = (content) => {
    if (!content) return '5 min read';
    
    // Rough estimate: 200 words per minute
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min read`;
  };

  return (
    <article className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
      {/* Article Image */}
      <div className="relative overflow-hidden">
        {getArticleImage()}
        
        {/* Article Type Badge */}
        {article.type && (
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              {article.type}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              Read Article
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
          {article.name}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>

        {/* Tags */}
        {article.keywords && article.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.keywords.slice(0, 3).map((keyword, keywordIndex) => (
              <span
                key={keywordIndex}
                className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
              >
                #{keyword}
              </span>
            ))}
            {article.keywords.length > 3 && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{article.keywords.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Article Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(article.releaseDate)}
            </span>
            
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getReadingTime(article.summary)}
            </span>
          </div>
        </div>

        {/* Publisher */}
        {article.publisher && (
          <div className="mb-4">
            <span className="inline-flex items-center text-xs text-blue-400">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Published on {article.publisher}
            </span>
          </div>
        )}

        {/* Article Highlights */}
        {article.highlights && article.highlights.length > 0 && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-white mb-2">What you'll learn:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              {article.highlights.slice(0, 2).map((highlight, highlightIndex) => (
                <li key={highlightIndex} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
