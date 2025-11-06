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
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="min-h-[44px] min-w-[44px] rounded-lg border border-gray-700 bg-gray-800/50 p-3 backdrop-blur-sm transition-colors hover:bg-gray-700/50"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <div className="flex h-6 w-6 flex-col items-center justify-center">
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? 'translate-y-1 rotate-45' : ''}`}
          ></span>
          <span
            className={`mt-1 block h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
          ></span>
          <span
            className={`mt-1 block h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? '-translate-y-1 -rotate-45' : ''}`}
          ></span>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-72 border-l border-gray-700 bg-[#1f1f1f]/95 shadow-2xl backdrop-blur-md md:w-80">
            <div className="p-4 md:p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between md:mb-8">
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src="/images/prepflow-logo.png"
                    alt="PrepFlow Logo"
                    width={32}
                    height={32}
                    className="h-7 w-auto md:h-8"
                  />
                  <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-base font-bold tracking-tight text-transparent md:text-lg">
                    PrepFlow
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-gray-800/50 p-2 transition-colors hover:bg-gray-700/50 md:p-3"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2 md:space-y-4">
                <button
                  onClick={() => handleNavClick('features')}
                  className="flex min-h-[44px] w-full items-center rounded-xl px-4 py-3 text-left text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#29E7CD] md:py-4"
                >
                  Features
                </button>
                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className="flex min-h-[44px] w-full items-center rounded-xl px-4 py-3 text-left text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#29E7CD] md:py-4"
                >
                  How it works
                </button>
                <button
                  onClick={() => handleNavClick('benefits')}
                  className="flex min-h-[44px] w-full items-center rounded-xl px-4 py-3 text-left text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#29E7CD] md:py-4"
                >
                  Outcomes
                </button>
                <button
                  onClick={() => handleNavClick('faq')}
                  className="flex min-h-[44px] w-full items-center rounded-xl px-4 py-3 text-left text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#29E7CD] md:py-4"
                >
                  FAQ
                </button>
              </nav>

              {/* Language Switcher */}
              <div className="mt-4 border-t border-gray-700 pt-4 md:mt-6 md:pt-6">
                <div className="mb-3 flex items-center justify-between md:mb-4">
                  <span className="text-sm text-gray-400">Language</span>
                </div>
                <LanguageSwitcher className="w-full" />
              </div>

              {/* CTA Button */}
              <div className="mt-4 border-t border-gray-700 pt-4 md:mt-6 md:pt-6">
                <a
                  href="https://7495573591101.gumroad.com/l/prepflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25 md:px-6 md:py-4 md:text-base"
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
