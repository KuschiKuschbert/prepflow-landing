import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import {
    additionalIngredientsForRecipes,
    sampleRecipeIngredientsForPopulate,
    sampleRecipesForPopulate
} from '@/lib/populate-recipes-data';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    // cleaned: Added environment protection to prevent demo data in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Recipe population is not allowed in production',
          message: 'This endpoint is only available in development mode',
        },
        { status: 403 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    logger.dev('Starting recipe population...');

    logger.dev('Starting recipe population...');

    // Insert additional ingredients
    await insertAdditionalIngredients(supabaseAdmin);

    // Insert recipes
    await insertSampleRecipes(supabaseAdmin);

    // Get ingredient IDs for recipe ingredients
    const { data: ingredients } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name');

    const ingredientMap = new Map();
    ingredients?.forEach(ing => {
      ingredientMap.set(ing.ingredient_name, ing.id);
    });

    // First, delete existing recipe ingredients for these recipes
    const recipeIds = [...new Set(sampleRecipeIngredientsForPopulate.map(ri => ri.recipe_id))];
    await deleteExistingIngredients(supabaseAdmin, recipeIds);

    // Insert recipe ingredients
    const { insertedCount, notFoundCount } = await insertRecipeIngredients(supabaseAdmin, ingredientMap);

    logger.dev(`Inserted ${insertedCount} recipe ingredients, ${notFoundCount} not found`);

    return NextResponse.json({
      success: true,
      message: 'Successfully populated 12 sample recipes with complete ingredient lists!',
      data: {
        recipes_added: 12,
        ingredients_added: additionalIngredientsForRecipes.length,
        recipe_ingredients_added: sampleRecipeIngredientsForPopulate.length,
      },
    });
  } catch (error) {
    logger.error('Error populating recipes:', error);
    return NextResponse.json(
      {
        error: 'Failed to populate recipes',
        message: 'There was an error adding the sample recipes to the database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertAdditionalIngredients(supabaseAdmin: any) {
    for (const ingredient of additionalIngredientsForRecipes) {
      const { error } = await supabaseAdmin
        .from('ingredients')
        .upsert(ingredient, { onConflict: 'product_code' });

      if (error) {
        logger.dev(`Error inserting ingredient ${ingredient.ingredient_name}:`, error.message);
      }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertSampleRecipes(supabaseAdmin: any) {
    for (const recipe of sampleRecipesForPopulate) {
      const { error } = await supabaseAdmin.from('recipes').upsert(recipe, { onConflict: 'id' });

      if (error) {
        logger.dev(`Error inserting recipe ${recipe.name}:`, error.message);
      }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deleteExistingIngredients(supabaseAdmin: any, recipeIds: string[]) {
    for (const recipeId of recipeIds) {
      const { error: deleteError } = await supabaseAdmin
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeId);

      if (deleteError) {
        logger.dev(
          `Error deleting existing recipe ingredients for ${recipeId}:`,
          deleteError.message,
        );
      }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertRecipeIngredients(supabaseAdmin: any, ingredientMap: Map<string, string>) {
    let insertedCount = 0;
    let notFoundCount = 0;
    for (const ri of sampleRecipeIngredientsForPopulate) {
      const ingredientId = ingredientMap.get(ri.ingredient_name);
      if (ingredientId) {
        const { error } = await supabaseAdmin.from('recipe_ingredients').insert({
          recipe_id: ri.recipe_id,
          ingredient_id: ingredientId,
          quantity: ri.quantity,
          unit: ri.unit,
        });

        if (error) {
          logger.dev(`Error inserting recipe ingredient ${ri.ingredient_name}:`, error.message);
        } else {
          insertedCount++;
        }
      } else {
        logger.dev(`Ingredient not found: ${ri.ingredient_name}`);
        notFoundCount++;
      }
    }
    return { insertedCount, notFoundCount };
}
