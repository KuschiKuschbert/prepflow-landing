import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Check if email is unique (not used by another employee)
 */
export async function checkEmailUniqueness(
  supabase: SupabaseClient,
  email: string,
): Promise<NextResponse | null> {
  const { data: emailCheck, error: emailCheckError } = await supabase
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
