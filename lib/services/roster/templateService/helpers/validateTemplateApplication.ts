import type { RosterTemplate, TemplateShift } from '@/app/webapp/roster/types';

/**
 * Validates that a template can be applied to a date range.
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

  for (const templateShift of templateShifts) {
    if (templateShift.day_of_week < 0 || templateShift.day_of_week > 6) {
      errors.push(`Invalid day of week: ${templateShift.day_of_week}`);
    }

    if (!templateShift.start_time || !templateShift.end_time) {
      errors.push('Template shift missing start or end time');
    }

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

