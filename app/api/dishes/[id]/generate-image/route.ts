/**
 * Dish Image Generation API Endpoint
 * POST /api/dishes/[id]/generate-image
 *
 * Generates photorealistic food images for a dish based on its name and ingredients.
 * Aggregates ingredients from both direct dish ingredients and recipe ingredients.
 * By default, generates 1 image with the 'classic' plating method.
 * Users can optionally specify multiple plating methods in the request body.
 */

import { generateFoodImagesForMethods } from '@/lib/ai/ai-service/image-generation';
import type { PlatingMethod, FoodImageResult } from '@/lib/ai/ai-service/image-generation';
import type { AIResponse } from '@/lib/ai/types';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImageToStorage } from '@/lib/storage/upload-image';
import { fetchDishIngredients } from '../helpers/fetchDishIngredients';
import { fetchDishRecipes } from '../helpers/fetchDishRecipes';
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

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
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
    const token = await getToken({ req });
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
    const { isAIEnabled } = await import('@/lib/ai/huggingface-client');
    if (!isAIEnabled()) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Image generation service is not available. Please configure HUGGINGFACE_API_KEY to generate images.',
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
      .select('id, dish_name, description, image_url, image_url_alternative, image_url_modern, image_url_minimalist')
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
    const hasExistingImages =
      dish.image_url &&
      dish.image_url_alternative &&
      dish.image_url_modern &&
      dish.image_url_minimalist;

    if (hasExistingImages) {
      logger.dev('[Dish Image Generation] Images already exist, returning existing URLs', {
        dishId,
      });
      return NextResponse.json({
        success: true,
        classic: dish.image_url,
        modern: dish.image_url_modern,
        rustic: dish.image_url_alternative,
        minimalist: dish.image_url_minimalist,
        // Legacy aliases for backward compatibility
        imageUrl: dish.image_url,
        imageUrlAlternative: dish.image_url_alternative,
        cached: true,
      });
    }

    // Fetch dish ingredients using helper function (handles nested relations properly)
    let dishIngredients: any[] = [];
    try {
      dishIngredients = await fetchDishIngredients(dishId);
      logger.dev('[Dish Image Generation] Fetched dish ingredients:', {
        dishId,
        count: dishIngredients.length,
        ingredients: dishIngredients.map(di => ({
          ingredientName: di.ingredients?.ingredient_name || di.ingredients?.name,
          quantity: di.quantity,
          unit: di.unit,
        })),
      });
    } catch (error) {
      logger.error('[Dish Image Generation] Failed to fetch dish ingredients:', {
        error: error instanceof Error ? error.message : String(error),
        dishId,
      });
      // Continue - we'll check if we have any ingredients at all later
    }

    // Fetch dish recipes using helper function (handles nested relations properly)
    let dishRecipes: any[] = [];
    try {
      dishRecipes = await fetchDishRecipes(dishId);
      logger.dev('[Dish Image Generation] Fetched dish recipes:', {
        dishId,
        count: dishRecipes.length,
        recipeIds: dishRecipes.map(dr => dr.recipe_id || dr.id),
      });
    } catch (error) {
      logger.error('[Dish Image Generation] Failed to fetch dish recipes:', {
        error: error instanceof Error ? error.message : String(error),
        dishId,
      });
      // Continue - we'll check if we have any ingredients at all later
    }

    // Fetch recipe ingredients for each recipe
    const recipeIngredientNamesSet = new Set<string>();
    for (const dishRecipe of dishRecipes) {
      const recipeId = dishRecipe.recipe_id || dishRecipe.id;
      if (!recipeId) continue;

      try {
        const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
          .from('recipe_ingredients')
          .select(
            `
            ingredients (
              ingredient_name
            )
          `,
          )
          .eq('recipe_id', recipeId);

        if (recipeIngredientsError) {
          logger.error('[Dish Image Generation] Failed to fetch recipe ingredients:', {
            error: recipeIngredientsError.message,
            recipeId,
            dishId,
          });
          continue;
        }

        if (recipeIngredients && Array.isArray(recipeIngredients)) {
          recipeIngredients.forEach(ri => {
            const ingredient = ri.ingredients;
            if (ingredient && typeof ingredient === 'object' && ingredient !== null) {
              const name =
                (ingredient as any).ingredient_name || (ingredient as any).name;
              if (name && typeof name === 'string') {
                recipeIngredientNamesSet.add(name);
              }
            }
          });
        }
      } catch (error) {
        logger.error('[Dish Image Generation] Error fetching recipe ingredients:', {
          error: error instanceof Error ? error.message : String(error),
          recipeId,
          dishId,
        });
      }
    }

    // Aggregate all ingredient names
    const ingredientNamesSet = new Set<string>();

    // Add direct dish ingredients
    dishIngredients.forEach(di => {
      const ingredient = di.ingredients;
      if (ingredient && typeof ingredient === 'object' && ingredient !== null) {
        const name = (ingredient as any).ingredient_name || (ingredient as any).name;
        if (name && typeof name === 'string') {
          ingredientNamesSet.add(name);
        }
      }
    });

    // Add ingredients from recipes
    recipeIngredientNamesSet.forEach(name => {
      ingredientNamesSet.add(name);
    });

    const ingredientNames = Array.from(ingredientNamesSet);

    logger.dev('[Dish Image Generation] Aggregated ingredient names:', {
      dishId,
      directIngredientsCount: dishIngredients.length,
      recipesCount: dishRecipes.length,
      recipeIngredientsCount: recipeIngredientNamesSet.size,
      totalUniqueIngredients: ingredientNames.length,
      ingredientNames,
    });

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

    // Parse request body for optional plating methods
    let selectedPlatingMethods: PlatingMethod[] | undefined;
    try {
      const body = await req.json().catch(() => ({}));
      if (body.platingMethods && Array.isArray(body.platingMethods) && body.platingMethods.length > 0) {
        selectedPlatingMethods = body.platingMethods;
      }
    } catch {
      // No body or invalid JSON - use defaults
    }

    // Determine which plating methods to generate
    let methodsToGenerate: PlatingMethod[];
    if (selectedPlatingMethods && selectedPlatingMethods.length > 0) {
      // User selected specific methods
      methodsToGenerate = selectedPlatingMethods;
      logger.dev('[Dish Image Generation] Generating images for selected plating methods', {
        dishId,
        dishName: dish.dish_name,
        methods: methodsToGenerate,
        ingredientCount: ingredientNames.length,
      });
    } else {
      // Default: generate only 1 image with 'classic' method
      methodsToGenerate = ['classic'];
      logger.dev('[Dish Image Generation] Generating image with default classic plating method', {
        dishId,
        dishName: dish.dish_name,
        ingredientCount: ingredientNames.length,
      });
    }

    // Generate images
    logger.dev('[Dish Image Generation] Starting image generation:', {
      dishId,
      dishName: dish.dish_name,
      methodsToGenerate,
      ingredientCount: ingredientNames.length,
    });

    let imageResults: Record<string, AIResponse<FoodImageResult>>;
    try {
      imageResults = await generateFoodImagesForMethods(
        dish.dish_name || 'Dish',
        ingredientNames,
        methodsToGenerate,
      );
    } catch (genError) {
      logger.error('[Dish Image Generation] Image generation failed:', {
        error: genError instanceof Error ? genError.message : String(genError),
        dishId,
        dishName: dish.dish_name,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          genError instanceof Error ? genError.message : 'Failed to generate images',
          'IMAGE_GENERATION_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    // Extract results for each method (with fallbacks for methods not generated)
    const classic = imageResults.classic || { content: { imageUrl: '' }, error: 'Not generated' };
    const modern = imageResults.modern || { content: { imageUrl: '' }, error: 'Not generated' };
    const rustic = imageResults.rustic || { content: { imageUrl: '' }, error: 'Not generated' };
    const minimalist = imageResults.minimalist || { content: { imageUrl: '' }, error: 'Not generated' };

    // Check if any images failed
    const hasErrors = Object.values(imageResults).some(result => result.error);
    if (hasErrors) {
      const errorMessages = Object.entries(imageResults)
        .map(([method, result]) => result.error && `${method}: ${result.error}`)
        .filter(Boolean);
      logger.error('[Dish Image Generation] Some images failed to generate:', {
        dishId,
        errors: errorMessages,
      });
      // Continue anyway - we'll upload what we can
    }

    // Upload images to Supabase Storage and get public URLs
    const updateData: {
      image_url?: string;
      image_url_alternative?: string;
      image_url_modern?: string;
      image_url_minimalist?: string;
    } = {};

    try {
      if (classic.content?.imageUrl) {
        const publicUrl = await uploadImageToStorage(
          classic.content.imageUrl,
          `dish-${dishId}-classic`,
        );
        updateData.image_url = publicUrl;
      }
      if (modern.content?.imageUrl) {
        const publicUrl = await uploadImageToStorage(
          modern.content.imageUrl,
          `dish-${dishId}-modern`,
        );
        updateData.image_url_modern = publicUrl;
      }
      if (rustic.content?.imageUrl) {
        const publicUrl = await uploadImageToStorage(
          rustic.content.imageUrl,
          `dish-${dishId}-rustic`,
        );
        updateData.image_url_alternative = publicUrl;
      }
      if (minimalist.content?.imageUrl) {
        const publicUrl = await uploadImageToStorage(
          minimalist.content.imageUrl,
          `dish-${dishId}-minimalist`,
        );
        updateData.image_url_minimalist = publicUrl;
      }
    } catch (uploadError) {
      logger.error('[Dish Image Generation] Failed to upload images to storage:', {
        error: uploadError instanceof Error ? uploadError.message : String(uploadError),
        dishId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to upload images', 'STORAGE_ERROR', 500),
        { status: 500 },
      );
    }

    // Store public URLs in database
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('dishes')
        .update(updateData)
        .eq('id', dishId);

      if (updateError) {
        logger.error('[Dish Image Generation] Failed to save image URLs to database:', {
          error: updateError.message,
          dishId,
        });
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Images uploaded but failed to save URLs to database',
            'DATABASE_ERROR',
            500,
          ),
          { status: 500 },
        );
      }
    }

    logger.dev('[Dish Image Generation] Successfully generated and uploaded images', {
      dishId,
      hasClassic: !!updateData.image_url,
      hasModern: !!updateData.image_url_modern,
      hasRustic: !!updateData.image_url_alternative,
      hasMinimalist: !!updateData.image_url_minimalist,
    });

    return NextResponse.json({
      success: true,
      classic: updateData.image_url || null,
      modern: updateData.image_url_modern || null,
      rustic: updateData.image_url_alternative || null,
      minimalist: updateData.image_url_minimalist || null,
      // Legacy aliases for backward compatibility
      imageUrl: updateData.image_url || null,
      imageUrlAlternative: updateData.image_url_alternative || null,
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
