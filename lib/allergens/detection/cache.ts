import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { consolidateAllergens } from '../australian-allergens';
import type { AIAllergenDetectionResult } from './types';

/**
 * Check ingredient composition cache
 */
export async function getCachedComposition(
  ingredientName: string,
  brand?: string,
): Promise<AIAllergenDetectionResult | null> {
  if (!supabaseAdmin) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from('ingredient_composition_cache')
      .select('detected_allergens, composition, expires_at')
      .eq('ingredient_name', ingredientName)
      .eq('brand', brand || null)
      .single();

    if (error) {
      logger.error('[allergens/ai-allergen-detection] Database error:', {
        error: error.message,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    if (error || !data) {
      return null;
    }

    // Check if cache is expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      // Cache expired, delete it
      await supabaseAdmin
        .from('ingredient_composition_cache')
        .delete()
        .eq('ingredient_name', ingredientName)
        .eq('brand', brand || null);
      return null;
    }

    const cachedAllergens = (data.detected_allergens as string[]) || [];
    return {
      allergens: consolidateAllergens(cachedAllergens),
      composition: data.composition || undefined,
      confidence: 'high',
      cached: true,
    };
  } catch (err) {
    logger.error('[AI Allergen Detection] Error checking cache:', err);
    return null;
  }
}

/**
 * Cache ingredient composition and detected allergens
 */
export async function cacheComposition(
  ingredientName: string,
  brand: string | null,
  allergens: string[],
  composition?: string,
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // 90 days TTL

    await supabaseAdmin.from('ingredient_composition_cache').upsert(
      {
        ingredient_name: ingredientName,
        brand: brand || null,
        detected_allergens: allergens,
        composition: composition || null,
        detected_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      {
        onConflict: 'ingredient_name,brand',
      },
    );
  } catch (err) {
    logger.error('[AI Allergen Detection] Error caching composition:', err);
  }
}
