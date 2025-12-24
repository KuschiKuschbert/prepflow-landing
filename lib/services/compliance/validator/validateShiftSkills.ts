/**
 * Validate shift against employee skills/role.
 */
import type { Shift, Employee, ComplianceValidationResult } from '@/app/webapp/roster/types';

/**
 * Validates shift against required skills/role.
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
