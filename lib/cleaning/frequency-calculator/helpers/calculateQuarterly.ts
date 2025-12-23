/**
 * Calculate dates for 3-monthly frequency (same date every 3 months).
 *
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @param {Date} referenceDate - Reference date for calculation
 * @returns {string[]} Array of ISO date strings
 */
export function calculateQuarterly(
  startDate: Date,
  endDate: Date,
  referenceDate: Date,
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  const quarterlyDayOfMonth = referenceDate.getDate();
  const quarterlyCurrent = new Date(current);

  quarterlyCurrent.setDate(quarterlyDayOfMonth);
  if (quarterlyCurrent < current) {
    quarterlyCurrent.setMonth(quarterlyCurrent.getMonth() + 3);
    quarterlyCurrent.setDate(quarterlyDayOfMonth);
  }

  while (quarterlyCurrent <= end) {
    if (quarterlyCurrent >= current) {
      dates.push(quarterlyCurrent.toISOString().split('T')[0]);
    }
    quarterlyCurrent.setMonth(quarterlyCurrent.getMonth() + 3);
    quarterlyCurrent.setDate(quarterlyDayOfMonth);
  }

  return dates;
}

