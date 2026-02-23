import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createShareRecord } from './helpers/createShareRecord';
import { fetchRecipeWithIngredients } from './helpers/fetchRecipeWithIngredients';
import { generateRecipePDF } from './helpers/generateRecipePDF';
import { handleRecipeShareError } from './helpers/handleRecipeShareError';
import { normalizeRecipeForShare } from './helpers/normalizeRecipeForShare';

const shareRecipeSchema = z.object({
  recipeId: z.string().min(1, 'Recipe ID is required'),
  shareType: z.string().min(1, 'Share type is required'),
  recipientEmail: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Recipe Share API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = shareRecipeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { recipeId, shareType, recipientEmail, notes } = validationResult.data;

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

    return NextResponse.json({
      success: true,
      message: 'Recipe share created successfully',
      data: {
        shareRecord,
        pdfContent: pdfContent,
        recipe: recipe,
      },
    });
  } catch (error: unknown) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      return NextResponse.json(error, { status });
    }
    return handleRecipeShareError(error, 'POST');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        ApiErrorHandler.createError('User ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('recipe_shares')
      .select(
        `
        *,
        recipes (
          id,
          recipe_name,
          description
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[Recipe Share API] Database error fetching shares:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/recipe-share', operation: 'GET', userId },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleRecipeShareError(error, 'GET');
  }
}
