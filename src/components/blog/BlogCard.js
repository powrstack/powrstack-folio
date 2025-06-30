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
      className={`card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 ${
        featured ? 'lg:card-side h-auto' : 'h-full flex flex-col'
      } ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Cover Image */}
      {post.coverImage && (
        <figure className={`relative ${featured ? 'lg:w-1/2' : 'h-48'} overflow-hidden bg-base-200`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            width={featured ? 600 : 400}
            height={featured ? 400 : 300}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"}
            loading="lazy"
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Source Badge */}
          <div className="absolute top-3 right-3">
            <div className="badge badge-primary gap-1 shadow-lg">
              <FontAwesomeIcon 
                icon={getSourceIcon(post.source)} 
                className="w-3 h-3" 
              />
              {post.source}
            </div>
          </div>

          {/* Reading Time Badge */}
          {post.readingTimeMinutes && (
            <div className="absolute top-3 left-3">
              <div className="badge badge-neutral gap-1 shadow-lg">
                <FontAwesomeIcon icon={['fas', 'clock']} className="w-3 h-3" />
                {post.readingTimeMinutes}min
              </div>
            </div>
          )}
        </figure>
      )}

      {/* No Cover Image - Add placeholder for consistency */}
      {!post.coverImage && (
        <div className={`relative ${featured ? 'lg:w-1/2 min-h-64' : 'h-48'} bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center`}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-base-100 rounded-full flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={['fas', 'blog']} className="w-8 h-8 text-primary" />
            </div>
            <div className="badge badge-primary gap-1">
              <FontAwesomeIcon 
                icon={getSourceIcon(post.source)} 
                className="w-3 h-3" 
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
                      className="rounded-full w-full h-full object-cover"
                      loading="lazy"
                      sizes="24px"
                      quality={75}
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
        <div className="card-actions justify-between items-center mt-auto pt-4 border-t border-base-200">
          <div className="flex gap-2">
            <Link
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm gap-2"
            >
              <FontAwesomeIcon icon={['fas', 'external-link-alt']} className="w-3 h-3" />
              Read Article
            </Link>
            
            {post.canonicalUrl && post.canonicalUrl !== post.url && (
              <Link
                href={post.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm gap-2"
              >
                <FontAwesomeIcon icon={['fas', 'link']} className="w-3 h-3" />
                Original
              </Link>
            )}
          </div>

          {/* Share Button */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
              <FontAwesomeIcon icon={['fas', 'share']} className="w-4 h-4" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-200">
              <li>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(post.url);
                    }
                  }}
                  className="gap-2"
                >
                  <FontAwesomeIcon icon={['fas', 'copy']} className="w-4 h-4" />
                  Copy Link
                </button>
              </li>
              {typeof navigator !== 'undefined' && navigator.share && (
                <li>
                  <button
                    onClick={() => {
                      navigator.share({
                        title: post.title,
                        text: post.description,
                        url: post.url,
                      });
                    }}
                    className="gap-2"
                  >
                    <FontAwesomeIcon icon={['fas', 'share']} className="w-4 h-4" />
                    Share
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
