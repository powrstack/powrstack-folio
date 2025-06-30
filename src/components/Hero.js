'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import AnimatedBackground from './AnimatedBackground';
import TypingAnimation from './TypingAnimation';
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

  const scrollToSection = useCallback((sectionId) => {
    if (typeof document === 'undefined') return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Memoize click handlers
  const handleContactShow = useCallback(() => setShowContact(true), []);
  const handleContactHide = useCallback(() => setShowContact(false), []);

  // Memoized shared components to prevent redundancy
  const SocialLinks = useMemo(() => {
    const SocialLinksComponent = ({ size = 'md', delay = 0.6 }) => (
      <div className="flex justify-center space-x-4">
        {personalInfo?.social?.github && (
          <motion.a
            href={personalInfo.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-circle btn-outline btn-${size} hover:btn-primary`}
            aria-label="Visit GitHub profile"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={['fab', 'github']} className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
          </motion.a>
        )}

        {personalInfo?.social?.linkedin && (
          <motion.a
            href={personalInfo.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-circle btn-outline btn-${size} hover:btn-secondary`}
            aria-label="Visit LinkedIn profile"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={['fab', 'linkedin']} className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
          </motion.a>
        )}

        {personalInfo?.social?.dev && (
          <motion.a
            href={personalInfo.social.dev}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-circle btn-outline btn-${size} hover:btn-accent`}
            aria-label="Visit DEV Community profile"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={['fab', 'dev']} className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
          </motion.a>
        )}
      </div>
    );
    SocialLinksComponent.displayName = 'SocialLinks';
    return SocialLinksComponent;
  }, [personalInfo?.social]);

  const CertificationBadges = useMemo(() => {
    const CertificationBadgesComponent = ({ size = 'sm', delay = 1.2 }) => (
      certifications && certifications.length > 0 && (
        <>
          <motion.h3 
            className="text-lg font-semibold text-base-content mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.2 }}
          >
            Certifications
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-sm mx-auto">
            {certifications.map((cert, index) => {
              const badgeSize = size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
              const imageSize = size === 'lg' ? 48 : 40;
              
              return (
                <motion.div
                  key={`${cert.name}-${index}`}
                  className="tooltip"
                  data-tip={`${cert.name} - ${cert.vendor || cert.issuer}`}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: delay + (index * 0.1),
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cert.badgeImage ? (
                    <div className={`${badgeSize} rounded-lg overflow-hidden shadow-lg bg-base-200 p-1 hover:shadow-xl transition-shadow`}>
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                        <Image
                          src={cert.badgeImage}
                          alt={`${cert.name} certification badge`}
                          width={imageSize}
                          height={imageSize}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          sizes={`${imageSize}px`}
                          quality={90}
                          unoptimized={false}
                        />
                      </a>
                    </div>
                  ) : (
                    <div className={`${badgeSize} rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full flex items-center justify-center">
                        <span className="text-primary-content font-bold text-xs text-center px-1">
                          {cert.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                        </span>
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )
    );
    CertificationBadgesComponent.displayName = 'CertificationBadges';
    return CertificationBadgesComponent;
  }, [certifications]);

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

        <div className="hero-content container mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          {/* Mobile-First Layout: Single Column Stack */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-8 w-full">
            {/* 1. Name and Title */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-base-content leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Hi, I'm{' '}
                <span className="text-primary">
                  {personalInfo?.name || 'Developer'}
                </span>
              </motion.h1>
              <motion.div
                className="text-lg sm:text-xl md:text-2xl font-semibold text-base-content/80 mt-4 h-10 sm:h-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <TypingAnimation roles={roles} />
              </motion.div>
            </motion.div>

            {/* 2. Image */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative inline-block">
                <motion.div
                  className="avatar"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-48 sm:w-56 md:w-64 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image
                      src={personalInfo?.profileImage || '/images/profile.jpg'}
                      alt={personalInfo?.name || 'Profile'}
                      width={256}
                      height={256}
                      sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 256px"
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

                {/* Floating Tech Icons - Hidden on mobile for cleaner look */}
                <div className="absolute inset-0 pointer-events-none hidden sm:block">
                  {technicalSkills.slice(0, 4).map((tech, index) => {
                    const techStyle = {
                      top: `${25 + (index * 20)}%`,
                      left: index % 2 === 0 ? '5%' : '95%',
                    };

                    return (
                      <motion.div
                        key={tech.name}
                        className="absolute badge badge-primary badge-sm"
                        style={techStyle}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: [0, -5, 0],
                        }}
                        transition={{
                          opacity: { duration: 0.5, delay: 1.2 + (index * 0.1) },
                          scale: { duration: 0.5, delay: 1.2 + (index * 0.1), type: "spring", stiffness: 200 },
                          y: {
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5,
                            ease: "easeInOut"
                          }
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech.name}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* 3. Social Links */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SocialLinks size="md" />
            </motion.div>

            {/* 4. Certifications */}
            {certifications && certifications.length > 0 && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <CertificationBadges size="sm" />
              </motion.div>
            )}

            {/* 5. Summary/Description */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="text-base sm:text-lg text-base-content/70 leading-relaxed px-2">
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

            {/* 6. Get In Touch Button */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.button
                onClick={handleContactShow}
                className="btn btn-primary btn-md w-full max-w-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </motion.div>

            {/* 7. Read Blog Button */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <Link
                href="/blog"
                className="btn btn-outline btn-md w-full max-w-xs"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read Blog
                </motion.span>
              </Link>
            </motion.div>

            {/* 8. Stats */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="stats shadow w-full max-w-md mx-auto grid grid-cols-3 sm:grid-cols-6">
                <div className="stat">
                  <div className="stat-value text-primary text-xl font-bold">
                    {resumeData?.stats?.totalExperience?.length || 5}+
                  </div>
                  <div className="stat-title text-xs">Years Exp</div>
                </div>

                <div className="stat">
                  <div className="stat-value text-secondary text-xl font-bold">
                    {resumeData?.projects?.length || 20}+
                  </div>
                  <div className="stat-title text-xs">Projects</div>
                </div>

                <div className="stat">
                  <div className="stat-value text-accent text-xl font-bold">
                    {technicalSkills.length || 15}+
                  </div>
                  <div className="stat-title text-xs">Tech Stack</div>
                </div>

                {/* Certifications by Vendor */}
                {[...certificationsByVendor.entries()].slice(0, 15).map(([vendor, certs], index) => (
                  <div className="stat" key={vendor}>
                    <div className="stat-value text-info text-xl font-bold">
                      {certs.length}x
                    </div>
                    <div className="stat-title text-xs">{vendor}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Desktop Layout: Two Columns */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column: Text Content */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <motion.h1
                  className="text-7xl font-bold text-base-content leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Hi, I'm{' '}
                  <span className="text-primary">
                    {personalInfo?.name || 'Developer'}
                  </span>
                </motion.h1>
                <motion.div
                  className="text-3xl font-semibold text-base-content/80 mt-4 h-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <TypingAnimation roles={roles} />
                </motion.div>
              </div>

              <motion.div
                className="text-lg text-base-content/70 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {personalInfo?.summary ?
                  personalInfo.summary.split('\n').map((line, index) => (
                    <p key={index} className={index > 0 ? 'mt-4' : ''}>
                      {line}
                    </p>
                  )) :
                  <p>Passionate about creating innovative solutions and building scalable applications that make a difference.</p>
                }
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-row gap-4 justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.button
                  onClick={handleContactShow}
                  className="btn btn-primary btn-lg"
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
                  className="btn btn-outline btn-lg"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Blog
                  </motion.span>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                className="mt-8 w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="stats shadow w-full grid grid-cols-3 lg:grid-cols-6">
                  <div className="stat">
                    <div className="stat-value text-primary text-2xl font-bold">
                      {resumeData?.stats?.totalExperience?.length || 5}+
                    </div>
                    <div className="stat-title text-sm">Years Exp</div>
                  </div>

                  <div className="stat">
                    <div className="stat-value text-secondary text-2xl font-bold">
                      {resumeData?.projects?.length || 20}+
                    </div>
                    <div className="stat-title text-sm">Projects</div>
                  </div>

                  <div className="stat">
                    <div className="stat-value text-accent text-2xl font-bold">
                      {technicalSkills.length || 15}+
                    </div>
                    <div className="stat-title text-sm">Tech Stack</div>
                  </div>

                  {/* Certifications by Vendor */}
                  {[...certificationsByVendor.entries()].slice(0, 15).map(([vendor, certs], index) => (
                    <div className="stat" key={vendor}>
                      <div className="stat-value text-info text-2xl font-bold">
                        {certs.length}x
                      </div>
                      <div className="stat-title text-sm">{vendor}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Profile Image & Tech Stack */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative inline-block">
                {/* Profile Image */}
                <motion.div
                  className="avatar mb-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-80 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image
                      src={personalInfo?.profileImage || '/images/profile.jpg'}
                      alt={personalInfo?.name || 'Profile'}
                      width={320}
                      height={320}
                      sizes="(max-width: 1024px) 280px, 320px"
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
                <div className="absolute inset-0 pointer-events-none">
                  {technicalSkills.slice(0, 6).map((tech, index) => {
                    const techStyle = {
                      top: `${20 + (index * 15)}%`,
                      left: index % 2 === 0 ? '10%' : '90%',
                    };

                    return (
                      <motion.div
                        key={tech.name}
                        className="absolute badge badge-primary badge-lg"
                        style={techStyle}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: [0, -10, 0],
                        }}
                        transition={{
                          opacity: { duration: 0.5, delay: 1.2 + (index * 0.1) },
                          scale: { duration: 0.5, delay: 1.2 + (index * 0.1), type: "spring", stiffness: 200 },
                          y: {
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5,
                            ease: "easeInOut"
                          }
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech.name}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center space-x-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <SocialLinks size="lg" />
              </motion.div>

              {/* Certification Badges */}
              <CertificationBadges size="lg" delay={1.6} />
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
      {showContact && (
        <motion.div
          className="modal modal-open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <div className="modal-action">
              <motion.button
                onClick={handleContactHide}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
                aria-label="Close contact form"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>
            <ContactForm resumeData={resumeData} />
          </motion.div>
          <div className="modal-backdrop" onClick={handleContactHide}>
            <button aria-label="Close modal">close</button>
          </div>
        </motion.div>
      )}
    </>
  );
}
