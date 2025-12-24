import {
  calculateEaster,
  calculateMothersDay,
  calculateFathersDay,
  calculateLabourDay,
  calculateRoyalBirthday,
} from './dateCalculations';

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

/**
 * Get country code (defaults to 'au' for PrepFlow)
 */
function getCountryCode(): 'au' | 'us' | 'other' {
  return 'au';
}

/**
 * Check if current date matches a seasonal event
 */
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
