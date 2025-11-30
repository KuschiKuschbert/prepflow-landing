/**
 * Generate CSV export for recipe cards
 */

import { NextResponse } from 'next/server';

interface RecipeCardData {
  id: string;
  menuItemId: string;
  menuItemName: string;
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
 * Generate CSV export for recipe cards
 *
 * @param {string} menuName - Menu name
 * @param {RecipeCardData[]} cards - Recipe cards data
 * @returns {NextResponse} CSV response
 */
export function generateCSV(menuName: string, cards: RecipeCardData[]): NextResponse {
  const headers = ['Category', 'Recipe Name', 'Base Yield', 'Ingredients', 'Method Steps', 'Notes'];

  const rows = cards.map(card => {
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

  const csvContent = [
    `Recipe Cards - ${menuName}`,
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_recipe_cards.csv"`,
    },
  });
}

