'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, trackPerformance } from '../lib/analytics';

interface PerformanceTrackerProps {
  onMetrics?: (metrics: any) => void;
  enabled?: boolean;
}

export default function PerformanceTracker({ onMetrics, enabled = true }: PerformanceTrackerProps) {
  const hasTrackedInitial = useRef(false);
  const hasTrackedLCP = useRef(false);
  const hasTrackedFID = useRef(false);
  const hasTrackedCLS = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Track initial page load performance
    const trackInitialPerformance = () => {
      if (hasTrackedInitial.current) return;
      hasTrackedInitial.current = true;

      const navigationEntry = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const metrics = {
          pageLoadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          domContentLoaded:
            navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
          firstByte: navigationEntry.responseStart - navigationEntry.requestStart,
          domInteractive: navigationEntry.domInteractive - navigationEntry.fetchStart,
          redirectTime: navigationEntry.redirectEnd - navigationEntry.redirectStart,
          dnsTime: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
          tcpTime: navigationEntry.connectEnd - navigationEntry.connectStart,
          serverResponseTime: navigationEntry.responseEnd - navigationEntry.responseStart,
        };

        // Track performance metrics
        trackPerformance(metrics);

        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_performance', {
            event_category: 'performance',
            event_label: 'initial_load',
            value: Math.round(metrics.pageLoadTime),
            custom_parameter_page_load_time: Math.round(metrics.pageLoadTime),
            custom_parameter_dom_content_loaded: Math.round(metrics.domContentLoaded),
            custom_parameter_first_byte: Math.round(metrics.firstByte),
            custom_parameter_page: window.location.pathname,
          });
        }

        if (onMetrics) {
          onMetrics(metrics);
        }
      }
    };

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window && !hasTrackedLCP.current) {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;

          if (lastEntry && !hasTrackedLCP.current) {
            hasTrackedLCP.current = true;
            const lcp = lastEntry.startTime;

            trackEvent('lcp', 'performance', 'largest_contentful_paint', Math.round(lcp));

            // Send to Google Analytics
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'largest_contentful_paint', {
                event_category: 'performance',
                event_label: 'lcp_measured',
                value: Math.round(lcp),
                custom_parameter_lcp_value: Math.round(lcp),
                custom_parameter_page: window.location.pathname,
              });
            }
          }
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // First Input Delay (FID)
      if ('PerformanceObserver' in window && !hasTrackedFID.current) {
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!hasTrackedFID.current) {
              hasTrackedFID.current = true;
              const fid = entry.processingStart - entry.startTime;

              trackEvent('fid', 'performance', 'first_input_delay', Math.round(fid));

              // Send to Google Analytics
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'first_input_delay', {
                  event_category: 'performance',
                  event_label: 'fid_measured',
                  value: Math.round(fid),
                  custom_parameter_fid_value: Math.round(fid),
                  custom_parameter_page: window.location.pathname,
                });
              }
            }
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });
      }

      // Cumulative Layout Shift (CLS)
      if ('PerformanceObserver' in window && !hasTrackedCLS.current) {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Track CLS after a delay to capture the full value
        setTimeout(() => {
          if (!hasTrackedCLS.current && clsValue > 0) {
            hasTrackedCLS.current = true;

            trackEvent(
              'cls',
              'performance',
              'cumulative_layout_shift',
              Math.round(clsValue * 1000),
            );

            // Send to Google Analytics
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'cumulative_layout_shift', {
                event_category: 'performance',
                event_label: 'cls_measured',
                value: Math.round(clsValue * 1000),
                custom_parameter_cls_value: Math.round(clsValue * 1000),
                custom_parameter_page: window.location.pathname,
              });
            }
          }
        }, 5000); // Wait 5 seconds to capture most layout shifts
      }
    };

    // Track resource loading performance
    const trackResourcePerformance = () => {
      if ('PerformanceObserver' in window) {
        const resourceObserver = new PerformanceObserver(list => {
          list.getEntries().forEach((entry: any) => {
            if (entry.entryType === 'resource') {
              const resourceMetrics = {
                name: entry.name,
                duration: Math.round(entry.duration),
                size: entry.transferSize || 0,
                type: entry.initiatorType,
              };

              // Only track slow resources (> 1 second)
              if (entry.duration > 1000) {
                trackEvent('slow_resource', 'performance', entry.name, Math.round(entry.duration));

                // Send to Google Analytics
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'slow_resource', {
                    event_category: 'performance',
                    event_label: entry.name,
                    value: Math.round(entry.duration),
                    custom_parameter_resource_name: entry.name,
                    custom_parameter_resource_type: entry.initiatorType,
                    custom_parameter_resource_duration: Math.round(entry.duration),
                    custom_parameter_page: window.location.pathname,
                  });
                }
              }
            }
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
      }
    };

    // Initialize tracking
    if (document.readyState === 'complete') {
      trackInitialPerformance();
      trackCoreWebVitals();
      trackResourcePerformance();
    } else {
      window.addEventListener('load', () => {
        trackInitialPerformance();
        trackCoreWebVitals();
        trackResourcePerformance();
      });
    }

    // Track performance after user interaction
    const trackInteractionPerformance = () => {
      if (hasTrackedInitial.current) {
        const timeSinceLoad = performance.now();

        trackEvent(
          'user_interaction',
          'performance',
          'interaction_timing',
          Math.round(timeSinceLoad),
        );

        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'user_interaction', {
            event_category: 'performance',
            event_label: 'interaction_timing',
            value: Math.round(timeSinceLoad),
            custom_parameter_time_since_load: Math.round(timeSinceLoad),
            custom_parameter_page: window.location.pathname,
          });
        }
      }
    };

    // Add interaction listeners
    document.addEventListener('click', trackInteractionPerformance, { once: true });
    document.addEventListener('scroll', trackInteractionPerformance, { once: true });

    // Cleanup
    return () => {
      document.removeEventListener('click', trackInteractionPerformance);
      document.removeEventListener('scroll', trackInteractionPerformance);
    };
  }, [enabled, onMetrics]);

  // This component doesn't render anything visible
  return null;
}
