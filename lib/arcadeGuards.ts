import { logger } from '@/lib/logger';
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isArcadeDisabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('PF_DISABLE_ARCADE_LOADING') === '1';
  } catch (_) {
    logger.error('[arcadeGuards.ts] Error in catch block:', {
      error: _ instanceof Error ? _.message : String(_),
      stack: _ instanceof Error ? _.stack : undefined,
    });

    return false;
  }
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  try {
    // Check for explicit force enable flag
    const forceEnable = localStorage.getItem('PF_ENABLE_ARCADE_MOBILE') === '1';
    if (forceEnable) return false;

    // Multiple detection methods for better Android/iOS coverage
    const hasTouchPoints = navigator.maxTouchPoints > 0;
    const hasTouchStart = typeof (window as any).ontouchstart !== 'undefined';

    // User agent detection as fallback (Android, iOS, iPad, etc.)
    const userAgent = navigator.userAgent || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );

    // Also check for mobile viewport (common on Android)
    const isMobileViewport =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches &&
      window.matchMedia('(pointer: coarse)').matches;

    const hasTouch = hasTouchPoints || hasTouchStart || isMobileUA || isMobileViewport;
    return hasTouch;
  } catch (_) {
    logger.error('[arcadeGuards.ts] Error in catch block:', {
      error: _ instanceof Error ? _.message : String(_),
      stack: _ instanceof Error ? _.stack : undefined,
    });

    // On error, assume it's a touch device to be safe
    return true;
  }
};
