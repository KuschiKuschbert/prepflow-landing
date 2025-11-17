import { useCallback, useEffect, useRef, useState } from 'react';
export const useLogoInteractions = () => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [showTomatoToss, setShowTomatoToss] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoHoldStartRef = useRef<number | null>(null);
  const preventNavigationRef = useRef<boolean>(false);
  const handleLogoInteraction = useCallback(
    (shouldPreventDefault: boolean = false) => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      const newClicks = logoClicks + 1;
      setLogoClicks(newClicks);
      if (newClicks >= 9) {
        if (shouldPreventDefault) {
          preventNavigationRef.current = true;
          setShowTomatoToss(true);
          setTimeout(() => {
            preventNavigationRef.current = false;
          }, 100);
        }
        setLogoClicks(0);
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current);
          clickTimerRef.current = null;
        }
        return true;
      } else {
        preventNavigationRef.current = false;
        clickTimerRef.current = setTimeout(() => {
          setLogoClicks(0);
          clickTimerRef.current = null;
        }, 6000);
        return false;
      }
    },
    [logoClicks],
  );
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      const shouldPrevent = handleLogoInteraction(true);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [handleLogoInteraction],
  );
  const handleLogoTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (logoClicks >= 8) {
        preventNavigationRef.current = true;
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [logoClicks],
  );
  const handleLogoTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const shouldPrevent = handleLogoInteraction(true);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [handleLogoInteraction],
  );
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
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (logoHoldTimerRef.current) clearTimeout(logoHoldTimerRef.current);
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
