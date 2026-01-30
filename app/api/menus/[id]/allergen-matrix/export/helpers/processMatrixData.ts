import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { EnrichedMenuItem } from '../../../../types';

export interface MatrixItem {
  name: string;
  type: 'Dish' | 'Recipe';
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  category: string | undefined;
}

export function processMenuItemsToMatrix(items: EnrichedMenuItem[]): MatrixItem[] {
  return items.map((item: EnrichedMenuItem) => {
    let allergens: string[] = [];
    if (item.allergens && Array.isArray(item.allergens)) {
      allergens = item.allergens;
    } else if (item.dish_id && item.dishes?.allergens && Array.isArray(item.dishes.allergens)) {
      allergens = item.dishes.allergens as string[];
    } else if (item.recipe_id && item.recipes?.allergens && Array.isArray(item.recipes.allergens)) {
      allergens = item.recipes.allergens as string[];
    }
    const validAllergenCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
    allergens = consolidateAllergens(allergens).filter(code => validAllergenCodes.includes(code));
    const isVegetarian =
      item.is_vegetarian ??
      (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
    const isVegan =
      item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);
    return {
      name: item.dish_id
        ? item.dishes?.dish_name || 'Unknown'
        : item.recipes?.recipe_name || (item.recipes as { name?: string })?.name || 'Unknown',
      type: item.dish_id ? 'Dish' : 'Recipe',
      allergens,
      isVegetarian: isVegetarian === true,
      isVegan: isVegan === true,
      category: item.category,
    };
  });
}

export function generateCSV(menuName: string, matrixData: MatrixItem[]): NextResponse {
  const headers = [
    'Item Name',
    'Type',
    'Category',
    ...AUSTRALIAN_ALLERGENS.map(a => a.displayName),
    'Vegetarian',
    'Vegan',
  ];

  const csvData = matrixData.map(item => {
    const allergenColumns: Record<string, string> = {};
    AUSTRALIAN_ALLERGENS.forEach(allergen => {
      allergenColumns[allergen.displayName] = item.allergens.includes(allergen.code) ? 'Yes' : '';
    });

    return {
      'Item Name': item.name,
      Type: item.type,
      Category: item.category || '',
      ...allergenColumns,
      Vegetarian: item.isVegetarian ? 'Yes' : '',
      Vegan: item.isVegan ? 'Yes' : '',
    };
  });

  const csvContent = Papa.unparse(csvData, {
    columns: headers,
    header: true,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });

  const fullContent = [`Allergen Matrix - ${menuName}`, '', csvContent].join('\n');

  return new NextResponse(fullContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_allergen_matrix.csv"`,
    },
  });
}
