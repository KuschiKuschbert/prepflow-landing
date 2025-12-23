/**
 * Helper for building ingredient query for allergen detection
 */

import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Builds query for ingredients missing allergens
 *
 * @param {string[] | null} ingredientIds - Optional ingredient IDs to filter by
 * @param {boolean} force - Whether to force re-detection (ignore manual allergens)
 * @returns {any} Supabase query builder
 */
export function buildIngredientQuery(ingredientIds: string[] | null, force: boolean) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  let query = supabaseAdmin
    .from('ingredients')
    .select('id, ingredient_name, brand, allergens, allergen_source');

  // Filter: ingredients without allergens OR with empty allergens array
  // OR force=true to re-detect all (except manually set ones)
  if (!force) {
    // Find ingredients where allergens is null, empty array, or doesn't exist
    query = query.or('allergens.is.null,allergens.eq.[]');
  } else {
    // When forcing, exclude manually set allergens
    // Find ingredients where allergen_source.manual is null or false
    query = query.or('allergen_source->>manual.is.null,allergen_source->>manual.eq.false');
  }

  // If specific ingredient IDs provided, filter by them
  if (ingredientIds && Array.isArray(ingredientIds) && ingredientIds.length > 0) {
    query = query.in('id', ingredientIds);
  }

  return query;
}




