'use client';

import { useEffect, useRef, useState } from 'react';
import { trackEvent, trackPerformance } from '../lib/analytics';
import { performanceBudgetManager, trackPerformanceBudget } from '../lib/performance-budgets';
import { advancedRUMManager, initializeRUM } from '../lib/advanced-rum';
import { performanceABTestingManager, initializePerformanceABTesting } from '../lib/performance-ab-testing';
import { performanceAlertManager, initializePerformanceAlerts, checkPerformanceAndAlert } from '../lib/performance-alerts';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  
  // Navigation Timing
  navigation: {
    dns: number;
    tcp: number;
    request: number;
    response: number;
    dom: number;
    load: number;
    total: number;
  };
  
  // Paint Timing
  paint: {
    fcp: number | null;
    lcp: number | null;
  };
  
  // Resource Performance
  resources: {
    slowResources: Array<{
      name: string;
      duration: number;
      size: number;
      type: string;
    }>;
    totalResources: number;
    averageLoadTime: number;
  };
  
  // User Experience
  ux: {
    timeToInteractive: number | null;
    firstInputDelay: number | null;
    cumulativeLayoutShift: number | null;
  };
  
  // Network Information
  network: {
    effectiveType: string | null;
    downlink: number | null;
    rtt: number | null;
  };
  
  // Memory Usage
  memory: {
    usedJSHeapSize: number | null;
    totalJSHeapSize: number | null;
    jsHeapSizeLimit: number | null;
  };
}

interface AdvancedPerformanceTrackerProps {
  onMetrics?: (metrics: PerformanceMetrics) => void;
  enabled?: boolean;
  sampleRate?: number; // 0-1, percentage of users to track
}

