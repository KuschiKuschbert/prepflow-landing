/**
 * Generate Recipe Cards API Endpoint
 * POST /api/menus/[id]/recipe-cards/generate - Manually trigger recipe card generation
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { generateRecipeCardsForMenu } from '../../lock/helpers/generateRecipeCards';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const requestStartTime = Date.now();
  logger.dev('[Generate Recipe Cards API] POST request received');

  try {
    const { id: menuId } = await context.params;
    logger.dev(`[Generate Recipe Cards API] Parsed menuId: ${menuId}`);

    if (!menuId) {
      logger.error('[Generate Recipe Cards API] Menu ID is missing');
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    logger.dev(`[Generate Recipe Cards API] Creating Supabase admin client...`);
    const supabase = createSupabaseAdmin();
    logger.dev(`[Generate Recipe Cards API] Supabase client created`);

    // Check if menu exists and is locked
    logger.dev(`[Generate Recipe Cards API] Fetching menu ${menuId}...`);
    const { data: menu, error: menuError } = await supabase
      .from('menus')
      .select('id, is_locked')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      logger.error('[Generate Recipe Cards API] Failed to fetch menu:', menuError);
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    logger.dev(`[Generate Recipe Cards API] Menu found: ${menu.id}, is_locked: ${menu.is_locked}`);

    if (!menu.is_locked) {
      logger.warn(`[Generate Recipe Cards API] Menu ${menuId} is not locked`);
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Menu must be locked before generating recipe cards',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Generate recipe cards
    try {
      logger.dev(`[Generate Recipe Cards API] Starting generation for menu ${menuId}`);

      // Check if AI is enabled before attempting generation
      logger.dev(`[Generate Recipe Cards API] Checking if AI is enabled...`);
      const { isAIEnabled } = await import('@/lib/ai/huggingface-client');
      const aiEnabled = isAIEnabled();
      logger.dev(`[Generate Recipe Cards API] AI enabled: ${aiEnabled}`);

      if (!aiEnabled) {
        logger.warn(
          '[Generate Recipe Cards API] AI service is not enabled - recipe card generation requires AI',
        );
        return NextResponse.json(
          ApiErrorHandler.createError(
            'AI service is not enabled. Please configure HUGGINGFACE_API_KEY to generate recipe cards.',
            'AI_NOT_ENABLED',
            503,
          ),
          { status: 503 },
        );
      }

      logger.dev(
        `[Generate Recipe Cards API] AI is enabled, calling generateRecipeCardsForMenu...`,
      );
      const generationStartTime = Date.now();

      // Add timeout to prevent hanging (5 minutes max)
      const generationPromise = generateRecipeCardsForMenu(menuId);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => {
            logger.error('[Generate Recipe Cards API] Generation timeout after 5 minutes');
            reject(new Error('Generation timeout after 5 minutes'));
          },
          5 * 60 * 1000,
        ),
      );

      await Promise.race([generationPromise, timeoutPromise]);
      const generationDuration = Date.now() - generationStartTime;
      const totalDuration = Date.now() - requestStartTime;
      logger.dev(
        `[Generate Recipe Cards API] Successfully generated recipe cards for menu ${menuId} in ${generationDuration}ms (total: ${totalDuration}ms)`,
      );

      return NextResponse.json({
        success: true,
        message: 'Recipe cards generated successfully',
      });
    } catch (genError) {
      logger.error('Failed to generate recipe cards:', genError);
      const errorMessage = genError instanceof Error ? genError.message : String(genError);

      // Provide more helpful error messages
      let userMessage = 'Failed to generate recipe cards';
      if (errorMessage.includes('AI') || errorMessage.includes('API key')) {
        userMessage =
          'AI service is not configured. Please set HUGGINGFACE_API_KEY environment variable.';
      } else if (errorMessage.includes('no ingredients')) {
        userMessage =
          'Some menu items have no ingredients. Please add ingredients to your dishes/recipes first.';
      } else if (errorMessage.includes('Failed to generate any')) {
        userMessage = errorMessage; // Use the detailed error message
      }

      return NextResponse.json(
        ApiErrorHandler.createError(userMessage, 'GENERATION_ERROR', 500, errorMessage),
        { status: 500 },
      );
    }
  } catch (err) {
    logger.error('[Generate Recipe Cards API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to generate recipe cards',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
