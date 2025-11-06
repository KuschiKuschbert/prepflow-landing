/**
 * Hook for managing CatchTheDocket overlay triggers
 * - Shift+D manual trigger
 * - URL param ?arcade=docket trigger
 * - Removed adaptive trigger; rely on global loading gate only
 */

import { useState, useEffect } from 'react';
import { prefersReducedMotion, isArcadeDisabled, isTouchDevice } from '@/lib/arcadeGuards';

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
