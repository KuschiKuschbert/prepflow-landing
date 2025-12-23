// PrepFlow Personality System - Utilities

import { checkSeasonalMatch } from './utils/helpers/seasonalMatch';

export type ShiftBucket = 'morning' | 'lunch' | 'evening' | 'late';

export function getShiftBucket(date: Date = new Date()): ShiftBucket {
  const h = date.getHours();
  if (h < 8) return 'morning';
  if (h < 15) return 'lunch';
  if (h < 21) return 'evening';
  return 'late';
}

/**
 * Get time-based personality adjustments
 */
export function getTimeBasedAdjustments(): {
  isEarlyMorning: boolean; // 5am-9am
  isLateNight: boolean; // 10pm-2am
  isWeekend: boolean;
  toneMultiplier: number; // Adjusts message frequency/intensity
} {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  const isEarlyMorning = h >= 5 && h < 9;
  const isLateNight = h >= 22 || h < 2;
  const isWeekend = day === 0 || day === 6;

  // Adjust tone multiplier based on time
  // Early morning: more supportive (reduce snark)
  // Late night: more playful
  // Weekend: different tone
  let toneMultiplier = 1.0;
  if (isEarlyMorning) toneMultiplier = 0.7; // Reduce frequency/intensity
  if (isLateNight) toneMultiplier = 1.2; // Increase playfulness

  return {
    isEarlyMorning,
    isLateNight,
    isWeekend,
    toneMultiplier,
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { checkSeasonalMatch };

export function isSilenced(settings: { silencedUntil?: number }): boolean {
  if (!settings.silencedUntil) return false;
  return Date.now() < settings.silencedUntil;
}

export function silenceFor24h(): number {
  return Date.now() + 24 * 60 * 60 * 1000;
}

/**
 * Get the current page context from the URL path
 * @returns Context string or null if not in webapp
 */
export function getCurrentContext():
  | 'ingredients'
  | 'recipes'
  | 'cogs'
  | 'performance'
  | 'temperature'
  | 'menu'
  | null {
  if (typeof window === 'undefined') return null;

  const path = window.location.pathname;

  // Extract context from webapp routes
  if (path.startsWith('/webapp/ingredients')) return 'ingredients';
  if (path.startsWith('/webapp/recipes')) return 'recipes';
  if (path.startsWith('/webapp/cogs')) return 'cogs';
  if (path.startsWith('/webapp/performance')) return 'performance';
  if (path.startsWith('/webapp/temperature')) return 'temperature';
  if (path.startsWith('/webapp/menu-builder') || path.startsWith('/webapp/dish-builder'))
    return 'menu';

  return null;
}
