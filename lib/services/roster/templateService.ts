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
import { createShiftFromTemplate } from './templateService/helpers/createShiftFromTemplate';
import { findShiftConflict } from './templateService/helpers/findShiftConflict';
import { validateTemplateApplication } from './templateService/helpers/validateTemplateApplication';

/**
 * Applies a roster template to a target week, creating actual shifts from template shifts.
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
 * Calculates the date range for a week starting from a given date.
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
 * @param {number} dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns {string} Day name
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}

/**
 * Formats a time string for display.
 * @param {string} time - Time string (HH:MM:SS or HH:MM)
 * @returns {string} Formatted time (HH:MM)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

export { validateTemplateApplication } from './templateService/helpers/validateTemplateApplication';
