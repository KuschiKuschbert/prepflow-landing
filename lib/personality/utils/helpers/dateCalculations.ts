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

