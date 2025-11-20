/**
 * Populate All Allergens API Endpoint
 * POST /api/ingredients/populate-all-allergens
 * Admin-only endpoint to automatically detect and populate allergens for all ingredients
 * that don't have manual allergens set
 */

import { NextRequest, NextResponse } from 'next/server';
import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 1; // 1 request per hour (this is a heavy operation)

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }

    const userId = session.user.email;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Rate limit exceeded. This operation can only be run once per hour.',
          'RATE_LIMIT_ERROR',
          429,
        ),
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { dry_run = false, batch_size = 50, force_ai = false } = body;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch all ingredients that don't have manual allergens
    // We'll process ingredients that:
    // 1. Have no allergens (null or empty array)
    // 2. Have allergens but they're not marked as manual
    const { data: ingredients, error: fetchError } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, brand, allergens, allergen_source')
      .order('ingredient_name', { ascending: true });

    if (fetchError) {
      logger.error('[Populate All Allergens] Failed to fetch ingredients:', {
        error: fetchError.message,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          total: 0,
          processed: 0,
          successful: 0,
          failed: 0,
          skipped: 0,
          results: [],
        },
      });
    }

    // Filter ingredients that need allergen detection
    const ingredientsToProcess = ingredients.filter(ingredient => {
      // Skip if has manual allergens
      const hasManualAllergens =
        ingredient.allergens &&
        Array.isArray(ingredient.allergens) &&
        ingredient.allergens.length > 0 &&
        ingredient.allergen_source &&
        typeof ingredient.allergen_source === 'object' &&
        (ingredient.allergen_source as { manual?: boolean }).manual;

      return !hasManualAllergens;
    });

    logger.dev(
      `[Populate All Allergens] Found ${ingredientsToProcess.length} ingredients to process out of ${ingredients.length} total`,
    );

    if (dry_run) {
      // Return preview of what would be processed
      return NextResponse.json({
        success: true,
        dry_run: true,
        data: {
          total: ingredients.length,
          to_process: ingredientsToProcess.length,
          skipped: ingredients.length - ingredientsToProcess.length,
          preview: ingredientsToProcess.slice(0, 10).map(ing => ({
            id: ing.id,
            ingredient_name: ing.ingredient_name,
            brand: ing.brand,
            current_allergens: ing.allergens || [],
          })),
        },
      });
    }

    const results: Array<{
      ingredient_id: string;
      ingredient_name: string;
      status: 'success' | 'failed' | 'skipped';
      allergens?: string[];
      method?: string;
      error?: string;
    }> = [];

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    // Process ingredients in batches
    for (let i = 0; i < ingredientsToProcess.length; i += batch_size) {
      const batch = ingredientsToProcess.slice(i, i + batch_size);
      logger.dev(
        `[Populate All Allergens] Processing batch ${Math.floor(i / batch_size) + 1}/${Math.ceil(ingredientsToProcess.length / batch_size)}`,
      );

      // Process each ingredient in the batch
      for (const ingredient of batch) {
        try {
          // Use hybrid detection
          const enriched = await enrichIngredientWithAllergensHybrid({
            ingredient_name: ingredient.ingredient_name,
            brand: ingredient.brand || undefined,
            allergens: (ingredient.allergens as string[]) || [],
            allergen_source:
              (ingredient.allergen_source as {
                manual?: boolean;
                ai?: boolean;
              }) || {},
            forceAI: force_ai,
          });

          // Update ingredient in database
          const { error: updateError } = await supabaseAdmin
            .from('ingredients')
            .update({
              allergens: enriched.allergens,
              allergen_source: enriched.allergen_source,
            })
            .eq('id', ingredient.id);

          if (updateError) {
            throw updateError;
          }

          successful++;
          results.push({
            ingredient_id: ingredient.id,
            ingredient_name: ingredient.ingredient_name,
            status: 'success',
            allergens: enriched.allergens,
            method: enriched.method || 'unknown',
          });

          // Small delay to respect rate limits (especially for AI calls)
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
          failed++;
          logger.error('[Populate All Allergens] Failed to process ingredient:', {
            ingredient_id: ingredient.id,
            ingredient_name: ingredient.ingredient_name,
            error: err instanceof Error ? err.message : String(err),
          });
          results.push({
            ingredient_id: ingredient.id,
            ingredient_name: ingredient.ingredient_name,
            status: 'failed',
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

      // Longer delay between batches to avoid overwhelming the system
      if (i + batch_size < ingredientsToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Count skipped (ingredients with manual allergens)
    skipped = ingredients.length - ingredientsToProcess.length;

    logger.dev(
      `[Populate All Allergens] Completed: ${successful} successful, ${failed} failed, ${skipped} skipped`,
    );

    return NextResponse.json({
      success: true,
      data: {
        total: ingredients.length,
        processed: ingredientsToProcess.length,
        successful,
        failed,
        skipped,
        results: results.slice(0, 100), // Limit results to first 100 for response size
      },
    });
  } catch (err) {
    logger.error('[Populate All Allergens] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to populate allergens',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
