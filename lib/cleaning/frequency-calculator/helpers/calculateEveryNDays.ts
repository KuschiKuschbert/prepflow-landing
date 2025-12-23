/**
 * Calculate dates for "every-N-days" frequency.
 *
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @param {Date} referenceDate - Reference date for calculation
 * @param {number} intervalDays - Number of days between occurrences
 * @returns {string[]} Array of ISO date strings
 */
export function calculateEveryNDays(
  startDate: Date,
  endDate: Date,
  referenceDate: Date,
  intervalDays: number,
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  // Every N days, starting from reference date
  const everyNStart = new Date(referenceDate);

  // Find the first occurrence in or before the range
  while (everyNStart > current) {
    everyNStart.setDate(everyNStart.getDate() - intervalDays);
  }
  while (everyNStart < current) {
    everyNStart.setDate(everyNStart.getDate() + intervalDays);
  }

  const everyNCurrent = new Date(everyNStart);
  while (everyNCurrent <= end) {
    if (everyNCurrent >= current) {
      dates.push(everyNCurrent.toISOString().split('T')[0]);
    }
    everyNCurrent.setDate(everyNCurrent.getDate() + intervalDays);
  }

  return dates;
}
