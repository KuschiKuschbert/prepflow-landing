'use client';

import { useState, useEffect } from 'react';
import { assignVariant, getCurrentVariant, trackEngagement } from '../lib/analytics';

interface UseABTestOptions {
  testId: string;
  userId?: string;
  onVariantChange?: (variantId: string) => void;
}

export function useABTest({ testId, userId, onVariantChange }: UseABTestOptions) {
  const [variantId, setVariantId] = useState<string>('control');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUserId = userId || localStorage.getItem('prepflow_user_id') || `user_${Date.now()}`;
      
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
      const currentUserId = userId || localStorage.getItem('prepflow_user_id') || `user_${Date.now()}`;
      trackEngagement(testId, currentUserId, engagementType, metadata);
    }
  };

  return {
    variantId,
    isLoading,
    trackEngagement: trackEngagementEvent,
    isControl: variantId === 'control',
    isVariantA: variantId === 'variant_a',
    isVariantB: variantId === 'variant_b',
    isVariantC: variantId === 'variant_c',
  };
}

// Convenience hook for specific test types
export function useLandingPageABTest(userId?: string) {
  return useABTest({ 
    testId: 'landing_page_variants', 
    userId,
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
