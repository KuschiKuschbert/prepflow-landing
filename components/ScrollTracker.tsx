'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { trackEngagement, trackEvent } from '../lib/analytics';

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
  const [_lastScrollTime, setLastScrollTime] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const sectionObserverRef = useRef<IntersectionObserver | undefined>(undefined);
  const startTimeOnPageRef = useRef<number | null>(null);
  const maxScrollDepthRef = useRef<number>(0);

  // Initialize lastScrollTime and startTime
  useEffect(() => {
    setLastScrollTime(Date.now());
    if (startTimeOnPageRef.current === null) {
      startTimeOnPageRef.current = Date.now();
    }
  }, []);

  // --- Scroll Depth Tracking ---
  const handleScroll = useCallback(() => {
    if (!enabled) return;

    const currentTime = Date.now();
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Avoid division by zero
    if (documentHeight <= 0) return;

    const currentScrollDepth = Math.round((scrollTop / documentHeight) * 100);

    // Update state for reactive components if any
    setScrollDepth(currentScrollDepth);
    setLastScrollTime(currentTime);

    // Track maximum scroll depth and milestones
    if (currentScrollDepth > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = currentScrollDepth;

      // Track milestone scroll depths (every 25%)
      if (maxScrollDepthRef.current % 25 === 0 && maxScrollDepthRef.current > 0) {
        trackEvent('scroll_depth_milestone', 'engagement', `${maxScrollDepthRef.current}%`);

        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scroll_depth_milestone', {
            event_category: 'engagement',
            event_label: `${maxScrollDepthRef.current}%`,
            value: maxScrollDepthRef.current,
            custom_parameter_page: window.location.pathname,
          });
        }

        if (onScrollDepth) {
          onScrollDepth(maxScrollDepthRef.current);
        }
      }
    }

    // Scroll session detection (end of scroll)
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      // Logic for scroll session can be added here if needed
      // Re-using the 1s duration check from original
    }, 150);
  }, [enabled, onScrollDepth]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, handleScroll]);


  // --- Section Visibility Tracking ---
  useEffect(() => {
    if (!enabled) return;

    const sections = document.querySelectorAll(
      'section[id], [id^="section-"], [id^="feature-"], [id^="pricing-"], [id^="faq-"]',
    );

    if (sections.length === 0) return;

    sectionObserverRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id || entry.target.getAttribute('data-section') || 'unknown';

            if (!viewedSections.has(sectionId)) {
              setViewedSections(prev => new Set([...prev, sectionId]));

              trackEvent('section_view', 'engagement', sectionId);

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

              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'section_view', {
                  event_category: 'engagement',
                  event_label: sectionId,
                  custom_parameter_section_id: sectionId,
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
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    sections.forEach(section => sectionObserverRef.current?.observe(section));

    return () => sectionObserverRef.current?.disconnect();
  }, [enabled, onSectionView, viewedSections, scrollDepth]);


  // --- Time on Page Tracking ---
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (!startTimeOnPageRef.current) return;

      const timeOnPage = Date.now() - startTimeOnPageRef.current;

      // Track 30s milestones
      if (timeOnPage > 0 && timeOnPage % 30000 === 0) {
        const seconds = Math.round(timeOnPage / 1000);
        trackEvent('time_on_page', 'engagement', `${seconds}s`);

        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'time_on_page', {
            event_category: 'engagement',
            event_label: `${seconds}s`,
            value: seconds,
            custom_parameter_page: window.location.pathname,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return null;
}
