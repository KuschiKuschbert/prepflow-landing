/**
 * Rate multiplier calculation for day-of-week penalty rates.
 */
import type { Employee } from '@/app/webapp/roster/types';

/**
 * Gets the rate multiplier for a given day of week.
 * Saturday and Sunday typically have penalty rates in Australian hospitality.
 *
 * @param {number} dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @param {Employee} employee - The employee
 * @returns {number} Rate multiplier (1.0 for weekdays, >1.0 for weekends)
 */
export function getRateMultiplier(dayOfWeek: number, employee: Employee): number {
  // Saturday (6)
  if (dayOfWeek === 6) {
    if (employee.saturday_rate) {
      // If saturday_rate is a multiplier (e.g., 1.25)
      if (employee.saturday_rate <= 5) {
        return employee.saturday_rate;
      }
      // If saturday_rate is an absolute rate, calculate multiplier
      return employee.saturday_rate / (employee.hourly_rate || 1);
    }
    // Default Saturday penalty: 1.25x (time and a quarter)
    return 1.25;
  }

  // Sunday (0)
  if (dayOfWeek === 0) {
    if (employee.sunday_rate) {
      // If sunday_rate is a multiplier (e.g., 1.5)
      if (employee.sunday_rate <= 5) {
        return employee.sunday_rate;
      }
      // If sunday_rate is an absolute rate, calculate multiplier
      return employee.sunday_rate / (employee.hourly_rate || 1);
    }
    // Default Sunday penalty: 1.5x (time and a half)
    return 1.5;
  }

  // Weekdays (Monday-Friday)
  return 1.0;
}




