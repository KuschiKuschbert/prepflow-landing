import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createShareRecord } from './helpers/createShareRecord';
import { fetchRecipeWithIngredients } from './helpers/fetchRecipeWithIngredients';
import { generateRecipePDF } from './helpers/generateRecipePDF';
import { handleRecipeShareError } from './helpers/handleRecipeShareError';
import { normalizeRecipeForShare } from './helpers/normalizeRecipeForShare';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeId, shareType, recipientEmail, notes } = body;

    if (!recipeId || !shareType) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Recipe ID and share type are required',
          'VALIDATION_ERROR',
          400,
          { message: 'Missing required fields' },
        ),
        { status: 400 },
      );
    }

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
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json(error, { status: error.status });
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
        {
          error: 'User ID is required',
          message: 'Please provide a valid user ID',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
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
          name,
          description
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[Recipe Share API] Database error fetching shares:', {
        error: error.message,
        code: (error as any).code,
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
    return handleRecipeShareError(error, 'GET');
  }
}
