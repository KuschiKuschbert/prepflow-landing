/**
 * Recipe Image Generation API Endpoint
 * POST /api/recipes/[id]/generate-image
 *
 * Generates photorealistic food images for a recipe based on its name and ingredients.
 * By default, generates 1 image with the 'classic' plating method.
 * Users can optionally specify multiple plating methods in the request body.
 */

import {
  generateFoodImages,
  generateFoodImagesForMethods,
  type PlatingMethod,
  type FoodImageResult,
} from '@/lib/ai/ai-service/image-generation';
import type { AIResponse } from '@/lib/ai/types';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImageToStorage } from '@/lib/storage/upload-image';
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
    const recipeId = id;

    // Parse request body to get optional platingMethods array
    let selectedPlatingMethods: PlatingMethod[] | undefined;
    try {
      const body = await req.json().catch(() => ({}));
      if (
        body.platingMethods &&
        Array.isArray(body.platingMethods) &&
        body.platingMethods.length > 0
      ) {
        // Validate and cast plating methods to ensure type safety
        selectedPlatingMethods = body.platingMethods.filter(
          (method: string): method is PlatingMethod => {
            const validMethods: PlatingMethod[] = [
              'classic',
              'modern',
              'rustic',
              'minimalist',
              'landscape',
              'futuristic',
              'hide_and_seek',
              'super_bowl',
              'bathing',
              'deconstructed',
              'stacking',
              'brush_stroke',
              'free_form',
            ];
            return validMethods.includes(method as PlatingMethod);
          },
        );

        logger.dev('[Recipe Image Generation] Parsed plating methods from request:', {
          raw: body.platingMethods,
          validated: selectedPlatingMethods,
          recipeId,
        });
      }
    } catch (error) {
      // Body is optional, continue with default behavior
      logger.dev('[Recipe Image Generation] Failed to parse request body:', {
        error: error instanceof Error ? error.message : String(error),
        recipeId,
      });
    }

    if (!recipeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check authentication using getToken (more reliable for API routes)
    let token;
    try {
      token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    } catch (tokenError) {
      logger.error('[Recipe Image Generation] Error getting token:', {
        error: tokenError instanceof Error ? tokenError.message : String(tokenError),
        recipeId,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      });
      // In development, allow requests to continue for testing
      if (process.env.NODE_ENV === 'development') {
        token = null; // Will use fallback userId
      } else {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
          { status: 401 },
        );
      }
    }

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      logger.dev('[Recipe Image Generation] Auth check:', {
        hasToken: !!token,
        tokenEmail: token?.email,
        tokenSub: token?.sub,
        cookies: req.headers.get('cookie') ? 'present' : 'missing',
      });
    }

    // Get userId from token (email or sub), with fallback for development
    const userId =
      token?.email || token?.sub || (process.env.NODE_ENV === 'development' ? 'dev-user' : null);

    if (!userId && process.env.NODE_ENV === 'production') {
      logger.warn('[Recipe Image Generation] Unauthorized attempt:', {
        recipeId,
        hasToken: !!token,
        cookies: req.headers.get('cookie') ? 'present' : 'missing',
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    // Check rate limit (use 'anonymous' as fallback for development)
    if (!checkRateLimit(userId || 'anonymous')) {
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
      logger.error('[Recipe Image Generation] AI not enabled - missing HUGGINGFACE_API_KEY');
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

    // Fetch recipe with ingredients
    // Note: Column name is 'name' (migration to 'recipe_name' may not have been applied)
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select(
        'id, name, description, instructions, image_url, image_url_alternative, image_url_modern, image_url_minimalist, plating_methods_images',
      )
      .eq('id', recipeId)
      .single();

    if (recipeError || !recipe) {
      logger.error('[Recipe Image Generation] Failed to fetch recipe:', {
        error: recipeError?.message,
        recipeId,
      });
      return NextResponse.json(ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Check if images already exist - allow regeneration by not returning early
    // Users can regenerate images by clicking the regenerate button
    const hasExistingImages = !!(
      recipe.image_url ||
      recipe.image_url_alternative ||
      recipe.image_url_modern ||
      recipe.image_url_minimalist
    );
    if (hasExistingImages) {
      logger.dev('[Recipe Image Generation] Existing images found, will regenerate', {
        recipeId,
        hasClassic: !!recipe.image_url,
        hasRustic: !!recipe.image_url_alternative,
        hasModern: !!recipe.image_url_modern,
        hasMinimalist: !!recipe.image_url_minimalist,
      });
    }

    // Fetch recipe ingredients
    const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        quantity,
        unit,
        ingredients (
          ingredient_name
        )
      `,
      )
      .eq('recipe_id', recipeId);

    if (ingredientsError) {
      logger.error('[Recipe Image Generation] Failed to fetch ingredients:', {
        error: ingredientsError.message,
        recipeId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipe ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Extract ingredient names
    const ingredientNames: string[] = [];
    if (recipeIngredients && Array.isArray(recipeIngredients)) {
      recipeIngredients.forEach(ri => {
        const ingredient = ri.ingredients;
        if (ingredient && typeof ingredient === 'object' && 'ingredient_name' in ingredient) {
          const name = (ingredient as { ingredient_name: string }).ingredient_name;
          if (name && !ingredientNames.includes(name)) {
            ingredientNames.push(name);
          }
        }
      });
    }

    if (ingredientNames.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Recipe has no ingredients. Add ingredients before generating images.',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Get recipe name (database uses 'name' column)
    const recipeName = (recipe as any).name || 'Recipe';

    // Determine which plating methods to generate
    const defaultMethod: PlatingMethod[] = ['classic']; // Default: generate only one image
    const additionalMethods: PlatingMethod[] = [
      'modern',
      'rustic',
      'minimalist',
      'landscape',
      'futuristic',
      'hide_and_seek',
      'super_bowl',
      'bathing',
      'deconstructed',
      'stacking',
      'brush_stroke',
      'free_form',
    ];

    let methodsToGenerate: PlatingMethod[];
    if (selectedPlatingMethods && selectedPlatingMethods.length > 0) {
      // User selected specific methods
      methodsToGenerate = selectedPlatingMethods;
      logger.dev('[Recipe Image Generation] Generating images for selected plating methods', {
        recipeId,
        recipeName,
        methods: methodsToGenerate,
        ingredientCount: ingredientNames.length,
      });
    } else {
      // Default: generate only one image (classic method)
      methodsToGenerate = defaultMethod;
      logger.dev('[Recipe Image Generation] Generating single image with classic plating method', {
        recipeId,
        recipeName,
        ingredientCount: ingredientNames.length,
      });
    }

    // Generate images for selected methods
    logger.dev('[Recipe Image Generation] Starting image generation:', {
      recipeId,
      recipeName,
      methodsToGenerate,
      ingredientCount: ingredientNames.length,
    });

    let imageResults: Record<string, AIResponse<FoodImageResult>>;
    try {
      // Get recipe instructions for image generation
      const recipeInstructions = (recipe as any).instructions || null;
      logger.dev('[Recipe Image Generation] Recipe instructions:', {
        recipeId,
        hasInstructions: !!recipeInstructions,
        instructionLength: recipeInstructions?.length || 0,
      });

      imageResults = await generateFoodImagesForMethods(
        recipeName,
        ingredientNames,
        methodsToGenerate,
        {},
        recipeInstructions,
      );
    } catch (genError) {
      logger.error('[Recipe Image Generation] Image generation threw error:', {
        error: genError instanceof Error ? genError.message : String(genError),
        stack: genError instanceof Error ? genError.stack : undefined,
        recipeId,
        recipeName,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          `Failed to generate images: ${genError instanceof Error ? genError.message : String(genError)}`,
          'AI_SERVICE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    // Check for errors - log but continue with successful images
    const errors: string[] = [];
    const successfulMethods: string[] = [];
    for (const [method, result] of Object.entries(imageResults)) {
      if (result.error) {
        errors.push(`${method}: ${result.error}`);
        logger.error(`[Recipe Image Generation] Failed to generate ${method} image:`, {
          error: result.error,
          recipeId,
          method,
        });
      } else if (result.content?.imageUrl) {
        successfulMethods.push(method);
      }
    }

    logger.dev('[Recipe Image Generation] Generation results:', {
      recipeId,
      successfulMethods,
      errors,
      totalMethods: methodsToGenerate.length,
    });

    if (errors.length > 0) {
      logger.warn('[Recipe Image Generation] Some images failed to generate:', {
        recipeId,
        errors,
        successfulMethods,
      });
      // Continue if at least one image was generated successfully
      if (errors.length === methodsToGenerate.length) {
        const errorMessage =
          errors.length === 1
            ? `Failed to generate image: ${errors[0]}`
            : `Failed to generate all images. Errors: ${errors.join('; ')}`;
        return NextResponse.json(
          ApiErrorHandler.createError(errorMessage, 'AI_SERVICE_ERROR', 500),
          { status: 500 },
        );
      }
    }

    // Upload images to Supabase Storage and get public URLs
    const updateData: {
      image_url?: string;
      image_url_alternative?: string;
      image_url_modern?: string;
      image_url_minimalist?: string;
      plating_methods_images?: Record<string, string>;
    } = {};

    // Get existing plating_methods_images JSON or initialize empty object
    const existingPlatingImages = (recipe.plating_methods_images as Record<string, string>) || {};

    try {
      // Process each generated image
      for (const [method, result] of Object.entries(imageResults)) {
        if (!result.content?.imageUrl) continue;

        const publicUrl = await uploadImageToStorage(
          result.content.imageUrl,
          `recipe-${recipeId}-${method}`,
        );

        // Store in appropriate column based on method type
        if (method === 'classic') {
          updateData.image_url = publicUrl;
        } else if (method === 'modern') {
          updateData.image_url_modern = publicUrl;
        } else if (method === 'rustic') {
          updateData.image_url_alternative = publicUrl;
        } else if (method === 'minimalist') {
          updateData.image_url_minimalist = publicUrl;
        } else {
          // Store additional methods in JSON column
          if (!updateData.plating_methods_images) {
            updateData.plating_methods_images = { ...existingPlatingImages };
          }
          updateData.plating_methods_images[method] = publicUrl;
        }
      }
    } catch (uploadError) {
      logger.error('[Recipe Image Generation] Failed to upload images to storage:', {
        error: uploadError instanceof Error ? uploadError.message : String(uploadError),
        recipeId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          uploadError instanceof Error ? uploadError.message : 'Failed to upload images to storage',
          'STORAGE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    // Store public URLs in database
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('recipes')
        .update(updateData)
        .eq('id', recipeId);

      if (updateError) {
        logger.error('[Recipe Image Generation] Failed to save image URLs to database:', {
          error: updateError.message,
          recipeId,
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

    logger.dev('[Recipe Image Generation] Successfully generated and uploaded images', {
      recipeId,
      methodsGenerated: methodsToGenerate,
      hasClassic: !!updateData.image_url,
      hasModern: !!updateData.image_url_modern,
      hasRustic: !!updateData.image_url_alternative,
      hasMinimalist: !!updateData.image_url_minimalist,
      additionalMethodsCount: Object.keys(updateData.plating_methods_images || {}).length,
    });

    // Build response with all generated images
    const response: Record<string, string | null | boolean> = {
      success: true,
      classic: updateData.image_url || null,
      modern: updateData.image_url_modern || null,
      rustic: updateData.image_url_alternative || null,
      minimalist: updateData.image_url_minimalist || null,
      // Legacy aliases for backward compatibility
      imageUrl: updateData.image_url || null,
      imageUrlAlternative: updateData.image_url_alternative || null,
    };

    // Add additional plating method images to response
    if (updateData.plating_methods_images) {
      for (const [method, url] of Object.entries(updateData.plating_methods_images)) {
        response[method] = url;
      }
    }

    return NextResponse.json(response);
  } catch (err) {
    logger.error('[Recipe Image Generation] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]/generate-image', method: 'POST' },
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
