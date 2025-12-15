/**
 * Logo interaction handlers.
 */
export function createLogoHandlers(
  logoClicks: number,
  setLogoClicks: (clicks: number) => void,
  setShowTomatoToss: (show: boolean) => void,
  preventNavigationRef: React.MutableRefObject<boolean>,
  clickTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
) {
  return {
    handleLogoInteraction: (shouldPreventDefault: boolean = false) => {
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
  };
}

export function createMouseHandlers(
  logoHoldTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  logoHoldStartRef: React.MutableRefObject<number | null>,
  setShowAchievements: (show: boolean) => void,
) {
  return {
    handleLogoMouseDown: () => {
      logoHoldStartRef.current = Date.now();
      logoHoldTimerRef.current = setTimeout(() => {
        setShowAchievements(true);
        logoHoldTimerRef.current = null;
      }, 2000);
    },
    handleLogoMouseUp: () => {
      if (logoHoldTimerRef.current) {
        clearTimeout(logoHoldTimerRef.current);
        logoHoldTimerRef.current = null;
      }
      logoHoldStartRef.current = null;
    },
    handleLogoMouseLeave: () => {
      if (logoHoldTimerRef.current) {
        clearTimeout(logoHoldTimerRef.current);
        logoHoldTimerRef.current = null;
      }
      logoHoldStartRef.current = null;
    },
  };
}
