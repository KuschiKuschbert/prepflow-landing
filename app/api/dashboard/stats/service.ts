
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { checkQueryErrors } from './helpers/checkQueryErrors';
import { fetchWithTimeout } from './helpers/fetchWithTimeout';

interface DishPrice {
  selling_price: number | null;
}

interface Recipe {
  id: string;
}

interface Ingredient {
  id: string;
  current_stock: number | null;
  min_stock_level: number | null;
}

interface RecipeIngredient {
  recipe_id: string | null;
}

export async function fetchDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    if (!supabaseAdmin) throw new Error('Database connection not available');

    // Fetch all data in parallel for better performance
    const [
      ingredientsResult,
      recipesResult,
      dishesPricesResult,
      menuItemsResult,
      allRecipesResult,
      allIngredientsResult,
      tempChecksResult,
      cleaningTasksResult,
    ] = await fetchWithTimeout(
      Promise.all([
        // Basic counts
        supabaseAdmin.from('ingredients').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('recipes').select('*', { count: 'exact', head: true }),
        // Fetch dish prices (dishes have selling_price, not recipes)
        supabaseAdmin.from('dishes').select('selling_price').not('selling_price', 'is', null),
        // Menu dishes count (from menu_items)
        supabaseAdmin.from('menu_items').select('*', { count: 'exact', head: true }),
        // All recipes for completeness check
        supabaseAdmin.from('recipes').select('id'),
        // All ingredients for stock check
        supabaseAdmin.from('ingredients').select('id, current_stock, min_stock_level'),
        // Temperature checks today
        supabaseAdmin
          .from('temperature_logs')
          .select('*', { count: 'exact', head: true })
          .eq('log_date', today),
        // Pending cleaning tasks
        supabaseAdmin
          .from('cleaning_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
      ]),
      10000, // 10 second timeout
    );

    // Check for errors in all queries
    checkQueryErrors(
      [
        ingredientsResult,
        recipesResult,
        menuItemsResult,
        allRecipesResult,
        allIngredientsResult,
        tempChecksResult,
        cleaningTasksResult,
      ],
      [
        'ingredients count',
        'recipes count',
        'menu items count',
        'all recipes',
        'all ingredients',
        'temperature checks',
        'cleaning tasks',
      ],
    );

    // Extract counts and data with fallbacks
    const ing = ingredientsResult.count || 0;
    const rec = recipesResult.count || 0;
    const menuDishes = menuItemsResult.count || 0;
    const allRecipes = allRecipesResult.data || [];
    const allIngredients = allIngredientsResult.data || [];
    const tempChecksToday = tempChecksResult.count || 0;
    const cleaningTasksPending = cleaningTasksResult.count || 0;

    // Calculate average dish price from dishes table
    let averageDishPrice = 0;
    if (dishesPricesResult.error) {
      const errorCode = dishesPricesResult.error.code;
      if (
        errorCode === 'PGRST116' ||
        dishesPricesResult.error.message?.includes('does not exist')
      ) {
        // Dishes table doesn't exist, default to 0
        logger.dev(
          '[Dashboard Stats API] Dishes table not found, defaulting average dish price to 0',
        );
      } else {
        logger.warn('[Dashboard Stats API] Error fetching dish prices:', {
          error: dishesPricesResult.error.message,
          code: errorCode,
        });
      }
    } else {
      const valid = ((dishesPricesResult.data as DishPrice[]) || [])
        .map(d => Number(d.selling_price || 0))
        .filter((v: number) => v > 0);
      averageDishPrice =
        valid.length > 0 ? valid.reduce((a: number, b: number) => a + b, 0) / valid.length : 0;
    }

    // Count recipes ready to cook
    const { data: recipeIngredientsData, error: recipeIngredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id')
      .not('recipe_id', 'is', null);

    if (recipeIngredientsError) {
      logger.warn('[Dashboard Stats API] Error fetching recipe ingredients:', {
        error: recipeIngredientsError.message,
      });
    }

    const recipeIngredientCounts = ((recipeIngredientsData as RecipeIngredient[]) || []).reduce(
      (acc: Record<string, number>, ri) => {
        if (ri.recipe_id) {
          acc[ri.recipe_id] = (acc[ri.recipe_id] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const recipesReady = ((allRecipes as Recipe[]) || []).filter(
      r => recipeIngredientCounts[r.id] > 0,
    ).length;

    const recipesWithoutCost = 0; // Deprecated

    const ingredientsLowStock = ((allIngredients as Ingredient[]) || []).filter(ing => {
      const currentStock = Number(ing.current_stock || 0);
      const minStock = Number(ing.min_stock_level || 0);
      return minStock > 0 && currentStock <= minStock;
    }).length;

    return {
      totalIngredients: ing || 0,
      totalRecipes: rec || 0,
      averageDishPrice,
      totalMenuDishes: menuDishes || 0,
      recipesReady,
      recipesWithoutCost,
      ingredientsLowStock,
      temperatureChecksToday: tempChecksToday || 0,
      cleaningTasksPending: cleaningTasksPending || 0,
    };
}
