import { addDays, format } from 'date-fns';
import type { TemplateShift, Shift } from '@/app/webapp/roster/types';

/**
 * Creates a shift from a template shift for a specific date.
 * @param {TemplateShift} templateShift - The template shift
 * @param {Date} targetDate - The target date for the shift
 * @param {string} templateId - The template ID
 * @returns {Shift} Created shift object
 */
export function createShiftFromTemplate(
  templateShift: TemplateShift,
  targetDate: Date,
  _templateId: string,
): Shift {
  const [startHour, startMin, startSec] = templateShift.start_time.split(':').map(Number);
  const [endHour, endMin, endSec] = templateShift.end_time.split(':').map(Number);

  const startTime = new Date(targetDate);
  startTime.setHours(startHour, startMin || 0, startSec || 0, 0);

  let endTime = new Date(targetDate);
  endTime.setHours(endHour, endMin || 0, endSec || 0, 0);

  if (endTime < startTime) {
    endTime = addDays(endTime, 1);
  }

  const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: tempId,
    employee_id: '',
    template_shift_id: templateShift.id,
    shift_date: format(targetDate, 'yyyy-MM-dd'),
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    status: 'draft',
    role: templateShift.role_required || null,
    break_duration_minutes: 0,
    notes: null,
    published_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
