/**
 * Build shift data from form data.
 */
import type { Shift } from '../../types';

export function buildShiftDataFromForm(
  formData: {
    employee_id: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    role: string;
    break_duration_minutes: number;
    notes: string;
  },
  editingShift: Shift | undefined,
): Partial<Shift> {
  const shiftDate = new Date(formData.shift_date);
  const [startHour, startMin] = formData.start_time.split(':').map(Number);
  const [endHour, endMin] = formData.end_time.split(':').map(Number);
  const startTime = new Date(shiftDate);
  startTime.setHours(startHour, startMin, 0, 0);
  let endTime = new Date(shiftDate);
  endTime.setHours(endHour, endMin, 0, 0);
  if (endTime < startTime) {
    endTime = new Date(endTime);
    endTime.setDate(endTime.getDate() + 1);
  }
  return {
    employee_id: formData.employee_id,
    shift_date: formData.shift_date,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    status: editingShift?.status || 'draft',
    role: formData.role || null,
    break_duration_minutes: formData.break_duration_minutes || 0,
    notes: formData.notes || null,
  };
}
