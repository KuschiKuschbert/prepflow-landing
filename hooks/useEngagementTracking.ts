/**
 * Custom hook for tracking user engagement events
 */

import { useCallback } from 'react';

interface EngagementEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  page_title?: string;
  page_location?: string;
}

/**
 * Hook for tracking user engagement events
 */
export const useEngagementTracking = () => {
  const trackEngagement = useCallback(
    (event: string, category = 'user_engagement', label?: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        const eventData: EngagementEvent = {
          event,
          category,
          label: label || event,
          page_title: document.title,
          page_location: window.location.href,
        };

        if (value !== undefined) {
          eventData.value = value;
        }

        window.gtag('event', event, eventData);
      }
    },
    [],
  );

  return { trackEngagement };
};
