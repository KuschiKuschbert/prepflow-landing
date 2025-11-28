/**
 * Generate combined CSV export (menu display + allergen matrix + recipe cards)
 */

import { NextResponse } from 'next/server';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';

interface MenuDisplayData {
  name: string;
  description?: string;
  price: number;
  category: string;
}

interface AllergenMatrixData {
  name: string;
  type: string;
  category: string;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
}

interface RecipeCardData {
  id: string;
  title: string;
  baseYield: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  methodSteps: string[];
  notes: string[];
  category: string;
}

/**
 * Generate combined CSV export (menu display + allergen matrix + recipe cards)
 *
 * @param {string} menuName - Menu name
 * @param {MenuDisplayData[]} menuData - Menu items data
 * @param {AllergenMatrixData[]} matrixData - Allergen matrix data
 * @param {RecipeCardData[]} recipeCardsData - Recipe cards data
 * @param {boolean} includeMenu - Whether to include menu display
 * @param {boolean} includeMatrix - Whether to include allergen matrix
 * @param {boolean} includeRecipes - Whether to include recipe cards
 * @returns {NextResponse} CSV response
 */
export function generateCombinedCSV(
  menuName: string,
  menuData: MenuDisplayData[],
  matrixData: AllergenMatrixData[],
  recipeCardsData: RecipeCardData[],
  includeMenu: boolean,
  includeMatrix: boolean,
  includeRecipes: boolean,
): NextResponse {
  const sections: string[] = [];

  // Menu display section
  if (includeMenu) {
    const menuHeaders = ['Category', 'Item Name', 'Description', 'Price'];
    const menuRows = menuData.map(item => [
      item.category || 'Uncategorized',
      item.name,
      item.description || '',
      `$${item.price.toFixed(2)}`,
    ]);

    sections.push(
      '=== MENU DISPLAY ===',
      '',
      menuHeaders.join(','),
      ...menuRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    );
  }

  // Allergen matrix section
  if (includeMatrix) {
    const matrixHeaders = [
      'Item Name',
      'Type',
      'Category',
      ...AUSTRALIAN_ALLERGENS.map(a => a.displayName),
      'Vegetarian',
      'Vegan',
    ];
    const matrixRows = matrixData.map(item => {
      const allergenColumns = AUSTRALIAN_ALLERGENS.map(allergen =>
        item.allergens.includes(allergen.code) ? 'Yes' : '',
      );
      return [
        item.name,
        item.type,
        item.category || '',
        ...allergenColumns,
        item.isVegetarian ? 'Yes' : '',
        item.isVegan ? 'Yes' : '',
      ];
    });

    sections.push(
      '=== ALLERGEN MATRIX ===',
      '',
      matrixHeaders.join(','),
      ...matrixRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    );
  }

  // Recipe cards section
  if (includeRecipes) {
    const recipeHeaders = [
      'Category',
      'Recipe Name',
      'Base Yield',
      'Ingredients',
      'Method Steps',
      'Notes',
    ];
    const recipeRows = recipeCardsData.map(card => {
      const ingredients = card.ingredients
        .map(ing => `${ing.name}: ${ing.quantity} ${ing.unit}`)
        .join('; ');
      const methodSteps = card.methodSteps.join('; ');
      const notes = card.notes.join('; ');

      return [
        card.category || 'Uncategorized',
        card.title,
        card.baseYield.toString(),
        ingredients,
        methodSteps,
        notes,
      ];
    });

    sections.push(
      '=== RECIPE CARDS ===',
      '',
      recipeHeaders.join(','),
      ...recipeRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    );
  }

  const csvContent = [`Complete Menu Export - ${menuName}`, '', ...sections].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_complete.csv"`,
    },
  });
}
