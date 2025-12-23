/**
 * Generate recipe CSV template
 */
export function generateRecipeTemplate(): string {
  const headers = [
    'recipe_name',
    'description',
    'instructions',
    'yield',
    'yield_unit',
    'category',
    'selling_price',
    'allergens',
    'is_vegetarian',
    'is_vegan',
  ];

  const exampleRow = [
    'Double Cheese Burger',
    'Classic burger with double cheese',
    '1. Cook patties\n2. Assemble burger\n3. Serve',
    '1',
    'serving',
    'Burgers',
    '15.50',
    'Dairy, Gluten',
    'false',
    'false',
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}
