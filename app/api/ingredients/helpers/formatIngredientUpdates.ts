import { UpdateIngredientData } from './schemas';

/**
 * Format ingredient update fields using text utilities.
 *
 * @param {UpdateIngredientData} updates - Raw update data
 * @returns {Promise<UpdateIngredientData & { updated_at: string }>} Formatted update data
 */
export async function formatIngredientUpdates(
  updates: UpdateIngredientData,
): Promise<UpdateIngredientData & { updated_at: string; [key: string]: unknown }> {
  const formattedUpdates: UpdateIngredientData & { updated_at: string; [key: string]: unknown } = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.ingredient_name) {
    const { formatIngredientName } = await import('@/lib/text-utils');
    formattedUpdates.ingredient_name = formatIngredientName(updates.ingredient_name);
  }
  if (updates.brand) {
    const { formatBrandName } = await import('@/lib/text-utils');
    formattedUpdates.brand = formatBrandName(updates.brand);
  }
  if (updates.supplier) {
    const { formatSupplierName } = await import('@/lib/text-utils');
    formattedUpdates.supplier = formatSupplierName(updates.supplier);
  }
  if (updates.storage_location) {
    const { formatStorageLocation } = await import('@/lib/text-utils');
    formattedUpdates.storage_location = formatStorageLocation(updates.storage_location);
  }
  if (updates.product_code) {
    const { formatTextInput } = await import('@/lib/text-utils');
    formattedUpdates.product_code = formatTextInput(updates.product_code);
  }

  // Handle allergens (ensure it's a valid JSONB array)
  if (updates.allergens !== undefined) {
    if (Array.isArray(updates.allergens)) {
      formattedUpdates.allergens = updates.allergens;
    } else if (updates.allergens === null || updates.allergens === '') {
      formattedUpdates.allergens = [];
    }
  }

  // Handle allergen_source (ensure it's a valid JSONB object)
  if (updates.allergen_source !== undefined) {
    if (typeof updates.allergen_source === 'object' && updates.allergen_source !== null) {
      formattedUpdates.allergen_source = updates.allergen_source;
    } else if (updates.allergen_source === null || updates.allergen_source === '') {
      formattedUpdates.allergen_source = { manual: false, ai: false };
    }
  }

  return formattedUpdates;
}
