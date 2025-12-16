import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createShareRecord } from '@/app/api/recipe-share/helpers/createShareRecord';
import { fetchRecipeWithIngredients } from '@/app/api/recipe-share/helpers/fetchRecipeWithIngredients';
import { normalizeRecipeForShare } from '@/app/api/recipe-share/helpers/normalizeRecipeForShare';
import { generateRecipePDF } from '@/app/api/recipe-share/helpers/generateRecipePDF';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeIds, shareType, recipientEmail, notes } = body;

    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe IDs array is required', 'VALIDATION_ERROR', 400, {
          message: 'Missing required field: recipeIds',
        }),
        { status: 400 },
      );
    }

    if (!shareType) {
      return NextResponse.json(
        ApiErrorHandler.createError('Share type is required', 'VALIDATION_ERROR', 400, {
          message: 'Missing required field: shareType',
        }),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const results: Array<{
      recipeId: string;
      success: boolean;
      shareRecord?: any;
      pdfContent?: string;
      error?: string;
    }> = [];

    // Process each recipe
    for (const recipeId of recipeIds) {
      try {
        // Fetch recipe with ingredients
        const recipe = await fetchRecipeWithIngredients(recipeId);

        // Create share record
        const shareRecord = await createShareRecord({
          recipe_id: recipeId,
          share_type: shareType,
          recipient_email: recipientEmail,
          notes,
        });

        // Normalize and generate PDF
        const normalized = normalizeRecipeForShare(recipe);
        const pdfContent = generateRecipePDF(normalized);

        results.push({
          recipeId,
          success: true,
          shareRecord,
          pdfContent,
        });
      } catch (error: any) {
        logger.error(`[Bulk Share API] Error sharing recipe ${recipeId}:`, {
          error: error.message || error,
          recipeId,
        });

        results.push({
          recipeId,
          success: false,
          error: error.message || 'Failed to share recipe',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Shared ${successCount} recipe${successCount > 1 ? 's' : ''} successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
      results,
      summary: {
        total: recipeIds.length,
        successful: successCount,
        failed: failureCount,
      },
    });
  } catch (error: any) {
    logger.error('[Bulk Share API] Unexpected error:', {
      error: error.message || error,
      stack: error.stack,
      context: { endpoint: '/api/recipes/bulk-share', method: 'POST' },
    });

    if (error.status) {
      return NextResponse.json(error, { status: error.status });
    }

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error.message || 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}



