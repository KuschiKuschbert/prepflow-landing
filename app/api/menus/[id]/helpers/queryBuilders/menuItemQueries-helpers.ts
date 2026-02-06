/**
 * Helper functions for menu item queries
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import {
  DISH_FIELDS_FULL,
  DISH_FIELDS_MINIMAL,
  DISH_FIELDS_NO_DIETARY,
  MENU_ITEM_BASE_FIELDS,
  MENU_ITEM_PRICING_FIELDS,
  RECIPE_FIELDS_FULL,
  RECIPE_FIELDS_MINIMAL,
  RECIPE_FIELDS_NO_DIETARY,
} from './constants';

function ensureSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError(
      'Supabase admin client not initialized',
      'DATABASE_ERROR',
      500,
    );
  }
}

export function buildFullQuery(menuId: string) {
  ensureSupabaseAdmin();
  const selectQuery = `
    ${MENU_ITEM_BASE_FIELDS},
    ${MENU_ITEM_PRICING_FIELDS},
    dishes (${DISH_FIELDS_FULL}),
    recipes (${RECIPE_FIELDS_FULL})
  `;

  return supabaseAdmin!
    .from('menu_items')
    .select(selectQuery)
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}

export function buildQueryWithoutPricing(menuId: string) {
  ensureSupabaseAdmin();
  const selectQuery = `
    ${MENU_ITEM_BASE_FIELDS},
    dishes (${DISH_FIELDS_FULL}),
    recipes (${RECIPE_FIELDS_FULL})
  `;

  return supabaseAdmin!
    .from('menu_items')
    .select(selectQuery)
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}

export function buildQueryWithoutDietary(menuId: string) {
  ensureSupabaseAdmin();
  const selectQuery = `
    ${MENU_ITEM_BASE_FIELDS},
    ${MENU_ITEM_PRICING_FIELDS},
    dishes (${DISH_FIELDS_NO_DIETARY}),
    recipes (${RECIPE_FIELDS_NO_DIETARY})
  `;

  return supabaseAdmin!
    .from('menu_items')
    .select(selectQuery)
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}

export function buildQueryWithoutDescription(menuId: string) {
  ensureSupabaseAdmin();
  const selectQuery = `
    ${MENU_ITEM_BASE_FIELDS},
    ${MENU_ITEM_PRICING_FIELDS},
    dishes (${DISH_FIELDS_MINIMAL}),
    recipes (${RECIPE_FIELDS_MINIMAL})
  `;

  return supabaseAdmin!
    .from('menu_items')
    .select(selectQuery)
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}

export function buildMinimalQuery(menuId: string) {
  ensureSupabaseAdmin();
  const selectQuery = `
    ${MENU_ITEM_BASE_FIELDS},
    dishes (${DISH_FIELDS_MINIMAL}),
    recipes (${RECIPE_FIELDS_MINIMAL})
  `;

  return supabaseAdmin!.from('menu_items').select(selectQuery).eq('menu_id', menuId);
}

export function buildQueryWithoutRelations(menuId: string) {
  ensureSupabaseAdmin();

  return supabaseAdmin!
    .from('menu_items')
    .select('id, dish_id, recipe_id, category, position')
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}

export function buildEssentialQuery(menuId: string) {
  ensureSupabaseAdmin();

  return supabaseAdmin!.from('menu_items').select('id, dish_id, recipe_id').eq('menu_id', menuId);
}
