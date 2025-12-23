import { supabaseAdmin } from './supabase';
import { logger } from './logger';
import type { TierSlug } from './tier-config';
import { getDefaultTierConfig } from './tier-config';

export interface UsageData {
  recipes: number;
  ingredients: number;
  dishes: number;
}

/**
 * Get current usage for a user.
 */
export async function getUsage(userEmail: string): Promise<UsageData> {
  if (!supabaseAdmin) {
    return { recipes: 0, ingredients: 0, dishes: 0 };
  }

  try {
    // Count recipes
    const { count: recipesCount, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    // Count ingredients
    const { count: ingredientsCount, error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .select('*', { count: 'exact', head: true });

    // Count dishes
    const { count: dishesCount, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select('*', { count: 'exact', head: true });

    if (recipesError || ingredientsError || dishesError) {
      logger.warn('[Usage Tracker] Error fetching usage counts:', {
        recipesError: recipesError?.message,
        ingredientsError: ingredientsError?.message,
        dishesError: dishesError?.message,
        userEmail,
      });
    }

    return {
      recipes: recipesCount || 0,
      ingredients: ingredientsCount || 0,
      dishes: dishesCount || 0,
    };
  } catch (error) {
    logger.warn('[Usage Tracker] Error fetching usage:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return { recipes: 0, ingredients: 0, dishes: 0 };
  }
}

/**
 * Check if user has reached limit for a resource type.
 */
export async function checkLimit(
  userEmail: string,
  resourceType: 'recipes' | 'ingredients',
): Promise<{ atLimit: boolean; used: number; limit: number | null }> {
  if (!supabaseAdmin) {
    return { atLimit: false, used: 0, limit: null };
  }

  try {
    // Get user tier
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('subscription_tier')
      .eq('email', userEmail)
      .maybeSingle();

    if (userError) {
      logger.warn('[Usage Tracker] Error fetching user tier:', {
        error: userError.message,
        userEmail,
      });
    }

    const tier = (userData?.subscription_tier as TierSlug) || 'starter';
    const config = getDefaultTierConfig(tier);
    const limit = config.limits?.[resourceType] ?? null;

    // Get current usage
    const usage = await getUsage(userEmail);
    const used = resourceType === 'recipes' ? usage.recipes : usage.ingredients;

    return {
      atLimit: limit !== null && used >= limit,
      used,
      limit,
    };
  } catch (error) {
    logger.warn('[Usage Tracker] Error checking limit:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
      resourceType,
    });
    return { atLimit: false, used: 0, limit: null };
  }
}
