import { memo } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogCardImage = memo(function BlogCardImage({ post, featured = false }) {
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

  if (!post.coverImage) {
    return (
      <div className={`relative ${featured ? 'lg:w-1/2 min-h-64' : 'h-48'} bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center`}>
        <FontAwesomeIcon 
          icon={['fas', 'blog']} 
          className="text-6xl text-base-content/20"
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
      </div>
    );
  }

  return (
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
  );
});

export default BlogCardImage;
