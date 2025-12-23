/**
 * Calculate dates for weekly frequency (same day of week each week).
 *
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @param {Date} referenceDate - Reference date for calculation
 * @returns {string[]} Array of ISO date strings
 */
export function calculateWeekly(startDate: Date, endDate: Date, referenceDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  const dayOfWeek = referenceDate.getDay();
  const weeklyCurrent = new Date(current);

  // Find the first occurrence of this day of week in or after the start date
  while (weeklyCurrent.getDay() !== dayOfWeek && weeklyCurrent <= end) {
    weeklyCurrent.setDate(weeklyCurrent.getDate() + 1);
  }

  while (weeklyCurrent <= end) {
    if (weeklyCurrent >= current) {
      dates.push(weeklyCurrent.toISOString().split('T')[0]);
    }
    weeklyCurrent.setDate(weeklyCurrent.getDate() + 7);
  }

  return dates;
}

