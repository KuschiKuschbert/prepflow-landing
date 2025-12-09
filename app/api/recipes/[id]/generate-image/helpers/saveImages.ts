/**
 * Upload and save recipe images to storage and database
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImageToStorage } from '@/lib/storage/upload-image';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { AIResponse } from '@/lib/ai/types';
import type { FoodImageResult } from '@/lib/ai/ai-service/image-generation';
import type { RecipeData } from './fetchRecipe';

export interface ImageUpdateData {
  image_url?: string;
  image_url_alternative?: string;
  image_url_modern?: string;
  image_url_minimalist?: string;
  plating_methods_images?: Record<string, string>;
}

export async function saveRecipeImages(
  recipeId: string,
  recipe: RecipeData,
  imageResults: Record<string, AIResponse<FoodImageResult>>,
): Promise<NextResponse | ImageUpdateData> {
  const updateData: ImageUpdateData = {};
  const existingPlatingImages = (recipe.plating_methods_images as Record<string, string>) || {};

  try {
    for (const [method, result] of Object.entries(imageResults)) {
      if (!result.content?.imageUrl) continue;

      const publicUrl = await uploadImageToStorage(
        result.content.imageUrl,
        `recipe-${recipeId}-${method}`,
      );

      if (method === 'classic') {
        updateData.image_url = publicUrl;
      } else if (method === 'modern') {
        updateData.image_url_modern = publicUrl;
      } else if (method === 'rustic') {
        updateData.image_url_alternative = publicUrl;
      } else if (method === 'minimalist') {
        updateData.image_url_minimalist = publicUrl;
      } else {
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

  if (Object.keys(updateData).length > 0) {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

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
    hasClassic: !!updateData.image_url,
    hasModern: !!updateData.image_url_modern,
    hasRustic: !!updateData.image_url_alternative,
    hasMinimalist: !!updateData.image_url_minimalist,
    additionalMethodsCount: Object.keys(updateData.plating_methods_images || {}).length,
  });

  return updateData;
}
