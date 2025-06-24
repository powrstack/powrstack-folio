'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import { faDev } from '@fortawesome/free-brands-svg-icons';


/**
 * BlogCard component to display individual blog post preview
 */
export default function BlogCard({ post, featured = false, className = '' }) {
  if (!post) return null;

  library.add(
    fas, faDev
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'dev.to':
        return ['fab', 'dev'];
      case 'hashnode':
        return ['fas', 'blog'];
      case 'medium':
        return ['fab', 'medium'];
      default:
        return ['fas', 'blog'];
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  return (
    <motion.article
      className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 ${
        featured ? 'lg:card-side' : 'h-full flex flex-col'
      } ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Cover Image */}
      {post.coverImage && (
        <figure className={`relative ${featured ? 'lg:w-1/2' : 'h-48'} overflow-hidden`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            width={featured ? 600 : 400}
            height={featured ? 400 : 300}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          />
          
          {/* Source Badge */}
          <div className="absolute top-3 right-3">
            <div className="badge badge-primary badge-lg">
              <FontAwesomeIcon 
                icon={getSourceIcon(post.source)} 
                className="w-4 h-4 mr-1" 
              />
              {post.source}
            </div>
          </div>
        </figure>
      )}

      {/* No Cover Image - Add placeholder for consistency */}
      {!post.coverImage && !featured && (
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={['fas', 'blog']} className="w-16 h-16 text-primary/30 mb-2" />
            <div className="badge badge-primary badge-lg">
              <FontAwesomeIcon 
                icon={getSourceIcon(post.source)} 
                className="w-4 h-4 mr-1" 
              />
              {post.source}
            </div>
          </div>
        </div>
      )}

      <div className={`card-body ${featured ? 'lg:w-1/2' : 'flex-1 flex flex-col'}`}>
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Link
                key={`${tag}-${index}`}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="badge badge-outline badge-sm hover:badge-primary transition-colors"
              >
                #{tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="badge badge-ghost badge-sm">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className={`card-title ${featured ? 'text-2xl lg:text-3xl' : 'text-xl'} line-clamp-2 hover:text-primary transition-colors mb-3`}>
          <Link href={post.url} target="_blank" rel="noopener noreferrer">
            {post.title}
          </Link>
        </h2>

        {/* Description */}
        <p className={`text-base-content/70 ${featured ? 'text-lg' : ''} line-clamp-3 leading-relaxed ${featured ? '' : 'flex-1'} mb-4`}>
          {post.description}
        </p>

        {/* Content spacer for consistent layout */}
        {!featured && <div className="flex-1"></div>}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60 mb-3">
          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.profileImage && (
                <div className="avatar">
                  <div className="w-6 h-6 rounded-full">
                    <Image
                      src={post.author.profileImage}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                </div>
              )}
              <Link
                href={post.author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {post.author.name}
              </Link>
            </div>
          )}

          {/* Published Date */}
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={['fas', 'calendar']} className="w-3 h-3" />
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>

          {/* Reading Time */}
          {post.readingTimeMinutes && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={['fas', 'clock']} className="w-3 h-3" />
              <span>{post.readingTimeMinutes} min read</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {(post.stats.reactions > 0 || post.stats.comments > 0) && (
          <div className="flex items-center gap-4 text-sm text-base-content/60 mb-4">
            {post.stats.reactions > 0 && (
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={['fas', 'heart']} className="w-3 h-3 text-error" />
                <span>{post.stats.reactions}</span>
              </div>
            )}
            {post.stats.comments > 0 && (
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={['fas', 'comment']} className="w-3 h-3 text-info" />
                <span>{post.stats.comments}</span>
              </div>
            )}
            {post.stats.views > 0 && (
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={['fas', 'eye']} className="w-3 h-3 text-accent" />
                <span>{post.stats.views}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions - Always at bottom */}
        <div className="card-actions justify-between items-center mt-auto">
          <div className="flex gap-2">
            <Link
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Read on {post.source}
              <FontAwesomeIcon icon={['fas', 'external-link-alt']} className="w-3 h-3 ml-1" />
            </Link>
            
            {post.canonicalUrl && post.canonicalUrl !== post.url && (
              <Link
                href={post.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Original
              </Link>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.description,
                  url: post.url,
                });
              } else {
                navigator.clipboard.writeText(post.url);
                // You could add a toast notification here
              }
            }}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Share post"
          >
            <FontAwesomeIcon icon={['fas', 'share']} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
