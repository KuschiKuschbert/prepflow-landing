/**
 * Recipe Scraper API - List Recipes
 * Returns list of scraped recipes from the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { searchRecipesByIngredients, getRecipeDatabaseStats } from '@/lib/ai/recipe-database';
import { loadJSONStorage, initializeStorage } from './helpers/storage-helpers';
import {
  filterByFormatAtIndex,
  filterByFormatAfterLoad,
  filterBySource,
} from './helpers/filter-helpers';

/**
 * GET /api/recipe-scraper/recipes
 * Get list of scraped recipes
 */
export async function GET(request: NextRequest) {
  try {
    try {
      await requireAuth(request);
    } catch (authErr) {
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
    const search = searchParams.get('search');
    const sourceFilter = searchParams.get('source') || undefined;
    const formatFilter = searchParams.get('format') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '25', 10)));
    const offset = (page - 1) * pageSize;

    let JSONStorageClass;
    try {
      JSONStorageClass = await loadJSONStorage();
    } catch (loadErr) {
      logger.error('[Recipe Scraper API] Failed to load JSONStorage:', {
        error: loadErr instanceof Error ? loadErr.message : String(loadErr),
      });
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

    const storage = initializeStorage(JSONStorageClass);
    if (!storage) {
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
        const ingredients = search
          .split(',')
          .map(i => i.trim())
          .filter(Boolean);
        const allMatchingRecipes = await searchRecipesByIngredients(
          ingredients,
          10000,
          sourceFilter,
        );

        const filteredRecipes = filterByFormatAfterLoad(allMatchingRecipes, formatFilter);
        totalRecipes = filteredRecipes.length;
        recipes = filteredRecipes.slice(offset, offset + pageSize);
      } else {
        try {
          const allRecipes = storage.getAllRecipes();
          let filteredRecipes = filterByFormatAtIndex(allRecipes, formatFilter);
          filteredRecipes = filterBySource(filteredRecipes, sourceFilter);
          totalRecipes = filteredRecipes.length;

          if (filteredRecipes.length > 0) {
            const paginatedEntries = filteredRecipes.slice(offset, offset + pageSize);
            const recipePromises = paginatedEntries.map(entry =>
              storage.loadRecipe(entry.file_path!),
            );
            const loadedRecipes = await Promise.all(recipePromises);
            recipes = loadedRecipes.filter(recipe => recipe !== null);
          }
        } catch (loadErr) {
          logger.error('[Recipe Scraper API] Error loading recipes:', {
            error: loadErr instanceof Error ? loadErr.message : String(loadErr),
          });
          recipes = [];
        }
      }
    } catch (recipeErr) {
      logger.error('[Recipe Scraper API] Error fetching recipes:', {
        error: recipeErr instanceof Error ? recipeErr.message : String(recipeErr),
      });
      recipes = [];
    }

    let stats;
    try {
      stats = getRecipeDatabaseStats();
    } catch (statsErr) {
      logger.error('[Recipe Scraper API] Error getting stats:', {
        error: statsErr instanceof Error ? statsErr.message : String(statsErr),
      });
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
    logger.error('[Recipe Scraper API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/recipes', operation: 'GET' },
    });

    if (err instanceof NextResponse) {
      return err;
    }

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
