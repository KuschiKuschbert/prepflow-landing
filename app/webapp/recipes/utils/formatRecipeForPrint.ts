/**
 * Format recipe data for print/export
 * Converts recipe with ingredients and instructions into HTML format
 */

import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { buildRecipePrintHTML } from './helpers/buildRecipePrintHTML';

export interface RecipePrintData {
  recipe: Recipe;
  ingredients: RecipeIngredientWithDetails[];
  costBreakdown?: {
    totalCost: number;
    costPerUnit: number;
    sellingPrice?: number;
    grossProfit?: number;
    grossProfitPercent?: number;
  };
}

/**
 * Format recipe for print/export as HTML
 *
 * @param {RecipePrintData} data - Recipe data
 * @returns {string} HTML content for recipe
 */
export function formatRecipeForPrint(data: RecipePrintData): string {
  return buildRecipePrintHTML(data);
}
