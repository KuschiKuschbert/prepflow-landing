import { format } from 'date-fns';
import type { Shift } from '../../../types';

/**
 * Get shifts for a specific day
 */
export function getShiftsForDay(shifts: Shift[], date: Date): Shift[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  return shifts.filter(shift => shift.shift_date === dateStr);
}

/**
 * Get shifts for an employee on a specific day
 */
export function getShiftsForEmployeeAndDay(
  shifts: Shift[],
  employeeId: string,
  date: Date,
): Shift[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  return shifts.filter(shift => shift.employee_id === employeeId && shift.shift_date === dateStr);
}

/**
 * Get shifts for current week
 */
export function getCurrentWeekShifts(shifts: Shift[], currentWeekStart: Date): Shift[] {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
  return shifts.filter(shift => {
    const shiftDate = shift.shift_date;
    return shiftDate >= weekStartStr && shiftDate <= weekEndStr;
  });
}
