/**
 * Global Arcade Mute System
 *
 * Manages global mute state for all arcade game sounds.
 */

const MUTE_KEY = 'prepflow_arcade_muted';

/**
 * Initialize mute state from localStorage
 */
export const initArcadeMute = (): boolean => {
  if (typeof window === 'undefined') return false;

  if (!('arcadeMuted' in window)) {
    const stored = localStorage.getItem(MUTE_KEY);
    (window as any).arcadeMuted = stored === 'true';
  }

  return (window as any).arcadeMuted || false;
};

/**
 * Toggle mute state
 */
export const toggleArcadeMute = (): boolean => {
  if (typeof window === 'undefined') return false;

  const current = (window as any).arcadeMuted || false;
  const newState = !current;

  (window as any).arcadeMuted = newState;
  localStorage.setItem(MUTE_KEY, String(newState));

  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('arcade:muteChanged', { detail: { muted: newState } }));

  return newState;
};

/**
 * Get current mute state
 */
export const isArcadeMuted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (window as any).arcadeMuted || false;
};

/**
 * Set mute state explicitly
 */
export const setArcadeMuted = (muted: boolean): void => {
  if (typeof window === 'undefined') return;

  (window as any).arcadeMuted = muted;
  localStorage.setItem(MUTE_KEY, String(muted));

  window.dispatchEvent(new CustomEvent('arcade:muteChanged', { detail: { muted } }));
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initArcadeMute();
}
