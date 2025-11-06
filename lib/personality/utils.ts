// PrepFlow Personality System - Utilities

export type ShiftBucket = 'morning' | 'lunch' | 'evening' | 'late';

export function getShiftBucket(date: Date = new Date()): ShiftBucket {
  const h = date.getHours();
  if (h < 8) return 'morning';
  if (h < 15) return 'lunch';
  if (h < 21) return 'evening';
  return 'late';
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function checkSeasonalMatch(): string | null {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${month}-${day}`;

  // Check exact day matches
  if (dateStr === '05-04') return 'lightsaber';
  if (dateStr === '10-20') return 'toque';

  // Check range matches (Dec 24-26)
  if (month === '12' && ['24', '25', '26'].includes(day)) {
    return 'santaHat';
  }

  return null;
}

export function isSilenced(settings: { silencedUntil?: number }): boolean {
  if (!settings.silencedUntil) return false;
  return Date.now() < settings.silencedUntil;
}

export function silenceFor24h(): number {
  return Date.now() + 24 * 60 * 60 * 1000;
}
