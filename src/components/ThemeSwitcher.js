'use client';

import { useState, useEffect } from 'react';
import config from '../masterConfig';

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  const themes = [
    { name: 'light', displayName: 'Light', icon: '💡' },
    { name: 'dark', displayName: 'Dark', icon: '🌙' },
    { name: 'cupcake', displayName: 'Cupcake', icon: '🧁' },
    { name: 'bumblebee', displayName: 'Bumblebee', icon: '🐝' },
    { name: 'emerald', displayName: 'Emerald', icon: '💚' },
    { name: 'corporate', displayName: 'Corporate', icon: '🏢' },
    { name: 'synthwave', displayName: 'Synthwave', icon: '🌈' },
    { name: 'retro', displayName: 'Retro', icon: '📻' },
    { name: 'cyberpunk', displayName: 'Cyberpunk', icon: '🤖' },
    { name: 'valentine', displayName: 'Valentine', icon: '💖' },
    { name: 'halloween', displayName: 'Halloween', icon: '🎃' },
    { name: 'garden', displayName: 'Garden', icon: '🌸' },
    { name: 'forest', displayName: 'Forest', icon: '🌲' },
    { name: 'aqua', displayName: 'Aqua', icon: '🌊' },
    { name: 'lofi', displayName: 'Lo-Fi', icon: '🎵' },
    { name: 'pastel', displayName: 'Pastel', icon: '🎨' },
    { name: 'fantasy', displayName: 'Fantasy', icon: '🦄' },
    { name: 'wireframe', displayName: 'Wireframe', icon: '📐' },
    { name: 'black', displayName: 'Black', icon: '⚫' },
    { name: 'luxury', displayName: 'Luxury', icon: '💎' },
    { name: 'dracula', displayName: 'Dracula', icon: '🧛' },
    { name: 'cmyk', displayName: 'CMYK', icon: '🖨️' },
    { name: 'autumn', displayName: 'Autumn', icon: '🍂' },
    { name: 'business', displayName: 'Business', icon: '💼' },
    { name: 'acid', displayName: 'Acid', icon: '🧪' },
    { name: 'lemonade', displayName: 'Lemonade', icon: '🍋' },
    { name: 'night', displayName: 'Night', icon: '🌃' },
    { name: 'coffee', displayName: 'Coffee', icon: '☕' },
    { name: 'winter', displayName: 'Winter', icon: '❄️' },
    { name: 'dim', displayName: 'Dim', icon: '🔅' },
    { name: 'nord', displayName: 'Nord', icon: '🧊' },
    { name: 'sunset', displayName: 'Sunset', icon: '🌅' },
  ];

  useEffect(() => {
    // Only run on client side after component mounts
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    // Check if random theme is enabled and no saved theme exists
    const shouldUseRandomTheme = config.enableRandomTheme && !localStorage.getItem('theme');
    
    // Get theme from localStorage with proper error handling
    let savedTheme = config.defaultTheme || 'light'; // Use config default
    
    if (shouldUseRandomTheme) {
      // Select a random theme
      const randomIndex = Math.floor(Math.random() * themes.length);
      savedTheme = themes[randomIndex].name;
    } else {
      try {
        savedTheme = localStorage.getItem('theme') || config.defaultTheme || 'light';
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
    }
    
    setCurrentTheme(savedTheme);
    
    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Save the theme to localStorage (including random theme)
    try {
      localStorage.setItem('theme', savedTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, []);

  const changeTheme = (themeName) => {
    // Early return if not mounted (SSR safety)
    if (!mounted || typeof window === 'undefined') return;
    
    setCurrentTheme(themeName);
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Store in localStorage with error handling
    try {
      localStorage.setItem('theme', themeName);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
    
    // Close the dropdown
    const dropdownDetails = document.querySelector('details.dropdown[open]');
    if (dropdownDetails) {
      dropdownDetails.removeAttribute('open');
    }
  };

  const currentThemeData = themes.find(theme => theme.name === currentTheme);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="btn btn-ghost btn-circle">
        <span className="text-xl">🎨</span>
      </div>
    );
  }

  return (
    <details className="dropdown dropdown-end">
      <summary 
        className="btn btn-ghost btn-circle" 
        title="Change Theme"
        aria-label="Change theme"
      >
        <span className="text-xl" aria-hidden="true">
          {currentThemeData?.icon || '🎨'}
        </span>
      </summary>
      
      <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow-lg border border-base-300 max-h-96 overflow-y-auto">
        <li className="menu-title">
          <span>Choose Theme</span>
        </li>
        <div className="divider my-2"></div>
        {themes.map((theme) => (
          <li key={theme.name}>
            <button
              className={`flex items-center justify-between ${
                currentTheme === theme.name ? 'active' : ''
              }`}
              onClick={() => changeTheme(theme.name)}
            >
              <span className="flex items-center">
                <span className="mr-3">{theme.icon}</span>
                {theme.displayName}
              </span>
              {currentTheme === theme.name && (
                <span className="text-primary">✓</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
