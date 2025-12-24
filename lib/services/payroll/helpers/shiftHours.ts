/**
 * Shift hours calculation utilities.
 */
import type { Shift } from '@/app/webapp/roster/types';

/**
 * Calculates total hours worked in a period.
 *
 * @param {Shift[]} shifts - Shifts to calculate hours for
 * @returns {number} Total hours (excluding breaks)
 */
export function calculateTotalHours(shifts: Shift[]): number {
  let totalHours = 0;

  for (const shift of shifts) {
    if (shift.status === 'cancelled') {
      continue;
    }

    const startTime = new Date(shift.start_time);
    const endTime = new Date(shift.end_time);
    const totalShiftHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const breakHours = shift.break_duration_minutes / 60;
    totalHours += totalShiftHours - breakHours;
  }

  return totalHours;
}
