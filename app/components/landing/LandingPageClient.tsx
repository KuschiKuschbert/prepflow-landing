'use client';

import React, { Suspense, lazy } from 'react';

// External components
import ScrollTracker from '../../../components/ScrollTracker';

// UI components
import { LandingSectionSkeleton } from '../../../components/ui/LandingSectionSkeleton';
import { ScrollProgress } from '../../../components/ui/ScrollProgress';
import { ScrollToTop } from '../../../components/ui/ScrollToTop';
// import { ScrollReveal } from '../components/ui/ScrollReveal'; // Unused in original

// Above-the-fold components (synchronous - critical for initial render)
import AppHero from './Hero';
import Highlights from './Highlights';
import LandingBackground from './LandingBackground';
import LandingHeader from './LandingHeader';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { ModernMobileNav } from './ModernMobileNav';

// Below-the-fold components (lazy-loaded for better performance)
const CloserLook = lazy(() => import('./CloserLook'));
const Performance = lazy(() => import('./Performance'));
const TechnicalSpecs = lazy(() => import('./TechnicalSpecs'));
const FinalCTA = lazy(() => import('./FinalCTA'));
const LandingFooter = lazy(() => import('./LandingFooter'));

// Background effects (lazy-loaded - defer until after initial render)
const SafeAnimatedBackground = lazy(() => import('./SafeAnimatedBackground'));
const SafeGradientOrbs = lazy(() => import('./SafeGradientOrbs'));
const BackgroundLogo = lazy(() => import('../../../components/ui/BackgroundLogo'));
const FloatingParticles = lazy(() =>
  import('../../../components/ui/FloatingParticles').then(mod => ({
    default: mod.FloatingParticles,
  })),
);

// Hooks and utilities
import { useEngagementTracking } from '../../../hooks/useEngagementTracking';

/**
 * Client-side wrapper for the landing page.
 * Handles state, hooks, and layout, receiving server-fetched data as props.
 */
export default function LandingPageClient() {
  // Translation hook (unused in this wrapper)
  // const { t } = useTranslation();

  // Engagement tracking
  const { trackEngagement } = useEngagementTracking();

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      performance.now();
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
        'Restaurant profitability platform for Australian restaurants, cafés, and food trucks. Calculate COGS, optimize pricing, track compliance, and monitor temperature—all in one place.',
      url: 'https://www.prepflow.org',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '29',
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
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
        onSectionView={() => {
          // Track section views for analytics
        }}
        onScrollDepth={() => {
          // Track scroll depth for analytics
        }}
      />
      <ScrollToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="desktop:pb-0 relative min-h-screen scroll-smooth bg-transparent pb-20 text-white">
        {/* Base background color */}
        <div className="fixed inset-0 -z-20 bg-[#0a0a0a]" aria-hidden={true} />

        {/* Beautiful Grid Background with Enhanced Effects */}
        <LandingBackground />

        {/* Animated Background Effects - Apple-style (lazy-loaded) */}
        <Suspense fallback={null}>
          <SafeAnimatedBackground />
          <SafeGradientOrbs />
          <BackgroundLogo />
          <FloatingParticles count={30} />
        </Suspense>

        {/* Content overlay - ensures content is above background */}
        <div className="relative z-10">
          {/* Header - now receiving server-fetched release data */}
          <LandingHeader trackEngagement={trackEngagement} />

          {/* Hero - Full-viewport with product title and large dashboard screenshot */}
          <AppHero trackEngagement={trackEngagement} />

          {/* Get the Highlights - 5 key features with icons and descriptions */}
          <Highlights />

          {/* Take a Closer Look - 6 expandable feature sections with screenshots */}
          <Suspense fallback={<LandingSectionSkeleton />}>
            <CloserLook />
          </Suspense>

          {/* Performance - Visual comparisons and performance metrics */}
          <Suspense fallback={<LandingSectionSkeleton />}>
            <Performance />
          </Suspense>

          {/* Technical Specs - Organized capabilities and features */}
          <Suspense fallback={<LandingSectionSkeleton />}>
            <TechnicalSpecs />
          </Suspense>

          {/* Final CTA - Register/Buy buttons */}
          <Suspense fallback={<LandingSectionSkeleton />}>
            <FinalCTA trackEngagement={trackEngagement} />
          </Suspense>

          {/* Footer */}
          <Suspense fallback={null}>
            <LandingFooter />
          </Suspense>
        </div>

        {/* Mobile Bottom Navigation */}
        <ModernMobileNav
          onMenuClick={() => setIsDrawerOpen(true)}
          trackEngagement={trackEngagement}
        />

        {/* Mobile Menu Drawer */}
        <MobileMenuDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          trackEngagement={trackEngagement}
        />
      </main>
    </>
  );
}
