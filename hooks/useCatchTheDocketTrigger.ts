/**
 * Hook for managing CatchTheDocket overlay triggers
 * - Shift+D manual trigger
 * - URL param ?arcade=docket trigger
 * - Adaptive long-load trigger based on fastest load time
 */

import { useState, useEffect } from 'react';

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isArcadeDisabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('PF_DISABLE_ARCADE_LOADING') === '1';
  } catch (_) {
    return false;
  }
};

const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  try {
    const hasTouch = navigator.maxTouchPoints > 0 || (window as any).ontouchstart !== undefined;
    const forceEnable = localStorage.getItem('PF_ENABLE_ARCADE_MOBILE') === '1';
    return hasTouch && !forceEnable;
  } catch (_) {
    return false;
  }
};

export const useCatchTheDocketTrigger = () => {
  const [showDocketOverlay, setShowDocketOverlay] = useState(false);

  // Manual trigger via Shift+D
  useEffect(() => {
    if (prefersReducedMotion() || isArcadeDisabled() || isTouchDevice()) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setShowDocketOverlay(true);
      }
      if (e.key === 'Escape') {
        setShowDocketOverlay(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // URL param trigger ?arcade=docket
  useEffect(() => {
    if (prefersReducedMotion() || isArcadeDisabled() || isTouchDevice()) return;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('arcade') === 'docket') {
        setShowDocketOverlay(true);
      }
    }
  }, []);

  // Removed adaptive slow-load trigger; rely on global loading gate only

  return { showDocketOverlay, setShowDocketOverlay };
};
