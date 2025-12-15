/**
 * Build updated shift from drag and drop.
 */
import { format, addDays } from 'date-fns';
import type { Shift } from '../../../../../types';

export function buildUpdatedShift(
  draggedShift: Shift,
  employeeId: string,
  date: Date,
): Shift {
  const newShiftDate = format(date, 'yyyy-MM-dd');
  const shiftDate = new Date(newShiftDate);
  const [startHour, startMin] = draggedShift.start_time.split('T')[1].split(':').map(Number);
  const [endHour, endMin] = draggedShift.end_time.split('T')[1].split(':').map(Number);
  const newStartTime = new Date(shiftDate);
  newStartTime.setHours(startHour, startMin, 0, 0);
  let newEndTime = new Date(shiftDate);
  newEndTime.setHours(endHour, endMin, 0, 0);
  if (newEndTime < newStartTime) {
    newEndTime = addDays(newEndTime, 1);
  }
  return {
    ...draggedShift,
    employee_id: employeeId,
    shift_date: newShiftDate,
    start_time: newStartTime.toISOString(),
    end_time: newEndTime.toISOString(),
  };
}
