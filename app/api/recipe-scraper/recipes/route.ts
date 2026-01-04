/**
 * Recipe Scraper API - List Recipes
 * Returns list of scraped recipes from the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { searchRecipesByIngredients, getRecipeDatabaseStats } from '@/lib/ai/recipe-database';

// Dynamic imports to handle potential import failures gracefully
async function loadJSONStorage() {
  try {
    const storageMod = await import('../../../../scripts/recipe-scraper/storage/json-storage');
    return storageMod.JSONStorage;
  } catch (importErr) {
    logger.error('[Recipe Scraper API] Failed to import JSONStorage:', {
      error: importErr instanceof Error ? importErr.message : String(importErr),
    });
    throw new Error('Failed to load JSONStorage module');
  }
}

// ScrapedRecipe is a type, not needed as a value

/**
 * GET /api/recipe-scraper/recipes
 * Get list of scraped recipes
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    try {
      await requireAuth(request);
    } catch (authErr) {
      // requireAuth throws NextResponse for auth errors, return it
      if (authErr instanceof NextResponse) {
        return authErr;
      }
      logger.error('[Recipe Scraper API] Authentication error:', {
        error: authErr instanceof Error ? authErr.message : String(authErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search'); // Comma-separated ingredients
    const sourceFilter = searchParams.get('source') || undefined; // Optional source filter
    // Pagination support: page (1-based) and pageSize
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '25', 10))); // Max 100 per page
    const offset = (page - 1) * pageSize;

    // Load modules dynamically
    let JSONStorageClass;
    try {
      JSONStorageClass = await loadJSONStorage();
    } catch (loadErr) {
      logger.error('[Recipe Scraper API] Failed to load JSONStorage:', {
        error: loadErr instanceof Error ? loadErr.message : String(loadErr),
      });
      // Return empty results instead of failing
      return NextResponse.json({
        success: true,
        data: {
          recipes: [],
          stats: {
            totalRecipes: 0,
            bySource: {},
            lastUpdated: null,
          },
        },
      });
    }

    // Initialize storage with error handling
    let storage;
    try {
      storage = new JSONStorageClass();
    } catch (storageErr) {
      logger.error('[Recipe Scraper API] Error initializing storage:', {
        error: storageErr instanceof Error ? storageErr.message : String(storageErr),
      });
      // Return empty results instead of failing
      return NextResponse.json({
        success: true,
        data: {
          recipes: [],
          stats: {
            totalRecipes: 0,
            bySource: {},
            lastUpdated: null,
          },
        },
      });
    }

    let recipes: any[] = [];
    let totalRecipes = 0;
    try {
      if (search) {
        // Search by ingredients - get all matching recipes first, then paginate
        const ingredients = search
          .split(',')
          .map(i => i.trim())
          .filter(Boolean);
        const allMatchingRecipes = await searchRecipesByIngredients(
          ingredients,
          10000,
          sourceFilter,
        ); // Get all matches with optional source filter
        totalRecipes = allMatchingRecipes.length;
        recipes = allMatchingRecipes.slice(offset, offset + pageSize);
      } else {
        // Get all recipes with pagination
        try {
          const allRecipes = storage.getAllRecipes();
          // Apply source filter if provided
          const filteredRecipes = sourceFilter
            ? allRecipes.filter(entry => entry.source === sourceFilter)
            : allRecipes;
          totalRecipes = filteredRecipes.length;

          if (filteredRecipes.length > 0) {
            // Apply pagination to file paths first (more efficient than loading all recipes)
            const paginatedEntries = filteredRecipes.slice(offset, offset + pageSize);
            const recipePromises = paginatedEntries.map(entry =>
              storage.loadRecipe(entry.file_path),
            );
            const loadedRecipes = await Promise.all(recipePromises);
            recipes = loadedRecipes.filter(recipe => recipe !== null);
          }
        } catch (loadErr) {
          logger.error('[Recipe Scraper API] Error loading recipes:', {
            error: loadErr instanceof Error ? loadErr.message : String(loadErr),
          });
          // Continue with empty recipes array
          recipes = [];
        }
      }
    } catch (recipeErr) {
      logger.error('[Recipe Scraper API] Error fetching recipes:', {
        error: recipeErr instanceof Error ? recipeErr.message : String(recipeErr),
      });
      // Continue with empty recipes array instead of failing
      recipes = [];
    }

    // Get statistics with error handling
    let stats;
    try {
      stats = getRecipeDatabaseStats();
    } catch (statsErr) {
      logger.error('[Recipe Scraper API] Error getting stats:', {
        error: statsErr instanceof Error ? statsErr.message : String(statsErr),
      });
      // Return default stats instead of failing
      stats = {
        totalRecipes: 0,
        bySource: {},
        lastUpdated: null,
      };
    }

    const totalPages = Math.ceil(totalRecipes / pageSize);

    return NextResponse.json({
      success: true,
      data: {
        recipes,
        stats,
        pagination: {
          page,
          pageSize,
          total: totalRecipes,
          totalPages,
        },
      },
    });
  } catch (err) {
    // Catch any unexpected errors and ensure JSON response
    logger.error('[Recipe Scraper API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/recipes', operation: 'GET' },
    });

    // requireAuth and other helpers may throw NextResponse
    if (err instanceof NextResponse) {
      return err;
    }

    // Always return JSON, never let Next.js return HTML error page
    // Return empty results instead of error to allow UI to render
    return NextResponse.json({
      success: true,
      data: {
        recipes: [],
        stats: {
          totalRecipes: 0,
          bySource: {},
          lastUpdated: null,
        },
      },
    });
  }
}
