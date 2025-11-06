export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isArcadeDisabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('PF_DISABLE_ARCADE_LOADING') === '1';
  } catch (_) {
    return false;
  }
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  try {
    const hasTouch = navigator.maxTouchPoints > 0 || (window as any).ontouchstart !== undefined;
    const forceEnable = localStorage.getItem('PF_ENABLE_ARCADE_MOBILE') === '1';
    return hasTouch && !forceEnable;
  } catch (_) {
    return false;
  }
};
