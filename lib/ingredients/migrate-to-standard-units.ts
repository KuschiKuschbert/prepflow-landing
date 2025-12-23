/**
 * Ingredient migration to standard units utilities.
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import type { IngredientRow, MigrationResult } from './migrate-to-standard-units/types';
import { migrateIngredient } from './migrate-to-standard-units/migrateIngredient';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

// Re-export types
export type { IngredientRow, MigrationResult } from './migrate-to-standard-units/types';

/**
 * Migrate all ingredients to standard units.
 *
 * @returns {Promise<MigrationResult>} Migration result with success status and counts
 */
export async function migrateIngredientsToStandardUnits(): Promise<MigrationResult> {
  const supabaseAdmin = createSupabaseAdmin();
  const errors: string[] = [];
  let migrated = 0;

  try {
    await ensureMigrationColumns(supabaseAdmin);
    const { data: ingredients, error: fetchError } = await supabaseAdmin
      .from('ingredients')
      .select('*')
      .is('standard_unit', null);

    if (fetchError) {
      throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
    }

    if (!ingredients || ingredients.length === 0) {
      return {
        success: true,
        migrated: 0,
        errors: 0,
      };
    }

    for (const ingredient of ingredients as IngredientRow[]) {
      try {
        const result = await migrateIngredient(ingredient, supabaseAdmin);
        if (result.success) {
          migrated++;
        } else {
          errors.push(
            `Ingredient ${ingredient.id} (${ingredient.ingredient_name}): ${result.error}`,
          );
        }
      } catch (err) {
        logger.error('[migrate-to-standard-units.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Ingredient ${ingredient.id} (${ingredient.ingredient_name}): ${errorMsg}`);
      }
    }

    return {
      success: errors.length === 0,
      migrated,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors : undefined,
    };
  } catch (err) {
    logger.error('[migrate-to-standard-units.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      migrated,
      errors: errors.length + 1,
      errorDetails: [...errors, `Migration failed: ${errorMsg}`],
    };
  }
}

/**
 * Ensure migration columns exist in database.
 *
 * @param {ReturnType<typeof createSupabaseAdmin>} supabaseAdmin - Supabase admin client
 */
async function ensureMigrationColumns(supabaseAdmin: ReturnType<typeof createSupabaseAdmin>) {
  // Columns should be added via Supabase SQL Editor if they don't exist
}
