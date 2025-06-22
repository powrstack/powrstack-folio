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
          <li><Link href="/about" className="btn btn-ghost">About</Link></li>
          <li><Link href="/experience" className="btn btn-ghost">Experience</Link></li>
          <li><Link href="/projects" className="btn btn-ghost">Projects</Link></li>
          <li><Link href="/blog" className="btn btn-ghost">Blog</Link></li>
        </ul>
      </div>

      <div className="navbar-end flex items-center space-x-2">
        <ThemeSwitcher />
        
        <div className="hidden lg:flex">
          <a
            href={`mailto:${personalInfo?.email}`}
            className="btn btn-primary"
          >
            Contact Me
          </a>
        </div>

        {/* Mobile menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/experience">Experience</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/blog">Blog</Link></li>
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
