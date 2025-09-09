'use client';

import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import ExitIntentTracker from '../../components/ExitIntentTracker';
import ScrollTracker from '../../components/ScrollTracker';
import PerformanceTracker from '../../components/PerformanceTracker';
import PerformanceOptimizer from '../../components/PerformanceOptimizer';
import { useLandingPageABTest } from '../../components/useABTest';
import RealStoryNotifier from '../../components/SocialProofNotifier';
import LeadMagnetForm from '../../components/LeadMagnetForm';
import { getVariantAssignmentInfo } from '../../lib/ab-testing-analytics';

// Import UI components
import { HeroSkeleton, PricingSkeleton } from '../../components/ui/LoadingSkeleton';
import { MobileNavigation } from '../../components/ui/MobileNavigation';
import { FloatingCTA } from '../../components/ui/FloatingCTA';
import { ScrollToTop } from '../../components/ui/ScrollToTop';
import { ScrollProgress } from '../../components/ui/ScrollProgress';

// Import variant components
import { 
  ControlHero, 
  VariantAHero, 
  VariantBHero, 
  VariantCHero 
} from '../../components/variants/HeroVariants';

import { 
  ControlPricing, 
  VariantAPricing, 
  VariantBPricing, 
  VariantCPricing 
} from '../../components/variants/PricingVariants';

export default function Page() {
  const { t } = useTranslation();
  
  // A/B Testing hook
  const { variantId, isLoading, trackEngagement } = useLandingPageABTest();

  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      console.log(`PrepFlow landing page loaded in ${loadTime.toFixed(2)}ms`);
      console.log(`🧪 A/B Test Variant: ${variantId}`);
      
      // Log variant assignment info for debugging
      let userId = localStorage.getItem('prepflow_user_id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('prepflow_user_id', userId);
      }
      
      const variantInfo = getVariantAssignmentInfo(variantId);
      console.log('📊 Variant Assignment Info:', variantInfo);
    }
  }, [variantId]);

  // Track engagement when user interacts with the page
  const handleEngagement = (action: string, element: string) => {
    trackEngagement(action, { element });
  };

  // Wrapper for components that expect single parameter
  const handleEngagementSingle = (type: string) => {
    trackEngagement(type, {});
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <HeroSkeleton />
          <div className="mt-16">
            <PricingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Render Hero based on variant
  const renderHero = () => {
    switch (variantId) {
      case 'variant-a':
        return <VariantAHero />;
      case 'variant-b':
        return <VariantBHero />;
      case 'variant-c':
        return <VariantCHero />;
      default:
        return <ControlHero />;
    }
  };

  // Render Pricing based on variant
  const renderPricing = () => {
    switch (variantId) {
      case 'variant-a':
        return <VariantAPricing />;
      case 'variant-b':
        return <VariantBPricing />;
      case 'variant-c':
        return <VariantCPricing />;
      default:
        return <ControlPricing />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Performance Optimizer */}
      <PerformanceOptimizer />
      
      {/* Scroll Progress */}
      <ScrollProgress />
      
      {/* Mobile Navigation */}
      <MobileNavigation onEngagement={handleEngagementSingle} />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        {renderHero()}
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('features.title')}
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('features.cogs.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.cogs.description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('features.margin.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.margin.description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('features.insights.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.insights.description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('features.global.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.global.description')}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        {renderPricing()}
        
        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/webapp"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                onClick={() => handleEngagement('click', 'cta-button')}
              >
                {t('cta.button')}
              </Link>
              <p className="text-blue-100 text-sm mt-2">
                {t('cta.guarantee')}
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">PrepFlow</h3>
              <p className="text-gray-400 mb-4">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.links.product')}</h4>
              <ul className="space-y-2">
                <li><Link href="/webapp" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.features')}</Link></li>
                <li><Link href="/webapp" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.pricing')}</Link></li>
                <li><Link href="/webapp" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.demo')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.links.legal')}</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.privacy')}</Link></li>
                <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">{t('footer.links.terms')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
      
      {/* Floating CTA */}
      <FloatingCTA onEngagement={handleEngagementSingle} />
      
      {/* Scroll to Top */}
      <ScrollToTop />
      
      {/* Trackers */}
      <ExitIntentTracker />
      <ScrollTracker />
      <PerformanceTracker />
      <RealStoryNotifier />
    </div>
  );
}