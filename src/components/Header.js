'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ resumeData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { personalInfo } = resumeData;

  const firstThree = personalInfo?.name?.split(' ').slice(0, 3).join(' ') || 'Portfolio';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">
          {firstThree}
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
          <a
            href={`mailto:${personalInfo?.email}`}
            className="btn btn-primary"
          >
            Contact Me
          </a>
        </div>

        {/* Mobile menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost" aria-label="Open navigation menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li>
              <a 
                href="/Md_Abu_Raihan_Srabon_Resume.pdf"
                download="Md_Abu_Raihan_Srabon_Resume.pdf"
                className="btn btn-outline btn-sm mt-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </a>
            </li>
            <li>
              <a href={`mailto:${personalInfo?.email}`} className="btn btn-primary btn-sm mt-2">
                Contact Me
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
