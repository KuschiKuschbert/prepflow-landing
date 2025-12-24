/**
 * Calculate dates for specific day of week frequency (monday-sunday).
 *
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @param {string} dayName - Day name (monday, tuesday, etc.)
 * @returns {string[]} Array of ISO date strings
 */
export function calculateDayOfWeek(startDate: Date, endDate: Date, dayName: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  const dayNameMap: Record<string, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
  };

  const targetDayOfWeek = dayNameMap[dayName];
  const dayOfWeekCurrent = new Date(current);

  // Find the first occurrence of this day of week in or after the start date
  while (dayOfWeekCurrent.getDay() !== targetDayOfWeek && dayOfWeekCurrent <= end) {
    dayOfWeekCurrent.setDate(dayOfWeekCurrent.getDate() + 1);
  }

  while (dayOfWeekCurrent <= end) {
    if (dayOfWeekCurrent >= current) {
      dates.push(dayOfWeekCurrent.toISOString().split('T')[0]);
    }
    dayOfWeekCurrent.setDate(dayOfWeekCurrent.getDate() + 7);
  }

  return dates;
}
