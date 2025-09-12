'use client';

import React, { useState, useEffect } from 'react';

interface FloatingCTAProps {
  onEngagement: (type: string) => void;
  t?: (key: string, fallback?: string | any[]) => string | any[];
}

export function FloatingCTA({ onEngagement, t }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show after scrolling 50% of the page
      if (scrollY > windowHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  // Default translation function if not provided
  const defaultT = (key: string, fallback?: string) => fallback || key;
  const translate = t || defaultT;

  return (
    <div className="fixed bottom-4 right-4 z-40 md:bottom-8 md:right-8">
      <div className="flex flex-col gap-2 md:gap-3">
        {/* Main CTA */}
        <a
          href="https://7495573591101.gumroad.com/l/prepflow"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-3 md:px-6 md:py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300 transform hover:scale-105 min-h-[44px] touch-manipulation"
          onClick={() => onEngagement('floating_cta_click')}
        >
          <span className="hidden sm:inline">{translate('floatingCta.mainButton', 'Get PrepFlow')}</span>
          <span className="sm:hidden">{translate('floatingCta.mainButtonMobile', 'Get It')}</span>
          <span className="text-xs opacity-90 ml-1">{translate('floatingCta.price', 'AUD $29')}</span>
        </a>
        
        {/* Sample Dashboard CTA */}
        <a
          href="#lead-magnet"
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-600 px-4 py-3 md:px-6 text-sm font-semibold text-gray-300 hover:text-[#29E7CD] hover:border-[#29E7CD] transition-all duration-300 transform hover:scale-105 min-h-[44px] touch-manipulation"
          onClick={() => onEngagement('floating_sample_click')}
        >
          <span className="hidden sm:inline">{translate('floatingCta.sampleButton', 'Free Sample')}</span>
          <span className="sm:hidden">{translate('floatingCta.sampleButtonMobile', 'Sample')}</span>
        </a>
      </div>
    </div>
  );
}
