'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ resumeData }) {
  const [mounted, setMounted] = useState(false);
  const { personalInfo } = resumeData || {};

  // Ensure consistent rendering between server and client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe fallback for SSR
  const displayName = mounted && personalInfo?.name 
    ? personalInfo.name.split(' ').slice(0, 3).join(' ') 
    : 'Portfolio';

  const email = mounted && personalInfo?.email ? personalInfo.email : '';

  if (!mounted) {
    // Return a simplified version for SSR
    return (
      <header className="navbar fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm h-16 min-h-16 px-4">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-lg sm:text-xl font-bold text-primary">
            Portfolio
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/" className="btn btn-ghost">Home</Link></li>
            <li><Link href="/blog" className="btn btn-ghost">Blog</Link></li>
          </ul>
        </div>

        <div className="navbar-end flex items-center space-x-2">
          <ThemeSwitcher />
          
          <div className="hidden lg:flex space-x-2">
            <a
              href="/Md_Abu_Raihan_Srabon_Resume.pdf"
              download="Md_Abu_Raihan_Srabon_Resume.pdf"
              className="btn btn-outline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </a>
            <button className="btn btn-primary">
              Contact Me
            </button>
          </div>

          {/* Mobile menu */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost" aria-label="Open navigation menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-lg bg-base-100 rounded-box w-48 border border-base-300 right-0 max-w-[calc(100vw-2rem)]">
              <li><Link href="/" className="hover:bg-base-200 px-3 py-2 rounded-md">Home</Link></li>
              <li><Link href="/blog" className="hover:bg-base-200 px-3 py-2 rounded-md">Blog</Link></li>
              <li className="border-t border-base-300 mt-2 pt-2">
                <a 
                  href="/Md_Abu_Raihan_Srabon_Resume.pdf"
                  download="Md_Abu_Raihan_Srabon_Resume.pdf"
                  className="btn btn-outline btn-sm w-full justify-start"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </a>
              </li>
              <li className="mt-2">
                <button className="btn btn-primary btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                  Contact Me
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  }

  // Client-side rendered version with full functionality
  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm h-16 min-h-16 px-4">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-lg sm:text-xl font-bold text-primary">
          {displayName}
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/" className="btn btn-ghost">Home</Link></li>
          <li><Link href="/blog" className="btn btn-ghost">Blog</Link></li>
        </ul>
      </div>

      <div className="navbar-end flex items-center space-x-2">
        <ThemeSwitcher />
        
        <div className="hidden lg:flex space-x-2">
          <a
            href="/Md_Abu_Raihan_Srabon_Resume.pdf"
            download="Md_Abu_Raihan_Srabon_Resume.pdf"
            className="btn btn-outline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CV
          </a>
          {email && (
            <a
              href={`mailto:${email}`}
              className="btn btn-primary"
            >
              Contact Me
            </a>
          )}
        </div>

        {/* Mobile menu */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost" aria-label="Open navigation menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-lg bg-base-100 rounded-box w-48 border border-base-300 right-0 max-w-[calc(100vw-2rem)]">
            <li><Link href="/" className="hover:bg-base-200 px-3 py-2 rounded-md">Home</Link></li>
            <li><Link href="/blog" className="hover:bg-base-200 px-3 py-2 rounded-md">Blog</Link></li>
            <li className="border-t border-base-300 mt-2 pt-2">
              <a 
                href="/Md_Abu_Raihan_Srabon_Resume.pdf"
                download="Md_Abu_Raihan_Srabon_Resume.pdf"
                className="btn btn-outline btn-sm w-full justify-start"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </a>
            </li>
            {email && (
              <li className="mt-2">
                <a href={`mailto:${email}`} className="btn btn-primary btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                  Contact Me
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
