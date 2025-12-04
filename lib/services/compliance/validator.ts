/**
 * Australian Hospitality Compliance Validator
 * Validates shifts against Australian hospitality industry rules and regulations.
 *
 * @module compliance/validator
 */

import type {
  Shift,
  Employee,
  ComplianceValidationResult,
  ShiftValidationWarning,
} from '@/app/webapp/roster/types';
import { logger } from '@/lib/logger';

// Australian Hospitality Compliance Rules
const COMPLIANCE_RULES = {
  // Minimum break between shifts (10 hours for different days, 4 hours for same-day split shifts)
  MIN_BREAK_BETWEEN_SHIFTS_HOURS: 10,
  MIN_BREAK_BETWEEN_SAME_DAY_SHIFTS_HOURS: 4, // For split shifts on the same day

  // Maximum shift length (12 hours)
  MAX_SHIFT_LENGTH_HOURS: 12,

  // Minimum break duration during shift (30 minutes for shifts > 5 hours)
  MIN_BREAK_DURATION_MINUTES: 30,
  MIN_BREAK_REQUIRED_AFTER_HOURS: 5,

  // Maximum consecutive days (5 days)
  MAX_CONSECUTIVE_DAYS: 5,

  // Maximum hours per week (38 for full-time, varies for casual/part-time)
  MAX_HOURS_PER_WEEK_FULL_TIME: 38,
  MAX_HOURS_PER_WEEK_PART_TIME: 30,
  MAX_HOURS_PER_WEEK_CASUAL: 50, // Higher limit for casual with penalty rates
} as const;

/**
 * Validates a single shift against compliance rules.
 *
 * @param {Shift} shift - The shift to validate
 * @param {Shift[]} employeeShifts - All shifts for the employee (for context)
 * @param {Employee} employee - The employee assigned to the shift
 * @returns {ComplianceValidationResult} Validation result with errors and warnings
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
    const otherDateStr = otherShift.shift_date;

    // Determine if shifts are on the same day
    const isSameDay = shiftDateStr === otherDateStr;
    const minBreakHours = isSameDay
      ? COMPLIANCE_RULES.MIN_BREAK_BETWEEN_SAME_DAY_SHIFTS_HOURS
      : COMPLIANCE_RULES.MIN_BREAK_BETWEEN_SHIFTS_HOURS;

    // Check if shifts are on consecutive days
    const timeBetweenShifts = Math.abs(startTime.getTime() - otherEnd.getTime()) / (1000 * 60 * 60);
    const timeBetweenShiftsReverse =
      Math.abs(endTime.getTime() - otherStart.getTime()) / (1000 * 60 * 60);

    // Check both directions (shift before/after other shift)
    if (timeBetweenShifts < minBreakHours && timeBetweenShifts > 0) {
      const message = isSameDay
        ? `Split shifts require minimum ${minBreakHours} hours break between them (${timeBetweenShifts.toFixed(1)} hours)`
        : `Less than ${minBreakHours} hours break between shifts (${timeBetweenShifts.toFixed(1)} hours)`;
      errors.push(message);
      violations.push({
        rule: 'min_break_between_shifts',
        message,
        severity: 'error',
      });
    }

    if (timeBetweenShiftsReverse < minBreakHours && timeBetweenShiftsReverse > 0) {
      const message = isSameDay
        ? `Split shifts require minimum ${minBreakHours} hours break between them (${timeBetweenShiftsReverse.toFixed(1)} hours)`
        : `Less than ${minBreakHours} hours break between shifts (${timeBetweenShiftsReverse.toFixed(1)} hours)`;
      errors.push(message);
      violations.push({
        rule: 'min_break_between_shifts',
        message,
        severity: 'error',
      });
    }

    // Check for overlapping shifts
    if (
      (startTime >= otherStart && startTime < otherEnd) ||
      (endTime > otherStart && endTime <= otherEnd) ||
      (startTime <= otherStart && endTime >= otherEnd)
    ) {
      const message = 'Shifts overlap in time';
      errors.push(message);
      violations.push({
        rule: 'no_overlapping_shifts',
        message,
        severity: 'error',
      });
    }
  }

  // Rule 4: Maximum consecutive days
  const shiftDate = new Date(shift.shift_date);
  const consecutiveDays = getConsecutiveDays(shiftDate, employeeShifts);
  if (consecutiveDays > COMPLIANCE_RULES.MAX_CONSECUTIVE_DAYS) {
    const message = `Employee has ${consecutiveDays} consecutive days scheduled (maximum: ${COMPLIANCE_RULES.MAX_CONSECUTIVE_DAYS})`;
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

/**
 * Validates multiple shifts for an employee.
 *
 * @param {Shift[]} shifts - All shifts to validate
 * @param {Employee} employee - The employee
 * @returns {ComplianceValidationResult} Combined validation result
 */
