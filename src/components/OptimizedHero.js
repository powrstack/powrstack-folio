'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroTitle from './ui/HeroTitle';
import config from '../masterConfig';

// Critical: Load immediately (above fold)
import LazyProfileImage from './client/LazyProfileImage';
import LazySocialLinks from './client/LazySocialLinks';
import LazyCertificationBadges from './client/LazyCertificationBadges';

// Deferred: Load with low priority (below fold)
import LazyHeroDescription from './client/LazyHeroDescription';
import LazyHeroCTA from './client/LazyHeroCTA';
import LazyAnimatedBackground from './client/LazyAnimatedBackground';
import LazyContactModal from './client/LazyContactModal';
import ServerHeroStats from './ui/ServerHeroStats';

export default function OptimizedHero({ resumeData, priority = false }) {
  const [showContact, setShowContact] = useState(false);
  const { personalInfo, skills, certifications } = resumeData;

  const backgroundConfig = config.background || { type: 'animated' };
  const shouldShowImage = backgroundConfig.type === 'image' || backgroundConfig.type === 'hybrid';
  const shouldShowAnimated = backgroundConfig.type === 'animated' || backgroundConfig.type === 'hybrid';

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

  const technicalSkills = useMemo(() => {
    if (!skills?.technical || !Array.isArray(skills.technical)) return [];
    return skills.technical;
  }, [skills]);

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

  const handleContactShow = useCallback(() => setShowContact(true), []);
  const handleContactHide = useCallback(() => setShowContact(false), []);

  return (
    <>
      <section className="hero relative overflow-hidden py-16 sm:py-16 lg:py-32">
        {/* Background - Low priority */}
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
            {backgroundConfig.image?.overlay && (
              <div className="absolute inset-0 bg-black" style={{ opacity: backgroundConfig.image?.overlayOpacity || 0.3 }}></div>
            )}
          </div>
        )}

        {shouldShowAnimated && backgroundConfig.animated?.enabled !== false && (
          <div className={`absolute inset-0 ${shouldShowImage ? 'z-[1]' : 'z-0'}`}>
            <Suspense fallback={null}>
              <LazyAnimatedBackground intensity={backgroundConfig.animated?.intensity} />
            </Suspense>
          </div>
        )}

        <div className="hero-content container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* CRITICAL PATH - Render immediately for LCP */}
            <div className="text-center lg:text-left mb-8">
              <HeroTitle 
                personalInfo={personalInfo}
                roles={roles}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Deferred content */}
              <div className="space-y-6 order-2 lg:order-1">
                <Suspense fallback={<div className="h-24 bg-base-300 rounded animate-pulse"></div>}>
                  <LazyHeroDescription personalInfo={personalInfo} />
                </Suspense>
                
                <Suspense fallback={<div className="h-12 bg-base-300 rounded animate-pulse"></div>}>
                  <LazyHeroCTA onContactShow={handleContactShow} />
                </Suspense>
              </div>

              {/* Right: Profile & Social (High priority but after title) */}
              <div className="space-y-6 order-1 lg:order-2 flex flex-col items-center">
                <Suspense fallback={
                  <div className="avatar animate-pulse">
                    <div className="w-48 sm:w-64 lg:w-80 rounded-full bg-base-300"></div>
                  </div>
                }>
                  <LazyProfileImage 
                    personalInfo={personalInfo}
                    technicalSkills={technicalSkills}
                    priority={false}
                    showFloatingIcons={true}
                  />
                </Suspense>

                <Suspense fallback={
                  <div className="flex gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 bg-base-300 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                }>
                  <LazySocialLinks 
                    socialData={personalInfo?.social} 
                    size="lg" 
                    delay={0.3} 
                  />
                </Suspense>

                {certifications && certifications.length > 0 && (
                  <Suspense fallback={
                    <div className="flex gap-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-12 h-12 bg-base-300 rounded animate-pulse"></div>
                      ))}
                    </div>
                  }>
                    <LazyCertificationBadges 
                      certifications={certifications} 
                      size="lg:w-16 lg:h-16" 
                      delay={0.5} 
                    />
                  </Suspense>
                )}
              </div>
            </div>

            {/* Stats - Lowest priority, loads last */}
            <div className="mt-12">
              <Suspense fallback={
                <div className="w-full h-32 bg-base-300 rounded animate-pulse"></div>
              }>
                <ServerHeroStats 
                  resumeData={resumeData}
                  technicalSkills={technicalSkills}
                  certificationsByVendor={certificationsByVendor}
                />
              </Suspense>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <Link href="/experience" className="btn btn-ghost btn-circle" aria-label="Scroll down">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
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
