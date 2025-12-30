import {
  formatBrandName,
  formatIngredientName,
  formatStorageLocation,
  formatSupplierName,
  formatTextInput,
} from '@/lib/text-utils';

/**
 * Format ingredient updates by applying text formatting to each field
 */
export function formatIngredientUpdates<T>(updates: Partial<T>) {
  return {
    ...updates,
    ingredient_name:
      'ingredient_name' in updates && updates.ingredient_name
        ? formatIngredientName(String(updates.ingredient_name))
        : undefined,
    brand: 'brand' in updates && updates.brand ? formatBrandName(String(updates.brand)) : undefined,
    supplier:
      'supplier' in updates && updates.supplier
        ? formatSupplierName(String(updates.supplier))
        : undefined,
    storage_location:
      'storage_location' in updates && updates.storage_location
        ? formatStorageLocation(String(updates.storage_location))
        : undefined,
    product_code:
      'product_code' in updates && updates.product_code
        ? formatTextInput(String(updates.product_code))
        : undefined,
  };
}




