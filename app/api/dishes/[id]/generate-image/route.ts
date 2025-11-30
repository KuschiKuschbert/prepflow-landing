/**
 * Dish Image Generation API Endpoint
 * POST /api/dishes/[id]/generate-image
 *
 * Generates photorealistic food images for a dish based on its name and ingredients.
 * Aggregates ingredients from both direct dish ingredients and recipe ingredients.
 * Returns primary and alternative plating style images.
 */

import { generateFoodImages } from '@/lib/ai/ai-service/image-generation';
import { isAIEnabled } from '@/lib/ai/gemini-client';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: 10 generations per user per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // 10 generations per hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (userLimit.count >= RATE_LIMIT_MAX) return false;
  userLimit.count++;
  return true;
}

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check authentication
    const token = await getToken({ req: _req });
    if (!token || !token.sub) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    const userId = token.sub;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Rate limit exceeded. Maximum 10 image generations per hour.',
          'RATE_LIMIT_ERROR',
          429,
        ),
        { status: 429 },
      );
    }

    // Check if AI is enabled
    if (!isAIEnabled()) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'AI service is not enabled. Please configure GEMINI_API_KEY to generate images.',
          'SERVICE_UNAVAILABLE',
          503,
        ),
        { status: 503 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch dish
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, image_url, image_url_alternative')
      .eq('id', dishId)
      .single();

    if (dishError || !dish) {
      logger.error('[Dish Image Generation] Failed to fetch dish:', {
        error: dishError?.message,
        dishId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Check if images already exist (optional: skip if exists)
    if (dish.image_url && dish.image_url_alternative) {
      logger.dev('[Dish Image Generation] Images already exist, returning existing URLs', {
        dishId,
      });
      return NextResponse.json({
        success: true,
        imageUrl: dish.image_url,
        imageUrlAlternative: dish.image_url_alternative,
        cached: true,
      });
    }

    // Fetch dish ingredients (direct ingredients)
    const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        quantity,
        unit,
        ingredients (
          ingredient_name
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishIngredientsError) {
      logger.error('[Dish Image Generation] Failed to fetch dish ingredients:', {
        error: dishIngredientsError.message,
        dishId,
      });
    }

    // Fetch dish recipes with their ingredients
    const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        recipes (
          id,
          recipe_name,
          recipe_ingredients (
            quantity,
            unit,
            ingredients (
              ingredient_name
            )
          )
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipesError) {
      logger.error('[Dish Image Generation] Failed to fetch dish recipes:', {
        error: dishRecipesError.message,
        dishId,
      });
    }

    // Aggregate all ingredient names
    const ingredientNamesSet = new Set<string>();

    // Add direct dish ingredients
    if (dishIngredients && Array.isArray(dishIngredients)) {
      dishIngredients.forEach(di => {
        const ingredient = di.ingredients;
        if (ingredient && typeof ingredient === 'object' && 'ingredient_name' in ingredient) {
          const name = (ingredient as { ingredient_name: string }).ingredient_name;
          if (name) {
            ingredientNamesSet.add(name);
          }
        }
      });
    }

    // Add ingredients from recipes
    if (dishRecipes && Array.isArray(dishRecipes)) {
      dishRecipes.forEach(dr => {
        const recipe = dr.recipes;
        if (recipe && typeof recipe === 'object' && 'recipe_ingredients' in recipe) {
          const recipeIngredients = (recipe as { recipe_ingredients: any[] }).recipe_ingredients;
          if (Array.isArray(recipeIngredients)) {
            recipeIngredients.forEach(ri => {
              const ingredient = ri.ingredients;
              if (ingredient && typeof ingredient === 'object' && 'ingredient_name' in ingredient) {
                const name = (ingredient as { ingredient_name: string }).ingredient_name;
                if (name) {
                  ingredientNamesSet.add(name);
                }
              }
            });
          }
        }
      });
    }

    const ingredientNames = Array.from(ingredientNamesSet);

    if (ingredientNames.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Dish has no ingredients. Add ingredients or recipes before generating images.',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Generate images
    logger.dev('[Dish Image Generation] Generating images', {
      dishId,
      dishName: dish.dish_name,
      ingredientCount: ingredientNames.length,
      directIngredientsCount: dishIngredients?.length || 0,
      recipeCount: dishRecipes?.length || 0,
    });

    const { primary, alternative } = await generateFoodImages(
      dish.dish_name || 'Dish',
      ingredientNames,
    );

    if (primary.error || alternative.error) {
      const errorMessage = primary.error || alternative.error || 'Failed to generate images';
      logger.error('[Dish Image Generation] Image generation failed:', {
        dishId,
        primaryError: primary.error,
        alternativeError: alternative.error,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(errorMessage, 'AI_SERVICE_ERROR', 500),
        { status: 500 },
      );
    }

    // Store images in database
    const updateData: {
      image_url?: string;
      image_url_alternative?: string;
    } = {};

    if (primary.content?.imageUrl) {
      updateData.image_url = primary.content.imageUrl;
    }
    if (alternative.content?.imageUrl) {
      updateData.image_url_alternative = alternative.content.imageUrl;
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('dishes')
        .update(updateData)
        .eq('id', dishId);

      if (updateError) {
        logger.error('[Dish Image Generation] Failed to save images to database:', {
          error: updateError.message,
          dishId,
        });
        // Don't fail the request - images were generated, just not saved
        // Return the images anyway
      }
    }

    logger.dev('[Dish Image Generation] Successfully generated images', {
      dishId,
      hasPrimary: !!primary.content?.imageUrl,
      hasAlternative: !!alternative.content?.imageUrl,
    });

    return NextResponse.json({
      success: true,
      imageUrl: primary.content?.imageUrl || null,
      imageUrlAlternative: alternative.content?.imageUrl || null,
    });
  } catch (err) {
    logger.error('[Dish Image Generation] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]/generate-image', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        'An unexpected error occurred while generating images',
        'INTERNAL_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
