/**
 * Calculate dates for bi-daily frequency (every 2 days).
 *
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @param {Date} referenceDate - Reference date for calculation
 * @returns {string[]} Array of ISO date strings
 */
export function calculateBiDaily(
  startDate: Date,
  endDate: Date,
  referenceDate: Date,
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  const biDailyStart = new Date(referenceDate);

  // Find the first occurrence in or before the range
  while (biDailyStart > current) {
    biDailyStart.setDate(biDailyStart.getDate() - 2);
  }
  while (biDailyStart < current) {
    biDailyStart.setDate(biDailyStart.getDate() + 2);
  }

  const biDailyCurrent = new Date(biDailyStart);
  while (biDailyCurrent <= end) {
    if (biDailyCurrent >= current) {
      dates.push(biDailyCurrent.toISOString().split('T')[0]);
    }
    biDailyCurrent.setDate(biDailyCurrent.getDate() + 2);
  }

  return dates;
}

