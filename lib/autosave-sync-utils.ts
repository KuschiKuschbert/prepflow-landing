/**
 * Autosave Sync Utilities
 * Helper functions for autosave sync operations
 */

import { supabase } from './supabase';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from './text-utils';

export type EntityType =
  | 'ingredients'
  | 'recipes'
  | 'recipes_ingredients'
  | 'menu_dishes'
  | 'suppliers'
  | 'supplier_price_lists'
  | 'compliance_records'
  | 'compliance_types'
  | 'order_lists'
  | 'prep_lists'
  | 'dish_sections'
  | 'temperature_equipment'
  | 'temperature_logs'
  | 'cleaning_tasks'
  | 'cleaning_areas'
  | 'par_levels'
  | 'equipment_maintenance';

/**
 * Extract detailed error message from Supabase error
 */
export function extractSupabaseErrorMessage(error: unknown, defaultMessage: string): string {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    if (err.message) {
      let msg = String(err.message);
      if (err.details && String(err.details).trim() && err.details !== err.message) {
        msg += `: ${err.details}`;
      }
      if (err.hint && String(err.hint).trim() && err.hint !== err.details) {
        msg += ` (${err.hint})`;
      }
      return msg;
    }
    if (err.details) return String(err.details);
    if (err.hint) return String(err.hint);
    if ('code' in err && err.code) return `Database error (${String(err.code)})`;
  }
  if (error instanceof Error) return error.message || defaultMessage;
  if (typeof error === 'string') return error;
  return defaultMessage;
}

/**
 * Format data based on entity type
 */
export function formatEntityData(
  entityType: EntityType,
  data: Record<string, unknown>,
): Record<string, unknown> {
  let formattedData = { ...data };

  if (entityType === 'ingredients') {
    if (formattedData.ingredient_name) {
      formattedData.ingredient_name = formatIngredientName(String(formattedData.ingredient_name));
    }
    if (formattedData.brand) {
      formattedData.brand = formatBrandName(String(formattedData.brand));
    }
    if (formattedData.supplier) {
      formattedData.supplier = formatSupplierName(String(formattedData.supplier));
    }
    if (formattedData.storage_location) {
      formattedData.storage_location = formatStorageLocation(
        String(formattedData.storage_location),
      );
    }
    if (formattedData.product_code) {
      formattedData.product_code = formatTextInput(String(formattedData.product_code));
    }
  }

  if (entityType === 'recipes') {
    const recipeUpdateData: { yield?: number; yield_unit?: string } = {};
    if (typeof formattedData.yield === 'number') {
      recipeUpdateData.yield = formattedData.yield;
    }
    if (typeof formattedData.yield_unit === 'string') {
      recipeUpdateData.yield_unit = formattedData.yield_unit;
    }
    formattedData = recipeUpdateData;
  }

  if (entityType === 'compliance_types') {
    // Map 'name' to 'type_name' if the database uses 'type_name' column
    if (formattedData.name && !formattedData.type_name) {
      formattedData.type_name = formattedData.name;
      delete formattedData.name;
    }
  }

  return formattedData;
}

/**
 * Check if entity exists in database
 */
export async function checkEntityExists(
  entityType: EntityType,
  entityId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from(entityType)
    .select('id')
    .eq('id', entityId)
    .maybeSingle();

  if (error) {
    // Import logger dynamically to avoid circular dependencies
    const { logger } = await import('./logger');
    logger.error('[Autosave Sync] Error checking entity existence:', {
      entityType,
      entityId,
      error: error.message,
    });
  }

  return !error && Boolean(data);
}
