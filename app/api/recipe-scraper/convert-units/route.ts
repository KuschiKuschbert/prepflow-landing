/**
 * Recipe Unit Conversion API
 * Converts all scraped recipes to Australian units (ml, l, gm, kg)
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { STORAGE_PATH } from '../../../../scripts/recipe-scraper/config';
import * as path from 'path';
import { processRecipeBatches } from './helpers/batch-processing';

// Dynamic import to handle potential import failures gracefully
async function loadJSONStorage() {
  try {
    const storageMod = await import('../../../../scripts/recipe-scraper/storage/json-storage');
    return storageMod.JSONStorage;
  } catch (importErr) {
    logger.error('[Recipe Unit Conversion API] Failed to import JSONStorage:', {
      error: importErr instanceof Error ? importErr.message : String(importErr),
    });
    throw new Error('Failed to load JSONStorage module');
  }
}

/**
 * POST /api/recipe-scraper/convert-units
 * Convert all recipes to Australian units
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    try {
      await requireAuth(request);
    } catch (authErr) {
      if (authErr instanceof NextResponse) {
        return authErr;
      }
      logger.error('[Recipe Unit Conversion API] Authentication error:', {
        error: authErr instanceof Error ? authErr.message : String(authErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Check for dry-run parameter
    const searchParams = request.nextUrl.searchParams;
    const dryRun = searchParams.get('dry') === '1';

    // Load JSONStorage
    let JSONStorageClass;
    try {
      JSONStorageClass = await loadJSONStorage();
    } catch (loadErr) {
      logger.error('[Recipe Unit Conversion API] Failed to load JSONStorage:', {
        error: loadErr instanceof Error ? loadErr.message : String(loadErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to load storage module', 'INTERNAL_ERROR', 500),
        { status: 500 },
      );
    }

    const storage = new JSONStorageClass();
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
