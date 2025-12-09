/**
 * Generate CSV export for recipe cards using PapaParse for consistent formatting
 */

import { NextResponse } from 'next/server';
import Papa from 'papaparse';

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

  const csvData = cards.map(card => {
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

  const csvContent = Papa.unparse(csvData, {
    columns: headers,
    header: true,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });

  const fullContent = [`Recipe Cards - ${menuName}`, '', csvContent].join('\n');

  return new NextResponse(fullContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_recipe_cards.csv"`,
    },
  });
}
