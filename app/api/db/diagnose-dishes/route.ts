import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Diagnostic endpoint to check dish ingredients and recipes
 * Helps diagnose why dishes don't have ingredients
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  const adminKey = request.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.SEED_ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
  }

  try {
    // Get all dishes
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name')
      .order('dish_name');

    if (dishesError) {
      return NextResponse.json({ error: dishesError.message }, { status: 500 });
    }

    // Get all dish_ingredients
    const { data: dishIngredients, error: diError } = await supabaseAdmin
      .from('dish_ingredients')
      .select('dish_id, ingredient_id, quantity, unit');

    if (diError) {
      return NextResponse.json({ error: diError.message }, { status: 500 });
    }

    // Get all dish_recipes
    const { data: dishRecipes, error: drError } = await supabaseAdmin
      .from('dish_recipes')
      .select('dish_id, recipe_id, quantity');

    if (drError) {
      return NextResponse.json({ error: drError.message }, { status: 500 });
    }

    // Get all recipe_ingredients to check if recipes have ingredients
    const { data: recipeIngredients, error: riError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id, ingredient_id');

    if (riError && riError.code !== 'PGRST116') {
      logger.warn('[Diagnose Dishes] Error fetching recipe_ingredients:', {
        error: riError.message,
      });
    }

    // Get ingredient names for reference
    const { data: ingredients, error: ingError } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name')
      .order('ingredient_name');

    if (ingError) {
      return NextResponse.json({ error: ingError.message }, { status: 500 });
    }

    // Check for "Beef Burger Deluxe" specifically
    const beefBurgerDeluxe = dishes?.find(d => d.dish_name === 'Beef Burger Deluxe');
    const beefBurgerDeluxeIngredients = dishIngredients?.filter(
      di => di.dish_id === beefBurgerDeluxe?.id,
    );
    const beefBurgerDeluxeRecipes = dishRecipes?.filter(dr => dr.dish_id === beefBurgerDeluxe?.id);

    // Check if Bacon and Cheese ingredients exist
    const baconIngredient = ingredients?.find(
      ing => ing.ingredient_name?.toLowerCase() === 'bacon',
    );
    const cheeseIngredient = ingredients?.find(
      ing => ing.ingredient_name?.toLowerCase() === 'cheese',
    );

    // Create a set of recipe IDs that have ingredients
    const recipesWithIngredients = new Set(
      (recipeIngredients || []).map(ri => ri.recipe_id).filter(Boolean),
    );

    // Group dish ingredients by dish and check if recipes have ingredients
    const dishStats = (dishes || []).map(dish => {
      const dishIngs = dishIngredients?.filter(di => di.dish_id === dish.id) || [];
      const dishRecs = dishRecipes?.filter(dr => dr.dish_id === dish.id) || [];

      // Check if any recipe has ingredients
      const recipeIds = dishRecs.map(dr => dr.recipe_id).filter(Boolean);
      const hasRecipeIngredients = recipeIds.some(rid => recipesWithIngredients.has(rid));

      // Dish has ingredients if it has direct ingredients OR recipes with ingredients
      const hasIngredients = dishIngs.length > 0 || hasRecipeIngredients;

      return {
        dish_id: dish.id,
        dish_name: dish.dish_name,
        ingredient_count: dishIngs.length,
        recipe_count: dishRecs.length,
        has_ingredients: hasIngredients,
        recipe_ids: recipeIds,
        recipes_have_ingredients: recipeIds.map(rid => ({
          recipe_id: rid,
          has_ingredients: recipesWithIngredients.has(rid),
        })),
      };
    });

    const emptyDishes = dishStats.filter(d => !d.has_ingredients);

    return NextResponse.json({
      success: true,
      summary: {
        total_dishes: dishes?.length || 0,
        total_dish_ingredients: dishIngredients?.length || 0,
        total_dish_recipes: dishRecipes?.length || 0,
        total_recipe_ingredients: recipeIngredients?.length || 0,
        total_ingredients: ingredients?.length || 0,
        empty_dishes_count: emptyDishes.length,
      },
      empty_dishes: emptyDishes.map(d => ({
        dish_id: d.dish_id,
        dish_name: d.dish_name,
        ingredient_count: d.ingredient_count,
        recipe_count: d.recipe_count,
      })),
      beef_burger_deluxe: {
        exists: !!beefBurgerDeluxe,
        dish_id: beefBurgerDeluxe?.id,
        ingredient_count: beefBurgerDeluxeIngredients?.length || 0,
        recipe_count: beefBurgerDeluxeRecipes?.length || 0,
        ingredients: beefBurgerDeluxeIngredients || [],
        recipes: beefBurgerDeluxeRecipes || [],
      },
      ingredient_check: {
        bacon_exists: !!baconIngredient,
        bacon_id: baconIngredient?.id,
        bacon_name: baconIngredient?.ingredient_name,
        cheese_exists: !!cheeseIngredient,
        cheese_id: cheeseIngredient?.id,
        cheese_name: cheeseIngredient?.ingredient_name,
      },
      all_dishes: dishStats,
      sample_ingredient_names: ingredients?.slice(0, 20).map(ing => ing.ingredient_name) || [],
    });
  } catch (err) {
    logger.error('[Diagnose Dishes] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
