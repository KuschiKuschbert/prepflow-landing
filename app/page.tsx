'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ExitIntentTracker from '../components/ExitIntentTracker';
import ScrollTracker from '../components/ScrollTracker';
import PerformanceTracker from '../components/PerformanceTracker';
import PerformanceOptimizer from '../components/PerformanceOptimizer';
import { useLandingPageABTest } from '../components/useABTest';
import LeadMagnetForm from '../components/LeadMagnetForm';
import { getVariantAssignmentInfo } from '../lib/ab-testing-analytics';
import { useTranslation } from '../lib/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Import UI components
import { HeroSkeleton, PricingSkeleton } from '../components/ui/LoadingSkeleton';
import { MobileNavigation } from '../components/ui/MobileNavigation';
import { FloatingCTA } from '../components/ui/FloatingCTA';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { ScrollProgress } from '../components/ui/ScrollProgress';

// Variant components are now lazy-loaded via useABTest hook

export default function Page() {
  // Translation hook
  const { t, currentLanguage, changeLanguage } = useTranslation();
  
  // Engagement tracking function
  const handleEngagement = (event: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: 'user_engagement',
        event_label: event,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  };
  
  // A/B Testing hook with lazy loading
  const { variantId, isLoading, trackEngagement, renderHero, renderPricing } = useLandingPageABTest(undefined, t, handleEngagement);

  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      console.log(`PrepFlow landing page loaded in ${loadTime.toFixed(2)}ms`);
      console.log(`🧪 A/B Test Variant: ${variantId}`);
      
      // Log variant assignment info for debugging
      let userId = localStorage.getItem('prepflow_user_id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
        localStorage.setItem('prepflow_user_id', userId);
      }
      const assignmentInfo = getVariantAssignmentInfo(userId);
      if (assignmentInfo) {
        console.log(`📊 Variant Assignment:`, {
          variant: assignmentInfo.variantId,
          assignedAt: assignmentInfo.assignedAt,
          daysRemaining: assignmentInfo.daysRemaining,
          isPersistent: assignmentInfo.isPersistent
        });
      }
    }
  }, [variantId]);


  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PrepFlow",
    "description": "COGS & Menu Profit Tool for restaurant profitability optimization",
    "url": "https://www.prepflow.org",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "29",
      "priceCurrency": "AUD",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  };

  return (
    <>
      {/* Performance & Analytics Components */}
      <PerformanceOptimizer />
      <ScrollProgress />
      <ExitIntentTracker 
        onExitIntent={() => {
          console.log('🚨 User attempting to leave page - potential conversion opportunity');
          // You could trigger a popup, offer, or other retention strategy here
        }}
      />
      <ScrollTracker 
        onSectionView={(sectionId) => {
          console.log(`👁️ User viewed section: ${sectionId}`);
        }}
        onScrollDepth={(depth) => {
          console.log(`📊 User scrolled to ${depth}% of page`);
        }}
      />
      <PerformanceTracker 
        onMetrics={(metrics) => {
          console.log('⚡ Performance metrics:', metrics);
        }}
      />
      
      {/* Floating CTA */}
      <FloatingCTA onEngagement={handleEngagement} t={t} />
      
      {/* Scroll to Top */}
      <ScrollToTop />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <main 
      className="min-h-screen bg-[#0a0a0a] text-white scroll-smooth" 
      style={{ 
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
        '--gray-800': '#1f2937'
      } as React.CSSProperties}
    >
      {/* Background gradient effects - optimized with CSS custom properties */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#29E7CD]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#D925C7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-8" role="banner">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/prepflow-logo.png" 
              alt={String(t('logo.alt', 'PrepFlow Logo'))}
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              PrepFlow
            </span>
          </div>
          <nav className="hidden gap-8 text-sm md:flex" role="navigation" aria-label={String(t('nav.ariaLabel', 'Main navigation'))}>
            <a href="#features" className="text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded" aria-label={String(t('nav.featuresAria', 'View PrepFlow features'))}>{t('nav.features', 'Features')}</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded" aria-label={String(t('nav.howItWorksAria', 'Learn how PrepFlow works'))}>{t('nav.howItWorks', 'How it works')}</a>
            <a href="#pricing" className="text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded" aria-label={String(t('nav.pricingAria', 'View PrepFlow pricing'))}>{t('nav.pricing', 'Pricing')}</a>
            <a href="#faq" className="text-gray-300 hover:text-[#29E7CD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded" aria-label={String(t('nav.faqAria', 'Frequently asked questions'))}>{t('nav.faq', 'FAQ')}</a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher className="mr-4" />
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              onClick={() => handleEngagement('header_cta_click')}
            >
              {t('hero.ctaPrimary', 'Get PrepFlow Now')}
            </a>
          </div>
          <MobileNavigation onEngagement={handleEngagement} />
        </header>

        {/* Hero Section - A/B Testing Variants with Lazy Loading */}
        {renderHero()}

        {/* Trust bar */}
        <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 text-center text-base text-gray-300 shadow-lg">
          {t('trustBar.text')}
        </div>



        {/* Problem → Outcome */}
        <section id="problem-outcome" className="py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  {t('problemOutcome.problem.title')}
                </span>
              </h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>{t('problemOutcome.problem.points.0')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>{t('problemOutcome.problem.points.1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>{t('problemOutcome.problem.points.2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>{t('problemOutcome.problem.points.3')}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                <span className="bg-gradient-to-r from-green-400 to-[#29E7CD] bg-clip-text text-transparent">
                  {t('problemOutcome.outcome.title')}
                </span>
              </h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>{t('problemOutcome.outcome.points.0')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>{t('problemOutcome.outcome.points.1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>{t('problemOutcome.outcome.points.2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>{t('problemOutcome.outcome.points.3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contributing Margin Highlight */}
        <section className="py-20" id="contributing-margin">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  {t('contributingMargin.title')}
                </span>
              </h3>
              <p className="text-lg text-gray-300">{t('contributingMargin.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-2xl p-6 mb-4">
                  <span className="text-4xl">💰</span>
                  <h4 className="text-xl font-semibold text-white mt-3">{t('contributingMargin.grossProfit.title')}</h4>
                  <p className="text-sm text-gray-300">{t('contributingMargin.grossProfit.description')}</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#D925C7]/20 border border-[#D925C7]/30 rounded-2xl p-6 mb-4">
                  <span className="text-4xl">⚡</span>
                  <h4 className="text-xl font-semibold text-white mt-3">{t('contributingMargin.contributingMargin.title')}</h4>
                  <p className="text-sm text-gray-300">{t('contributingMargin.contributingMargin.description')}</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-2xl p-6 mb-4">
                  <span className="text-4xl">🎯</span>
                  <h4 className="text-xl font-semibold text-white mt-3">{t('contributingMargin.actionPlan.title')}</h4>
                  <p className="text-sm text-gray-300">{t('contributingMargin.actionPlan.description')}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-base text-gray-300">
                <strong>{t('contributingMargin.explanation')}</strong>
                <br /><span className="text-sm text-gray-400">{t('contributingMargin.disclaimer')}</span>
              </p>
            </div>
          </div>
        </section>

        {/* My Story - Authentic Journey */}
        <section className="py-20 border-t border-gray-700">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              {t('journey.title')}
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              {t('journey.subtitle')}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('journey.earlyExperience.title')}</h3>
              <p className="text-gray-300 text-sm">
                {t('journey.earlyExperience.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('journey.europeanLeadership.title')}</h3>
              <p className="text-gray-300 text-sm">
                {t('journey.europeanLeadership.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🇦🇺</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('journey.australianExcellence.title')}</h3>
              <p className="text-gray-300 text-sm">
                {t('journey.australianExcellence.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('journey.readyToShare.title')}</h3>
              <p className="text-gray-300 text-sm">
                {t('journey.readyToShare.description')}
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-[#29E7CD] mb-4">
                {t('journey.whyCreated.title')}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('journey.whyCreated.paragraphs.0')}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('journey.whyCreated.paragraphs.1')}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('journey.whyCreated.paragraphs.2')}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('journey.whyCreated.paragraphs.3')}
              </p>
            </div>
          </div>
        </section>

        {/* Features – tailored to the spreadsheet */}
        <section id="features" className="py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard title={String(t('features.stockList.title'))} body={String(t('features.stockList.description'))} />
            <FeatureCard title={String(t('features.cogsRecipes.title'))} body={String(t('features.cogsRecipes.description'))} />
            <FeatureCard title={String(t('features.itemPerformance.title'))} body={String(t('features.itemPerformance.description'))} />
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <FeatureCard title={String(t('features.dashboardKpis.title'))} body={String(t('features.dashboardKpis.description'))} />
            <FeatureCard title={String(t('features.globalTax.title'))} body={String(t('features.globalTax.description'))} />
            <FeatureCard title={String(t('features.fastOnboarding.title'))} body={String(t('features.fastOnboarding.description'))} />
            <FeatureCard title={String(t('features.aiMethodGenerator.title'))} body={String(t('features.aiMethodGenerator.description'))} />
          </div>
        </section>

        {/* Global Features */}
        <section id="global-features" className="py-20">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
                        <div className="text-center mb-12">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  {t('globalFeatures.title')}
                </span>
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                {t('globalFeatures.subtitle')}
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{t('globalFeatures.multiCurrency.title')}</h4>
                <p className="text-sm text-gray-400">{t('globalFeatures.multiCurrency.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D925C7] to-[#29E7CD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{t('globalFeatures.taxSystems.title')}</h4>
                <p className="text-sm text-gray-400">{t('globalFeatures.taxSystems.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{t('globalFeatures.access24_7.title')}</h4>
                <p className="text-sm text-gray-400">{t('globalFeatures.access24_7.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{t('globalFeatures.noConsultants.title')}</h4>
                <p className="text-sm text-gray-400">{t('globalFeatures.noConsultants.description')}</p>
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
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            {t('howItWorks.title')}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step n={1} title={String(t('howItWorks.step1.title'))} body={String(t('howItWorks.step1.description'))} />
            <Step n={2} title={String(t('howItWorks.step2.title'))} body={String(t('howItWorks.step2.description'))} />
            <Step n={3} title={String(t('howItWorks.step3.title'))} body={String(t('howItWorks.step3.description'))} />
          </div>
          
          {/* 60-Second Checklist */}
          <div className="mt-16 rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-6">{t('howItWorks.checklist.title')}</h3>
            <div className="grid gap-4 md:grid-cols-5 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">1</span>
                </div>
                <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.0')}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">2</span>
                </div>
                <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.1')}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">3</span>
                </div>
                <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.2')}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">4</span>
                </div>
                <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.3')}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">5</span>
                </div>
                <span className="text-sm text-gray-300">{t('howItWorks.checklist.items.4')}</span>
              </div>
            </div>
          </div>
        </section>



        {/* Lead Magnet */}
        <section id="lead-magnet" className="py-20">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                {t('leadMagnet.title')}
              </h3>
              <p className="text-lg text-gray-300">
                {t('leadMagnet.subtitle')}
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
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
            <h3 className="text-xl font-bold mb-2">
              {t('pricing.title')}
            </h3>
            <p className="text-sm opacity-90">
              {t('pricing.subtitle')}
            </p>
          </div>
        </div>

        {/* Pricing Section - A/B Testing Variants with Lazy Loading */}
        {renderPricing()}

        {/* How PrepFlow Works in Practice */}
        <section id="how-it-works-practice" className="py-20">
          <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">{t('howItWorksPractice.title')}</h3>
              <p className="text-lg text-gray-300">{t('howItWorksPractice.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-6 mb-4">
                  <p className="text-2xl font-bold text-orange-400">{t('howItWorksPractice.before.title')}</p>
                  <p className="text-4xl font-extrabold text-orange-300">?</p>
                  <p className="text-sm text-gray-400">{t('howItWorksPractice.before.status')}</p>
                </div>
                <p className="text-sm text-gray-400">{t('howItWorksPractice.before.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 mb-4">
                  <p className="text-2xl font-bold text-green-400">{t('howItWorksPractice.after.title')}</p>
                  <p className="text-4xl font-extrabold text-green-300">📊</p>
                  <p className="text-sm text-gray-400">{t('howItWorksPractice.after.status')}</p>
                </div>
                <p className="text-sm text-gray-400">{t('howItWorksPractice.after.description')}</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">{t('howItWorksPractice.explanation')}</p>
              <p className="text-xs text-gray-500 mt-2">{t('howItWorksPractice.disclaimer')}</p>
            </div>
          </div>
        </section>

        {/* What PrepFlow Helps You Achieve */}
        <section id="benefits" className="py-20">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
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
            <div className="inline-flex items-center gap-3 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-6 py-3">
              <span className="text-[#29E7CD]">📊</span>
              <span className="text-white font-medium">{t('benefits.cta.text')}</span>
              <a href="#lead-magnet" className="bg-[#29E7CD] text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-[#29E7CD]/80 transition-colors">
                {t('benefits.cta.button')}
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            {t('faq.title')}
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <FAQ q={String(t('faq.questions.0.question'))} a={String(t('faq.questions.0.answer'))} />
            <FAQ q={String(t('faq.questions.1.question'))} a={String(t('faq.questions.1.answer'))} />
            <FAQ q={String(t('faq.questions.2.question'))} a={String(t('faq.questions.2.answer'))} />
            <FAQ q={String(t('faq.questions.3.question'))} a={String(t('faq.questions.3.answer'))} />
          </div>
        </section>

        {/* Trust Elements */}
        <section className="py-16 border-t border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">{t('builtFor.title')}</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">📊</span>
                <span className="text-white text-sm">{t('builtFor.features.0')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">🛡️</span>
                <span className="text-white text-sm">{t('builtFor.features.1')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">🇦🇺</span>
                <span className="text-white text-sm">{t('builtFor.features.2')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-700 py-12 text-sm text-gray-500">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p>{t('footer.copyright', `© ${new Date().getFullYear()} PrepFlow. All rights reserved.`)}</p>
            <div className="flex items-center gap-8">
              <Link href="/terms-of-service" className="hover:text-[#29E7CD] transition-colors">{t('footer.terms', 'Terms')}</Link>
              <Link href="/privacy-policy" className="hover:text-[#29E7CD] transition-colors">{t('footer.privacy', 'Privacy')}</Link>
              <a href="mailto:support@prepflow.org" className="hover:text-[#29E7CD] transition-colors">{t('footer.support', 'Support')}</a>
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
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-sm font-bold text-white">
          {n}
        </div>
        <h5 className="text-lg font-semibold text-white">{title}</h5>
      </div>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}



function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <p className="text-base font-semibold text-white mb-3">{q}</p>
      <p className="text-gray-300 leading-relaxed">{a}</p>
    </div>
  );
}

function BenefitCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
