'use client';

import React from 'react';

// External components
// ExitIntentTracker removed per request
// PerformanceTracker removed per request
import ScrollTracker from '../components/ScrollTracker';

// UI components
// FloatingCTA removed per request
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { ScrollToTop } from '../components/ui/ScrollToTop';

// Landing page components
import Capabilities from './components/landing/Capabilities';
import AppHero from './components/landing/Hero';
import HowItWorks from './components/landing/HowItWorks';
import LandingBackground from './components/landing/LandingBackground';
import LandingHeader from './components/landing/LandingHeader';
import Security from './components/landing/Security';
import Tour from './components/landing/Tour';

// Hooks and utilities
import { useEngagementTracking } from '../hooks/useEngagementTracking';
import { useTranslation } from '../lib/useTranslation';

// Variant components are now lazy-loaded via useABTest hook

export default function Page() {
  // Translation hook
  const { t } = useTranslation();

  // Engagement tracking
  const { trackEngagement } = useEngagementTracking();

  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      // cleaned: Removed console.log statements for production
    }
  }, []);

  // Structured data for SEO (trimmed, no pricing)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PrepFlow',
    description: 'Restaurant COGS and menu profitability tool for accurate pricing.',
    url: 'https://www.prepflow.org',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
  };

  return (
    <>
      {/* Performance & Analytics Components */}
      <ScrollProgress />
      {/* Exit-intent disabled */}
      <ScrollTracker
        onSectionView={sectionId => {
          // Track section views for analytics
        }}
        onScrollDepth={depth => {
          // Track scroll depth for analytics
        }}
      />
      {/* Performance tracker disabled */}

      {/* Floating CTA disabled */}

      {/* Scroll to Top - Only on landing page */}
      <ScrollToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main
        className="min-h-screen scroll-smooth bg-transparent text-white"
        style={
          {
            '--primary-color': '#29E7CD',
            '--secondary-color': '#3B82F6',
            '--accent-color': '#D925C7',
            '--bg-color': '#0a0a0a',
            '--text-color': '#ffffff',
            '--gray-300': '#d1d5db',
            '--gray-400': '#9ca3af',
            '--gray-500': '#6b7280',
            '--gray-600': '#4b5563',
            '--gray-700': '#374151',
            '--gray-800': '#1f2937',
          } as React.CSSProperties
        }
      >
        {/* Background Effects */}
        <LandingBackground />

        {/* Header */}
        <LandingHeader trackEngagement={trackEngagement} />

        {/* Hero */}
        <AppHero />

        {/* Tour teaser */}
        <Tour />

        {/* Capabilities */}
        <Capabilities />

        {/* How it works */}
        <HowItWorks />

        {/* Security */}
        <Security />
      </main>
    </>
  );
}
