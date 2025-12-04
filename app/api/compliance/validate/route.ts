/**
 * Compliance Validation API Route
 * Validates shifts against Australian hospitality compliance rules.
 *
 * @module api/compliance/validate
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import {
  validateShift,
  validateShiftAvailability,
  validateShiftSkills,
  createValidationWarnings,
} from '@/lib/services/compliance/validator';
import type {
  Shift,
  Employee,
  Availability,
  ComplianceValidationResult,
} from '@/app/webapp/roster/types';

/**
 * POST /api/compliance/validate
 * Validate a shift against compliance rules.
 *
 * Request body:
 * - shift: Shift object to validate (required)
 * - employee_id: Employee ID (required, if shift doesn't have employee_id)
 * - check_availability: Whether to check availability (optional, default: true)
 * - check_skills: Whether to check skills (optional, default: true)
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const { shift, employee_id, check_availability = true, check_skills = true } = body;

    if (!shift) {
      return NextResponse.json(
        ApiErrorHandler.createError('Shift data is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const shiftEmployeeId = shift.employee_id || employee_id;
    if (!shiftEmployeeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Get employee
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('*')
      .eq('id', shiftEmployeeId)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    // Get all shifts for this employee (for context)
    const { data: employeeShifts, error: shiftsError } = await supabaseAdmin
      .from('shifts')
      .select('*')
      .eq('employee_id', shiftEmployeeId)
      .neq('status', 'cancelled');

    if (shiftsError) {
      logger.error('[Compliance API] Database error fetching employee shifts:', {
        error: shiftsError.message,
        code: (shiftsError as any).code,
        context: {
          endpoint: '/api/compliance/validate',
          operation: 'POST',
          employeeId: shiftEmployeeId,
        },
      });
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

    return NextResponse.json({
      success: true,
      validation: combinedResult,
      warnings,
    });
  } catch (err) {
    logger.error('[Compliance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/compliance/validate', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
