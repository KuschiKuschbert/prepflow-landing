'use client';

import React from 'react';

// External components
import ScrollTracker from '../components/ScrollTracker';

// UI components
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { ScrollToTop } from '../components/ui/ScrollToTop';

// Landing page components
import CloserLook from './components/landing/CloserLook';
import FinalCTA from './components/landing/FinalCTA';
import AppHero from './components/landing/Hero';
import Highlights from './components/landing/Highlights';
import LandingFooter from './components/landing/LandingFooter';
import LandingHeader from './components/landing/LandingHeader';
import Performance from './components/landing/Performance';
import SafeAnimatedBackground from './components/landing/SafeAnimatedBackground';
import SafeGradientOrbs from './components/landing/SafeGradientOrbs';
import LandingBackground from './components/landing/LandingBackground';
import TechnicalSpecs from './components/landing/TechnicalSpecs';

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

  // Structured data for SEO - SoftwareApplication with Organization
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PrepFlow',
      description:
        'Kitchen project management software for restaurants, cafés, and food trucks. Track ingredients, manage recipes, calculate COGS, and optimize pricing.',
      url: 'https://www.prepflow.org',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '127',
      },
      publisher: {
        '@type': 'Organization',
        name: 'PrepFlow',
        url: 'https://www.prepflow.org',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.prepflow.org/images/prepflow-logo.png',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PrepFlow',
      url: 'https://www.prepflow.org',
      logo: 'https://www.prepflow.org/images/prepflow-logo.png',
      sameAs: ['https://www.prepflow.org'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'hello@prepflow.org',
      },
    },
  ];

  return (
    <>
      {/* Performance & Analytics Components */}
      <ScrollProgress />
      <ScrollTracker
        onSectionView={sectionId => {
          // Track section views for analytics
        }}
        onScrollDepth={depth => {
          // Track scroll depth for analytics
        }}
      />
      <ScrollToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main
        className="relative min-h-screen scroll-smooth bg-transparent text-white"
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
        {/* Base background color */}
        <div className="fixed inset-0 -z-20 bg-[#0a0a0a]" aria-hidden="true" />

        {/* Beautiful Grid Background */}
        <LandingBackground />

        {/* Animated Background Effects - Apple-style */}
        <SafeAnimatedBackground />
        <SafeGradientOrbs />

        {/* Content overlay - ensures content is above background */}
        <div className="relative z-10">
          {/* Header */}
          <LandingHeader trackEngagement={trackEngagement} />

          {/* Hero - Full-viewport with product title and large dashboard screenshot */}
          <AppHero trackEngagement={trackEngagement} />

          {/* Get the Highlights - 5 key features with icons and descriptions */}
          <Highlights />

          {/* Take a Closer Look - 6 expandable feature sections with screenshots */}
          <CloserLook />

          {/* Performance - Visual comparisons and performance metrics */}
          <Performance />

          {/* Technical Specs - Organized capabilities and features */}
          <TechnicalSpecs />

          {/* Final CTA - Register/Buy buttons */}
          <FinalCTA trackEngagement={trackEngagement} />

          {/* Footer */}
          <LandingFooter />
        </div>
      </main>
    </>
  );
}
