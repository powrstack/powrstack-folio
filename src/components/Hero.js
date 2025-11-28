'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeroContent, HeroStats } from './ui';
import config from '../masterConfig';

// Lazy-load heavy components
import LazyAnimatedBackground from './client/LazyAnimatedBackground';
import LazyContactModal from './client/LazyContactModal';
import LazySocialLinks from './client/LazySocialLinks';
import LazyCertificationBadges from './client/LazyCertificationBadges';
import LazyProfileImage from './client/LazyProfileImage';

export default function Hero({ resumeData, priority = false }) {
  const [showContact, setShowContact] = useState(false);
  const { personalInfo, skills, certifications } = resumeData;

  // Get background configuration
  const backgroundConfig = config.background || { type: 'animated' };
  const shouldShowImage = backgroundConfig.type === 'image' || backgroundConfig.type === 'hybrid';
  const shouldShowAnimated = backgroundConfig.type === 'animated' || backgroundConfig.type === 'hybrid';

  // Memoize certifications grouping to prevent re-creation on every render
  const certificationsByVendor = useMemo(() => {
    if (!certifications || !Array.isArray(certifications)) return new Map();
    return certifications.reduce((acc, cert) => {
      const vendor = cert.vendor || cert.issuer;
      if (!vendor) return acc;
      if (!acc.has(vendor)) acc.set(vendor, []);
      acc.get(vendor).push(cert);
      return acc;
    }, new Map());
  }, [certifications]);

  // Memoize technical skills to prevent re-creation
  const technicalSkills = useMemo(() => {
    if (!skills?.technical || !Array.isArray(skills.technical)) return [];
    return skills.technical;
  }, [skills]);

  // Memoize roles array for typing animation
  const roles = useMemo(() => {
    const baseRoles = [
      personalInfo?.title || 'Software Engineer',
      'Open Source Contributor'
    ];

    if (technicalSkills.length > 0) {
      const techRoles = technicalSkills.slice(0, 3).map(skill => `${skill.name} Developer`);
      baseRoles.splice(1, 0, ...techRoles);
    }

    return baseRoles.filter(Boolean);
  }, [personalInfo?.title, technicalSkills]);

  // Memoize click handlers
  const handleContactShow = useCallback(() => setShowContact(true), []);
  const handleContactHide = useCallback(() => setShowContact(false), []);

  return (
    <>
      <section
        className="hero relative overflow-hidden py-16 sm:py-16 lg:py-32"
      >
        {/* Configurable Background */}
        {shouldShowImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundConfig.image?.src || "/images/image-1.jpg"}
              alt="Hero background"
              fill
              className="object-cover object-center"
              priority={priority && (backgroundConfig.image?.priority ?? true)}
              quality={backgroundConfig.image?.quality || 85}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            
            {/* Optional overlay for better text readability */}
            {backgroundConfig.image?.overlay && (
              <div 
                className="absolute inset-0 bg-black"
                style={{ 
                  opacity: backgroundConfig.image?.overlayOpacity || 0.3 
                }}
              ></div>
            )}
          </div>
        )}

        {/* Animated Background */}
        {shouldShowAnimated && backgroundConfig.animated?.enabled !== false && (
          <div className={`absolute inset-0 ${shouldShowImage ? 'z-[1]' : 'z-0'}`}>
            <Suspense fallback={null}>
              <LazyAnimatedBackground intensity={backgroundConfig.animated?.intensity} />
            </Suspense>
          </div>
        )}

        <div className="hero-content container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            {/* Mobile: Single column layout */}
            <div className="block lg:hidden space-y-8">
              {/* 1. Title */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <HeroContent 
                  personalInfo={personalInfo}
                  roles={roles}
                  onContactShow={handleContactShow}
                  showDescription={false}
                  showCTA={false}
                />
              </motion.div>

              {/* 2. Profile Image */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Suspense fallback={
                  <div className="avatar mb-4 lg:mb-8 animate-pulse">
                    <div className="w-48 sm:w-56 md:w-64 lg:w-80 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-300"></div>
                  </div>
                }>
                  <LazyProfileImage 
                    personalInfo={personalInfo}
                    technicalSkills={technicalSkills}
                    priority={priority}
                    showFloatingIcons={true}
                  />
                </Suspense>
              </motion.div>

              {/* 3. Social Links */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Suspense fallback={
                  <div className="flex justify-center space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="btn btn-circle btn-outline animate-pulse">
                        <div className="w-5 h-5 bg-base-300 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                }>
                  <LazySocialLinks 
                    socialData={personalInfo?.social} 
                    size="text-2xl md" 
                    delay={0.6} 
                  />
                </Suspense>
              </motion.div>

              {/* 4. Certifications */}
              {certifications && certifications.length > 0 && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Suspense fallback={
                    <div className="w-full">
                      <div className="h-6 bg-base-300 rounded w-32 mx-auto mb-4 animate-pulse"></div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-12 h-12 bg-base-300 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  }>
                    <LazyCertificationBadges 
                      certifications={certifications} 
                      size="sm" 
                      delay={0.8} 
                    />
                  </Suspense>
                </motion.div>
              )}

              {/* 5. Description */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="text-base sm:text-lg text-base-content/70 leading-relaxed">
                  {personalInfo?.summary ?
                    personalInfo.summary.split('\n').map((line, index) => (
                      <p key={index} className={index > 0 ? 'mt-4' : ''}>
                        {line}
                      </p>
                    )) :
                    <p>Passionate about creating innovative solutions and building scalable applications that make a difference.</p>
                  }
                </div>
              </motion.div>

              {/* 6. CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <motion.button
                  onClick={handleContactShow}
                  className="btn btn-primary btn-md w-full sm:w-auto min-w-[160px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get In Touch
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>

                <Link
                  href="/blog"
                  className="btn btn-outline btn-md w-full sm:w-auto min-w-[160px]"
                >
                  <motion.span
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Blog
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </motion.span>
                </Link>
              </motion.div>

              {/* 7. Stats - Mobile: full width */}
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <HeroStats 
                  resumeData={resumeData}
                  technicalSkills={technicalSkills}
                  certificationsByVendor={certificationsByVendor}
                  delay={1.4}
                />
              </motion.div>
            </div>

            {/* Desktop: Two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
              {/* Left Column: Title + Description + CTA */}
              <div className="space-y-8">
                {/* Title */}
                <motion.div
                  className="text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <HeroContent 
                    personalInfo={personalInfo}
                    roles={roles}
                    onContactShow={handleContactShow}
                    showDescription={false}
                    showCTA={false}
                  />
                </motion.div>

                {/* Description */}
                <motion.div
                  className="text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-lg xl:text-xl text-base-content/70 leading-relaxed">
                    {personalInfo?.summary ?
                      personalInfo.summary.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-4' : ''}>
                          {line}
                        </p>
                      )) :
                      <p>Passionate about creating innovative solutions and building scalable applications that make a difference.</p>
                    }
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-row gap-4 justify-start items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.button
                    onClick={handleContactShow}
                    className="btn btn-primary btn-lg min-w-[160px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get In Touch
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.button>

                  <Link
                    href="/blog"
                    className="btn btn-outline btn-lg min-w-[160px]"
                  >
                    <motion.span
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read Blog
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </motion.span>
                  </Link>
                </motion.div>
              </div>

              {/* Right Column: Profile Image + Social Links + Certifications + Stats */}
              <div className="space-y-8 flex flex-col items-center">
                {/* Profile Image */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Suspense fallback={
                    <div className="avatar mb-4 lg:mb-8 animate-pulse">
                      <div className="w-80 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-300"></div>
                    </div>
                  }>
                    <LazyProfileImage 
                      personalInfo={personalInfo}
                      technicalSkills={technicalSkills}
                      priority={priority}
                      showFloatingIcons={true}
                    />
                  </Suspense>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Suspense fallback={
                    <div className="flex justify-center space-x-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="btn btn-circle btn-outline btn-lg animate-pulse">
                          <div className="w-6 h-6 bg-base-300 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  }>
                    <LazySocialLinks 
                      socialData={personalInfo?.social} 
                      size="lg" 
                      delay={0.8} 
                    />
                  </Suspense>
                </motion.div>

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <Suspense fallback={
                      <div className="w-full">
                        <div className="h-6 bg-base-300 rounded w-32 mx-auto mb-4 animate-pulse"></div>
                        <div className="flex flex-wrap justify-center gap-3">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-16 h-16 bg-base-300 rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    }>
                      <LazyCertificationBadges 
                      certifications={certifications} 
                      size="lg:w-16 lg:h-16" 
                      delay={1.0} 
                    />
                  </Suspense>
                </motion.div>
              )}

                {/* Stats - Desktop: in right column */}
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <HeroStats 
                    resumeData={resumeData}
                    technicalSkills={technicalSkills}
                    certificationsByVendor={certificationsByVendor}
                    delay={1.2}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            href="/blog"
            className="btn btn-ghost btn-circle"
            aria-label="Go to Blog page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* Contact Modal - Lazy load only when opened */}
      <LazyContactModal 
        isOpen={showContact}
        onClose={handleContactHide}
        resumeData={resumeData}
      />
    </>
  );
}
