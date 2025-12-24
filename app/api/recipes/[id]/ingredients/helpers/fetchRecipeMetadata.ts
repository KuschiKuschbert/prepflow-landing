import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { getUserEmail } from '@/lib/auth0-api-helpers';
import { NextRequest } from 'next/server';

/**
 * Fetch recipe metadata for change tracking
 */
export async function fetchRecipeMetadata(
  request: NextRequest,
  recipeId: string,
): Promise<{
  userEmail: string | null;
  recipeName: string | null;
}> {
  let userEmail: string | null = null;
  try {
    userEmail = await getUserEmail(request);
  } catch (tokenError) {
    logger.warn('[Recipes API] Could not get user email for change tracking:', tokenError);
  }

  let recipeName: string | null = null;
  try {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .select('recipe_name')
        .eq('id', recipeId)
        .single();
      if (error) {
        logger.error('[Recipes API] Error fetching recipe name for change tracking:', {
          error: error.message,
          recipeId,
          context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'fetchRecipeMetadata' },
        });
      }
      recipeName = data?.recipe_name || null;
    }
  } catch (err) {
    logger.warn('[Recipes API] Could not fetch recipe name for change tracking:', err);
  }

  return { userEmail, recipeName };
}
