import { exportToCSV } from '@/lib/csv/csv-utils';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
}

const CSV_HEADERS = [
  'Ingredient Name',
  'Brand',
  'Pack Size',
  'Pack Size Unit',
  'Pack Price',
  'Unit',
  'Cost Per Unit',
  'Supplier',
  'Product Code',
  'Storage Location',
  'Min Stock Level',
  'Current Stock',
];

/**
 * Map ingredient to CSV row format.
 *
 * @param {Ingredient} ingredient - Ingredient to map
 * @returns {Record<string, any>} CSV row object
 */
function mapIngredientToCSVRow(ingredient: Ingredient): Record<string, unknown> {
  return {
    'Ingredient Name': ingredient.ingredient_name || '',
    Brand: ingredient.brand || '',
    'Pack Size': ingredient.pack_size || '',
    'Pack Size Unit': ingredient.pack_size_unit || '',
    'Pack Price': ingredient.pack_price || 0,
    Unit: ingredient.unit || '',
    'Cost Per Unit': ingredient.cost_per_unit || 0,
    Supplier: ingredient.supplier || '',
    'Product Code': ingredient.product_code || '',
    'Storage Location': ingredient.storage_location || '',
    'Min Stock Level': ingredient.min_stock_level || 0,
    'Current Stock': ingredient.current_stock || 0,
  };
}

/**
 * Export ingredients to CSV file using unified CSV utilities.
 *
 * @param {Ingredient[]} filteredIngredients - Ingredients to export
 */
export function exportIngredientsToCSV(filteredIngredients: Ingredient[]): void {
  if (!filteredIngredients || filteredIngredients.length === 0) {
    return;
  }

  const csvData = filteredIngredients.map(mapIngredientToCSVRow);
  exportToCSV(csvData, CSV_HEADERS, 'ingredients.csv');
}
