import type {
  Availability,
  ComplianceValidationResult,
  Employee,
  Shift,
} from '@/app/webapp/roster/types';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import {
  createValidationWarnings,
  validateShift,
  validateShiftAvailability,
  validateShiftSkills,
} from '@/lib/services/compliance/validator';
import { supabaseAdmin } from '@/lib/supabase';

export async function performComplianceValidation(data: {
  shift: any;
  employee_id?: string;
  check_availability: boolean;
  check_skills: boolean;
}): Promise<
  { success: boolean; validation: any; warnings: any[] } | { error: any; status: number }
> {
  if (!supabaseAdmin) {
    return {
      error: ApiErrorHandler.createError(
        'Database connection not available',
        'DATABASE_ERROR',
        500,
      ),
      status: 500,
    };
  }

  const { shift, employee_id, check_availability = true, check_skills = true } = data;
  const shiftEmployeeId = shift.employee_id || employee_id;

  // Get employee
  const { data: employee, error: employeeError } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('id', shiftEmployeeId)
    .single();

  if (employeeError || !employee) {
    return {
      error: ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
      status: 404,
    };
  }

  // Get all shifts for this employee (for context)
  const { data: employeeShifts, error: shiftsError } = await supabaseAdmin
    .from('shifts')
    .select('*')
    .eq('employee_id', shiftEmployeeId)
    .neq('status', 'cancelled');

  if (shiftsError) {
    logger.warn(
      '[Compliance API] Database error fetching employee shifts (continuing with empty array):',
      {
        error: shiftsError.message,
        code: (shiftsError as any).code,
        context: {
          endpoint: '/api/compliance/validate',
          operation: 'POST',
          employeeId: shiftEmployeeId,
        },
      },
    );
    // Continue with empty array - validation can still proceed
  }

  // Validate shift compliance
  const complianceResult = validateShift(
    shift as Shift,
    (employeeShifts || []) as Shift[],
    employee as Employee,
  );

  // Validate availability if requested
  let availabilityResult: ComplianceValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    violations: [],
  };
  if (check_availability) {
    const { data: availability, error: availabilityError } = await supabaseAdmin
      .from('availability')
      .select('*')
      .eq('employee_id', shiftEmployeeId);

    if (!availabilityError && availability) {
      availabilityResult = validateShiftAvailability(
        shift as Shift,
        availability as Availability[],
      );
    }
  }

  // Validate skills if requested
  let skillsResult: ComplianceValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    violations: [],
  };
  if (check_skills) {
    skillsResult = validateShiftSkills(shift as Shift, employee as Employee);
  }

  // Combine all validation results
  const combinedResult = {
    isValid: complianceResult.isValid && availabilityResult.isValid && skillsResult.isValid,
    errors: [...complianceResult.errors, ...availabilityResult.errors, ...skillsResult.errors],
    warnings: [
      ...complianceResult.warnings,
      ...availabilityResult.warnings,
      ...skillsResult.warnings,
    ],
    violations: [
      ...complianceResult.violations,
      ...availabilityResult.violations,
      ...skillsResult.violations,
    ],
  };

  // Create validation warnings for UI
  const warnings = createValidationWarnings(combinedResult, shift.id || 'temp');

  return {
    success: true,
    validation: combinedResult,
    warnings,
  };
}
