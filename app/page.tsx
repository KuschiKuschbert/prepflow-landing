'use client';

import React from 'react';

// External components
import ExitIntentTracker from '../components/ExitIntentTracker';
import PerformanceTracker from '../components/PerformanceTracker';
import ScrollTracker from '../components/ScrollTracker';

// UI components
import { FloatingCTA } from '../components/ui/FloatingCTA';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { ScrollToTop } from '../components/ui/ScrollToTop';

// Landing page components
import LandingBackground from './components/landing/LandingBackground';
import LandingHeader from './components/landing/LandingHeader';
import LandingSections from './components/landing/LandingSections';
import Hero from './components/landing/Hero';

// Hooks and utilities
import { useLandingPageABTest } from '../components/useABTest';
import { useEngagementTracking } from '../hooks/useEngagementTracking';
import { getVariantAssignmentInfo } from '../lib/ab-testing-analytics';
import { isDevelopment } from '../lib/constants';
import { useTranslation } from '../lib/useTranslation';
import { getOrCreateUserId } from '../lib/user-utils';

// Variant components are now lazy-loaded via useABTest hook

export default function Page() {
  // Translation hook
  const { t } = useTranslation();

  // Engagement tracking
  const { trackEngagement } = useEngagementTracking();

  // A/B Testing hook with lazy loading
  const {
    variantId,
    isLoading,
    trackEngagement: abTrackEngagement,
    renderHero,
  } = useLandingPageABTest(undefined, t, trackEngagement);

  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      // cleaned: Removed console.log statements for production
      if (isDevelopment) {
        console.log(`PrepFlow landing page loaded in ${loadTime.toFixed(2)}ms`);
        console.log(`🧪 A/B Test Variant: ${variantId}`);
      }

      // Log variant assignment info for debugging
      const userId = getOrCreateUserId();
      const assignmentInfo = getVariantAssignmentInfo(userId);
      if (assignmentInfo && isDevelopment) {
        console.log(`📊 Variant Assignment:`, {
          variant: assignmentInfo.variantId,
          assignedAt: assignmentInfo.assignedAt,
          daysRemaining: assignmentInfo.daysRemaining,
          isPersistent: assignmentInfo.isPersistent,
        });
      }
    }
  }, [variantId]);

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PrepFlow',
    description: 'COGS & Menu Profit Tool for restaurant profitability optimization',
    url: 'https://www.prepflow.org',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'AUD',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return (
    <>
      {/* Performance & Analytics Components */}
      <ScrollProgress />
      <ExitIntentTracker
        onExitIntent={() => {
          // Track exit intent for conversion optimization
          // You could trigger a popup, offer, or other retention strategy here
        }}
      />
      <ScrollTracker
        onSectionView={sectionId => {
          // Track section views for analytics
        }}
        onScrollDepth={depth => {
          // Track scroll depth for analytics
        }}
      />
      <PerformanceTracker
        onMetrics={metrics => {
          // Track performance metrics for optimization
        }}
      />

      {/* Floating CTA */}
      <FloatingCTA onEngagement={trackEngagement} t={t} />

      {/* Scroll to Top - Only on landing page */}
      <ScrollToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main
        className="min-h-screen scroll-smooth bg-[#0a0a0a] text-white"
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
        <Hero />

        {/* Main Sections (pricing/FAQ disabled for explainer landing) */}
        <LandingSections renderHero={() => null} renderPricing={() => null} />
      </main>
    </>
  );
}
