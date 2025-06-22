'use client';

import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('portfolio');
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: 'portfolio', displayName: 'Portfolio Light', icon: '☀️' },
    { name: 'portfolio-dark', displayName: 'Portfolio Dark', icon: '🌙' },
    { name: 'light', displayName: 'Light', icon: '💡' },
    { name: 'dark', displayName: 'Dark', icon: '🌚' },
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
    // Get theme from localStorage or default to 'portfolio'
    const savedTheme = localStorage.getItem('theme') || 'portfolio';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(theme => theme.name === currentTheme);

  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost btn-circle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl" title="Change Theme">
          {currentThemeData?.icon || '🎨'}
        </span>
      </div>
      
      {isOpen && (
        <ul 
          tabIndex={0} 
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow-lg border border-base-300 max-h-96 overflow-y-auto"
        >
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
      )}
    </div>
  );
}
