import {
  formatBrandName,
  formatIngredientName,
  formatStorageLocation,
  formatSupplierName,
  formatTextInput,
} from '@/lib/text-utils';

interface Ingredient {
  id?: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit?: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
}

/**
 * Map CSV row to ingredient object using flexible column matching.
 *
 * @param {Record<string, any>} row - CSV row data
 * @returns {Partial<Ingredient>} Ingredient object
 */
export function mapCSVRowToIngredient(row: Record<string, any>): Partial<Ingredient> {
  const ingredient: Partial<Ingredient> = {};

  // Normalize keys to lowercase for matching
  const normalizedRow: Record<string, any> = {};
  Object.keys(row).forEach(key => {
    normalizedRow[key.toLowerCase().trim()] = row[key];
  });

  // Flexible column matching
  Object.keys(normalizedRow).forEach(key => {
    const value = normalizedRow[key];

    if (key.includes('name') || key.includes('ingredient')) {
      ingredient.ingredient_name = formatIngredientName(String(value || '').trim());
    } else if (key.includes('brand')) {
      ingredient.brand = formatBrandName(String(value || '').trim());
    } else if ((key.includes('cost') || key.includes('price')) && !key.includes('pack')) {
      ingredient.cost_per_unit = parseFloat(String(value)) || 0;
    } else if (key.includes('unit') && !key.includes('pack')) {
      ingredient.unit =
        String(value || '')
          .toUpperCase()
          .trim() || 'GM';
    } else if (key.includes('supplier')) {
      ingredient.supplier = formatSupplierName(String(value || '').trim());
    } else if (key.includes('code') || key.includes('sku')) {
      ingredient.product_code = formatTextInput(String(value || '').trim());
    } else if (key.includes('location') || key.includes('storage')) {
      ingredient.storage_location = formatStorageLocation(String(value || '').trim());
    } else if (key.includes('pack') && key.includes('size') && !key.includes('unit')) {
      ingredient.pack_size = String(value || '').trim() || '1';
    } else if (key.includes('pack') && key.includes('size') && key.includes('unit')) {
      ingredient.pack_size_unit = String(value || '').trim();
    } else if (key.includes('pack') && key.includes('price')) {
      const packPrice = parseFloat(String(value));
      ingredient.pack_price = isNaN(packPrice) ? undefined : packPrice;
    } else if (key.includes('min') && key.includes('stock')) {
      const minStock = parseFloat(String(value));
      ingredient.min_stock_level = isNaN(minStock) ? undefined : minStock;
    } else if (key.includes('current') && key.includes('stock')) {
      const currentStock = parseFloat(String(value));
      ingredient.current_stock = isNaN(currentStock) ? undefined : currentStock;
    }
  });

  // Set defaults for required fields
  if (!ingredient.ingredient_name) {
    return {}; // Skip rows without ingredient name
  }
  if (!ingredient.cost_per_unit) ingredient.cost_per_unit = 0;
  if (!ingredient.cost_per_unit_as_purchased)
    ingredient.cost_per_unit_as_purchased = ingredient.cost_per_unit || 0;
  if (!ingredient.cost_per_unit_incl_trim)
    ingredient.cost_per_unit_incl_trim = ingredient.cost_per_unit || 0;
  if (!ingredient.trim_peel_waste_percentage) ingredient.trim_peel_waste_percentage = 0;
  if (!ingredient.yield_percentage) ingredient.yield_percentage = 100;
  if (!ingredient.unit) ingredient.unit = 'GM';
  if (!ingredient.pack_size) ingredient.pack_size = '1';

  return ingredient;
}
