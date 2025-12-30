import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Handles KDS order status updates securely.
 * @param request The incoming request object containing id and status.
 * @returns JSON response indicating success or failure.
 */
export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      const error = ApiErrorHandler.createError('Missing id or status', 'VALIDATION_ERROR', 400);
      return NextResponse.json(error, { status: 400 });
    }

    if (!supabaseAdmin) {
      logger.error('SERVER ERROR: supabaseAdmin is not initialized');
      const error = ApiErrorHandler.createError('Server configuration error', 'CONFIG_ERROR', 500);
      return NextResponse.json(error, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from('transactions')
      .update({ fulfillment_status: status })
      .eq('id', id);

    if (error) {
      logger.error('Supabase update error:', error);
      const apiError = ApiErrorHandler.fromSupabaseError(error);
      return NextResponse.json(apiError, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    logger.error('KDS Update API Error:', e);
    // Cast e to Error or use a safe conversion
    const errorObj = e instanceof Error ? e : new Error(String(e));
    const apiError = ApiErrorHandler.fromException(errorObj);
    return NextResponse.json(apiError, { status: 500 });
  }
}
