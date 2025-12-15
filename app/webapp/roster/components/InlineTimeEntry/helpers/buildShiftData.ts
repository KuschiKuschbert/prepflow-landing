/**
 * Build shift data from times.
 */
import { format } from 'date-fns';
import type { Shift } from '../../../types';

export function buildShiftData(
  employeeId: string,
  date: Date,
  startTime: string,
  endTime: string,
): Partial<Shift> {
  const shiftDate = format(date, 'yyyy-MM-dd');
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startDateTime = new Date(date);
  startDateTime.setHours(startHour, startMin, 0, 0);
  let endDateTime = new Date(date);
  endDateTime.setHours(endHour, endMin, 0, 0);
  if (endDateTime < startDateTime) {
    endDateTime = new Date(endDateTime);
    endDateTime.setDate(endDateTime.getDate() + 1);
  }
  return {
    employee_id: employeeId,
    shift_date: shiftDate,
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    status: 'draft',
  };
}
