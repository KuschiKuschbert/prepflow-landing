'use client';

import { useEffect, useState, useRef } from 'react';
import { trackEvent, trackEngagement } from '../lib/analytics';

interface ScrollTrackerProps {
  onSectionView?: (sectionId: string) => void;
  onScrollDepth?: (depth: number) => void;
  enabled?: boolean;
}

export default function ScrollTracker({
  onSectionView,
  onScrollDepth,
  enabled = true,
}: ScrollTrackerProps) {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const sectionObserverRef = useRef<IntersectionObserver | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    let maxScrollDepth = 0;
    let scrollStartTime = Date.now();
    let isScrolling = false;

    // Enhanced scroll depth tracking
    const handleScroll = () => {
      const currentTime = Date.now();
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollDepth = Math.round((scrollTop / documentHeight) * 100);

      // Update scroll depth
      setScrollDepth(currentScrollDepth);

      // Track maximum scroll depth
      if (currentScrollDepth > maxScrollDepth) {
        maxScrollDepth = currentScrollDepth;

        // Track milestone scroll depths
        if (maxScrollDepth % 25 === 0) {
          trackEvent('scroll_depth_milestone', 'engagement', `${maxScrollDepth}%`);

          // Send to Google Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'scroll_depth_milestone', {
              event_category: 'engagement',
              event_label: `${maxScrollDepth}%`,
              value: maxScrollDepth,
              custom_parameter_page: window.location.pathname,
            });
          }

          if (onScrollDepth) {
            onScrollDepth(maxScrollDepth);
          }
        }
      }

      // Track scroll velocity and patterns
      if (!isScrolling) {
        isScrolling = true;
        scrollStartTime = currentTime;
      }

      setLastScrollTime(currentTime);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        isScrolling = false;
        const scrollDuration = currentTime - scrollStartTime;

        // Track scroll session
        if (scrollDuration > 1000) {
          // Only track if scrolling for more than 1 second
          trackEvent('scroll_session', 'engagement', 'scroll_completed', scrollDuration);

          // Send to Google Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'scroll_session', {
              event_category: 'engagement',
              event_label: 'scroll_completed',
              value: scrollDuration,
              custom_parameter_page: window.location.pathname,
              custom_parameter_scroll_depth: maxScrollDepth,
            });
          }
        }
      }, 150); // 150ms delay to detect scroll end
    };

    // Section visibility tracking
    const setupSectionObserver = () => {
      const sections = document.querySelectorAll(
        'section[id], [id^="section-"], [id^="feature-"], [id^="pricing-"], [id^="faq-"]',
      );

      if (sections.length > 0) {
        sectionObserverRef.current = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const sectionId =
                  entry.target.id || entry.target.getAttribute('data-section') || 'unknown';

                if (!viewedSections.has(sectionId)) {
                  setViewedSections(prev => new Set([...prev, sectionId]));

                  // Track section view
                  trackEvent('section_view', 'engagement', sectionId);

                  // Track engagement
                  trackEngagement(
                    'landing_page_variants',
                    'user_' + Math.random().toString(36).substr(2, 9),
                    'section_view',
                    {
                      section_id: sectionId,
                      section_name: entry.target.textContent?.substring(0, 50) || 'unknown',
                      scroll_depth_at_view: scrollDepth,
                    },
                  );

                  // Send to Google Analytics
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'section_view', {
                      event_category: 'engagement',
                      event_label: sectionId,
                      custom_parameter_section_id: sectionId,
                      custom_parameter_section_name:
                        entry.target.textContent?.substring(0, 50) || 'unknown',
                      custom_parameter_scroll_depth: scrollDepth,
                      custom_parameter_page: window.location.pathname,
                    });
                  }

                  if (onSectionView) {
                    onSectionView(sectionId);
                  }
                }
              }
            });
          },
          {
            threshold: 0.3, // Trigger when 30% of section is visible
            rootMargin: '0px 0px -10% 0px', // Slight offset for better detection
          },
        );

        sections.forEach(section => {
          sectionObserverRef.current?.observe(section);
        });
      }
    };

    // Time on page tracking
    const startTimeOnPage = Date.now();
    const timeOnPageInterval = setInterval(() => {
      const timeOnPage = Date.now() - startTimeOnPage;

      // Track time milestones
      if (timeOnPage % 30000 === 0) {
        // Every 30 seconds
        trackEvent('time_on_page', 'engagement', `${Math.round(timeOnPage / 1000)}s`);

        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'time_on_page', {
            event_category: 'engagement',
            event_label: `${Math.round(timeOnPage / 1000)}s`,
            value: Math.round(timeOnPage / 1000),
            custom_parameter_page: window.location.pathname,
            custom_parameter_scroll_depth: maxScrollDepth,
          });
        }
      }
    }, 1000);

    // Setup initial tracking
    setupSectionObserver();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (sectionObserverRef.current) {
        sectionObserverRef.current.disconnect();
      }
      clearInterval(timeOnPageInterval);
    };
  }, [enabled, onSectionView, onScrollDepth, viewedSections, scrollDepth]);

  // This component doesn't render anything visible
  return null;
}
