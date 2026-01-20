/**
 * Recipe Scraper API - List Recipes
 * Returns list of scraped recipes from the database
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { getRecipeDatabaseStats } from '@/lib/ai/recipe-database';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { processListRequest, processSearchRequest } from './helpers/request-processors';
import { initializeStorage, loadJSONStorage } from './helpers/storage-helpers';

/**
 * GET /api/recipe-scraper/recipes
 * Get list of scraped recipes
 */
export async function GET(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

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

    let recipes: unknown[] = [];
    let totalRecipes = 0;

    try {
      if (search) {
        const result = await processSearchRequest(
          search,
          sourceFilter,
          formatFilter,
          offset,
          pageSize
        );
        recipes = result.recipes;
        totalRecipes = result.totalRecipes;
      } else {
        const result = await processListRequest(
          storage,
          sourceFilter,
          formatFilter,
          offset,
          pageSize
        );
        recipes = result.recipes;
        totalRecipes = result.totalRecipes;
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
