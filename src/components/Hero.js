'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  AnimatedBackground, 
  SocialLinks, 
  CertificationBadges,
  HeroStats,
  ProfileImage,
  HeroContent,
  ContactModal
} from './ui';
import config from '../masterConfig';

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
            <AnimatedBackground intensity={backgroundConfig.animated?.intensity} />
          </div>
        )}

        <div className="hero-content container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Unified Single-Column Layout with Desktop Grid Overlay */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto">
            
            {/* Content follows exact mobile order, then desktop grid positioning */}
            
            {/* 1. Title - Mobile: full width, Desktop: left column */}
            <motion.div
              className="col-span-1 lg:col-span-7 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <HeroContent 
                personalInfo={personalInfo}
                roles={roles}
                onContactShow={handleContactShow}
                showDescription={false}  // We'll show it separately
                showCTA={false}         // We'll show it separately
              />
            </motion.div>

            {/* 2. Profile Image - Mobile: full width, Desktop: right column */}
            <motion.div
              className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ProfileImage 
                personalInfo={personalInfo}
                technicalSkills={technicalSkills}
                priority={priority}
                showFloatingIcons={true}
              />
            </motion.div>

            {/* 3. Social Links - Mobile: full width, Desktop: spans both columns */}
            <motion.div
              className="col-span-1 lg:col-span-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SocialLinks 
                socialData={personalInfo?.social} 
                size="md lg:size-lg" 
                delay={0.6} 
              />
            </motion.div>

            {/* 4. Certifications - Mobile: full width, Desktop: spans both columns */}
            {certifications && certifications.length > 0 && (
              <motion.div
                className="col-span-1 lg:col-span-12 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <CertificationBadges 
                  certifications={certifications} 
                  size="sm lg:size-lg" 
                  delay={0.8} 
                />
              </motion.div>
            )}

            {/* 5. Description - Mobile: full width, Desktop: center column */}
            <motion.div
              className="col-span-1 lg:col-span-8 lg:col-start-3 text-center lg:text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="text-base sm:text-lg lg:text-xl text-base-content/70 leading-relaxed max-w-4xl mx-auto">
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

            {/* 6. CTA Buttons - Mobile: full width, Desktop: center column */}
            <motion.div
              className="col-span-1 lg:col-span-6 lg:col-start-4 flex flex-col sm:flex-row gap-4 justify-center items-center"
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

            {/* 7. Stats - Mobile: full width, Desktop: spans both columns */}
            <motion.div
              className="col-span-1 lg:col-span-12"
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

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContact}
        onClose={handleContactHide}
        resumeData={resumeData}
      />
    </>
  );
}
