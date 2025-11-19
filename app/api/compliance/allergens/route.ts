/**
 * Compliance Allergen Overview API Endpoint
 * GET /api/compliance/allergens
 * Returns all dishes/recipes with aggregated allergens
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { batchAggregateRecipeAllergens } from '@/lib/allergens/allergen-aggregation';
import { aggregateDishAllergens } from '@/lib/allergens/allergen-aggregation';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const excludeAllergen = searchParams.get('exclude_allergen'); // Filter for gluten-free, etc.

    // Fetch all recipes
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name, description, allergens');

    if (recipesError) {
      logger.error('[Compliance Allergens API] Error fetching recipes:', {
        error: recipesError.message,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch all dishes
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, allergens');

    if (dishesError) {
      // Dishes table might not exist, continue with recipes only
      logger.dev('[Compliance Allergens API] Dishes table not found, continuing with recipes only');
    }

    // Batch aggregate allergens for recipes that don't have cached allergens
    const recipeIds = (recipes || []).map(r => r.id);
    const allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);

    // Aggregate allergens for dishes
    const dishesWithAllergens = await Promise.all(
      (dishes || []).map(async dish => {
        let allergens: string[] = [];
        if (dish.allergens && Array.isArray(dish.allergens)) {
          allergens = dish.allergens;
        } else {
          allergens = await aggregateDishAllergens(dish.id);
        }
        return { ...dish, allergens };
      }),
    );

    // Enrich recipes with allergens
    const recipesWithAllergens = (recipes || []).map(recipe => ({
      ...recipe,
      allergens: allergensByRecipe[recipe.id] || recipe.allergens || [],
    }));

    // Combine recipes and dishes
    const allItems = [
      ...recipesWithAllergens.map(r => ({
        id: r.id,
        name: r.recipe_name,
        description: r.description,
        type: 'recipe' as const,
        allergens: r.allergens || [],
      })),
      ...dishesWithAllergens.map(d => ({
        id: d.id,
        name: d.dish_name,
        description: d.description,
        type: 'dish' as const,
        allergens: d.allergens || [],
      })),
    ];

    // Filter by allergen if requested
    let filteredItems = allItems;
    if (excludeAllergen) {
      filteredItems = allItems.filter(
        item => !item.allergens.includes(excludeAllergen),
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        items: filteredItems,
        total: filteredItems.length,
      },
    });
  } catch (err) {
    logger.error('[Compliance Allergens API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch allergen overview',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

