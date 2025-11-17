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
    await ensureMigrationColumns(supabaseAdmin);
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
  // Columns should be added via Supabase SQL Editor if they don't exist
}

async function migrateIngredient(
  ingredient: IngredientRow,
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const unitToMigrate = ingredient.pack_size_unit || ingredient.unit || 'pc';
    const normalizedUnit = normalizeUnit(unitToMigrate);
    const category = getUnitCategory(normalizedUnit);
    const standardUnit =
      category === 'weight'
        ? STANDARD_UNITS.WEIGHT
        : category === 'volume'
          ? STANDARD_UNITS.VOLUME
          : STANDARD_UNITS.PIECE;

    if (normalizedUnit === standardUnit) {
      const { error } = await supabaseAdmin
        .from('ingredients')
        .update({ standard_unit: standardUnit.toUpperCase(), original_unit: unitToMigrate })
        .eq('id', ingredient.id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    let convertedPackSize: number | null = null;
    if (ingredient.pack_size && ingredient.pack_size_unit) {
      const packSizeNum =
        typeof ingredient.pack_size === 'string'
          ? parseFloat(ingredient.pack_size)
          : ingredient.pack_size;
      if (!isNaN(packSizeNum) && packSizeNum > 0) {
        convertedPackSize = convertToStandardUnit(packSizeNum, normalizedUnit).value;
      }
    }
    let convertedCostPerUnit = ingredient.cost_per_unit;
    if (ingredient.pack_price && ingredient.pack_size) {
      const packSizeNum =
        typeof ingredient.pack_size === 'string'
          ? parseFloat(ingredient.pack_size)
          : ingredient.pack_size;
      if (!isNaN(packSizeNum) && packSizeNum > 0 && ingredient.pack_price > 0) {
        const conversion = convertToStandardUnit(1, normalizedUnit);
        convertedCostPerUnit = ingredient.pack_price / packSizeNum / conversion.value;
      }
    } else if (normalizedUnit !== standardUnit) {
      convertedCostPerUnit =
        ingredient.cost_per_unit / convertToStandardUnit(1, normalizedUnit).value;
    }
    let convertedCostPerUnitAsPurchased = ingredient.cost_per_unit_as_purchased;
    if (convertedCostPerUnitAsPurchased && normalizedUnit !== standardUnit) {
      convertedCostPerUnitAsPurchased =
        convertedCostPerUnitAsPurchased / convertToStandardUnit(1, normalizedUnit).value;
    }
    let convertedCostPerUnitInclTrim = ingredient.cost_per_unit_incl_trim;
    if (convertedCostPerUnitInclTrim && normalizedUnit !== standardUnit) {
      convertedCostPerUnitInclTrim =
        convertedCostPerUnitInclTrim / convertToStandardUnit(1, normalizedUnit).value;
    }

    const updateData: Partial<IngredientRow> = {
      unit: standardUnit.toUpperCase(),
      cost_per_unit: convertedCostPerUnit,
      standard_unit: standardUnit.toUpperCase(),
      original_unit: unitToMigrate,
    };
    if (convertedPackSize !== null) updateData.pack_size = convertedPackSize.toString();
    if (convertedCostPerUnitAsPurchased !== undefined)
      updateData.cost_per_unit_as_purchased = convertedCostPerUnitAsPurchased;
    if (convertedCostPerUnitInclTrim !== undefined)
      updateData.cost_per_unit_incl_trim = convertedCostPerUnitInclTrim;

    const { error } = await supabaseAdmin
      .from('ingredients')
      .update(updateData)
      .eq('id', ingredient.id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: errorMsg };
  }
}
