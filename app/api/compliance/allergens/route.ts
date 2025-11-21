/**
 * Compliance Allergen Overview API Endpoint
 * GET /api/compliance/allergens
 * Returns all dishes/recipes with aggregated allergens
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
  batchAggregateRecipeAllergens,
  aggregateDishAllergens,
  extractAllergenSources,
  mergeAllergenSources,
} from '@/lib/allergens/allergen-aggregation';

/**
 * Gets allergen overview data for compliance.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Allergen overview response
 */
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
    const menuIdsParam = searchParams.get('menu_ids'); // Comma-separated menu IDs for filtering
    const menuIds = menuIdsParam ? menuIdsParam.split(',').filter(id => id.trim()) : null;

    // Fetch all recipes - handle both 'name' and 'recipe_name' columns
    let recipes: any[] = [];

    // Select all columns to avoid column name issues
    const { data: recipesData, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('*');

    if (recipesError) {
      const errorCode = (recipesError as any).code;
      if (errorCode === '42P01') {
        // Table doesn't exist - return empty data
        logger.dev('[Compliance Allergens API] Recipes table not found, returning empty data');
        return NextResponse.json({
          success: true,
          data: {
            items: [],
            total: 0,
          },
        });
      }

      logger.error('[Compliance Allergens API] Error fetching recipes:', {
        error: recipesError.message,
        code: errorCode,
        details: recipesError,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    } else {
      recipes = recipesData || [];
    }

    // Fetch all dishes - handle gracefully if table doesn't exist
    let dishes: any[] = [];
    const { data: dishesData, error: dishesError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, allergens');

    if (dishesError) {
      // Dishes table might not exist, continue with recipes only
      const errorCode = (dishesError as any).code;
      if (errorCode === '42P01') {
        // Table doesn't exist - this is OK, continue with recipes only
        logger.dev(
          '[Compliance Allergens API] Dishes table not found, continuing with recipes only',
        );
      } else {
        // Other error - log but continue
        logger.warn('[Compliance Allergens API] Error fetching dishes:', {
          error: dishesError.message,
          code: errorCode,
        });
      }
    } else {
      dishes = dishesData || [];
    }

    // Batch aggregate allergens for recipes that don't have cached allergens
    let allergensByRecipe: Record<string, string[]> = {};
    try {
      const recipeIds = (recipes || []).map(r => r.id);
      allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);
    } catch (err) {
      logger.warn('[Compliance Allergens API] Error batch aggregating recipe allergens:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      // Continue with empty allergensByRecipe
    }

    // Fetch ingredient sources for recipes
    const recipeIngredientSources: Record<string, Record<string, string[]>> = {};
    try {
      const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
        .from('recipe_ingredients')
        .select(
          `
          recipe_id,
          ingredients (
            id,
            ingredient_name,
            allergens
          )
        `,
        );

      if (!recipeIngredientsError && recipeIngredients) {
        // Group ingredients by recipe_id
        const ingredientsByRecipe: Record<
          string,
          Array<{ ingredient_name: string; allergens?: string[] }>
        > = {};
        recipeIngredients.forEach((ri: any) => {
          const recipeId = ri.recipe_id;
          const ingredient = ri.ingredients;
          if (recipeId && ingredient) {
            if (!ingredientsByRecipe[recipeId]) {
              ingredientsByRecipe[recipeId] = [];
            }
            ingredientsByRecipe[recipeId].push({
              ingredient_name: ingredient.ingredient_name,
              allergens: ingredient.allergens,
            });
          }
        });

        // Extract allergen sources for each recipe using utility function
        Object.entries(ingredientsByRecipe).forEach(([recipeId, ingredients]) => {
          recipeIngredientSources[recipeId] = extractAllergenSources(ingredients);
        });
      }
    } catch (err) {
      logger.warn('[Compliance Allergens API] Error fetching recipe ingredient sources:', err);
    }

    // Aggregate allergens for dishes and get ingredient sources
    const dishesWithAllergens = await Promise.all(
      (dishes || []).map(async dish => {
        let allergens: string[] = [];
        const allergenSources: Record<string, string[]> = {};

        try {
          if (dish.allergens && Array.isArray(dish.allergens)) {
            allergens = dish.allergens;
          } else {
            allergens = await aggregateDishAllergens(dish.id);
          }

          // Fetch dish ingredients to get allergen sources
          if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
          }
          const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
            .from('dish_ingredients')
            .select(
              `
              ingredients (
                id,
                ingredient_name,
                allergens
              )
            `,
            )
            .eq('dish_id', dish.id);

          if (!dishIngredientsError && dishIngredients) {
            // Extract allergen sources using utility function
            const dishIngredientList = dishIngredients.map((di: any) => ({
              ingredient_name: di.ingredients?.ingredient_name || '',
              allergens: di.ingredients?.allergens,
            }));
            const dishIngredientSources = extractAllergenSources(dishIngredientList);
            Object.assign(allergenSources, dishIngredientSources);
          }

          // Also check dish recipes for allergens
          if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
          }
          const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
            .from('dish_recipes')
            .select(
              `
              recipe_id,
              recipes (
                id
              )
            `,
            )
            .eq('dish_id', dish.id);

          if (!dishRecipesError && dishRecipes) {
            // Collect recipe allergen sources for this dish
            const recipeSources: Record<string, string[]>[] = [];
            dishRecipes.forEach((dr: any) => {
              const recipeId = dr.recipe_id;
              if (recipeId && recipeIngredientSources[recipeId]) {
                recipeSources.push(recipeIngredientSources[recipeId]);
              }
            });

            // Merge recipe sources with dish ingredient sources using utility function
            if (recipeSources.length > 0) {
              const mergedSources = mergeAllergenSources(allergenSources, ...recipeSources);
              Object.assign(allergenSources, mergedSources);
            }
          }
        } catch (err) {
          logger.warn('[Compliance Allergens API] Error aggregating dish allergens:', {
            dishId: dish.id,
            error: err,
          });
          // Continue with empty allergens array
        }
        return { ...dish, allergens, allergenSources };
      }),
    );

    // Enrich recipes with allergens and ingredient sources - handle both 'name' and 'recipe_name' columns
    const recipesWithAllergens = (recipes || []).map(recipe => ({
      ...recipe,
      recipe_name: (recipe as any).recipe_name || (recipe as any).name,
      allergens: allergensByRecipe[recipe.id] || recipe.allergens || [],
      allergenSources: recipeIngredientSources[recipe.id] || {},
    }));

    // Fetch menu information for all items
    let menuItemsMap: Record<string, Array<{ menu_id: string; menu_name: string }>> = {};

    try {
      // Query menu_items to find which menus contain each dish/recipe
      const { data: menuItems, error: menuItemsError } = await supabaseAdmin
        .from('menu_items')
        .select('menu_id, dish_id, recipe_id, menus(id, menu_name)');

      if (menuItemsError) {
        const errorCode = (menuItemsError as any).code;
        if (errorCode === '42P01') {
          // Table doesn't exist - continue without menu information
          logger.dev(
            '[Compliance Allergens API] Menu items table not found, continuing without menu information',
          );
        } else {
          logger.warn('[Compliance Allergens API] Error fetching menu items:', {
            error: menuItemsError.message,
            code: errorCode,
          });
        }
      } else if (menuItems) {
        // Build a map of item_id -> menus
        menuItems.forEach((item: any) => {
          const itemId = item.dish_id || item.recipe_id;
          const menu = item.menus;

          if (itemId && menu) {
            if (!menuItemsMap[itemId]) {
              menuItemsMap[itemId] = [];
            }
            // Check if this menu is already added (avoid duplicates)
            if (!menuItemsMap[itemId].some(m => m.menu_id === menu.id)) {
              menuItemsMap[itemId].push({
                menu_id: menu.id,
                menu_name: menu.menu_name || 'Unknown Menu',
              });
            }
          }
        });
      }
    } catch (err) {
      logger.warn('[Compliance Allergens API] Error fetching menu items:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      // Continue without menu information
    }

    // Combine recipes and dishes with menu information
    const allItems = [
      ...recipesWithAllergens.map(r => ({
        id: r.id,
        name: r.recipe_name,
        description: r.description,
        type: 'recipe' as const,
        allergens: r.allergens || [],
        allergenSources: r.allergenSources || {},
        menus: menuItemsMap[r.id] || [],
      })),
      ...dishesWithAllergens.map(d => ({
        id: d.id,
        name: d.dish_name,
        description: d.description,
        type: 'dish' as const,
        allergens: d.allergens || [],
        allergenSources: d.allergenSources || {},
        menus: menuItemsMap[d.id] || [],
      })),
    ];

    // Filter by allergen if requested
    let filteredItems = allItems;
    if (excludeAllergen) {
      filteredItems = filteredItems.filter(item => !item.allergens.includes(excludeAllergen));
    }

    // Filter by menu IDs if requested
    if (menuIds && menuIds.length > 0) {
      filteredItems = filteredItems.filter(item => {
        // Show item if it appears in ANY of the selected menus
        return item.menus.some(menu => menuIds.includes(menu.menu_id));
      });
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
