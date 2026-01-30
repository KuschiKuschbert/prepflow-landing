import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { parseBulkUpdateBody, prepareIngredientUpdateData } from './helpers/parseBody';

export async function PUT(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    const dataOrResponse = await parseBulkUpdateBody(request);
    if (dataOrResponse instanceof NextResponse) {
      return dataOrResponse;
    }

    const { ids, updates } = dataOrResponse;
    const preparationResult = prepareIngredientUpdateData(ids, updates as Record<string, unknown>);

    if (typeof preparationResult === 'string') {
      return NextResponse.json(
        ApiErrorHandler.createError(preparationResult, 'SERVER_ERROR', 400),
        { status: 400 },
      );
    }

    const { normalizedIds, updateData } = preparationResult;

    // Perform bulk update
    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .update(updateData)
      .in('id', normalizedIds)
      .select();

    if (error) {
      logger.error('[bulk-update] Error updating ingredients:', error);
      return NextResponse.json(
        {
          error: 'Failed to update ingredients',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${data?.length || 0} ingredient${data?.length !== 1 ? 's' : ''}`,
      data: {
        updated: data?.length || 0,
        ids: normalizedIds,
      },
    });
  } catch (e: unknown) {
    logger.error('[bulk-update] Unexpected error:', e);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
