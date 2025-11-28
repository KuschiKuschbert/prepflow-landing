import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const category = searchParams.get('category');
    const excludeAllergens =
      searchParams.get('exclude_allergens')?.split(',').filter(Boolean) || [];
    const includeAllergens =
      searchParams.get('include_allergens')?.split(',').filter(Boolean) || [];
    const vegetarian = searchParams.get('vegetarian') === 'true';
    const vegan = searchParams.get('vegan') === 'true';
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabaseAdmin.from('recipes').select('*', { count: 'exact' });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (excludeAllergens.length > 0) {
      excludeAllergens.forEach(allergen => {
        query = query.not('allergens', 'cs', JSON.stringify([allergen]));
      });
    }
    if (includeAllergens.length > 0) {
      // Filter client-side (Supabase doesn't support OR directly)
    }
    if (vegetarian) query = query.eq('is_vegetarian', true);
    if (vegan) query = query.eq('is_vegan', true);

    const { data: recipes, error, count } = await query.order('name').range(start, end);

    if (error) {
      logger.error('[Recipes API] Database error fetching recipes:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/recipes', operation: 'GET', table: 'recipes' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
    let filteredRecipes = recipes || [];
    if (includeAllergens.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const recipeAllergens = (recipe.allergens as string[]) || [];
        return includeAllergens.some(allergen => recipeAllergens.includes(allergen));
      });
    }
    const recipesNeedingAllergens = filteredRecipes.filter(
      r => !r.allergens || (Array.isArray(r.allergens) && r.allergens.length === 0),
    );
    if (recipesNeedingAllergens.length > 0) {
      const { batchAggregateRecipeAllergens } = await import(
        '@/lib/allergens/allergen-aggregation'
      );
      const recipeIds = recipesNeedingAllergens.map(r => r.id);
      const allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);
      filteredRecipes = filteredRecipes.map(recipe => {
        if (allergensByRecipe[recipe.id]) {
          return { ...recipe, allergens: allergensByRecipe[recipe.id] };
        }
        return recipe;
      });
    }
    const mappedRecipes = filteredRecipes.map(recipe => ({
      ...recipe,
      recipe_name: (recipe as any).name || (recipe as any).recipe_name,
    }));

    return NextResponse.json({
      success: true,
      recipes: mappedRecipes,
      count: count || 0,
      page,
      pageSize,
    });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, yield: dishPortions, yield_unit, category, description, instructions } = body;

    if (!name) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe name is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if recipe already exists (try recipe_name first, fallback to name for compatibility)
    let existingRecipes: any[] | null = null;
    let checkError: any = null;

    // Try recipe_name first (newer schema)
    const checkResult = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name, name')
      .ilike('recipe_name', name.trim());

    if (checkResult.error && (checkResult.error as any).code === '42703') {
      // Column doesn't exist, try name (older schema)
      const fallbackResult = await supabaseAdmin
        .from('recipes')
        .select('id, name')
        .ilike('name', name.trim());
      existingRecipes = fallbackResult.data;
      checkError = fallbackResult.error;
    } else {
      existingRecipes = checkResult.data;
      checkError = checkResult.error;
    }

    const existingRecipe =
      existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;
    const recipeData = {
      yield: dishPortions || 1,
      yield_unit: yield_unit || 'servings',
      category: category || 'Uncategorized',
      description: description || null,
      instructions: instructions || null,
    };
    if (existingRecipe && !checkError) {
      const { data: updatedRecipe, error: updateError } = await supabaseAdmin
        .from('recipes')
        .update({ ...recipeData, updated_at: new Date().toISOString() })
        .eq('id', existingRecipe.id)
        .select()
        .single();
      if (updateError) {
        logger.error('[Recipes API] Database error updating recipe:', {
          error: updateError.message,
          code: (updateError as any).code,
          context: { endpoint: '/api/recipes', operation: 'PUT', recipeId: existingRecipe.id },
        });
        const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }
      return NextResponse.json({ success: true, recipe: updatedRecipe, isNew: false });
    }
    // Try recipe_name first (newer schema), fallback to name (older schema)
    let newRecipe: any = null;
    let createError: any = null;

    try {
      const insertResult = await supabaseAdmin
        .from('recipes')
        .insert({ recipe_name: name.trim(), ...recipeData })
        .select()
        .single();

      if (insertResult.error && (insertResult.error as any).code === '42703') {
        // Column doesn't exist, try name (older schema)
        logger.warn('[Recipes API] recipe_name column not found, trying name column');
        const fallbackResult = await supabaseAdmin
          .from('recipes')
          .insert({ name: name.trim(), ...recipeData })
          .select()
          .single();
        newRecipe = fallbackResult.data;
        createError = fallbackResult.error;
      } else {
        newRecipe = insertResult.data;
        createError = insertResult.error;
      }
    } catch (insertErr) {
      logger.error('[Recipes API] Error during recipe insert:', insertErr);
      createError = insertErr;
    }
    if (createError) {
      logger.error('[Recipes API] Database error creating recipe:', {
        error: createError.message,
        code: (createError as any).code,
        context: { endpoint: '/api/recipes', operation: 'POST', recipeName: name },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(createError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
    return NextResponse.json({ success: true, recipe: newRecipe, isNew: true });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
