/**
 * Format ingredient update fields using text utilities.
 *
 * @param {Object} updates - Raw update data
 * @returns {Promise<Object>} Formatted update data
 */
export async function formatIngredientUpdates(updates: any): Promise<any> {
  const formattedUpdates: any = {
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

  return formattedUpdates;
}
