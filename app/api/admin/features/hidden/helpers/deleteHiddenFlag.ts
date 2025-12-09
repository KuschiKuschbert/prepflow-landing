import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Deletes a hidden feature flag from the database.
 *
 * @param {string} featureKey - The feature key to delete.
 * @returns {Promise<true | NextResponse>} Success or error response.
 */
export async function deleteHiddenFlag(featureKey: string): Promise<true | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { error } = await supabaseAdmin
    .from('hidden_feature_flags')
    .delete()
    .eq('feature_key', featureKey);

  if (error) {
    logger.error('[Admin Hidden Features API] Error deleting flag:', {
      error: error.message,
      feature_key: featureKey,
      context: { endpoint: '/api/admin/features/hidden', method: 'DELETE' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        `Failed to delete hidden feature flag: ${error.message}`,
        'DATABASE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }

  return true;
}
