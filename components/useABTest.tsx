'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { assignVariant, getCurrentVariant, trackEngagement } from '../lib/analytics';

// Lazy load variants for better performance
const ControlHero = lazy(() => import('./variants/HeroVariants').then(m => ({ default: m.ControlHero })));
const VariantAHero = lazy(() => import('./variants/HeroVariants').then(m => ({ default: m.VariantAHero })));
const VariantBHero = lazy(() => import('./variants/HeroVariants').then(m => ({ default: m.VariantBHero })));
const VariantCHero = lazy(() => import('./variants/HeroVariants').then(m => ({ default: m.VariantCHero })));

const ControlPricing = lazy(() => import('./variants/PricingVariants').then(m => ({ default: m.ControlPricing })));
const VariantAPricing = lazy(() => import('./variants/PricingVariants').then(m => ({ default: m.VariantAPricing })));
const VariantBPricing = lazy(() => import('./variants/PricingVariants').then(m => ({ default: m.VariantBPricing })));
const VariantCPricing = lazy(() => import('./variants/PricingVariants').then(m => ({ default: m.VariantCPricing })));

// Loading components
const HeroSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-gray-800 rounded-3xl"></div>
  </div>
);

const PricingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-800 rounded-3xl"></div>
  </div>
);

interface UseABTestOptions {
  testId: string;
  userId?: string;
  onVariantChange?: (variantId: string) => void;
  t?: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

export function useABTest({ testId, userId, onVariantChange, t, handleEngagement }: UseABTestOptions) {
  const [variantId, setVariantId] = useState<string>('control');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let currentUserId = userId || localStorage.getItem('prepflow_user_id');
      
      // Generate stable user ID if none exists
      if (!currentUserId) {
        currentUserId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
        localStorage.setItem('prepflow_user_id', currentUserId);
      }
      
      // Assign or get variant for this user
      const assignedVariant = assignVariant(testId, currentUserId);
      setVariantId(assignedVariant);
      
      // Call callback if provided
      if (onVariantChange) {
        onVariantChange(assignedVariant);
      }
      
      setIsLoading(false);
    }
  }, [testId, userId, onVariantChange]);

  const trackEngagementEvent = (engagementType: string, metadata?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      const currentUserId = userId || localStorage.getItem('prepflow_user_id') || 'user_unknown';
      trackEngagement(testId, currentUserId, engagementType, metadata);
    }
  };

  // Render functions for lazy-loaded components
  const renderHero = () => {
    if (isLoading) return <HeroSkeleton />;

    // Provide default functions if not provided
    const defaultT = (key: string, fallback?: string | any[]) => fallback || key;
    const defaultHandleEngagement = (event: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event, {
          event_category: 'user_engagement',
          event_label: event,
        });
      }
    };

    return (
      <Suspense fallback={<HeroSkeleton />}>
        {variantId === 'control' && <ControlHero t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
        {variantId === 'variant_a' && <VariantAHero t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
        {variantId === 'variant_b' && <VariantBHero t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
        {variantId === 'variant_c' && <VariantCHero t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
      </Suspense>
    );
  };

  const renderPricing = () => {
    if (isLoading) return <PricingSkeleton />;

    // Provide default functions if not provided
    const defaultT = (key: string, fallback?: string | any[]) => fallback || key;
    const defaultHandleEngagement = (event: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event, {
          event_category: 'user_engagement',
          event_label: event,
        });
      }
    };

    return (
      <Suspense fallback={<PricingSkeleton />}>
        {variantId === 'control' && <ControlPricing t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
        {variantId === 'variant_a' && <VariantAPricing t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
        {variantId === 'variant_b' && <VariantBPricing t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
        {variantId === 'variant_c' && <VariantCPricing t={t || defaultT} handleEngagement={handleEngagement || defaultHandleEngagement} />}
      </Suspense>
    );
  };

  return {
    variantId,
    isLoading,
    trackEngagement: trackEngagementEvent,
    renderHero,
    renderPricing,
    isControl: variantId === 'control',
    isVariantA: variantId === 'variant_a',
    isVariantB: variantId === 'variant_b',
    isVariantC: variantId === 'variant_c',
  };
}

// Convenience hook for specific test types
export function useLandingPageABTest(userId?: string, t?: (key: string, fallback?: string | any[]) => string | any[], handleEngagement?: (event: string) => void) {
  return useABTest({ 
    testId: 'landing_page_variants', 
    userId,
    t,
    handleEngagement,
    onVariantChange: (variantId) => {
      // Track page view with variant context
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          event_category: 'ab_testing',
          event_label: `landing_page_${variantId}`,
          custom_parameter_test_id: 'landing_page_variants',
          custom_parameter_variant_id: variantId,
        });
      }
    }
  });
}
