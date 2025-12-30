/**
 * Hour calculation helpers for compliance validation.
 */
import type { Shift } from '@/app/webapp/roster/types';

export function calculateWeeklyHours(shifts: Shift[], weekStart: Date, weekEnd: Date): number {
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

export function getMaxWeeklyHours(employmentType: string): number {
  const COMPLIANCE_RULES = {
    MAX_HOURS_PER_WEEK_FULL_TIME: 38,
    MAX_HOURS_PER_WEEK_PART_TIME: 30,
    MAX_HOURS_PER_WEEK_CASUAL: 50,
  };

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




