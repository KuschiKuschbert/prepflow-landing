/**
 * Hook for managing logo interactions (Tomato Toss and Achievements)
 */

import { useState, useRef, useEffect, useCallback } from 'react';

export const useLogoInteractions = () => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [showTomatoToss, setShowTomatoToss] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoHoldStartRef = useRef<number | null>(null);
  const preventNavigationRef = useRef<boolean>(false);

  // Shared click/tap handler logic
  const handleLogoInteraction = useCallback(
    (shouldPreventDefault: boolean = false) => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      const newClicks = logoClicks + 1;
      setLogoClicks(newClicks);

      if (newClicks >= 9) {
        // On 9th click, prevent navigation and show game
        if (shouldPreventDefault) {
          preventNavigationRef.current = true;
          setShowTomatoToss(true);
          // Reset flag after a short delay to allow Link click handler to check it
          setTimeout(() => {
            preventNavigationRef.current = false;
          }, 100);
        }
        setLogoClicks(0);
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current);
          clickTimerRef.current = null;
        }
        return true; // Indicates we should prevent default
      } else {
        preventNavigationRef.current = false;
        clickTimerRef.current = setTimeout(() => {
          setLogoClicks(0);
          clickTimerRef.current = null;
        }, 6000);
        return false; // Allow normal navigation
      }
    },
    [logoClicks],
  );

  // Logo click handler for Tomato Toss Easter Egg (desktop)
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      const shouldPrevent = handleLogoInteraction(true);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Otherwise allow normal Link navigation
    },
    [handleLogoInteraction],
  );

  // Logo touch start handler for Tomato Toss Easter Egg (mobile/Android)
  // Android needs touchstart to prevent Link navigation early
  const handleLogoTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const shouldPrevent = handleLogoInteraction(true);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [handleLogoInteraction],
  );

  // Logo touch end handler for Tomato Toss Easter Egg (mobile)
  const handleLogoTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const shouldPrevent = handleLogoInteraction(true);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Otherwise allow normal Link navigation
    },
    [handleLogoInteraction],
  );

  // Logo hold handler for Achievements Dropdown
  const handleLogoMouseDown = useCallback(() => {
    logoHoldStartRef.current = Date.now();
    logoHoldTimerRef.current = setTimeout(() => {
      setShowAchievements(true);
      logoHoldTimerRef.current = null;
    }, 2000);
  }, []);

  const handleLogoMouseUp = useCallback(() => {
    if (logoHoldTimerRef.current) {
      clearTimeout(logoHoldTimerRef.current);
      logoHoldTimerRef.current = null;
    }
    logoHoldStartRef.current = null;
  }, []);

  const handleLogoMouseLeave = useCallback(() => {
    if (logoHoldTimerRef.current) {
      clearTimeout(logoHoldTimerRef.current);
      logoHoldTimerRef.current = null;
    }
    logoHoldStartRef.current = null;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowAchievements(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      if (logoHoldTimerRef.current) {
        clearTimeout(logoHoldTimerRef.current);
      }
    };
  }, []);

  return {
    showTomatoToss,
    setShowTomatoToss,
    showAchievements,
    setShowAchievements,
    handleLogoClick,
    handleLogoTouchStart,
    handleLogoTouchEnd,
    handleLogoMouseDown,
    handleLogoMouseUp,
    handleLogoMouseLeave,
    shouldPreventNavigation: preventNavigationRef,
  };
};
