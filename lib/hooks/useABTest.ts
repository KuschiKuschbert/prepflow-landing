// React hooks for A/B testing integration
import { useState, useEffect } from 'react';
import { getVariant, trackConversion, getExperimentStats, isExperimentActive } from '../ab-testing';
import type { Variant as AbVariant } from '../ab-testing';
import { getSessionId } from '../analytics';
import type { Variant, ExperimentStats } from '../ab-testing';

export function useABTest(experimentId: string) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sessionId = getSessionId();
      const assignedVariant = getVariant(experimentId, sessionId);
      
      setVariant(assignedVariant);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load A/B test variant');
      setIsLoading(false);
    }
  }, [experimentId]);

  const trackExperimentConversion = (conversionType: string, value?: number) => {
    if (variant) {
      const sessionId = getSessionId();
      trackConversion(experimentId, variant.id, sessionId, conversionType, value);
    }
  };

  return {
    variant,
    isLoading,
    error,
    trackConversion: trackExperimentConversion,
    isActive: isExperimentActive(experimentId)
  };
}

export function useExperimentStats(experimentId: string) {
  const [stats, setStats] = useState<ExperimentStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      try {
        const experimentStats = getExperimentStats(experimentId);
        setStats(experimentStats);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load experiment stats:', err);
        setIsLoading(false);
      }
    };

    // Load stats immediately
    loadStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);

    return () => clearInterval(interval);
  }, [experimentId]);

  return { stats, isLoading };
}

export function useExperimentValue<T>(experimentId: string, key: keyof AbVariant['config'], defaultValue: T): T {
  const { variant, isLoading } = useABTest(experimentId);

  if (isLoading || !variant) {
    return defaultValue;
  }

  return (variant.config[key] as T) ?? defaultValue;
}

// Hook for conditional rendering based on A/B test variants
export function useExperimentCondition(experimentId: string, condition: (variant: Variant) => boolean) {
  const { variant, isLoading } = useABTest(experimentId);

  if (isLoading || !variant) {
    return false;
  }

  return condition(variant);
}

// Hook for A/B testing with automatic conversion tracking
export function useABTestWithTracking(experimentId: string) {
  const { variant, isLoading, error, isActive } = useABTest(experimentId);
  const sessionId = getSessionId();

  const trackConversionWithMetadata = (
    conversionType: string, 
    metadata?: Record<string, unknown>,
    value?: number
  ) => {
    if (variant && sessionId) {
      trackConversion(experimentId, variant.id, sessionId, conversionType, value);
      
      // Also track in main analytics
      if (typeof window !== 'undefined') {
        // This would integrate with your existing analytics.trackEvent
        // Silent tracking - no visible indicators to users
      }
    }
  };

  return {
    variant,
    isLoading,
    error,
    isActive,
    trackConversion: trackConversionWithMetadata
  };
}
