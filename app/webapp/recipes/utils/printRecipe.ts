/**
 * Print utility for recipes
 * Formats recipe with ingredients, instructions, and cost breakdown
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import { formatRecipeForPrint } from './formatRecipeForPrint';
import { getRecipePrintStyles } from './recipePrintStyles';
import type { Recipe, RecipeIngredientWithDetails } from '../types';

export interface PrintRecipeOptions {
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
 * Format recipe for printing
 *
 * @param {PrintRecipeOptions} options - Recipe print options
 * @returns {void} Opens print dialog
 */
export function printRecipe({ recipe, ingredients, costBreakdown }: PrintRecipeOptions): void {
  // Format recipe content as HTML
  const contentHtml = formatRecipeForPrint({
    recipe,
    ingredients,
    costBreakdown,
  });

  // Get recipe-specific styles
  const recipeStyles = getRecipePrintStyles();

  // Generate full HTML using unified template
  printWithTemplate({
    title: recipe.recipe_name,
    subtitle: recipe.category || 'Recipe',
    content: `<style>${recipeStyles}</style>${contentHtml}`,
    totalItems: ingredients.length,
    customMeta: costBreakdown ? `Total Cost: $${costBreakdown.totalCost.toFixed(2)}` : undefined,
  });
}
