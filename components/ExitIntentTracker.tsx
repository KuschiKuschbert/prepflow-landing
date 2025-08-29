'use client';

import { useEffect, useState } from 'react';
import { trackEvent, trackConversion } from '../lib/analytics';

interface ExitIntentTrackerProps {
  onExitIntent?: () => void;
  enabled?: boolean;
}

export default function ExitIntentTracker({ onExitIntent, enabled = true }: ExitIntentTrackerProps) {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || hasTriggered) return;

    let mouseLeaveTimeout: NodeJS.Timeout | undefined;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page (likely user leaving)
      if (e.clientY <= 0) {
        setHasTriggered(true);
        
        // Track exit intent event
        trackEvent('exit_intent', 'engagement', 'user_leaving_page');
        
        // Track as conversion event for analytics
        trackConversion({
          type: 'exit_intent',
          element: 'page_exit',
          page: window.location.pathname,
          timestamp: Date.now(),
          sessionId: 'exit_intent_session',
          metadata: { 
            trigger: 'mouse_leave_top',
            user_agent: navigator.userAgent,
            referrer: document.referrer
          }
        });

        // Call custom handler if provided
        if (onExitIntent) {
          onExitIntent();
        }

        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exit_intent', {
            event_category: 'engagement',
            event_label: 'user_leaving_page',
            custom_parameter_trigger: 'mouse_leave_top',
            custom_parameter_page: window.location.pathname,
          });
        }
      }
    };

    const handleBeforeUnload = () => {
      if (!hasTriggered) {
        setHasTriggered(true);
        
        // Track page unload event
        trackEvent('page_unload', 'engagement', 'user_closing_tab');
        
        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_unload', {
            event_category: 'engagement',
            event_label: 'user_closing_tab',
            custom_parameter_page: window.location.pathname,
          });
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !hasTriggered) {
        setHasTriggered(true);
        
        // Track tab switch/background event
        trackEvent('tab_background', 'engagement', 'user_switched_tab');
        
        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'tab_background', {
            event_category: 'engagement',
            event_label: 'user_switched_tab',
            custom_parameter_page: window.location.pathname,
          });
        }
      }
    };

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mouseLeaveTimeout) clearTimeout(mouseLeaveTimeout);
    };
  }, [enabled, hasTriggered, onExitIntent]);

  // This component doesn't render anything visible
  return null;
}
