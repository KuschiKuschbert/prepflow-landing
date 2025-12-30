/**
 * Validate all shifts for an employee.
 */
import type { Shift, Employee, ComplianceValidationResult } from '@/app/webapp/roster/types';
import { validateShift } from './validateShift';

/**
 * Validates all shifts for an employee.
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


