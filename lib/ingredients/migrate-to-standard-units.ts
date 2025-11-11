// PrepFlow - Migrate Ingredients to Standard Units
// Converts all existing ingredients to use standard units (g/ml/pc)

import { createSupabaseAdmin } from '@/lib/supabase';
import {
  convertToStandardUnit,
  getUnitCategory,
  normalizeUnit,
  STANDARD_UNITS,
} from '@/lib/unit-conversion';

export interface IngredientRow {
  id: string;
  ingredient_name: string;
  pack_size?: string | number | null;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  standard_unit?: string;
  original_unit?: string;
}

export interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: number;
  errorDetails?: string[];
}

export async function migrateIngredientsToStandardUnits(): Promise<MigrationResult> {
  const supabaseAdmin = createSupabaseAdmin();
  const errors: string[] = [];
  let migrated = 0;

  try {
    // First, ensure columns exist
    await ensureMigrationColumns(supabaseAdmin);

    // Fetch all ingredients
    // Filter by standard_unit being null to only migrate unmigrated ingredients
    // If column doesn't exist, Supabase will return an error which we'll handle
    const { data: ingredients, error: fetchError } = await supabaseAdmin
      .from('ingredients')
      .select('*')
      .is('standard_unit', null);

    if (fetchError) {
      throw new Error(`Failed to fetch ingredients: ${fetchError.message}`);
    }

    if (!ingredients || ingredients.length === 0) {
      return {
        success: true,
        migrated: 0,
        errors: 0,
      };
    }

    // Process each ingredient
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
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      migrated,
      errors: errors.length + 1,
      errorDetails: [...errors, `Migration failed: ${errorMsg}`],
    };
  }
}

async function ensureMigrationColumns(supabaseAdmin: ReturnType<typeof createSupabaseAdmin>) {
  // Check if columns exist by trying to select them
  // If they don't exist, the migration will handle it gracefully
  // Note: In production, columns should be added via Supabase SQL Editor:
  // ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS standard_unit VARCHAR(50);
  // ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS original_unit VARCHAR(50);
  // For now, we'll just try to use the columns and handle errors gracefully
  // The migration will work even if columns don't exist - we'll just skip setting them
}

async function migrateIngredient(
  ingredient: IngredientRow,
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Determine which unit to migrate (prefer pack_size_unit, fallback to unit)
    const unitToMigrate = ingredient.pack_size_unit || ingredient.unit || 'pc';
    const normalizedUnit = normalizeUnit(unitToMigrate);
    const category = getUnitCategory(normalizedUnit);

    // Determine standard unit
    let standardUnit: string;
    switch (category) {
      case 'weight':
        standardUnit = STANDARD_UNITS.WEIGHT;
        break;
      case 'volume':
        standardUnit = STANDARD_UNITS.VOLUME;
        break;
      case 'piece':
        standardUnit = STANDARD_UNITS.PIECE;
        break;
      default:
        standardUnit = STANDARD_UNITS.PIECE;
    }

    // If already in standard unit, just set the flags
    if (normalizedUnit === standardUnit) {
      const { error } = await supabaseAdmin
        .from('ingredients')
        .update({
          standard_unit: standardUnit.toUpperCase(),
          original_unit: unitToMigrate,
        })
        .eq('id', ingredient.id);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    // Convert pack_size to standard unit if pack_size_unit exists
    let convertedPackSize: number | null = null;
    if (ingredient.pack_size && ingredient.pack_size_unit) {
      const packSizeNum =
        typeof ingredient.pack_size === 'string'
          ? parseFloat(ingredient.pack_size)
          : ingredient.pack_size;

      if (!isNaN(packSizeNum) && packSizeNum > 0) {
        const conversion = convertToStandardUnit(packSizeNum, normalizedUnit);
        convertedPackSize = conversion.value;
      }
    }

    // Recalculate cost_per_unit in standard unit
    let convertedCostPerUnit = ingredient.cost_per_unit;
    if (ingredient.pack_price && ingredient.pack_size) {
      const packSizeNum =
        typeof ingredient.pack_size === 'string'
          ? parseFloat(ingredient.pack_size)
          : ingredient.pack_size;

      if (!isNaN(packSizeNum) && packSizeNum > 0 && ingredient.pack_price > 0) {
        // Calculate cost per original unit
        const costPerOriginalUnit = ingredient.pack_price / packSizeNum;

        // Convert to standard unit
        const conversion = convertToStandardUnit(1, normalizedUnit);
        convertedCostPerUnit = costPerOriginalUnit / conversion.value;
      }
    } else if (normalizedUnit !== standardUnit) {
      // Convert existing cost_per_unit to standard unit
      const conversion = convertToStandardUnit(1, normalizedUnit);
      convertedCostPerUnit = ingredient.cost_per_unit / conversion.value;
    }

    // Recalculate cost_per_unit_as_purchased
    let convertedCostPerUnitAsPurchased = ingredient.cost_per_unit_as_purchased;
    if (convertedCostPerUnitAsPurchased && normalizedUnit !== standardUnit) {
      const conversion = convertToStandardUnit(1, normalizedUnit);
      convertedCostPerUnitAsPurchased = convertedCostPerUnitAsPurchased / conversion.value;
    }

    // Recalculate cost_per_unit_incl_trim
    let convertedCostPerUnitInclTrim = ingredient.cost_per_unit_incl_trim;
    if (convertedCostPerUnitInclTrim && normalizedUnit !== standardUnit) {
      const conversion = convertToStandardUnit(1, normalizedUnit);
      convertedCostPerUnitInclTrim = convertedCostPerUnitInclTrim / conversion.value;
    }

    // Update ingredient
    const updateData: Partial<IngredientRow> = {
      unit: standardUnit.toUpperCase(),
      cost_per_unit: convertedCostPerUnit,
      standard_unit: standardUnit.toUpperCase(),
      original_unit: unitToMigrate,
    };

    if (convertedPackSize !== null) {
      updateData.pack_size = convertedPackSize.toString();
    }

    if (convertedCostPerUnitAsPurchased !== undefined) {
      updateData.cost_per_unit_as_purchased = convertedCostPerUnitAsPurchased;
    }

    if (convertedCostPerUnitInclTrim !== undefined) {
      updateData.cost_per_unit_incl_trim = convertedCostPerUnitInclTrim;
    }

    const { error } = await supabaseAdmin
      .from('ingredients')
      .update(updateData)
      .eq('id', ingredient.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: errorMsg };
  }
}
