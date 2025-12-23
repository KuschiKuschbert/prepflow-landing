/**
 * Upload images to storage and save URLs to database
 */

import type { AIResponse } from '@/lib/ai/types';
import type { FoodImageResult } from '@/lib/ai/ai-service/image-generation';
import { logger } from '@/lib/logger';
import { uploadImageToStorage } from '@/lib/storage/upload-image';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Upload images to storage and update database
 *
 * @param {string} dishId - Dish ID
 * @param {Record<string, AIResponse<FoodImageResult>>} imageResults - Generated image results
 * @returns {Promise<{generatedImages: Record<string, string | null>, updateData: Record<string, string>}>} Uploaded image URLs and database update data
 */
export async function uploadAndSaveImages(
  dishId: string,
  imageResults: Record<string, AIResponse<FoodImageResult>>,
): Promise<{
  generatedImages: Record<string, string | null>;
  updateData: Record<string, string>;
}> {
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
  const generatedImages: Record<string, string | null> = {};

  try {
    // Upload all generated images and store URLs
    for (const [method, result] of Object.entries(imageResults)) {
      if (result.content?.imageUrl) {
        const publicUrl = await uploadImageToStorage(
          result.content.imageUrl,
          `dish-${dishId}-${method}`,
        );
        generatedImages[method] = publicUrl;

        // Map to database columns for backward compatibility
        if (method === 'classic') {
          updateData.image_url = publicUrl;
        } else if (method === 'modern') {
          updateData.image_url_modern = publicUrl;
        } else if (method === 'rustic') {
          updateData.image_url_alternative = publicUrl;
        } else if (method === 'minimalist') {
          updateData.image_url_minimalist = publicUrl;
        }
      } else {
        generatedImages[method] = null;
      }
    }
  } catch (uploadError) {
    logger.error('[Dish Image Generation] Failed to upload images to storage:', {
      error: uploadError instanceof Error ? uploadError.message : String(uploadError),
      dishId,
    });
    throw ApiErrorHandler.createError('Failed to upload images', 'DATABASE_ERROR', 500);
  }

  // Store public URLs in database
  if (Object.keys(updateData).length > 0) {
    if (!supabaseAdmin) {
      throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
    }
    const { error: updateError } = await supabaseAdmin
      .from('dishes')
      .update(updateData)
      .eq('id', dishId);

    if (updateError) {
      logger.error('[Dish Image Generation] Failed to save image URLs to database:', {
        error: updateError.message,
        dishId,
      });
      throw ApiErrorHandler.createError(
        'Images uploaded but failed to save URLs to database',
        'DATABASE_ERROR',
        500,
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

  return { generatedImages, updateData };
}
