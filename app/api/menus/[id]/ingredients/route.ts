import { NextRequest, NextResponse } from 'next/server';
import { fetchMenuWithItems } from '../helpers/fetchMenuWithItems';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

interface IngredientWithParLevel {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  cost_per_unit: number;
  unit?: string;
  storage?: string;
  category?: string;
  par_level?: number;
  reorder_point?: number;
  par_unit?: string;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Get sort option from query params
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'storage';

    // Fetch menu with items
    const menu = await fetchMenuWithItems(menuId);

    if (!menu.items || menu.items.length === 0) {
      return NextResponse.json({
        success: true,
        menuName: menu.menu_name,
        ingredients: [],
        groupedIngredients: {},
      });
    }

    // Collect all dish IDs and recipe IDs
    const dishIds = new Set<string>();
    const recipeIds = new Set<string>();

    for (const menuItem of menu.items) {
      if (menuItem.dish_id) {
        dishIds.add(menuItem.dish_id);
      }
      if (menuItem.recipe_id) {
        recipeIds.add(menuItem.recipe_id);
      }
    }

    // Collect all ingredient IDs
    const ingredientIds = new Set<string>();

    // Fetch dish ingredients
    if (dishIds.size > 0) {
      try {
        const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
          .from('dish_ingredients')
          .select('ingredient_id')
          .in('dish_id', Array.from(dishIds));

        if (dishIngredientsError) {
          logger.warn('[Menu Ingredients API] Error fetching dish ingredients (continuing):', {
            error: dishIngredientsError.message,
            context: { menuId },
          });
        } else if (dishIngredients) {
          dishIngredients.forEach((di: any) => {
            if (di.ingredient_id) ingredientIds.add(di.ingredient_id);
          });
        }

        // Fetch dish recipes and their ingredients
        const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
          .from('dish_recipes')
          .select('recipe_id')
          .in('dish_id', Array.from(dishIds));

        if (dishRecipesError) {
          logger.warn('[Menu Ingredients API] Error fetching dish recipes (continuing):', {
            error: dishRecipesError.message,
            context: { menuId },
          });
        } else if (dishRecipes) {
          const dishRecipeIds = dishRecipes.map((dr: any) => dr.recipe_id).filter((id: any) => id);

          if (dishRecipeIds.length > 0) {
            const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
              .from('recipe_ingredients')
              .select('ingredient_id')
              .in('recipe_id', dishRecipeIds);

            if (recipeIngredientsError) {
              logger.warn(
                '[Menu Ingredients API] Error fetching recipe ingredients from dishes (continuing):',
                {
                  error: recipeIngredientsError.message,
                  context: { menuId },
                },
              );
            } else if (recipeIngredients) {
              recipeIngredients.forEach((ri: any) => {
                if (ri.ingredient_id) ingredientIds.add(ri.ingredient_id);
              });
            }
          }
        }
      } catch (err) {
        logger.warn('[Menu Ingredients API] Error processing dishes (continuing):', err);
      }
    }

    // Fetch recipe ingredients for menu recipes
    if (recipeIds.size > 0) {
      try {
        const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
          .from('recipe_ingredients')
          .select('ingredient_id')
          .in('recipe_id', Array.from(recipeIds));

        if (recipeIngredientsError) {
          logger.warn('[Menu Ingredients API] Error fetching recipe ingredients (continuing):', {
            error: recipeIngredientsError.message,
            context: { menuId },
          });
        } else if (recipeIngredients) {
          recipeIngredients.forEach((ri: any) => {
            if (ri.ingredient_id) ingredientIds.add(ri.ingredient_id);
          });
        }
      } catch (err) {
        logger.warn('[Menu Ingredients API] Error processing recipes (continuing):', err);
      }
    }

    if (ingredientIds.size === 0) {
      return NextResponse.json({
        success: true,
        menuName: menu.menu_name,
        ingredients: [],
        groupedIngredients: {},
      });
    }

