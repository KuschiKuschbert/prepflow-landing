'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import LanguageSwitcher from '../LanguageSwitcher';

interface MobileNavigationProps {
  onEngagement: (type: string) => void;
}

export function MobileNavigation({ onEngagement }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavClick = (section: string) => {
    closeMenu();
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-700/50 transition-colors"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-80 h-full bg-[#1f1f1f]/95 backdrop-blur-md border-l border-gray-700 shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/images/prepflow-logo.png" 
                    alt="PrepFlow Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                    PrepFlow
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-4">
                <button
                  onClick={() => handleNavClick('features')}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors"
                >
                  How it works
                </button>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => handleNavClick('faq')}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-[#29E7CD] hover:bg-gray-800/50 transition-colors"
                >
                  FAQ
                </button>
              </nav>

              {/* Language Switcher */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Language</span>
                </div>
                <LanguageSwitcher className="w-full" />
              </div>

              {/* CTA Button */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <a
                  href="https://7495573591101.gumroad.com/l/prepflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-4 text-center font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                  onClick={() => {
                    onEngagement('mobile_menu_cta_click');
                    closeMenu();
                  }}
                >
                  Get PrepFlow Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
