// PrepFlow Personality System - Utilities

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

/**
 * Calculate Easter date for a given year using the Computus algorithm
 */
export function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * Calculate Mother's Day (2nd Sunday in May - same for AU and US)
 */
export function calculateMothersDay(year: number): Date {
  const may = new Date(year, 4, 1); // May 1st
  const firstSunday = may.getDay() === 0 ? 1 : 8 - may.getDay();
  return new Date(year, 4, firstSunday + 7); // 2nd Sunday
}

/**
 * Calculate Father's Day
 * AU: 1st Sunday in September
 * US: 3rd Sunday in June
 */
export function calculateFathersDay(year: number, country: 'au' | 'us' = 'au'): Date {
  if (country === 'au') {
    const september = new Date(year, 8, 1); // September 1st
    const firstSunday = september.getDay() === 0 ? 1 : 8 - september.getDay();
    return new Date(year, 8, firstSunday);
  } else {
    const june = new Date(year, 5, 1); // June 1st
    const firstSunday = june.getDay() === 0 ? 1 : 8 - june.getDay();
    return new Date(year, 5, firstSunday + 14); // 3rd Sunday
  }
}

/**
 * Calculate Labour Day
 * AU: First Monday in October (most states)
 * US: First Monday in September
 */
export function calculateLabourDay(year: number, country: 'au' | 'us' = 'au'): Date {
  if (country === 'au') {
    const october = new Date(year, 9, 1); // October 1st
    const firstMonday =
      october.getDay() === 1 ? 1 : october.getDay() === 0 ? 2 : 9 - october.getDay();
    return new Date(year, 9, firstMonday);
  } else {
    const september = new Date(year, 8, 1); // September 1st
    const firstMonday =
      september.getDay() === 1 ? 1 : september.getDay() === 0 ? 2 : 9 - september.getDay();
    return new Date(year, 8, firstMonday);
  }
}

/**
 * Calculate Queen's/King's Birthday (Australia - 2nd Monday in June, most states)
 */
export function calculateRoyalBirthday(year: number): Date {
  const june = new Date(year, 5, 1); // June 1st
  const firstMonday = june.getDay() === 1 ? 1 : june.getDay() === 0 ? 2 : 9 - june.getDay();
  return new Date(year, 5, firstMonday + 7); // 2nd Monday
}

/**
 * Get country code (defaults to 'au' for PrepFlow)
 * Can be enhanced later with actual geolocation
 */
export function getCountryCode(): 'au' | 'us' | 'other' {
  // Default to Australia for PrepFlow
  // Can be enhanced with geolocation API if needed
  return 'au';
}

/**
 * Check if two dates are the same day (ignoring time)
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function checkSeasonalMatch(): string | null {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${month}-${day}`;
  const country = getCountryCode();

  // Fixed date matches
  if (dateStr === '01-01') return 'newYear';
  if (dateStr === '01-26') return 'australiaDay';
  if (dateStr === '02-14') return 'valentines';
  if (dateStr === '04-25') return 'anzac';
  if (dateStr === '05-04') return 'lightsaber';
  if (dateStr === '07-04') return 'independenceDay';
  if (dateStr === '10-20') return 'toque';
  if (dateStr === '10-31') return 'halloween';
  if (dateStr === '12-26') return 'boxingDay';
  if (dateStr === '12-31') return 'newYearsEve';

  // Range matches
  if (month === '12' && ['24', '25', '26'].includes(day)) {
    return 'santaHat';
  }

  // Variable date matches
  const easter = calculateEaster(year);
  if (isSameDay(now, easter)) return 'easter';

  const mothersDay = calculateMothersDay(year);
  if (isSameDay(now, mothersDay)) return 'mothersDay';

  const fathersDayAU = calculateFathersDay(year, 'au');
  const fathersDayUS = calculateFathersDay(year, 'us');
  if (isSameDay(now, fathersDayAU) || isSameDay(now, fathersDayUS)) return 'fathersDay';

  const labourDayAU = calculateLabourDay(year, 'au');
  const labourDayUS = calculateLabourDay(year, 'us');
  if (isSameDay(now, labourDayAU) || isSameDay(now, labourDayUS)) return 'labourDay';

  const royalBirthday = calculateRoyalBirthday(year);
  if (isSameDay(now, royalBirthday)) return 'royalBirthday';

  return null;
}

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
