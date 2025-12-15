import { useCallback, useEffect, useRef, useState } from 'react';
import { createLogoHandlers, createMouseHandlers } from './useLogoInteractions/helpers/handlers';
import { setupKeyboardHandler } from './useLogoInteractions/helpers/keyboardHandler';
import { createCleanupHandler } from './useLogoInteractions/helpers/cleanup';

export const useLogoInteractions = () => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [showTomatoToss, setShowTomatoToss] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoHoldStartRef = useRef<number | null>(null);
  const preventNavigationRef = useRef<boolean>(false);
  const { handleLogoInteraction } = createLogoHandlers(
    logoClicks,
    setLogoClicks,
    setShowTomatoToss,
    preventNavigationRef,
    clickTimerRef,
  );
  const { handleLogoMouseDown, handleLogoMouseUp, handleLogoMouseLeave } = createMouseHandlers(
    logoHoldTimerRef,
    logoHoldStartRef,
    setShowAchievements,
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
  useEffect(() => setupKeyboardHandler(setShowAchievements), []);
  useEffect(() => createCleanupHandler(clickTimerRef, logoHoldTimerRef), []);
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
