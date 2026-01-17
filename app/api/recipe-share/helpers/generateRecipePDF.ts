interface RecipeIngredientForPDF {
  ingredients: Record<string, unknown> | null;
  [key: string]: unknown;
}

interface RecipeForPDF {
  recipe_name?: string;
  name?: string;
  description?: string;
  yield?: number;
  yield_unit?: string;
  category?: string;
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  instructions?: unknown;
  notes?: string;
  recipe_ingredients?: RecipeIngredientForPDF[];
}

/**
 * Generate HTML content for a recipe PDF/export
 * Uses unified template system with Cyber Carrot branding
 *
 * @param {RecipeForPDF} recipe - Recipe object with ingredients and instructions
 * @returns {string} HTML content for PDF generation
 */
export function generateRecipePDF(recipe: RecipeForPDF): string {
  // Import formatting utilities
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { formatRecipeForPrint } = require('@/app/webapp/recipes/utils/formatRecipeForPrint');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getRecipePrintStyles } = require('@/app/webapp/recipes/utils/recipePrintStyles');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { generateExportTemplate } = require('@/lib/exports/pdf-template');

  // Format ingredients for the print function
  const ingredients = (recipe.recipe_ingredients || []).map(ri => ({
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
