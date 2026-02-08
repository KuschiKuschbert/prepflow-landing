/**
 * Recipe Unit Conversion API
 * Converts all scraped recipes to Australian units (ml, l, gm, kg)
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { STORAGE_PATH } from '@/lib/recipes/config';
import { JSONStorage } from '@/lib/recipes/storage/json-storage';
import { NextRequest, NextResponse } from 'next/server';
import * as path from 'path';
import { processRecipeBatches } from './helpers/batch-processing';

/**
 * POST /api/recipe-scraper/convert-units
 * Convert all recipes to Australian units
 */
export async function POST(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    // Check for dry-run parameter
    const searchParams = request.nextUrl.searchParams;
    const dryRun = searchParams.get('dry') === '1';

    const storage = new JSONStorage();
    const allRecipes = storage.getAllRecipes();

    if (allRecipes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No recipes found to convert',
        data: {
          totalRecipes: 0,
          convertedRecipes: 0,
          totalIngredientsConverted: 0,
          dryRun,
        },
      });
    }

    // Get storage path for direct file updates
    const storagePath = path.join(process.cwd(), STORAGE_PATH);

    // Process recipes in batches
    const { convertedRecipes, totalIngredientsConverted, errors } = await processRecipeBatches(
      allRecipes,
      storage,
      storagePath,
      dryRun,
    );

    return NextResponse.json({
      success: true,
      message: dryRun
        ? `Dry run: Would convert ${convertedRecipes} recipes (${totalIngredientsConverted} ingredients)`
        : `Successfully converted ${convertedRecipes} recipes (${totalIngredientsConverted} ingredients)`,
      data: {
        totalRecipes: allRecipes.length,
        convertedRecipes,
        totalIngredientsConverted,
        errors: errors.length > 0 ? errors : undefined,
        dryRun,
      },
    });
  } catch (err) {
    logger.error('[Recipe Unit Conversion API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/convert-units', operation: 'POST' },
    });

    if (err instanceof NextResponse) {
      return err;
    }

    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to convert recipe units',
        'INTERNAL_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
