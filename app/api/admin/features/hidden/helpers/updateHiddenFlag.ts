import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateHiddenFlagSchema = z.object({
  feature_key: z.string().min(1),
  is_unlocked: z.boolean().optional(),
  is_enabled: z.boolean().optional(),
  description: z.string().optional().nullable(),
});

/**
 * Updates a hidden feature flag in the database.
 *
 * @param {z.infer<typeof updateHiddenFlagSchema>} validated - Validated update data.
 * @returns {Promise<{ flag: Record<string, unknown> } | NextResponse>} Updated flag data or error response.
 */
export async function updateHiddenFlag(
  validated: z.infer<typeof updateHiddenFlagSchema>,
): Promise<{ flag: Record<string, unknown> } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { feature_key, is_unlocked, is_enabled, description } = validated;

  // Build update object (only include fields that are provided)
  const updateData: Record<string, unknown> = {};
  if (is_unlocked !== undefined) {
    updateData.is_unlocked = is_unlocked;
  }
  if (is_enabled !== undefined) {
    updateData.is_enabled = is_enabled;
  }
  if (description !== undefined) {
    updateData.description = description;
  }

  const { data, error } = await supabaseAdmin
    .from('hidden_feature_flags')
    .update(updateData)
    .eq('feature_key', feature_key)
    .select()
    .single();

  if (error) {
    logger.error('[Admin Hidden Features API] Error updating flag:', {
      error: error.message,
      feature_key,
      context: { endpoint: '/api/admin/features/hidden', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        `Failed to update hidden feature flag: ${error.message}`,
        'DATABASE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }

  return { flag: data };
}

export { updateHiddenFlagSchema };
