'use client';

import { trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';
import { Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsTrackerProps {
  enabled?: boolean;
  onMetric?: (metric: Metric) => void;
}

export default function WebVitalsTracker({ enabled = true, onMetric }: WebVitalsTrackerProps) {
  useEffect(() => {
    if (!enabled) return;

    // Track Core Web Vitals
    const trackWebVital = (metric: Metric) => {
      // Send to analytics
      trackEvent(metric.name, 'web-vitals', metric.id, Math.round(metric.value));

      // Send to Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.value),
          non_interaction: true,
          custom_parameter_metric_name: metric.name,
          custom_parameter_metric_value: Math.round(metric.value),
          custom_parameter_metric_delta: Math.round(metric.delta),
          custom_parameter_metric_rating: metric.rating,
          custom_parameter_page: window.location.pathname,
        });
      }

      // Call custom callback if provided
      if (onMetric) {
        onMetric(metric);
      }
    };

    // Track all Core Web Vitals
    onCLS(trackWebVital);
    onINP(trackWebVital);
    onFCP(trackWebVital);
    onLCP(trackWebVital);
    onTTFB(trackWebVital);
  }, [enabled, onMetric]);

  return null;
}
