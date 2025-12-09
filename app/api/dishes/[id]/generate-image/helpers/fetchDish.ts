/**
 * Fetch and validate dish data
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface DishData {
  id: string;
  dish_name: string | null;
  description: string | null;
  image_url: string | null;
  image_url_alternative: string | null;
  image_url_modern: string | null;
  image_url_minimalist: string | null;
}

/**
 * Fetch dish from database
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<{dish: DishData} | NextResponse>} Dish data or error response
 */
export async function fetchDish(dishId: string): Promise<{ dish: DishData } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }
  const { data: dish, error: dishError } = await supabaseAdmin
    .from('dishes')
    .select(
      'id, dish_name, description, image_url, image_url_alternative, image_url_modern, image_url_minimalist',
    )
    .eq('id', dishId)
    .single();

  if (dishError || !dish) {
    logger.error('[Dish Image Generation] Failed to fetch dish:', {
      error: dishError?.message,
      dishId,
    });
    return NextResponse.json(ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { dish };
}

/**
 * Check if dish already has all images and return cached response
 *
 * @param {DishData} dish - Dish data
 * @param {string} dishId - Dish ID for logging
 * @returns {NextResponse | null} Cached response if images exist, null if generation needed
 */
export function checkExistingImages(dish: DishData, dishId: string): NextResponse | null {
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

  return null;
}
