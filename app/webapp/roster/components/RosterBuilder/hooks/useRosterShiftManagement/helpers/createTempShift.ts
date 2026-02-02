/**
 * Create temporary shift for optimistic update.
 */
import type { Shift } from '@/lib/types/roster';

export function createTempShift(shiftData: Partial<Shift>): Shift {
  const tempId = `temp-${Date.now()}`;
  return {
    id: tempId,
    employee_id: shiftData.employee_id!,
    shift_date: shiftData.shift_date!,
    start_time: shiftData.start_time!,
    end_time: shiftData.end_time!,
    status: shiftData.status || 'draft',
    role: shiftData.role || null,
    break_duration_minutes: shiftData.break_duration_minutes || 0,
    notes: shiftData.notes || null,
    template_shift_id: shiftData.template_shift_id || null,
    published_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
