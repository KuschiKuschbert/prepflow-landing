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
 * Format ingredient for CSV export.
 *
 * @param {Ingredient} ingredient - Ingredient to format
 * @returns {string} CSV row string
 */
export function formatIngredientForCSV(ingredient: Ingredient): string {
  return [
    ingredient.ingredient_name,
    ingredient.brand || '',
    ingredient.pack_size || '',
    ingredient.pack_size_unit || '',
    ingredient.pack_price || 0,
    ingredient.unit || '',
    ingredient.cost_per_unit || 0,
    ingredient.supplier || '',
    ingredient.product_code || '',
    ingredient.storage_location || '',
    ingredient.min_stock_level || 0,
    ingredient.current_stock || 0,
  ].join(',');
}

/**
 * Export ingredients to CSV file.
 *
 * @param {Ingredient[]} filteredIngredients - Ingredients to export
 */
export function exportIngredientsToCSV(filteredIngredients: Ingredient[]): void {
  const csvContent = [CSV_HEADERS.join(','), ...filteredIngredients.map(formatIngredientForCSV)].join(
    '\n',
  );
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ingredients.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}
