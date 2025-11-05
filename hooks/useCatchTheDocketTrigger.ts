/**
 * Hook for managing CatchTheDocket overlay triggers
 * - Shift+D manual trigger
 * - URL param ?arcade=docket trigger
 * - Adaptive long-load trigger based on fastest load time
 */

import { useState, useEffect } from 'react';

export const useCatchTheDocketTrigger = () => {
  const [showDocketOverlay, setShowDocketOverlay] = useState(false);

  // Manual trigger via Shift+D
  useEffect(() => {
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
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('arcade') === 'docket') {
        setShowDocketOverlay(true);
      }
    }
  }, []);

  // Initial long-load trigger on first load only (adaptive based on fastest load time)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const FASTEST_LOAD_KEY = 'prepflow_fastest_load_ms';
    const ADAPTIVE_THRESHOLD_MS = 500; // Trigger if load exceeds fastest + 500ms

    // Get stored fastest load time
    const storedFastest = Number(localStorage.getItem(FASTEST_LOAD_KEY) || 0);
    const startTime = performance.now();

    let triggered = false;
    let loadComplete = false;

    const checkLoad = () => {
      if (loadComplete) return;

      const elapsed = performance.now() - startTime;
      const threshold =
        storedFastest > 0 ? storedFastest + ADAPTIVE_THRESHOLD_MS : ADAPTIVE_THRESHOLD_MS;

      if (elapsed > threshold && !triggered && document.readyState !== 'complete') {
        setShowDocketOverlay(true);
        triggered = true;
      }

      // Continue checking until page is loaded
      if (!loadComplete) {
        requestAnimationFrame(checkLoad);
      }
    };

    const onLoad = () => {
      loadComplete = true;
      const totalLoadTime = performance.now() - startTime;

      // Update fastest load time if this was faster
      if (storedFastest === 0 || totalLoadTime < storedFastest) {
        localStorage.setItem(FASTEST_LOAD_KEY, String(Math.round(totalLoadTime)));
      }
    };

    // Start checking
    requestAnimationFrame(checkLoad);

    // Listen for load completion
    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => {
      loadComplete = true;
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return { showDocketOverlay, setShowDocketOverlay };
};
