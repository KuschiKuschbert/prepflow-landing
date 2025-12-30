/**
 * Create validation warnings from compliance results.
 */
import type { ComplianceValidationResult, ShiftValidationWarning } from '@/app/webapp/roster/types';

/**
 * Creates validation warnings from compliance results.
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



