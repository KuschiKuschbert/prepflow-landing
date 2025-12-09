import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

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

  const { data: emailCheck } = await supabaseAdmin
    .from('employees')
    .select('id')
    .eq('email', email)
    .single();

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