export function validateEmployeeShifts(
  shifts: Shift[],
  employee: Employee,
): ComplianceValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const allViolations: ComplianceValidationResult['violations'] = [];

  for (const shift of shifts) {
    const result = validateShift(shift, shifts, employee);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    allViolations.push(...result.violations);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    violations: allViolations,
  };
}

/**
 * Validates shift against availability.
 *
 * @param {Shift} shift - The shift to validate
 * @param {import('@/app/webapp/roster/types').Availability[]} availability - Employee availability
 * @returns {ComplianceValidationResult} Validation result
 */
export function validateShiftAvailability(
  shift: Shift,
  availability: import('@/app/webapp/roster/types').Availability[],
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

/**
 * Validates shift against required skills/role.
 *
 * @param {Shift} shift - The shift to validate
 * @param {Employee} employee - The employee
 * @returns {ComplianceValidationResult} Validation result
 */
export function validateShiftSkills(shift: Shift, employee: Employee): ComplianceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const violations: ComplianceValidationResult['violations'] = [];

  if (!shift.role) {
    // No role requirement - skip validation
    return { isValid: true, errors: [], warnings: [], violations: [] };
  }

  const employeeSkills = employee.skills || [];
  const requiredRole = shift.role.toLowerCase();

  // Check if employee has the required skill
  const hasSkill = employeeSkills.some(skill => skill.toLowerCase() === requiredRole);

  if (!hasSkill) {
    const message = `Employee does not have required skill: ${shift.role}`;
    warnings.push(message);
    violations.push({
      rule: 'skill_gap',
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

// Helper functions

function getConsecutiveDays(date: Date, shifts: Shift[]): number {
  const sortedShifts = [...shifts]
    .map(s => new Date(s.shift_date))
    .sort((a, b) => a.getTime() - b.getTime());

  let consecutive = 1;
  let currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);

  // Check days before
  let checkDate = new Date(currentDate);
  checkDate.setDate(checkDate.getDate() - 1);
  while (sortedShifts.some(d => isSameDay(d, checkDate))) {
    consecutive++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Check days after
  checkDate = new Date(currentDate);
  checkDate.setDate(checkDate.getDate() + 1);
  while (sortedShifts.some(d => isSameDay(d, checkDate))) {
    consecutive++;
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return consecutive;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday = 0
  return new Date(d.setDate(diff));
}

function calculateWeeklyHours(shifts: Shift[], weekStart: Date, weekEnd: Date): number {
  let totalHours = 0;

  for (const shift of shifts) {
    const shiftStart = new Date(shift.start_time);
    if (shiftStart >= weekStart && shiftStart < weekEnd) {
      const start = new Date(shift.start_time);
      const end = new Date(shift.end_time);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const breakHours = shift.break_duration_minutes / 60;
      totalHours += hours - breakHours;
    }
  }

  return totalHours;
}

function getMaxWeeklyHours(employmentType: string): number {
  switch (employmentType) {
    case 'full-time':
      return COMPLIANCE_RULES.MAX_HOURS_PER_WEEK_FULL_TIME;
    case 'part-time':
      return COMPLIANCE_RULES.MAX_HOURS_PER_WEEK_PART_TIME;
    case 'casual':
      return COMPLIANCE_RULES.MAX_HOURS_PER_WEEK_CASUAL;
    default:
      return COMPLIANCE_RULES.MAX_HOURS_PER_WEEK_CASUAL;
  }
}

function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Creates validation warnings from compliance results.
 *
 * @param {ComplianceValidationResult} result - Compliance validation result
 * @param {string} shiftId - Shift ID
 * @returns {ShiftValidationWarning[]} Array of validation warnings
 */
export function createValidationWarnings(
  result: ComplianceValidationResult,
  shiftId: string,
): ShiftValidationWarning[] {
  return result.violations.map(violation => ({
    type:
      violation.rule === 'availability_clash' || violation.rule === 'availability_time_clash'
        ? 'availability_clash'
        : violation.rule === 'skill_gap'
          ? 'skill_gap'
          : violation.rule === 'no_overlapping_shifts'
            ? 'overlap'
            : 'compliance_violation',
    message: violation.message,
    shiftId,
    severity: violation.severity,
  }));
}