    // Fetch ingredient details - use select('*') to get all columns and handle missing ones gracefully
    const { data: ingredients, error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .select('*')
      .in('id', Array.from(ingredientIds));

    if (ingredientsError) {
      logger.error('[Menu Ingredients API] Error fetching ingredients:', {
        error: ingredientsError.message,
        code: (ingredientsError as any).code,
        context: { menuId },
      });

      // Provide helpful error message
      const errorMessage = ingredientsError.message || 'Unknown database error';
      if (errorMessage.includes('column') || errorMessage.includes('does not exist')) {
        return NextResponse.json(
          ApiErrorHandler.createError('Database column not found', 'DATABASE_ERROR', 500, {
            message:
              'One or more database columns are missing. Please ensure your database schema is up to date.',
            details: errorMessage,
          }),
          { status: 500 },
        );
      }

      throw ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
    }

    // Fetch par levels - handle case where table might not exist
    let parLevels: any[] = [];
    try {
      const { data, error: parLevelsError } = await supabaseAdmin
        .from('par_levels')
        .select('ingredient_id, par_level, reorder_point, unit')
        .in('ingredient_id', Array.from(ingredientIds));

      if (!parLevelsError && data) {
        parLevels = data;
      } else if (parLevelsError) {
        // Table might not exist or have different structure - log but don't fail
        logger.warn('[Menu Ingredients API] Could not fetch par levels:', {
          error: parLevelsError.message,
          context: { menuId },
        });
      }
    } catch (err) {
      // Par levels are optional - continue without them
      logger.warn(
        '[Menu Ingredients API] Error fetching par levels (continuing without them):',
        err,
      );
    }

    // Create par levels map
    const parLevelsMap = new Map<
      string,
      { par_level?: number; reorder_point?: number; unit?: string }
    >();
    if (parLevels) {
      parLevels.forEach((pl: any) => {
        parLevelsMap.set(pl.ingredient_id, {
          par_level: pl.par_level,
          reorder_point: pl.reorder_point,
          unit: pl.unit,
        });
      });
    }

    // Combine ingredients with par levels
    const ingredientsWithParLevels: IngredientWithParLevel[] = (ingredients || []).map(
      (ing: any) => {
        const parLevel = parLevelsMap.get(ing.id);
        return {
          id: ing.id,
          ingredient_name: ing.ingredient_name,
          brand: ing.brand || undefined,
          pack_size: ing.pack_size || undefined,
          pack_size_unit: ing.pack_size_unit || ing.unit || undefined,
          pack_price: ing.pack_price || undefined,
          cost_per_unit: ing.cost_per_unit || 0,
          unit: ing.unit || undefined,
          storage: ing.storage || ing.storage_location || 'Uncategorized',
          category: ing.category || undefined,
          par_level: parLevel?.par_level,
          reorder_point: parLevel?.reorder_point,
          par_unit: parLevel?.unit,
        };
      },
    );

    // Group by storage location (default) or sort by other options
    let groupedIngredients: Record<string, IngredientWithParLevel[]> = {};

    if (sortBy === 'storage') {
      // Group by storage
      ingredientsWithParLevels.forEach(ing => {
        const storage = ing.storage || 'Uncategorized';
        if (!groupedIngredients[storage]) {
          groupedIngredients[storage] = [];
        }
        groupedIngredients[storage].push(ing);
      });

      // Sort within each group by name
      Object.keys(groupedIngredients).forEach(key => {
        groupedIngredients[key].sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name));
      });
    } else if (sortBy === 'name') {
      // Sort all by name, then group by first letter or just show as single group
      const sorted = [...ingredientsWithParLevels].sort((a, b) =>
        a.ingredient_name.localeCompare(b.ingredient_name),
      );
      groupedIngredients['All Ingredients'] = sorted;
    } else if (sortBy === 'category') {
      // Group by category
      ingredientsWithParLevels.forEach(ing => {
        const category = ing.category || 'Uncategorized';
        if (!groupedIngredients[category]) {
          groupedIngredients[category] = [];
        }
        groupedIngredients[category].push(ing);
      });

      // Sort within each group by name
      Object.keys(groupedIngredients).forEach(key => {
        groupedIngredients[key].sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name));
      });
    }

    return NextResponse.json({
      success: true,
      menuName: menu.menu_name,
      menuId: menu.id,
      ingredients: ingredientsWithParLevels,
      groupedIngredients,
      sortBy,
    });
  } catch (err: any) {
    logger.error('[Menu Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch menu ingredients', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
