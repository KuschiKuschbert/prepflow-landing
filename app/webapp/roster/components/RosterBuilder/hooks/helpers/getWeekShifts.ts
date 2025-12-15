/**
 * Get shifts for the current week.
 */
import { addDays, format } from 'date-fns';
import type { Shift } from '../../../../types';

export function getWeekShifts(shifts: Shift[], currentWeekStart: Date): Shift[] {
  const weekEnd = addDays(currentWeekStart, 6);
  const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

  return shifts.filter(shift => {
    const shiftDate = shift.shift_date;
    return shiftDate >= weekStartStr && shiftDate <= weekEndStr;
  });
}
