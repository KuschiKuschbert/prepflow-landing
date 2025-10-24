'use client';

import React from 'react';
import Link from 'next/link';

// External components
import OptimizedImage from '../components/OptimizedImage';
import ExitIntentTracker from '../components/ExitIntentTracker';
import ScrollTracker from '../components/ScrollTracker';
import PerformanceTracker from '../components/PerformanceTracker';
import LeadMagnetForm from '../components/LeadMagnetForm';
import LanguageSwitcher from '../components/LanguageSwitcher';

// UI components
import { MobileNavigation } from '../components/ui/MobileNavigation';
import { FloatingCTA } from '../components/ui/FloatingCTA';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { HeroSkeleton, PricingSkeleton } from '../components/ui/LoadingSkeleton';

// Hooks and utilities
import { useLandingPageABTest } from '../components/useABTest';
import { getVariantAssignmentInfo } from '../lib/ab-testing-analytics';
import { useTranslation } from '../lib/useTranslation';
import { getOrCreateUserId } from '../lib/user-utils';
import { isDevelopment } from '../lib/constants';
import { BUTTON_STYLES } from '../lib/tailwind-utils';
import { useEngagementTracking } from '../hooks/useEngagementTracking';

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
    renderPricing,
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
        {/* Background gradient effects - optimized with CSS custom properties */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#29E7CD]/10 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-[#D925C7]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex items-center justify-between py-8" role="banner">
            <div className="flex items-center gap-3">
              <OptimizedImage
                src="/images/prepflow-logo.png"
                alt={String(t('logo.alt', 'PrepFlow Logo'))}
                width={48}
                height={48}
                className="h-12 w-auto"
                priority={true}
              />
              <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-xl font-bold tracking-tight text-transparent">
                PrepFlow
              </span>
            </div>
            <nav
              className="hidden gap-8 text-sm md:flex"
              role="navigation"
              aria-label={String(t('nav.ariaLabel', 'Main navigation'))}
            >
              <a
                href="#features"
                className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
                aria-label={String(t('nav.featuresAria', 'View PrepFlow features'))}
              >
                {t('nav.features', 'Features')}
              </a>
              <a
                href="#how-it-works"
                className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
                aria-label={String(t('nav.howItWorksAria', 'Learn how PrepFlow works'))}
              >
                {t('nav.howItWorks', 'How it works')}
              </a>
              <a
                href="#pricing"
                className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
                aria-label={String(t('nav.pricingAria', 'View PrepFlow pricing'))}
              >
                {t('nav.pricing', 'Pricing')}
              </a>
              <a
                href="#faq"
                className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
                aria-label={String(t('nav.faqAria', 'Frequently asked questions'))}
              >
                {t('nav.faq', 'FAQ')}
              </a>
            </nav>
            <div className="hidden items-center gap-4 md:flex">
              <LanguageSwitcher className="mr-4" />
              <a
                href="https://7495573591101.gumroad.com/l/prepflow"
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_STYLES.primary}
                onClick={() => trackEngagement('header_cta_click')}
              >
                {t('hero.ctaPrimary', 'Get PrepFlow Now')}
              </a>
            </div>

            {/* Mobile Header - Language Switcher + Navigation */}
            <div className="flex items-center gap-3 md:hidden">
              <LanguageSwitcher className="scale-90" showFlag={true} showName={true} size="sm" />
              <MobileNavigation onEngagement={trackEngagement} />
            </div>
          </header>

          {/* Hero Section - A/B Testing Variants with Lazy Loading */}
          {renderHero()}

          {/* Trust bar */}
          <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 p-6 text-center text-base text-gray-300 shadow-lg backdrop-blur-sm">
            {t('trustBar.text')}
          </div>

          {/* Problem → Outcome */}
          <section id="problem-outcome" className="py-20">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    {t('problemOutcome.problem.title')}
                  </span>
                </h3>
                <ul className="space-y-4 text-lg text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-red-400">✗</span>
                    <span>{t('problemOutcome.problem.points.0')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-red-400">✗</span>
                    <span>{t('problemOutcome.problem.points.1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-red-400">✗</span>
                    <span>{t('problemOutcome.problem.points.2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-red-400">✗</span>
                    <span>{t('problemOutcome.problem.points.3')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                  <span className="bg-gradient-to-r from-green-400 to-[#29E7CD] bg-clip-text text-transparent">
                    {t('problemOutcome.outcome.title')}
                  </span>
                </h3>
                <ul className="space-y-4 text-lg text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-green-400">✓</span>
                    <span>{t('problemOutcome.outcome.points.0')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-green-400">✓</span>
                    <span>{t('problemOutcome.outcome.points.1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-green-400">✓</span>
                    <span>{t('problemOutcome.outcome.points.2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl text-green-400">✓</span>
                    <span>{t('problemOutcome.outcome.points.3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contributing Margin Highlight */}
          <section className="py-20" id="contributing-margin">
            <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
              <div className="mb-8 text-center">
                <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                    {t('contributingMargin.title')}
                  </span>
                </h3>
                <p className="text-lg text-gray-300">{t('contributingMargin.subtitle')}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-4 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/20 p-6">
                    <span className="text-4xl">💰</span>
                    <h4 className="mt-3 text-xl font-semibold text-white">
                      {t('contributingMargin.grossProfit.title')}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {t('contributingMargin.grossProfit.description')}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-4 rounded-2xl border border-[#D925C7]/30 bg-[#D925C7]/20 p-6">
                    <span className="text-4xl">⚡</span>
                    <h4 className="mt-3 text-xl font-semibold text-white">
                      {t('contributingMargin.contributingMargin.title')}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {t('contributingMargin.contributingMargin.description')}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-4 rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/20 p-6">
                    <span className="text-4xl">🎯</span>
                    <h4 className="mt-3 text-xl font-semibold text-white">
                      {t('contributingMargin.actionPlan.title')}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {t('contributingMargin.actionPlan.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-base text-gray-300">
                  <strong>{t('contributingMargin.explanation')}</strong>
                  <br />
                  <span className="text-sm text-gray-400">
                    {t('contributingMargin.disclaimer')}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* My Story - Authentic Journey */}
          <section className="border-t border-gray-700 py-20">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                {t('journey.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-gray-300">{t('journey.subtitle')}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 text-4xl">👨‍🍳</div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {t('journey.earlyExperience.title')}
                </h3>
                <p className="text-sm text-gray-300">{t('journey.earlyExperience.description')}</p>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl">🌍</div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {t('journey.europeanLeadership.title')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('journey.europeanLeadership.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl">🇦🇺</div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {t('journey.australianExcellence.title')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('journey.australianExcellence.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl">🚀</div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {t('journey.readyToShare.title')}
                </h3>
                <p className="text-sm text-gray-300">{t('journey.readyToShare.description')}</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="mx-auto max-w-4xl rounded-2xl border border-[#29E7CD]/30 bg-[#1f1f1f] p-8">
                <h3 className="mb-4 text-2xl font-bold text-[#29E7CD]">
                  {t('journey.whyCreated.title')}
                </h3>
                <p className="mb-4 leading-relaxed text-gray-300">
                  {t('journey.whyCreated.paragraphs.0')}
                </p>
                <p className="mb-4 leading-relaxed text-gray-300">
                  {t('journey.whyCreated.paragraphs.1')}
                </p>
                <p className="mb-4 leading-relaxed text-gray-300">
                  {t('journey.whyCreated.paragraphs.2')}
                </p>
                <p className="mb-4 leading-relaxed text-gray-300">
                  {t('journey.whyCreated.paragraphs.3')}
                </p>
              </div>
            </div>
          </section>

          {/* Features – tailored to the spreadsheet */}
          <section id="features" className="py-20">
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                title={String(t('features.stockList.title'))}
                body={String(t('features.stockList.description'))}
              />
              <FeatureCard
                title={String(t('features.cogsRecipes.title'))}
                body={String(t('features.cogsRecipes.description'))}
              />
              <FeatureCard
                title={String(t('features.itemPerformance.title'))}
                body={String(t('features.itemPerformance.description'))}
              />
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <FeatureCard
                title={String(t('features.dashboardKpis.title'))}
                body={String(t('features.dashboardKpis.description'))}
              />
              <FeatureCard
                title={String(t('features.globalTax.title'))}
                body={String(t('features.globalTax.description'))}
              />
              <FeatureCard
                title={String(t('features.fastOnboarding.title'))}
                body={String(t('features.fastOnboarding.description'))}
              />
              <FeatureCard
                title={String(t('features.aiMethodGenerator.title'))}
                body={String(t('features.aiMethodGenerator.description'))}
              />
            </div>
          </section>

          {/* Global Features */}
          <section id="global-features" className="py-20">
            <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
              <div className="mb-12 text-center">
                <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                    {t('globalFeatures.title')}
                  </span>
                </h3>
                <p className="mx-auto max-w-3xl text-lg text-gray-300">
                  {t('globalFeatures.subtitle')}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD] to-[#3B82F6]">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-white">
                    {t('globalFeatures.multiCurrency.title')}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {t('globalFeatures.multiCurrency.description')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D925C7] to-[#29E7CD]">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-white">
                    {t('globalFeatures.taxSystems.title')}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {t('globalFeatures.taxSystems.description')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#D925C7]">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-white">
                    {t('globalFeatures.access24_7.title')}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {t('globalFeatures.access24_7.description')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD] to-[#D925C7]">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-white">
                    {t('globalFeatures.noConsultants.title')}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {t('globalFeatures.noConsultants.description')}
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-base text-gray-300">
                  <strong>{t('globalFeatures.conclusion')}</strong>
                </p>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="py-20">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
              {t('howItWorks.title')}
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Step
                n={1}
                title={String(t('howItWorks.step1.title'))}
                body={String(t('howItWorks.step1.description'))}
              />
              <Step
                n={2}
                title={String(t('howItWorks.step2.title'))}
                body={String(t('howItWorks.step2.description'))}
              />
              <Step
                n={3}
                title={String(t('howItWorks.step3.title'))}
                body={String(t('howItWorks.step3.description'))}
              />
            </div>

            {/* 60-Second Checklist */}
            <div className="mt-16 rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-8 shadow-2xl backdrop-blur-sm">
              <h3 className="mb-6 text-center text-2xl font-bold">
                {t('howItWorks.checklist.title')}
              </h3>
              <div className="grid gap-4 text-center md:grid-cols-5">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-xl text-[#29E7CD]">1</span>
                  </div>
                  <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.0')}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-xl text-[#29E7CD]">2</span>
                  </div>
                  <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.1')}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-xl text-[#29E7CD]">3</span>
                  </div>
                  <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.2')}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-xl text-[#29E7CD]">4</span>
                  </div>
                  <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.3')}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/20">
                    <span className="text-xl text-[#29E7CD]">5</span>
                  </div>
                  <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.4')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Lead Magnet */}
          <section id="lead-magnet" className="py-20">
            <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-10 shadow-2xl backdrop-blur-sm">
              <div className="mb-8 text-center">
                <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {t('leadMagnet.title')}
                </h3>
                <p className="text-lg text-gray-300">{t('leadMagnet.subtitle')}</p>
              </div>

              <div className="mx-auto max-w-md">
                <LeadMagnetForm
                  onSuccess={(data: { name: string; email: string; preference: 'sample' }) => {
                    console.log('Lead captured:', data);
                    // You can add additional success handling here
                  }}
                  onError={(error: string) => {
                    console.error('Lead capture failed:', error);
                    // You can add additional error handling here
                  }}
                />
              </div>
            </div>
          </section>

          {/* Simple Pricing Banner */}
          <div className="bg-gradient-to-r from-[#D925C7] to-[#29E7CD] p-6 text-center text-white">
            <div className="mb-3">
              <h3 className="mb-2 text-xl font-bold">{t('pricing.title')}</h3>
              <p className="text-sm opacity-90">{t('pricing.subtitle')}</p>
            </div>
          </div>

          {/* Pricing Section - A/B Testing Variants with Lazy Loading */}
          {renderPricing()}

          {/* How PrepFlow Works in Practice */}
          <section id="how-it-works-practice" className="py-20">
            <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm">
              <div className="mb-8 text-center">
                <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {t('howItWorksPractice.title')}
                </h3>
                <p className="text-lg text-gray-300">{t('howItWorksPractice.subtitle')}</p>
              </div>

              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className="text-center">
                  <div className="mb-4 rounded-2xl border border-orange-500/30 bg-orange-500/20 p-6">
                    <p className="text-2xl font-bold text-orange-400">
                      {t('howItWorksPractice.before.title')}
                    </p>
                    <p className="text-4xl font-extrabold text-orange-300">?</p>
                    <p className="text-sm text-gray-400">{t('howItWorksPractice.before.status')}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {t('howItWorksPractice.before.description')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-500/20 p-6">
                    <p className="text-2xl font-bold text-green-400">
                      {t('howItWorksPractice.after.title')}
                    </p>
                    <p className="text-4xl font-extrabold text-green-300">📊</p>
                    <p className="text-sm text-gray-400">{t('howItWorksPractice.after.status')}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {t('howItWorksPractice.after.description')}
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">{t('howItWorksPractice.explanation')}</p>
                <p className="mt-2 text-xs text-gray-500">{t('howItWorksPractice.disclaimer')}</p>
              </div>
            </div>
          </section>

          {/* What PrepFlow Helps You Achieve */}
          <section id="benefits" className="py-20">
            <h3 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
              {t('benefits.title')}
            </h3>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <BenefitCard
                title={String(t('benefits.betterPricing.title'))}
                description={String(t('benefits.betterPricing.description'))}
                icon="💰"
              />
              <BenefitCard
                title={String(t('benefits.identifyOpportunities.title'))}
                description={String(t('benefits.identifyOpportunities.description'))}
                icon="🎯"
              />
              <BenefitCard
                title={String(t('benefits.streamlineOperations.title'))}
                description={String(t('benefits.streamlineOperations.description'))}
                icon="⚡"
              />
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-6 py-3">
                <span className="text-[#29E7CD]">📊</span>
                <span className="font-medium text-white">{t('benefits.cta.text')}</span>
                <a
                  href="#lead-magnet"
                  className="flex min-h-[36px] items-center justify-center rounded-full bg-[#29E7CD] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#29E7CD]/80"
                >
                  {t('benefits.cta.button')}
                </a>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="py-20">
            <h3 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
              {t('faq.title')}
            </h3>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <FAQ
                q={String(t('faq.questions.0.question'))}
                a={String(t('faq.questions.0.answer'))}
              />
              <FAQ
                q={String(t('faq.questions.1.question'))}
                a={String(t('faq.questions.1.answer'))}
              />
              <FAQ
                q={String(t('faq.questions.2.question'))}
                a={String(t('faq.questions.2.answer'))}
              />
              <FAQ
                q={String(t('faq.questions.3.question'))}
                a={String(t('faq.questions.3.answer'))}
              />
            </div>
          </section>

          {/* Trust Elements */}
          <section className="border-t border-gray-700 py-16">
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-white">{t('builtFor.title')}</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex min-h-[40px] items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-3">
                  <span className="text-[#29E7CD]">📊</span>
                  <span className="text-sm text-white">{t('builtFor.features.0')}</span>
                </div>
                <div className="flex min-h-[40px] items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-3">
                  <span className="text-[#29E7CD]">🛡️</span>
                  <span className="text-sm text-white">{t('builtFor.features.1')}</span>
                </div>
                <div className="flex min-h-[40px] items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-3">
                  <span className="text-[#29E7CD]">🇦🇺</span>
                  <span className="text-sm text-white">{t('builtFor.features.2')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-700 py-12 text-sm text-gray-500">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <p>
                {t(
                  'footer.copyright',
                  `© ${new Date().getFullYear()} PrepFlow. All rights reserved.`,
                )}
              </p>
              <div className="flex items-center gap-8">
                <Link href="/terms-of-service" className="transition-colors hover:text-[#29E7CD]">
                  {t('footer.terms', 'Terms')}
                </Link>
                <Link href="/privacy-policy" className="transition-colors hover:text-[#29E7CD]">
                  {t('footer.privacy', 'Privacy')}
                </Link>
                <a
                  href="mailto:support@prepflow.org"
                  className="transition-colors hover:text-[#29E7CD]"
                >
                  {t('footer.support', 'Support')}
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

/* ---------- Small helper components ---------- */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]" />
      {children}
    </li>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#29E7CD]/50 hover:shadow-xl">
      <h4 className="mb-3 text-xl font-semibold text-white">{title}</h4>
      <p className="leading-relaxed text-gray-300">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#29E7CD]/50 hover:shadow-xl">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-sm font-bold text-white">
          {n}
        </div>
        <h5 className="text-lg font-semibold text-white">{title}</h5>
      </div>
      <p className="leading-relaxed text-gray-300">{body}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#29E7CD]/50 hover:shadow-xl">
      <p className="mb-3 text-base font-semibold text-white">{q}</p>
      <p className="leading-relaxed text-gray-300">{a}</p>
    </div>
  );
}

function BenefitCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#29E7CD]/50 hover:shadow-xl">
      <div className="mb-4 text-4xl">{icon}</div>
      <h4 className="mb-3 text-xl font-semibold text-white">{title}</h4>
      <p className="leading-relaxed text-gray-300">{description}</p>
    </div>
  );
}
