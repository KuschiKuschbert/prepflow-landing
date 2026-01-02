/**
 * Recipe Scraper API - List Recipes
 * Returns list of scraped recipes from the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { JSONStorage } from '../../../../scripts/recipe-scraper/storage/json-storage';
import { searchRecipesByIngredients, getRecipeDatabaseStats } from '@/lib/ai/recipe-database';
import { ScrapedRecipe } from '../../../../scripts/recipe-scraper/parsers/types';

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
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Initialize storage with error handling
    let storage: JSONStorage;
    try {
      storage = new JSONStorage();
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

    let recipes: ScrapedRecipe[] = [];
    try {
      if (search) {
        // Search by ingredients
        const ingredients = search
          .split(',')
          .map(i => i.trim())
          .filter(Boolean);
        recipes = await searchRecipesByIngredients(ingredients, limit);
      } else {
        // Get all recipes
        try {
          const allRecipes = storage.getAllRecipes();
          if (allRecipes.length > 0) {
            const recipePromises = allRecipes
              .slice(0, limit)
              .map(entry => storage.loadRecipe(entry.file_path));
            const loadedRecipes = await Promise.all(recipePromises);
            recipes = loadedRecipes.filter((recipe): recipe is ScrapedRecipe => recipe !== null);
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

    return NextResponse.json({
      success: true,
      data: {
        recipes,
        stats,
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
