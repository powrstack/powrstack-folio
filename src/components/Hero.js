'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ContactForm from './ContactForm';
import AnimatedBackground from './AnimatedBackground';

export default function Hero({ resumeData }) {
  const [showContact, setShowContact] = useState(false);
  const { personalInfo, skills } = resumeData;

  // Auto-type effect for role
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Generate roles from resume data
  const roles = [
    personalInfo?.title || 'Software Engineer',
    ...(skills?.technical?.slice(0, 3).map(skill => `${skill.name} Developer`) || []),
    'Open Source Contributor'
  ].filter(Boolean);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentRole = roles[currentRoleIndex];
      
      if (!isDeleting) {
        if (currentText.length < currentRole.length) {
          setCurrentText(currentRole.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentRole.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentRoleIndex]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="hero min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground />

        <div className="hero-content container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="mb-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-base-content">
                  Hi, I'm{' '}
                  <span className="text-primary">
                    {personalInfo?.name || 'Developer'}
                  </span>
                </h1>
                <div className="text-2xl lg:text-3xl font-semibold text-base-content/80 mt-4 h-12">
                  I'm a{' '}
                  <span className="text-secondary">
                    {currentText}
                    <span className="animate-pulse">|</span>
                  </span>
                </div>
              </div>

              <div className="text-lg text-base-content/70 mb-8 leading-relaxed">
                {personalInfo?.summary ? 
                  personalInfo.summary.split('\n').map((line, index) => (
                    <p key={index} className={index > 0 ? 'mt-4' : ''}>
                      {line}
                    </p>
                  )) :
                  <p>Passionate about creating innovative solutions and building scalable applications that make a difference.</p>
                }
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setShowContact(true)}
                  className="btn btn-primary btn-lg"
                >
                  Get In Touch
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button
                  onClick={() => scrollToSection('about')}
                  className="btn btn-outline btn-lg"
                >
                  Learn More
                </button>
              </div>

              {/* Quick Stats */}
              <div className="stats stats-vertical sm:stats-horizontal shadow-lg mt-8 bg-base-100">
                <div className="stat">
                  <div className="stat-value text-primary text-2xl">
                    {resumeData?.experience?.length || 5}+
                  </div>
                  <div className="stat-title">Years Experience</div>
                </div>
                
                <div className="stat">
                  <div className="stat-value text-secondary text-2xl">
                    {resumeData?.projects?.length || 20}+
                  </div>
                  <div className="stat-title">Projects</div>
                </div>
                
                <div className="stat">
                  <div className="stat-value text-accent text-2xl">
                    {skills?.technical?.length || 15}+
                  </div>
                  <div className="stat-title">Technologies</div>
                </div>
              </div>
            </div>

            {/* Profile Image & Tech Stack */}
            <div className="text-center order-1 lg:order-2">
              <div className="relative inline-block">
                {/* Profile Image */}
                <div className="avatar mb-8">
                  <div className="w-64 lg:w-80 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image
                      src={personalInfo?.profileImage || '/images/profile.jpg'}
                      alt={personalInfo?.name || 'Profile'}
                      width={320}
                      height={320}
                      sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 320px"
                      className="rounded-full object-cover"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                </div>

                {/* Floating Tech Icons */}
                <div className="absolute inset-0 pointer-events-none">
                  {skills?.technical?.slice(0, 6).map((tech, index) => (
                    <div
                      key={tech.name}
                      className={`absolute badge badge-primary badge-lg animate-bounce`}
                      style={{
                        top: `${20 + (index * 15)}%`,
                        left: index % 2 === 0 ? '10%' : '90%',
                        animationDelay: `${index * 0.5}s`,
                        animationDuration: '3s'
                      }}
                    >
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 mt-8">
                {personalInfo?.social?.github && (
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline btn-lg hover:btn-primary"
                    aria-label="Visit GitHub profile"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                {personalInfo?.social?.linkedin && (
                  <a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline btn-lg hover:btn-secondary"
                    aria-label="Visit LinkedIn profile"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                
                {personalInfo?.social?.dev && (
                  <a
                    href={personalInfo.social.dev}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline btn-lg hover:btn-accent"
                    aria-label="Visit DEV Community profile"
                  >
                    <Image
                      src="/images/dev-badge.svg"
                      alt="DEV Community"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('about')}
            className="btn btn-ghost btn-circle"
            aria-label="Scroll down to About section"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Contact Modal */}
      {showContact && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="modal-action">
              <button
                onClick={() => setShowContact(false)}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                aria-label="Close contact form"
              >
                ✕
              </button>
            </div>
            <ContactForm resumeData={resumeData} />
          </div>
          <div className="modal-backdrop" onClick={() => setShowContact(false)}>
            <button aria-label="Close modal">close</button>
          </div>
        </div>
      )}
    </>
  );
}
