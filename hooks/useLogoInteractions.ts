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

  // Logo click handler for Tomato Toss Easter Egg
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      const newClicks = logoClicks + 1;
      setLogoClicks(newClicks);

      if (newClicks >= 9) {
        e.preventDefault();
        e.stopPropagation();
        setShowTomatoToss(true);
        setLogoClicks(0);
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current);
          clickTimerRef.current = null;
        }
      } else {
        clickTimerRef.current = setTimeout(() => {
          setLogoClicks(0);
          clickTimerRef.current = null;
        }, 6000);
      }
    },
    [logoClicks],
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
    handleLogoMouseDown,
    handleLogoMouseUp,
    handleLogoMouseLeave,
  };
};
