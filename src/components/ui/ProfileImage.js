'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FloatingTechIcons from './FloatingTechIcons';

const ProfileImage = memo(function ProfileImage({ 
  personalInfo, 
  technicalSkills,
  priority = false,
  isDesktop = false,
  showFloatingIcons = true
}) {
  const containerSize = "w-48 sm:w-56 md:w-64 lg:w-80";
  const imageSize = { width: 320, height: 320 };
  const imageSizes = "(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 320px";

  return (
    <div className="relative inline-block">
      <motion.div
        className="avatar mb-4 lg:mb-8"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className={`${containerSize} rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}>
          <Image
            src={personalInfo?.profileImage || '/images/profile.jpg'}
            alt={personalInfo?.name || 'Profile'}
            width={imageSize.width}
            height={imageSize.height}
            sizes={imageSizes}
            className="rounded-full object-cover w-full h-full"
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            fetchPriority={priority ? "high" : "auto"}
            quality={85}
            unoptimized={false}
          />
        </div>
      </motion.div>

      {/* Floating Tech Icons */}
      {showFloatingIcons && (
        <div className="hidden sm:block">
          <FloatingTechIcons 
            technicalSkills={technicalSkills}
            isDesktop={false}
            delay={1.2}
          />
        </div>
      )}
    </div>
  );
});

export default ProfileImage;
