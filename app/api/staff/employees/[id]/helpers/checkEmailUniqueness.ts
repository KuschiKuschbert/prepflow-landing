import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if email is unique (not used by another employee)
 */
export async function checkEmailUniqueness(email: string): Promise<NextResponse | null> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: emailCheck, error: emailCheckError } = await supabaseAdmin
    .from('employees')
    .select('id')
    .eq('email', email)
    .single();

  if (emailCheckError && emailCheckError.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, email is unique
    logger.error('[Staff Employees API] Error checking email uniqueness:', {
      error: emailCheckError.message,
      email,
      context: { endpoint: '/api/staff/employees/[id]', operation: 'checkEmailUniqueness' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Error checking email uniqueness', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  if (emailCheck) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Employee with this email already exists',
        'DUPLICATE_ERROR',
        409,
      ),
      { status: 409 },
    );
  }

  return null;
}
