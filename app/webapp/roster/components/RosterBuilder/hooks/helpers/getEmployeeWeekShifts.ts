/**
 * Get shifts for a specific employee in the current week.
 */
import { addDays, format } from 'date-fns';
import type { Shift } from '@/lib/types/roster';

export function getEmployeeWeekShifts(
  shifts: Shift[],
  employeeId: string,
  currentWeekStart: Date,
): Shift[] {
  const weekEnd = addDays(currentWeekStart, 6);
  const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

  return shifts.filter(shift => {
    const shiftDate = shift.shift_date;
    return shift.employee_id === employeeId && shiftDate >= weekStartStr && shiftDate <= weekEndStr;
  });
}
