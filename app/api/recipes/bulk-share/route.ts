import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createShareRecord } from '@/app/api/recipe-share/helpers/createShareRecord';
import { fetchRecipeWithIngredients } from '@/app/api/recipe-share/helpers/fetchRecipeWithIngredients';
import { normalizeRecipeForShare } from '@/app/api/recipe-share/helpers/normalizeRecipeForShare';
import { generateRecipePDF } from '@/app/api/recipe-share/helpers/generateRecipePDF';

const bulkShareSchema = z.object({
  recipeIds: z
    .array(z.string().uuid('Recipe ID must be a valid UUID'))
    .min(1, 'Recipe IDs array is required and must contain at least one recipe ID'),
  shareType: z.enum(['email', 'link', 'pdf']),
  recipientEmail: z.string().email('Invalid email address').optional(),
  notes: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Bulk Share API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = bulkShareSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { recipeIds, shareType, recipientEmail, notes } = zodValidation.data;

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

        // Create share record (convert null to undefined)
        const shareRecord = await createShareRecord({
          recipe_id: recipeId,
          share_type: shareType,
          recipient_email: recipientEmail,
          notes: notes ?? undefined,
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
      return NextResponse.json(
        ApiErrorHandler.createError(
          error.message || 'Request failed',
          'CLIENT_ERROR',
          error.status,
        ),
        { status: error.status },
      );
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