export default function AdvancedPerformanceTracker({ 
  onMetrics, 
  enabled = true,
  sampleRate = 0.1 // Default to 10% sampling
}: AdvancedPerformanceTrackerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const hasTrackedInitial = useRef(false);
  const hasTrackedLCP = useRef(false);
  const hasTrackedFID = useRef(false);
  const hasTrackedCLS = useRef(false);
  const resourceObserver = useRef<PerformanceObserver | null>(null);
  const lcpObserver = useRef<PerformanceObserver | null>(null);
  const fidObserver = useRef<PerformanceObserver | null>(null);
  const clsObserver = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    // Sample rate check
    if (Math.random() > sampleRate) {
      console.log('📊 PrepFlow Performance: User not sampled for performance tracking');
      return;
    }

    console.log('🚀 PrepFlow Performance: Starting advanced performance tracking');

    // Initialize performance tracking
    const initializeTracking = async () => {
      try {
        // Initialize advanced monitoring systems
        initializeRUM();
        initializePerformanceABTesting();
        initializePerformanceAlerts();
        
        // Track initial page load performance
        await trackInitialPerformance();
        
        // Track Core Web Vitals
        trackCoreWebVitals();
        
        // Track resource performance
        trackResourcePerformance();
        
        // Track user experience metrics
        trackUserExperience();
        
        // Track network information
        trackNetworkInfo();
        
        // Track memory usage
        trackMemoryUsage();
        
        console.log('✅ PrepFlow Performance: All tracking initialized');
      } catch (error) {
        console.error('❌ PrepFlow Performance: Initialization failed:', error);
      }
    };

    if (document.readyState === 'complete') {
      initializeTracking();
    } else {
      window.addEventListener('load', initializeTracking);
    }

    // Cleanup function
    return () => {
      if (resourceObserver.current) resourceObserver.current.disconnect();
      if (lcpObserver.current) lcpObserver.current.disconnect();
      if (fidObserver.current) fidObserver.current.disconnect();
      if (clsObserver.current) clsObserver.current.disconnect();
    };
  }, [enabled, sampleRate]);

  // Track initial page load performance
  const trackInitialPerformance = async () => {
    if (hasTrackedInitial.current) return;
    hasTrackedInitial.current = true;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    if (navigation) {
      const navigationMetrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.fetchStart,
      };

      const paintMetrics = {
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null,
        lcp: null, // Will be set by LCP observer
      };

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        navigation: navigationMetrics,
        paint: paintMetrics,
        lcp: null,
        fid: null,
        cls: null,
        resources: { slowResources: [], totalResources: 0, averageLoadTime: 0 },
        ux: { timeToInteractive: null, firstInputDelay: null, cumulativeLayoutShift: null },
        network: { effectiveType: null, downlink: null, rtt: null },
        memory: { usedJSHeapSize: null, totalJSHeapSize: null, jsHeapSizeLimit: null }
      }));

      // Track performance metrics
      trackPerformance({
        pageLoadTime: navigationMetrics.total,
        firstContentfulPaint: paintMetrics.fcp || 0,
        largestContentfulPaint: 0, // Will be updated by LCP observer
        firstInputDelay: 0, // Will be updated by FID observer
        cumulativeLayoutShift: 0, // Will be updated by CLS observer
        timestamp: Date.now(),
        page: window.location.pathname,
        sessionId: 'session_' + Math.random().toString(36).substr(2, 9),
      });
      
      // Send to Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_performance', {
          event_category: 'performance',
          event_label: 'initial_load',
          value: Math.round(navigationMetrics.total),
          custom_parameter_page_load_time: Math.round(navigationMetrics.total),
          custom_parameter_dom_content_loaded: Math.round(navigationMetrics.dom),
          custom_parameter_first_byte: Math.round(navigationMetrics.request),
          custom_parameter_page: window.location.pathname,
        });
      }

      if (onMetrics) {
        onMetrics(metrics!);
      }
    }
  };

  // Track Core Web Vitals
  const trackCoreWebVitals = () => {
    // LCP Observer
    if ('PerformanceObserver' in window && !hasTrackedLCP.current) {
      lcpObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        
        if (lastEntry && !hasTrackedLCP.current) {
          hasTrackedLCP.current = true;
          const lcp = lastEntry.startTime;
          
          setMetrics(prev => ({
            ...prev,
            lcp,
            paint: { ...prev?.paint, lcp }
          } as PerformanceMetrics));
          
          trackEvent('lcp', 'performance', 'largest_contentful_paint', Math.round(lcp));
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'largest_contentful_paint', {
              event_category: 'performance',
              event_label: 'lcp_measured',
              value: Math.round(lcp),
              custom_parameter_lcp_value: Math.round(lcp),
              custom_parameter_page: window.location.pathname,
            });
          }
          
          // Check performance budget and trigger alerts
          const currentMetrics = {
            lcp: Math.round(lcp),
            fid: null,
            cls: null,
            fcp: null,
            tti: null,
          };
          
          trackPerformanceBudget(currentMetrics, 'landing');
          checkPerformanceAndAlert(currentMetrics, window.location.pathname, undefined, `session_${Date.now()}`);
        }
      });
      
      lcpObserver.current.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // FID Observer
    if ('PerformanceObserver' in window && !hasTrackedFID.current) {
      fidObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!hasTrackedFID.current) {
            hasTrackedFID.current = true;
            const fid = entry.processingStart - entry.startTime;
            
            setMetrics(prev => ({
              ...prev,
              fid,
              ux: { ...prev?.ux, firstInputDelay: fid }
            } as PerformanceMetrics));
            
            trackEvent('fid', 'performance', 'first_input_delay', Math.round(fid));
            
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
      
      fidObserver.current.observe({ entryTypes: ['first-input'] });
    }

    // CLS Observer
    if ('PerformanceObserver' in window && !hasTrackedCLS.current) {
      let clsValue = 0;
      clsObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      
      clsObserver.current.observe({ entryTypes: ['layout-shift'] });
      
      // Track CLS after a delay
      setTimeout(() => {
        if (!hasTrackedCLS.current && clsValue > 0) {
          hasTrackedCLS.current = true;
          
          setMetrics(prev => ({
            ...prev,
            cls: clsValue,
            ux: { ...prev?.ux, cumulativeLayoutShift: clsValue }
          } as PerformanceMetrics));
          
          trackEvent('cls', 'performance', 'cumulative_layout_shift', Math.round(clsValue * 1000));
          
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
      }, 5000);
    }
  };

  // Track resource performance
  const trackResourcePerformance = () => {
    if ('PerformanceObserver' in window) {
      const slowResources: Array<{name: string, duration: number, size: number, type: string}> = [];
      let totalResources = 0;
      let totalLoadTime = 0;

      resourceObserver.current = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.entryType === 'resource') {
            totalResources++;
            totalLoadTime += entry.duration;
            
            if (entry.duration > 1000) { // Slow resources > 1 second
              slowResources.push({
                name: entry.name,
                duration: Math.round(entry.duration),
                size: entry.transferSize || 0,
                type: entry.initiatorType,
              });
            }
          }
        });

        const averageLoadTime = totalResources > 0 ? totalLoadTime / totalResources : 0;

        setMetrics(prev => ({
          ...prev,
          resources: {
            slowResources,
            totalResources,
            averageLoadTime: Math.round(averageLoadTime)
          }
        } as PerformanceMetrics));

        // Track slow resources
        if (slowResources.length > 0) {
          trackEvent('slow_resources', 'performance', 'slow_loading', slowResources.length);
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'slow_resources', {
              event_category: 'performance',
              event_label: 'slow_loading_detected',
              value: slowResources.length,
              custom_parameter_slow_resources_count: slowResources.length,
              custom_parameter_page: window.location.pathname,
            });
          }
        }
      });
      
      resourceObserver.current.observe({ entryTypes: ['resource'] });
    }
  };

  // Track user experience metrics
  const trackUserExperience = () => {
    // Time to Interactive (TTI) - simplified version
    const tti = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      ux: { ...prev?.ux, timeToInteractive: tti }
    } as PerformanceMetrics));

    // Track user interactions
    const trackInteraction = () => {
      const interactionTime = performance.now();
      
      trackEvent('user_interaction', 'performance', 'interaction_timing', Math.round(interactionTime));
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'user_interaction', {
          event_category: 'performance',
          event_label: 'interaction_timing',
          value: Math.round(interactionTime),
          custom_parameter_time_since_load: Math.round(interactionTime),
          custom_parameter_page: window.location.pathname,
        });
      }
    };

    // Track first interaction
    document.addEventListener('click', trackInteraction, { once: true });
    document.addEventListener('scroll', trackInteraction, { once: true });
  };

  // Track network information
  const trackNetworkInfo = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      setMetrics(prev => ({
        ...prev,
        network: {
          effectiveType: connection.effectiveType || null,
          downlink: connection.downlink || null,
          rtt: connection.rtt || null,
        }
      } as PerformanceMetrics));

      // Track network quality
      trackEvent('network_quality', 'performance', connection.effectiveType || 'unknown', 0);
    }
  };

  // Track memory usage
  const trackMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      setMetrics(prev => ({
        ...prev,
        memory: {
          usedJSHeapSize: memory.usedJSHeapSize || null,
          totalJSHeapSize: memory.totalJSHeapSize || null,
          jsHeapSizeLimit: memory.jsHeapSizeLimit || null,
        }
      } as PerformanceMetrics));

      // Track memory usage
      const memoryUsagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100;
      trackEvent('memory_usage', 'performance', 'memory_usage', Math.round(memoryUsagePercent));
    }
  };

  // This component doesn't render anything visible
  return null;
}
