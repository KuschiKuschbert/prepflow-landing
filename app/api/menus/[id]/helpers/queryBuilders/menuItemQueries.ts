/**
 * Query builders for menu items with progressive fallback
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

/** Query with all columns (pricing + dietary/allergen + description) */
export function buildFullQuery(menuId: string) {
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
    )
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}
/** Query without pricing columns (but with dietary/allergen) */
export function buildQueryWithoutPricing(menuId: string) {
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
    )
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}
/** Query without dietary/allergen columns (but with pricing) */
export function buildQueryWithoutDietary(menuId: string) {
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
    )
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}
/** Query without description (but with pricing and dietary) */
export function buildQueryWithoutDescription(menuId: string) {
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
    )
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}
/** Minimal query (no pricing, no dietary, no description) */
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

/** Query without relationships (just menu_items columns) */
export function buildQueryWithoutRelations(menuId: string) {
  ensureSupabaseAdmin();
  return supabaseAdmin!
    .from('menu_items')
    .select('id, dish_id, recipe_id, category, position, region')
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}
/** Essential query (only essential columns, no ordering) */
export function buildEssentialQuery(menuId: string) {
  ensureSupabaseAdmin();
  return supabaseAdmin!.from('menu_items').select('id, dish_id, recipe_id').eq('menu_id', menuId);
}
