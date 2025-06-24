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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Memoize click handlers
  const handleContactShow = useCallback(() => setShowContact(true), []);
  const handleContactHide = useCallback(() => setShowContact(false), []);

  // Memoize the background style to prevent re-creation
  const heroStyle = useMemo(() => ({
    backgroundImage: `url(${config.landingBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }), []);

  return (
    <>
      <section
        className="hero min-h-screen relative overflow-hidden"
        style={heroStyle}
      >
        {/* Animated Background */}
        <AnimatedBackground />

        <div className="hero-content container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Text Content */}
            <motion.div
              className="text-center lg:text-left order-2 lg:order-1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <motion.h1
                  className="text-5xl lg:text-7xl font-bold text-base-content"
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
                  className="text-2xl lg:text-3xl font-semibold text-base-content/80 mt-4 h-12"
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
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
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
                className="stats stats-vertical sm:stats-horizontal shadow-lg mt-8 bg-base-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="stat">
                  <div className="stat-value text-primary text-2xl font-bold">
                    {resumeData?.stats?.totalExperience?.length || 5}+
                  </div>
                  <div className="stat-title text-base-content font-medium">Years Experience</div>
                </div>

                <div className="stat">
                  <div className="stat-value text-secondary text-2xl font-bold">
                    {resumeData?.projects?.length || 20}+
                  </div>
                  <div className="stat-title text-base-content font-medium">Projects</div>
                </div>

                <div className="stat">
                  <div className="stat-value text-accent text-2xl font-bold">
                    {technicalSkills.length || 15}+
                  </div>
                  <div className="stat-title text-base-content font-medium">Technologies</div>
                </div>

                {/* Certifications by Vendor */}
                {[...certificationsByVendor.entries()].map(([vendor, certs]) => (
                  <div className="stat" key={vendor}>
                    <div className="stat-value text-info text-2xl font-bold">
                      {certs.length}x
                    </div>
                    <div className="stat-title text-base-content font-medium">{vendor} Certifications</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Profile Image & Tech Stack */}
            <motion.div
              className="text-center order-1 lg:order-2"
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
                  <div className="w-64 lg:w-80 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image
                      src={personalInfo?.profileImage || '/images/profile.jpg'}
                      alt={personalInfo?.name || 'Profile'}
                      width={320}
                      height={320}
                      sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 320px"
                      className="rounded-full object-cover"
                      priority={priority}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      fetchPriority={priority ? "high" : "auto"}
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
                {personalInfo?.social?.github && (
                  <motion.a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline btn-lg hover:btn-primary"
                    aria-label="Visit GitHub profile"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={['fab', 'github']} className="w-6 h-6 text-3xl" />
                  </motion.a>
                )}

                {personalInfo?.social?.linkedin && (
                  <motion.a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline btn-lg hover:btn-secondary"
                    aria-label="Visit LinkedIn profile"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={['fab', 'linkedin']} className="w-6 h-6 text-3xl" />
                  </motion.a>
                )}

                {personalInfo?.social?.dev && (
                  <motion.a
                    href={personalInfo.social.dev}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline btn-lg hover:btn-accent"
                    aria-label="Visit DEV Community profile"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={['fab', 'dev']} className="w-6 h-6 text-3xl" />
                  </motion.a>
                )}
              </motion.div>

              {/* Certification Badges */}
              {certifications && certifications.length > 0 && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <motion.h3 
                    className="text-lg font-semibold text-base-content mb-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.8 }}
                  >
                    Certifications
                  </motion.h3>
                  <div className="flex flex-wrap justify-center gap-3 max-w-sm mx-auto">
                    {certifications.slice(0, 6).map((cert, index) => (
                      <motion.div
                        key={`${cert.name}-${index}`}
                        className="tooltip"
                        data-tip={`${cert.name} - ${cert.vendor || cert.issuer}`}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 2.0 + (index * 0.1),
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
                          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg bg-base-200 p-2 hover:shadow-xl transition-shadow">
                            <Image
                              src={cert.badgeImage}
                              alt={`${cert.name} certification badge`}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                            <span className="text-primary-content font-bold text-xs text-center px-1">
                              {cert.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {certifications.length > 6 && (
                    <motion.div
                      className="text-center mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 2.5 }}
                    >
                      <span className="text-sm text-base-content/70">
                        +{certifications.length - 6} more certifications
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
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
            className="modal-box max-w-4xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <div className="modal-action">
              <motion.button
                onClick={handleContactHide}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
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
