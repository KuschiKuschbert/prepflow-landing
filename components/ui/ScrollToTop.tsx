'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show on landing page, not in webapp
  if (pathname.startsWith('/webapp')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 left-4 z-40 min-h-[44px] min-w-[44px] transform touch-manipulation rounded-full border border-gray-600 bg-gray-800/80 p-3 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#29E7CD] hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none desktop:bottom-8 desktop:left-8"
      aria-label="Scroll to top"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
