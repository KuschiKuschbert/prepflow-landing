import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import {
  dishHasDirectIngredients,
  getDefaultIngredientsForDish,
  getDefaultIngredientsForRecipe,
  getIngredientName,
  getIngredientsFromRecipes,
  recipeHasIngredients,
} from '@/lib/populate-helpers/populate-empty-dishes-helpers';

/**
 * GET: Diagnostic endpoint - returns dishes with no ingredients
 * POST: Populates empty dishes with default ingredients
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

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        empty_dishes: [],
        summary: {
          total_dishes: 0,
          empty_dishes_count: 0,
        },
      });
    }

    // Check each dish for DIRECT ingredients (UI only shows direct ingredients)
    const emptyDishes: Array<{ id: string; dish_name: string }> = [];
    const dishesWithIngredients: Array<{ id: string; dish_name: string }> = [];

    for (const dish of dishes) {
      const hasDirectIngredients = await dishHasDirectIngredients(dish.id);
      if (hasDirectIngredients) {
        dishesWithIngredients.push(dish);
      } else {
        emptyDishes.push(dish);
      }
    }

    return NextResponse.json({
      success: true,
      empty_dishes: emptyDishes,
      dishes_with_ingredients: dishesWithIngredients,
      summary: {
        total_dishes: dishes.length,
        empty_dishes_count: emptyDishes.length,
        dishes_with_ingredients_count: dishesWithIngredients.length,
      },
    });
  } catch (err) {
    logger.error('[Populate Empty Dishes] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        populated: [],
        skipped: [],
        errors: [],
        summary: {
          total_dishes: 0,
          populated_count: 0,
          skipped_count: 0,
          error_count: 0,
        },
      });
    }

    // Get all available ingredients
    const { data: ingredients, error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, unit')
      .order('ingredient_name');

    if (ingredientsError) {
      return NextResponse.json({ error: ingredientsError.message }, { status: 500 });
    }

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No ingredients available in database',
        populated: [],
        skipped: [],
        errors: [],
      });
    }

    // Check each dish and populate if empty
    const populated: Array<{
      dish_id: string;
      dish_name: string;
      ingredients_added: number;
      ingredient_names: string[];
    }> = [];
    const skipped: Array<{ dish_id: string; dish_name: string; reason: string }> = [];
    const errors: Array<{ dish_id: string; dish_name: string; error: string }> = [];

    for (const dish of dishes) {
      try {
        const hasDirectIngredients = await dishHasDirectIngredients(dish.id);
        if (hasDirectIngredients) {
          skipped.push({
            dish_id: dish.id,
            dish_name: dish.dish_name,
            reason: 'Dish already has direct ingredients',
          });
          continue;
        }

        // Try to get ingredients from recipes first, then fallback to default
        let ingredientsToAdd = await getIngredientsFromRecipes(dish.id, ingredients);

        // If no recipe ingredients, use default ingredients based on dish name
        if (ingredientsToAdd.length === 0) {
          ingredientsToAdd = getDefaultIngredientsForDish(dish.dish_name, ingredients);
        }

        if (ingredientsToAdd.length === 0) {
          skipped.push({
            dish_id: dish.id,
            dish_name: dish.dish_name,
            reason: 'No matching ingredients found in database',
          });
          continue;
        }

        // Insert dish_ingredients
        const dishIngredientsToInsert = ingredientsToAdd.map(ing => ({
          dish_id: dish.id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
          unit: ing.unit,
        }));

        const { error: insertError } = await supabaseAdmin
          .from('dish_ingredients')
          .insert(dishIngredientsToInsert);

        if (insertError) {
          errors.push({
            dish_id: dish.id,
            dish_name: dish.dish_name,
            error: insertError.message,
          });
          logger.error('[Populate Empty Dishes] Error inserting ingredients:', {
            dishId: dish.id,
            dishName: dish.dish_name,
            error: insertError.message,
          });
          continue;
        }

        const ingredientNames = ingredientsToAdd.map(ing =>
          getIngredientName(ing.ingredient_id, ingredients),
        );

        populated.push({
          dish_id: dish.id,
          dish_name: dish.dish_name,
          ingredients_added: ingredientsToAdd.length,
          ingredient_names: ingredientNames,
        });

        logger.dev('[Populate Empty Dishes] Populated dish:', {
          dishId: dish.id,
          dishName: dish.dish_name,
          ingredientsAdded: ingredientsToAdd.length,
          ingredientNames,
        });
      } catch (err) {
        errors.push({
          dish_id: dish.id,
          dish_name: dish.dish_name,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
        logger.error('[Populate Empty Dishes] Error processing dish:', {
          dishId: dish.id,
          dishName: dish.dish_name,
          error: err,
        });
      }
    }

    // Also populate recipes without ingredients
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('id, name')
      .order('name');

    const populatedRecipes: Array<{
      recipe_id: string;
      recipe_name: string;
      ingredients_added: number;
      ingredient_names: string[];
    }> = [];
    const skippedRecipes: Array<{ recipe_id: string; recipe_name: string; reason: string }> = [];
    const recipeErrors: Array<{ recipe_id: string; recipe_name: string; error: string }> = [];

    if (!recipesError && recipes && recipes.length > 0) {
      for (const recipe of recipes) {
        try {
          const recipeName = recipe.name || 'Unknown';
          const hasIngredients = await recipeHasIngredients(recipe.id);
          if (hasIngredients) {
            skippedRecipes.push({
              recipe_id: recipe.id,
              recipe_name: recipeName,
              reason: 'Recipe already has ingredients',
            });
            continue;
          }

          // Get default ingredients based on recipe name
          const ingredientsToAdd = getDefaultIngredientsForRecipe(recipeName, ingredients);

          if (ingredientsToAdd.length === 0) {
            skippedRecipes.push({
              recipe_id: recipe.id,
              recipe_name: recipeName,
              reason: 'No matching ingredients found in database',
            });
            continue;
          }

          // Insert recipe_ingredients
          const recipeIngredientsToInsert = ingredientsToAdd.map(ing => ({
            recipe_id: recipe.id,
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
          }));

          const { error: insertError } = await supabaseAdmin
            .from('recipe_ingredients')
            .insert(recipeIngredientsToInsert);

          if (insertError) {
            recipeErrors.push({
              recipe_id: recipe.id,
              recipe_name: recipeName,
              error: insertError.message,
            });
            logger.error('[Populate Empty Dishes] Error inserting recipe ingredients:', {
              recipeId: recipe.id,
              recipeName,
              error: insertError.message,
            });
            continue;
          }

          const ingredientNames = ingredientsToAdd.map(ing =>
            getIngredientName(ing.ingredient_id, ingredients),
          );

          populatedRecipes.push({
            recipe_id: recipe.id,
            recipe_name: recipeName,
            ingredients_added: ingredientsToAdd.length,
            ingredient_names: ingredientNames,
          });

          logger.dev('[Populate Empty Dishes] Populated recipe:', {
            recipeId: recipe.id,
            recipeName,
            ingredientsAdded: ingredientsToAdd.length,
            ingredientNames,
          });
        } catch (err) {
          const recipeName = recipe.name || 'Unknown';
          recipeErrors.push({
            recipe_id: recipe.id,
            recipe_name: recipeName,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
          logger.error('[Populate Empty Dishes] Error processing recipe:', {
            recipeId: recipe.id,
            recipeName: recipe.name,
            error: err,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      dishes: {
        populated,
        skipped,
        errors,
        summary: {
          total_dishes: dishes.length,
          populated_count: populated.length,
          skipped_count: skipped.length,
          error_count: errors.length,
        },
      },
      recipes: {
        populated: populatedRecipes,
        skipped: skippedRecipes,
        errors: recipeErrors,
        summary: {
          total_recipes: recipes?.length || 0,
          populated_count: populatedRecipes.length,
          skipped_count: skippedRecipes.length,
          error_count: recipeErrors.length,
        },
      },
      overall_summary: {
        dishes_populated: populated.length,
        recipes_populated: populatedRecipes.length,
        total_populated: populated.length + populatedRecipes.length,
      },
    });
  } catch (err) {
    logger.error('[Populate Empty Dishes] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
