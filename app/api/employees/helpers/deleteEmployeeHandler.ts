import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { deleteEmployee } from './deleteEmployee';
import { handleEmployeeError } from './handleEmployeeError';

export async function handleDeleteEmployee(request: NextRequest, supabase: SupabaseClient) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteEmployee(supabase, id);

    return NextResponse.json({
      success: true,
      message: 'Employee deactivated successfully',
    });
  } catch (err) {
    logger.error('[Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/employees', method: 'DELETE' },
    });
    return handleEmployeeError(err, 'DELETE');
  }
}
