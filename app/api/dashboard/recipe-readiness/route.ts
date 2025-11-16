import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Test connection first
    try {
      const { error: testError } = await supabaseAdmin.from('recipes').select('id').limit(1);
      if (testError) {
        console.error('Database connection test failed:', testError);
        console.error('Test error details:', JSON.stringify(testError, null, 2));
      }
    } catch (testErr) {
      console.error('Database connection test exception:', testErr);
    }

    // Fetch all recipes
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('id, name');

    if (recipesError) {
      console.error('Error fetching recipes:', recipesError);
      console.error('Recipe error code:', (recipesError as any).code);
      console.error('Recipe error message:', recipesError.message);
      console.error('Recipe error details:', JSON.stringify(recipesError, null, 2));
      console.error('Recipe error hint:', (recipesError as any).hint);

      // Extract error code safely
      const errorCode = (recipesError as any).code;
      const errorMessage = recipesError.message || 'Unknown database error';
      const errorHint = (recipesError as any).hint;

      // Check for common errors (table not found)
      const isTableNotFound =
        errorCode === '42P01' ||
        errorMessage.includes('does not exist') ||
        (errorMessage.includes('relation') && errorMessage.includes('does not exist'));

      if (isTableNotFound) {
        // Return empty data gracefully instead of error - allows UI to render without breaking
        console.warn(
          'Recipes table does not exist. Returning empty data. Please run database setup.',
        );
        return NextResponse.json({
          success: true,
          completeRecipes: 0,
          incompleteRecipes: 0,
          recipesWithoutCost: 0,
          mostUsedRecipes: [],
          totalRecipes: 0,
          _warning:
            process.env.NODE_ENV === 'development'
              ? 'Recipes table does not exist. Please run database setup.'
              : undefined,
        });
      }

      // Return the actual error message in development
      const devMessage =
        process.env.NODE_ENV === 'development'
          ? `${errorMessage}${errorHint ? ` (${errorHint})` : ''}${errorCode ? ` [${errorCode}]` : ''}`
          : 'Could not retrieve recipes from database';

      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: devMessage,
          details:
            process.env.NODE_ENV === 'development'
              ? {
                  message: errorMessage,
                  code: errorCode,
                  hint: errorHint,
                  fullError: JSON.stringify(recipesError, null, 2),
                }
              : undefined,
        },
        { status: 500 },
      );
    }

    // Handle empty recipes gracefully (not an error)
    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        completeRecipes: 0,
        incompleteRecipes: 0,
        recipesWithoutCost: 0,
        mostUsedRecipes: [],
        totalRecipes: 0,
      });
    }

    // Fetch all recipe ingredients to check completeness
    const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id');

    if (recipeIngredientsError) {
      console.error('Error fetching recipe ingredients:', recipeIngredientsError);
      const ingredientsErrorCode = (recipeIngredientsError as any).code;
      const ingredientsErrorMessage = recipeIngredientsError.message || 'Unknown error';
      console.error('Recipe ingredients error code:', ingredientsErrorCode);
      console.error('Recipe ingredients error message:', ingredientsErrorMessage);
      console.error(
        'Recipe ingredients error details:',
        JSON.stringify(recipeIngredientsError, null, 2),
      );

      // If recipe_ingredients table doesn't exist, treat as empty (recipes have no ingredients)
      const isIngredientsTableNotFound =
        ingredientsErrorCode === '42P01' ||
        ingredientsErrorMessage.includes('does not exist') ||
        (ingredientsErrorMessage.includes('relation') &&
          ingredientsErrorMessage.includes('does not exist'));

      if (isIngredientsTableNotFound) {
        console.warn('recipe_ingredients table not found, treating all recipes as incomplete');
        // Continue with empty recipeIngredients array
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Could not retrieve recipe ingredients from database',
            details: process.env.NODE_ENV === 'development' ? ingredientsErrorMessage : undefined,
          },
          { status: 500 },
        );
      }
    }

    // Create set of recipe IDs that have ingredients
    // Normalize IDs to strings for proper comparison (UUIDs can be different types)
    const recipesWithIngredients = new Set(
      (recipeIngredients || [])
        .map((ri: any) => ri.recipe_id)
        .filter((id: any) => id != null) // Filter out null/undefined
        .map((id: any) => String(id).trim()), // Normalize to string
    );

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Recipe Readiness] Debug info:', {
        totalRecipes: recipes?.length || 0,
        totalRecipeIngredients: recipeIngredients?.length || 0,
        sampleRecipeId: recipes?.[0]?.id,
        sampleRecipeIdType: typeof recipes?.[0]?.id,
        sampleIngredientRecipeId: recipeIngredients?.[0]?.recipe_id,
        sampleIngredientRecipeIdType: typeof recipeIngredients?.[0]?.recipe_id,
        recipesWithIngredientsSetSize: recipesWithIngredients.size,
        firstRecipeInSet: Array.from(recipesWithIngredients)[0],
        sampleRecipeIds: (recipes || []).slice(0, 3).map((r: any) => ({
          id: r.id,
          type: typeof r.id,
          normalized: String(r.id).trim(),
        })),
      });
    }

    // Count complete recipes (have ingredients)
    // Normalize recipe IDs to strings for comparison
    const completeRecipes = (recipes || []).filter(
      (r: any) => r.id != null && recipesWithIngredients.has(String(r.id).trim()),
    ).length;

    // Count incomplete recipes (no ingredients)
    const incompleteRecipes = (recipes || []).filter(
      (r: any) => r.id == null || !recipesWithIngredients.has(String(r.id).trim()),
    ).length;

    // Get most used recipes (recipes linked to menu dishes)
    // Fetch menu dishes early so we can use them for cost calculation
    let menuDishes: any[] = [];
    const { data: menuDishesData, error: menuDishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select('recipe_id, selling_price')
      .not('recipe_id', 'is', null);

    if (menuDishesError) {
      console.error('Error fetching menu dishes:', menuDishesError);
      const menuDishesErrorCode = (menuDishesError as any).code;
      const menuDishesErrorMessage = menuDishesError.message || 'Unknown error';
      console.error('Menu dishes error code:', menuDishesErrorCode);
      console.error('Menu dishes error message:', menuDishesErrorMessage);
      // If menu_dishes table doesn't exist, treat as empty (no recipes used)
      if (
        menuDishesErrorCode !== '42P01' &&
        !menuDishesErrorMessage.includes('does not exist') &&
        !(
          menuDishesErrorMessage.includes('relation') &&
          menuDishesErrorMessage.includes('does not exist')
        )
      ) {
        // Only log non-table-not-found errors
        console.warn('Could not fetch menu dishes, treating as empty');
      }
    } else {
      menuDishes = menuDishesData || [];
    }

    // Count recipes without costs (recipes that don't have a menu_dish with selling_price)
    // Get all recipe IDs that have menu dishes with selling prices
    const recipesWithCosts = new Set(
      (menuDishes || [])
        .filter((dish: any) => dish.recipe_id && dish.selling_price && dish.selling_price > 0)
        .map((dish: any) => String(dish.recipe_id).trim()),
    );

    const recipesWithoutCost = (recipes || []).filter(
      (r: any) => r.id == null || !recipesWithCosts.has(String(r.id).trim()),
    ).length;

    // Count how many times each recipe is used
    // Normalize IDs to strings for proper comparison
    const recipeUsageCount = new Map<string, number>();
    menuDishes.forEach((dish: any) => {
      if (dish && dish.recipe_id) {
        const normalizedId = String(dish.recipe_id).trim();
        recipeUsageCount.set(normalizedId, (recipeUsageCount.get(normalizedId) || 0) + 1);
      }
    });

    // Get top 3 most used recipes
    const mostUsedRecipes = Array.from(recipeUsageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([recipeId, count]) => {
        // Normalize recipe ID for comparison
        const recipe = (recipes || []).find(
          (r: any) => r.id != null && String(r.id).trim() === recipeId,
        );
        return {
          id: recipeId,
          name: recipe?.name || 'Unknown',
          usageCount: count,
        };
      });

    return NextResponse.json({
      success: true,
      completeRecipes,
      incompleteRecipes,
      recipesWithoutCost,
      mostUsedRecipes,
      totalRecipes: recipes?.length || 0,
    });
  } catch (error) {
    console.error('Error in recipe readiness API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
