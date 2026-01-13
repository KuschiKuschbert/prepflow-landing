import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { CreateDishInput, Dish, DishIngredientInput, DishRecipeInput } from './schemas';

/**
 * Create dish with recipes and ingredients.
 *
 * @param {Omit<CreateDishInput, 'recipes' | 'ingredients'>} dishData - Dish data
 * @param {DishRecipeInput[]} [recipes] - Optional recipes array
 * @param {DishIngredientInput[]} [ingredients] - Optional ingredients array
 * @returns {Promise<Dish>} Created dish
 * @throws {Error} If creation fails
 */
export async function createDishWithRelations(
  dishData: {
    dish_name: string;
    description?: string | null;
    selling_price: number;
    category?: string;
  },
  recipes?: DishRecipeInput[],
  ingredients?: DishIngredientInput[],
): Promise<Dish> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Create the dish
  const { data: newDish, error: createError } = await supabaseAdmin
    .from('dishes')
    .insert({
      dish_name: dishData.dish_name.trim(),
      description: dishData.description?.trim() || null,
      selling_price: dishData.selling_price,
      category: dishData.category || 'Uncategorized',
    })
    .select()
    .single();

  if (createError) {
    logger.error('[Dishes API] Database error creating dish:', {
      error: createError.message,
      code: createError.code,
      context: { endpoint: '/api/dishes', operation: 'POST', dishName: dishData.dish_name },
    });
    throw ApiErrorHandler.fromSupabaseError(createError, 500);
  }

  // Add recipes if provided
  if (recipes && recipes.length > 0) {
    const dishRecipes = recipes.map(r => ({
      dish_id: newDish.id,
      recipe_id: r.recipe_id,
      quantity: r.quantity || 1,
    }));

    const { error: recipesError } = await supabaseAdmin.from('dish_recipes').insert(dishRecipes);

    if (recipesError) {
      logger.error('[Dishes API] Database error adding recipes to dish:', {
        error: recipesError.message,
        code: recipesError.code,
        context: { endpoint: '/api/dishes', operation: 'POST', dishId: newDish.id },
      });
      // Rollback dish creation
      const { error: rollbackError } = await supabaseAdmin
        .from('dishes')
        .delete()
        .eq('id', newDish.id);
      if (rollbackError) {
        logger.error('[Dishes API] Failed to rollback dish creation after recipes error:', {
          error: rollbackError.message,
          dishId: newDish.id,
        });
      }
      throw ApiErrorHandler.fromSupabaseError(recipesError, 500);
    }
  }

  // Add ingredients if provided
  if (ingredients && ingredients.length > 0) {
    const dishIngredients = ingredients.map(i => ({
      dish_id: newDish.id,
      ingredient_id: i.ingredient_id,
      quantity: i.quantity,
      unit: i.unit,
    }));

    const { error: ingredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .insert(dishIngredients);

    if (ingredientsError) {
      logger.error('[Dishes API] Database error adding ingredients to dish:', {
        error: ingredientsError.message,
        code: ingredientsError.code,
        context: { endpoint: '/api/dishes', operation: 'POST', dishId: newDish.id },
      });
      // Rollback dish creation
      const { error: rollbackError2 } = await supabaseAdmin
        .from('dishes')
        .delete()
        .eq('id', newDish.id);
      if (rollbackError2) {
        logger.error('[Dishes API] Failed to rollback dish creation after ingredients error:', {
          error: rollbackError2.message,
          dishId: newDish.id,
        });
      }
      throw ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
    }
  }

  return newDish as Dish;
}
