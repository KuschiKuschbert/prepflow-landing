/**
 * Roster Template Service
 * Handles applying roster templates to specific weeks, converting template shifts into actual shifts.
 *
 * @module roster/templateService
 */

import { addDays, startOfWeek, format, parse, getDay } from 'date-fns';
import type {
  RosterTemplate,
  TemplateShift,
  Shift,
  TemplateApplicationRequest,
  TemplateApplicationResult,
} from '@/app/webapp/roster/types';
import { logger } from '@/lib/logger';

/**
 * Applies a roster template to a target week, creating actual shifts from template shifts.
 *
 * @param {TemplateApplicationRequest} request - Template application request
 * @param {RosterTemplate} template - The roster template to apply
 * @param {TemplateShift[]} templateShifts - Template shifts for the template
 * @param {Shift[]} existingShifts - Existing shifts for the target week (to check for conflicts)
 * @returns {TemplateApplicationResult} Result of template application
 */
export function applyTemplate(
  request: TemplateApplicationRequest,
  template: RosterTemplate,
  templateShifts: TemplateShift[],
  existingShifts: Shift[] = [],
): TemplateApplicationResult {
  const result: TemplateApplicationResult = {
    success: true,
    shiftsCreated: 0,
    shiftsUpdated: 0,
    shiftsSkipped: 0,
    errors: [],
  };

  try {
    const targetWeekStart = parse(request.targetWeekStartDate, 'yyyy-MM-dd', new Date());
    const weekStart = startOfWeek(targetWeekStart, { weekStartsOn: 0 }); // Sunday = 0

    // Group template shifts by day of week
    const shiftsByDay: Record<number, TemplateShift[]> = {};
    for (const templateShift of templateShifts) {
      if (!shiftsByDay[templateShift.day_of_week]) {
        shiftsByDay[templateShift.day_of_week] = [];
      }
      shiftsByDay[templateShift.day_of_week].push(templateShift);
    }

    // Process each day of the week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = addDays(weekStart, dayOffset);
      const dayOfWeek = getDay(targetDate); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const dayShifts = shiftsByDay[dayOfWeek] || [];

      for (const templateShift of dayShifts) {
        try {
          // Create shift from template shift
          const shift = createShiftFromTemplate(templateShift, targetDate, template.id);

          // Check for existing shift conflicts
          const conflict = findShiftConflict(shift, existingShifts);

          if (conflict && !request.overwriteExisting) {
            result.shiftsSkipped++;
            logger.dev(`Skipping shift creation due to conflict: ${conflict.message}`);
            continue;
          }

          if (conflict && request.overwriteExisting) {
            // Update existing shift
            result.shiftsUpdated++;
            logger.dev(`Updating existing shift: ${conflict.shiftId}`);
          } else {
            // Create new shift
            result.shiftsCreated++;
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error creating shift';
          result.errors.push(
            `Error creating shift for ${format(targetDate, 'EEEE')}: ${errorMessage}`,
          );
          logger.error('Error creating shift from template', error);
        }
      }
    }

    result.success = result.errors.length === 0;
  } catch (error) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error applying template';
    result.errors.push(`Failed to apply template: ${errorMessage}`);
    logger.error('Error applying template', error);
  }

  return result;
}

/**
 * Creates a shift from a template shift for a specific date.
 *
 * @param {TemplateShift} templateShift - The template shift
 * @param {Date} targetDate - The target date for the shift
 * @param {string} templateId - The template ID
 * @returns {Shift} Created shift object
 */
function createShiftFromTemplate(
  templateShift: TemplateShift,
  targetDate: Date,
  templateId: string,
): Shift {
  // Parse start and end times from template
  const [startHour, startMin, startSec] = templateShift.start_time.split(':').map(Number);
  const [endHour, endMin, endSec] = templateShift.end_time.split(':').map(Number);

  // Create start and end timestamps
  const startTime = new Date(targetDate);
  startTime.setHours(startHour, startMin || 0, startSec || 0, 0);

  let endTime = new Date(targetDate);
  endTime.setHours(endHour, endMin || 0, endSec || 0, 0);

  // Handle shifts that span midnight (end time < start time)
  if (endTime < startTime) {
    endTime = addDays(endTime, 1);
  }

  // Generate a temporary ID (will be replaced by server)
  const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: tempId,
    employee_id: '', // Will be assigned when shift is dropped onto employee
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

/**
 * Finds conflicts between a new shift and existing shifts.
 *
 * @param {Shift} newShift - The new shift to check
 * @param {Shift[]} existingShifts - Existing shifts
 * @returns {{ shiftId: string; message: string } | null} Conflict info or null
 */
function findShiftConflict(
  newShift: Shift,
  existingShifts: Shift[],
): { shiftId: string; message: string } | null {
  const newStart = new Date(newShift.start_time);
  const newEnd = new Date(newShift.end_time);

  for (const existingShift of existingShifts) {
    // Skip cancelled shifts
    if (existingShift.status === 'cancelled') {
      continue;
    }

    const existingStart = new Date(existingShift.start_time);
    const existingEnd = new Date(existingShift.end_time);

    // Check for overlap
    if (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return {
        shiftId: existingShift.id,
        message: `Shift overlaps with existing shift on ${existingShift.shift_date}`,
      };
    }
  }

  return null;
}

/**
 * Calculates the date range for a week starting from a given date.
 *
 * @param {Date} weekStartDate - The start date of the week
 * @returns {{ start: Date; end: Date }} Week date range
 */
export function getWeekDateRange(weekStartDate: Date): { start: Date; end: Date } {
  const start = startOfWeek(weekStartDate, { weekStartsOn: 0 }); // Sunday = 0
  const end = addDays(start, 6); // Saturday
  return { start, end };
}

/**
 * Gets the day name for a given day of week number.
 *
 * @param {number} dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns {string} Day name
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}

/**
 * Formats a time string for display.
 *
 * @param {string} time - Time string (HH:MM:SS or HH:MM)
 * @returns {string} Formatted time (HH:MM)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

/**
 * Validates that a template can be applied to a date range.
 *
 * @param {RosterTemplate} template - The template to validate
 * @param {TemplateShift[]} templateShifts - Template shifts
 * @param {Date} targetDate - Target date
 * @returns {{ isValid: boolean; errors: string[] }} Validation result
 */
export function validateTemplateApplication(
  template: RosterTemplate,
  templateShifts: TemplateShift[],
  targetDate: Date,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!template.is_active) {
    errors.push('Template is not active');
  }

  if (templateShifts.length === 0) {
    errors.push('Template has no shifts defined');
  }

  // Validate template shifts
  for (const templateShift of templateShifts) {
    if (templateShift.day_of_week < 0 || templateShift.day_of_week > 6) {
      errors.push(`Invalid day of week: ${templateShift.day_of_week}`);
    }

    if (!templateShift.start_time || !templateShift.end_time) {
      errors.push('Template shift missing start or end time');
    }

    // Validate time format
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(templateShift.start_time) || !timeRegex.test(templateShift.end_time)) {
      errors.push(
        `Invalid time format in template shift: ${templateShift.start_time} - ${templateShift.end_time}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}




