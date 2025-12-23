/**
 * Calculate dates for monthly frequency (same date each month).
 *
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @param {Date} referenceDate - Reference date for calculation
 * @returns {string[]} Array of ISO date strings
 */
export function calculateMonthly(startDate: Date, endDate: Date, referenceDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  const dayOfMonth = referenceDate.getDate();
  const monthlyCurrent = new Date(current);

  // Find the first occurrence of this day in or after the start date
  monthlyCurrent.setDate(dayOfMonth);
  if (monthlyCurrent < current) {
    monthlyCurrent.setMonth(monthlyCurrent.getMonth() + 1);
    monthlyCurrent.setDate(dayOfMonth);
  }

  while (monthlyCurrent <= end) {
    if (monthlyCurrent >= current) {
      dates.push(monthlyCurrent.toISOString().split('T')[0]);
    }
    monthlyCurrent.setMonth(monthlyCurrent.getMonth() + 1);
    monthlyCurrent.setDate(dayOfMonth);
  }

  return dates;
}

