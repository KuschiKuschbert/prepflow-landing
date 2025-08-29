'use client';

import React, { useState, useEffect } from 'react';

interface RealStorySection {
  id: string;
  year: string;
  title: string;
  description: string;
  location?: string;
  icon: string;
}

interface RealStoryNotifierProps {
  enabled?: boolean;
  showStory?: boolean;
}

export default function RealStoryNotifier({ enabled = true, showStory = true }: RealStoryNotifierProps) {
  const [currentStory, setCurrentStory] = useState<RealStorySection | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Your real story and journey
  const realStory: RealStorySection[] = [
    {
      id: '1',
      year: '2008-2012',
      title: 'Early Experience',
      description: 'Started as Sous Chef at Krautwells GmbH, managing vegan cuisine and training junior chefs',
      location: 'Germany',
      icon: '👨‍🍳'
    },
    {
      id: '2',
      year: '2012-2018',
      title: 'European Leadership',
      description: 'Founded KSK-Küchenspezialkräfte vegan catering, managed teams of 21 staff, served 1,200+ daily',
      location: 'Europe',
      icon: '🌍'
    },
    {
      id: '3',
      year: '2018-2024',
      title: 'Australian Excellence',
      description: 'Executive Chef roles, Head Chef at ALH Hotels, leading teams of 9 chefs with AI integration',
      location: 'Australia',
      icon: '🇦🇺'
    },
    {
      id: '4',
      year: '2024',
      title: 'Ready to Share',
      description: 'Now sharing the perfected tool with fellow chefs and restaurateurs',
      location: 'Global Launch',
      icon: '🚀'
    }
  ];

  useEffect(() => {
    if (!enabled || !showStory) return;

    // Show first story immediately
    setCurrentStory(realStory[0]);
    setIsVisible(true);

    // Cycle through stories every 8 seconds
    let storyIndex = 1;
    const timer = setInterval(() => {
      setCurrentStory(realStory[storyIndex % realStory.length]);
      setIsVisible(true);
      
      // Hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
      
      storyIndex++;
    }, 8000);

    return () => clearInterval(timer);
  }, [enabled, showStory]);

  if (!enabled || !showStory || !currentStory) return null;

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-40 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-xl p-4 shadow-2xl max-w-sm">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {currentStory.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#29E7CD] text-xs font-semibold">
                    {currentStory.year}
                  </span>
                  {currentStory.location && (
                    <span className="text-gray-500 text-xs">
                      • {currentStory.location}
                    </span>
                  )}
                </div>
                <p className="text-white text-sm font-medium leading-relaxed">
                  {currentStory.title}
                </p>
                <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                  {currentStory.description}
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                aria-label="Close story"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
