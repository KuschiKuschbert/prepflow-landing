/**
 * Validate shift against employee availability.
 */
import type { ComplianceValidationResult } from '@/app/webapp/roster/types';
import type { Shift, Availability } from '@/app/webapp/roster/types';
import { getDayName, formatTime } from './helpers/dateUtils';

/**
 * Validates shift against availability.
 */
export function validateShiftAvailability(
  shift: Shift,
  availability: Availability[],
): ComplianceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const violations: ComplianceValidationResult['violations'] = [];

  const shiftDate = new Date(shift.shift_date);
  const dayOfWeek = shiftDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const dayAvailability = availability.find(av => av.day_of_week === dayOfWeek);

  if (!dayAvailability) {
    // No availability set for this day - assume available
    return { isValid: true, errors: [], warnings: [], violations: [] };
  }

  if (!dayAvailability.is_available) {
    const message = `Employee is not available on ${getDayName(dayOfWeek)}`;
    errors.push(message);
    violations.push({
      rule: 'availability_clash',
      message,
      severity: 'error',
    });
    return { isValid: false, errors, warnings, violations };
  }

  // Check time range if specified
  if (dayAvailability.start_time && dayAvailability.end_time) {
    const shiftStart = new Date(shift.start_time);
    const shiftEnd = new Date(shift.end_time);
    const [availStartHour, availStartMin] = dayAvailability.start_time.split(':').map(Number);
    const [availEndHour, availEndMin] = dayAvailability.end_time.split(':').map(Number);

    const availStart = new Date(shiftDate);
    availStart.setHours(availStartHour, availStartMin, 0, 0);

    const availEnd = new Date(shiftDate);
    availEnd.setHours(availEndHour, availEndMin, 0, 0);

    if (shiftStart < availStart || shiftEnd > availEnd) {
      const message = `Shift time (${formatTime(shiftStart)} - ${formatTime(shiftEnd)}) is outside availability window (${dayAvailability.start_time} - ${dayAvailability.end_time})`;
      warnings.push(message);
      violations.push({
        rule: 'availability_time_clash',
        message,
        severity: 'warning',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    violations,
  };
}
