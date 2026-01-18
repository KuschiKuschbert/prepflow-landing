/**
 * Validate a single shift against compliance rules.
 */
import type { Shift, Employee, ComplianceValidationResult } from '@/app/webapp/roster/types';
import { COMPLIANCE_RULES } from './constants';
import { getConsecutiveDays } from './helpers/getConsecutiveDays';
import { getWeekStart } from './helpers/dateUtils';
import { calculateWeeklyHours, getMaxWeeklyHours } from './helpers/calculateHours';

/**
 * Validates a single shift against compliance rules.
 */
export function validateShift(
  shift: Shift,
  employeeShifts: Shift[],
  employee: Employee,
): ComplianceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const violations: ComplianceValidationResult['violations'] = [];

  const startTime = new Date(shift.start_time);
  const endTime = new Date(shift.end_time);
  const shiftDurationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const shiftDateStr = shift.shift_date;

  // Rule 0: Maximum 2 shifts per day (for split shifts)
  const sameDayShifts = employeeShifts.filter(
    s => s.id !== shift.id && s.shift_date === shiftDateStr && s.status !== 'cancelled',
  );
  if (sameDayShifts.length >= 2) {
    const message = 'Maximum 2 shifts per day allowed';
    errors.push(message);
    violations.push({
      rule: 'max_shifts_per_day',
      message,
      severity: 'error',
    });
  }

  // Rule 1: Maximum shift length
  if (shiftDurationHours > COMPLIANCE_RULES.MAX_SHIFT_LENGTH_HOURS) {
    const message = `Shift exceeds maximum length of ${COMPLIANCE_RULES.MAX_SHIFT_LENGTH_HOURS} hours`;
    errors.push(message);
    violations.push({
      rule: 'max_shift_length',
      message,
      severity: 'error',
    });
  }

  // Rule 2: Minimum break during shift (if shift > 5 hours)
  if (shiftDurationHours > COMPLIANCE_RULES.MIN_BREAK_REQUIRED_AFTER_HOURS) {
    const breakHours = shift.break_duration_minutes / 60;
    if (breakHours < COMPLIANCE_RULES.MIN_BREAK_DURATION_MINUTES / 60) {
      const message = `Shift over ${COMPLIANCE_RULES.MIN_BREAK_REQUIRED_AFTER_HOURS} hours requires minimum ${COMPLIANCE_RULES.MIN_BREAK_DURATION_MINUTES} minute break`;
      warnings.push(message);
      violations.push({
        rule: 'min_break_duration',
        message,
        severity: 'warning',
      });
    }
  }

  // Rule 3: Break between shifts (10 hours for different days, 4 hours for same-day split shifts)
  const otherShifts = employeeShifts.filter(s => s.id !== shift.id && s.status !== 'cancelled');
  for (const otherShift of otherShifts) {
    const otherStart = new Date(otherShift.start_time);
    const otherEnd = new Date(otherShift.end_time);
    const isSameDay = shiftDateStr === otherShift.shift_date;
    const minBreakHours = isSameDay
      ? COMPLIANCE_RULES.MIN_BREAK_BETWEEN_SAME_DAY_SHIFTS_HOURS
      : COMPLIANCE_RULES.MIN_BREAK_BETWEEN_SHIFTS_HOURS;

    // Check break before this shift
    if (otherEnd <= startTime) {
      const breakHours = (startTime.getTime() - otherEnd.getTime()) / (1000 * 60 * 60);
      if (breakHours < minBreakHours) {
        const message = `Insufficient break time (${breakHours.toFixed(1)}h) between shifts. Minimum required: ${minBreakHours}h`;
        errors.push(message);
        violations.push({
          rule: 'min_break_between_shifts',
          message,
          severity: 'error',
        });
      }
    }

    // Check break after this shift
    if (endTime <= otherStart) {
      const breakHours = (otherStart.getTime() - endTime.getTime()) / (1000 * 60 * 60);
      if (breakHours < minBreakHours) {
        const message = `Insufficient break time (${breakHours.toFixed(1)}h) between shifts. Minimum required: ${minBreakHours}h`;
        errors.push(message);
        violations.push({
          rule: 'min_break_between_shifts',
          message,
          severity: 'error',
        });
      }
    }
  }

  // Rule 4: Maximum consecutive days
  const shiftDate = new Date(shift.shift_date);
  const consecutiveDays = getConsecutiveDays(shiftDate, employeeShifts);
  if (consecutiveDays > COMPLIANCE_RULES.MAX_CONSECUTIVE_DAYS) {
    const message = `Employee has worked ${consecutiveDays} consecutive days (maximum: ${COMPLIANCE_RULES.MAX_CONSECUTIVE_DAYS})`;
    warnings.push(message);
    violations.push({
      rule: 'max_consecutive_days',
      message,
      severity: 'warning',
    });
  }

  // Rule 5: Maximum hours per week
  const weekStart = getWeekStart(shiftDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weeklyHours = calculateWeeklyHours(employeeShifts, weekStart, weekEnd);
  const maxHours = getMaxWeeklyHours(employee.employment_type);

  if (weeklyHours > maxHours) {
    const message = `Employee exceeds maximum weekly hours (${weeklyHours.toFixed(1)}/${maxHours} hours for ${employee.employment_type})`;
    warnings.push(message);
    violations.push({
      rule: 'max_weekly_hours',
      message,
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    violations,
  };
}
