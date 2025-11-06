// PrepFlow Personality System - Footer Easter Egg Hook

'use client';

import { useEffect, useRef } from 'react';
import { usePersonality } from '@/lib/personality/store';
import { dispatchToast } from '@/lib/personality/ui';

const FOOTER_HOVER_DURATION_MS = 10000; // 10 seconds

/**
 * Hook to detect footer hover for ≥10s and trigger Easter egg toast
 */
export function useFooterEasterEgg() {
  const { settings } = usePersonality();
  const hoverStartRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const triggeredRef = useRef<boolean>(false);

  useEffect(() => {
    if (!settings.enabled || !settings.footerEasterEggs) return;

    const footer = document.querySelector('footer');
    if (!footer) return;

    const handleMouseEnter = () => {
      if (triggeredRef.current) return; // Only trigger once per session
      hoverStartRef.current = Date.now();

      timeoutRef.current = window.setTimeout(() => {
        // 10 seconds elapsed, trigger Easter egg
        const msg = dispatchToast.pick(Math.random() < 0.5 ? 'meta' : 'chefHabits');
        if (msg) {
          window.dispatchEvent(
            new CustomEvent('personality:addToast', { detail: { message: msg } }),
          );
          triggeredRef.current = true;
        }
      }, FOOTER_HOVER_DURATION_MS);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      hoverStartRef.current = null;
    };

    footer.addEventListener('mouseenter', handleMouseEnter);
    footer.addEventListener('mouseleave', handleMouseLeave);
    footer.addEventListener('touchstart', handleMouseEnter, { passive: true });
    footer.addEventListener('touchend', handleMouseLeave, { passive: true });

    return () => {
      footer.removeEventListener('mouseenter', handleMouseEnter);
      footer.removeEventListener('mouseleave', handleMouseLeave);
      footer.removeEventListener('touchstart', handleMouseEnter);
      footer.removeEventListener('touchend', handleMouseLeave);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [settings.enabled, settings.footerEasterEggs]);
}
