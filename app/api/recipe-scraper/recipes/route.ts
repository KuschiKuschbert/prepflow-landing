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
    await requireAuth(request);

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search'); // Comma-separated ingredients
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const storage = new JSONStorage();

    let recipes;
    if (search) {
      // Search by ingredients
      const ingredients = search
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);
      recipes = await searchRecipesByIngredients(ingredients, limit);
    } else {
      // Get all recipes
      const allRecipes = storage.getAllRecipes();
      const recipePromises = allRecipes
        .slice(0, limit)
        .map(entry => storage.loadRecipe(entry.file_path));
      const loadedRecipes = await Promise.all(recipePromises);
      recipes = loadedRecipes.filter((recipe): recipe is ScrapedRecipe => recipe !== null);
    }

    const stats = getRecipeDatabaseStats();

    return NextResponse.json({
      success: true,
      data: {
        recipes,
        stats,
      },
    });
  } catch (err) {
    logger.error('[Recipe Scraper API] Error fetching recipes:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/recipe-scraper/recipes', operation: 'GET' },
    });

    if (err instanceof NextResponse) {
      return err;
    }

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch recipes', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
