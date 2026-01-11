/**
 * Helper functions for menu item queries
 */

import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';

function ensureSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError(
      'Supabase admin client not initialized',
      'DATABASE_ERROR',
      500,
    );
  }
}

function buildBaseQuery(menuId: string) {
  ensureSupabaseAdmin();
  return supabaseAdmin!
    .from('menu_items')
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}

export function buildFullQuery(menuId: string) {
  return buildBaseQuery(menuId).select(
    `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      region,
      actual_selling_price,
      recommended_selling_price,
      dishes (
        id,
        dish_name,
        description,
        selling_price,
        allergens,
        is_vegetarian,
        is_vegan,
        dietary_confidence,
        dietary_method
      ),
      recipes (
        id,
        name,
        description,
        yield,
        allergens,
        is_vegetarian,
        is_vegan,
        dietary_confidence,
        dietary_method
      )
    `,
  );
}

export function buildQueryWithoutPricing(menuId: string) {
  return buildBaseQuery(menuId).select(
    `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      region,
      dishes (
        id,
        dish_name,
        description,
        selling_price,
        allergens,
        is_vegetarian,
        is_vegan,
        dietary_confidence,
        dietary_method
      ),
      recipes (
        id,
        name,
        description,
        yield,
        allergens,
        is_vegetarian,
        is_vegan,
        dietary_confidence,
        dietary_method
      )
    `,
  );
}

export function buildQueryWithoutDietary(menuId: string) {
  return buildBaseQuery(menuId).select(
    `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      region,
      actual_selling_price,
      recommended_selling_price,
      dishes (
        id,
        dish_name,
        description,
        selling_price
      ),
      recipes (
        id,
        name,
        description,
        yield
      )
    `,
  );
}

export function buildQueryWithoutDescription(menuId: string) {
  return buildBaseQuery(menuId).select(
    `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      region,
      actual_selling_price,
      recommended_selling_price,
      dishes (
        id,
        dish_name,
        selling_price
      ),
      recipes (
        id,
        recipe_name,
        yield
      )
    `,
  );
}

export function buildMinimalQuery(menuId: string) {
  ensureSupabaseAdmin();
  return supabaseAdmin!
    .from('menu_items')
    .select(
      `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      region,
      dishes (
        id,
        dish_name,
        selling_price
      ),
      recipes (
        id,
        recipe_name,
        yield
      )
    `,
    )
    .eq('menu_id', menuId);
}

export function buildQueryWithoutRelations(menuId: string) {
  return buildBaseQuery(menuId).select('id, dish_id, recipe_id, category, position, region');
}

export function buildEssentialQuery(menuId: string) {
  ensureSupabaseAdmin();
  return supabaseAdmin!.from('menu_items').select('id, dish_id, recipe_id').eq('menu_id', menuId);
}
