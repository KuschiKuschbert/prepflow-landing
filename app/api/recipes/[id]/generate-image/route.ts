/**
 * Recipe Image Generation API Endpoint
 * POST /api/recipes/[id]/generate-image
 *
 * Generates photorealistic food images for a recipe based on its name and ingredients.
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
    const recipeId = id;

    if (!recipeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check authentication using getToken (more reliable for API routes)
    let token;
    try {
      token = await getToken({ req: _req, secret: process.env.NEXTAUTH_SECRET });
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
        cookies: _req.headers.get('cookie') ? 'present' : 'missing',
      });
    }

    // Get userId from token (email or sub), with fallback for development
    const userId = token?.email || token?.sub || (process.env.NODE_ENV === 'development' ? 'dev-user' : null);

    if (!userId && process.env.NODE_ENV === 'production') {
      logger.warn('[Recipe Image Generation] Unauthorized attempt:', {
        recipeId,
        hasToken: !!token,
        cookies: _req.headers.get('cookie') ? 'present' : 'missing',
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

    // Fetch recipe with ingredients
    // Note: Column name is 'name', not 'recipe_name' (database uses 'name')
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select('id, name, description, image_url, image_url_alternative')
      .eq('id', recipeId)
      .single();

    if (recipeError || !recipe) {
      logger.error('[Recipe Image Generation] Failed to fetch recipe:', {
        error: recipeError?.message,
        recipeId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Check if images already exist - allow regeneration by not returning early
    // Users can regenerate images by clicking the regenerate button
    const hasExistingImages = !!(recipe.image_url && recipe.image_url_alternative);
    if (hasExistingImages) {
      logger.dev('[Recipe Image Generation] Existing images found, will regenerate', {
        recipeId,
        hasPrimary: !!recipe.image_url,
        hasAlternative: !!recipe.image_url_alternative,
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

    // Generate images
    logger.dev('[Recipe Image Generation] Generating images', {
      recipeId,
      recipeName,
      ingredientCount: ingredientNames.length,
    });

    const { primary, alternative } = await generateFoodImages(recipeName, ingredientNames);

    if (primary.error || alternative.error) {
      const errorMessage = primary.error || alternative.error || 'Failed to generate images';
      logger.error('[Recipe Image Generation] Image generation failed:', {
        recipeId,
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
        .from('recipes')
        .update(updateData)
        .eq('id', recipeId);

      if (updateError) {
        logger.error('[Recipe Image Generation] Failed to save images to database:', {
          error: updateError.message,
          recipeId,
        });
        // Don't fail the request - images were generated, just not saved
        // Return the images anyway
      }
    }

    logger.dev('[Recipe Image Generation] Successfully generated images', {
      recipeId,
      hasPrimary: !!primary.content?.imageUrl,
      hasAlternative: !!alternative.content?.imageUrl,
    });

    return NextResponse.json({
      success: true,
      imageUrl: primary.content?.imageUrl || null,
      imageUrlAlternative: alternative.content?.imageUrl || null,
    });
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
