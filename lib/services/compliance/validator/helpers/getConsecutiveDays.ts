/**
 * Calculate consecutive days helper.
 */
import type { Shift } from '@/app/webapp/roster/types';
import { isSameDay } from './dateUtils';

export function getConsecutiveDays(date: Date, shifts: Shift[]): number {
  const sortedShifts = shifts
    .filter(s => s.status !== 'cancelled')
    .map(s => new Date(s.shift_date))
    .sort((a, b) => a.getTime() - b.getTime());

  let consecutive = 1; // Count the current day
  const currentDate = new Date(date);

  // Check days before
  let checkDate = new Date(currentDate);
  checkDate.setDate(checkDate.getDate() - 1);
  while (sortedShifts.some(d => isSameDay(d, checkDate))) {
    consecutive++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Check days after
  checkDate = new Date(currentDate);
  checkDate.setDate(checkDate.getDate() + 1);
  while (sortedShifts.some(d => isSameDay(d, checkDate))) {
    consecutive++;
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return consecutive;
}
