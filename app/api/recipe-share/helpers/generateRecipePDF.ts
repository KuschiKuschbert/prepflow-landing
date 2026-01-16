/**
 * Generate HTML content for a recipe PDF/export
 * Uses unified template system with Cyber Carrot branding
 *
 * @param {Object} recipe - Recipe object with ingredients and instructions
 * @returns {string} HTML content for PDF generation
 */
export function generateRecipePDF(recipe: unknown): string {
  // Import formatting utilities
  const { formatRecipeForPrint } = require('@/app/webapp/recipes/utils/formatRecipeForPrint');
  const { getRecipePrintStyles } = require('@/app/webapp/recipes/utils/recipePrintStyles');
  const { generateExportTemplate } = require('@/lib/exports/pdf-template');

  // Format ingredients for the print function
  const ingredients = (recipe.recipe_ingredients || []).map((ri: unknown) => ({
    ...ri,
    ingredients: ri.ingredients || {},
  }));

  // Format recipe content as HTML
  const contentHtml = formatRecipeForPrint({
    recipe: {
      recipe_name: recipe.recipe_name || recipe.name || 'Unnamed Recipe',
      description: recipe.description || null,
      yield: recipe.yield || 1,
      yield_unit: recipe.yield_unit || 'servings',
      category: recipe.category || null,
      allergens: recipe.allergens || [],
      is_vegetarian: recipe.is_vegetarian || false,
      is_vegan: recipe.is_vegan || false,
      instructions: recipe.instructions || null,
      notes: recipe.notes || null,
    },
    ingredients,
  });

  // Get recipe-specific styles
  const recipeStyles = getRecipePrintStyles();

  // Generate full HTML using unified template
  const html = generateExportTemplate({
    title: recipe.recipe_name || recipe.name || 'Recipe',
    subtitle: recipe.category || 'Recipe',
    content: `<style>${recipeStyles}</style>${contentHtml}`,
    totalItems: ingredients.length,
    forPDF: true,
  });

  return html;
}
