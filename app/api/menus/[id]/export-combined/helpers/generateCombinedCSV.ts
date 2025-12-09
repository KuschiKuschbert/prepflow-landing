/**
 * Generate combined CSV export (menu display + allergen matrix + recipe cards)
 * Uses PapaParse for consistent CSV formatting
 */

import { NextResponse } from 'next/server';
import Papa from 'papaparse';
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
    const menuDataForCSV = menuData.map(item => ({
      Category: item.category || 'Uncategorized',
      'Item Name': item.name,
      Description: item.description || '',
      Price: `$${item.price.toFixed(2)}`,
    }));

    const menuCSV = Papa.unparse(menuDataForCSV, {
      columns: menuHeaders,
      header: true,
      delimiter: ',',
      newline: '\n',
      quoteChar: '"',
      escapeChar: '"',
    });

    sections.push('=== MENU DISPLAY ===', '', menuCSV);
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
    const matrixDataForCSV = matrixData.map(item => {
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

    const matrixCSV = Papa.unparse(matrixDataForCSV, {
      columns: matrixHeaders,
      header: true,
      delimiter: ',',
      newline: '\n',
      quoteChar: '"',
      escapeChar: '"',
    });

    sections.push('=== ALLERGEN MATRIX ===', '', matrixCSV);
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
    const recipeDataForCSV = recipeCardsData.map(card => {
      const ingredients = card.ingredients
        .map(ing => `${ing.name}: ${ing.quantity} ${ing.unit}`)
        .join('; ');
      const methodSteps = card.methodSteps.join('; ');
      const notes = card.notes.join('; ');

      return {
        Category: card.category || 'Uncategorized',
        'Recipe Name': card.title,
        'Base Yield': card.baseYield.toString(),
        Ingredients: ingredients,
        'Method Steps': methodSteps,
        Notes: notes,
      };
    });

    const recipeCSV = Papa.unparse(recipeDataForCSV, {
      columns: recipeHeaders,
      header: true,
      delimiter: ',',
      newline: '\n',
      quoteChar: '"',
      escapeChar: '"',
    });

    sections.push('=== RECIPE CARDS ===', '', recipeCSV);
  }

  const csvContent = [`Complete Menu Export - ${menuName}`, '', ...sections].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_complete.csv"`,
    },
  });
}
