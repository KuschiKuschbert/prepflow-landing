/**
 * Batch processing helpers for recipe conversion
 */

import { logger } from '@/lib/logger';
import { ScrapedRecipe } from '../../../../../scripts/recipe-scraper/parsers/types';
import { convertRecipeIngredients } from './ingredient-conversion';
import { updateRecipeFile } from './file-operations';

interface RecipeEntry {
  id: string;
  file_path: string;
}

interface BatchResult {
  converted: boolean;
  ingredientCount: number;
  error?: boolean;
}

interface ProcessingResult {
  convertedRecipes: number;
  totalIngredientsConverted: number;
  errors: Array<{ recipeId: string; error: string }>;
}

/**
 * Process a single recipe for unit conversion
 */
async function processRecipe(
  entry: RecipeEntry,
  storage: { loadRecipe: (path: string) => Promise<ScrapedRecipe | null> },
  storagePath: string,
  dryRun: boolean,
  batchIndex: number,
  convertedRecipes: number,
): Promise<BatchResult> {
  try {
    const recipe = await storage.loadRecipe(entry.file_path);
    if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
      return { converted: false, ingredientCount: 0 };
    }

    // Debug: Log first few ingredients to see their structure (only once)
    if (batchIndex === 0 && convertedRecipes === 0 && !dryRun) {
      logger.dev('[Recipe Unit Conversion API] Sample ingredient structure:', {
        firstIngredient: recipe.ingredients[0],
        totalIngredients: recipe.ingredients.length,
        hasQuantity: recipe.ingredients.filter(ing => ing.quantity).length,
        hasUnit: recipe.ingredients.filter(ing => ing.unit).length,
        hasOriginalText: recipe.ingredients.filter(ing => ing.original_text).length,
      });
    }

    const { ingredients, convertedCount } = convertRecipeIngredients(recipe.ingredients);

    if (convertedCount > 0) {
      if (!dryRun) {
        // Update recipe with converted ingredients
        const updatedRecipe: ScrapedRecipe = {
          ...recipe,
          ingredients,
          updated_at: new Date().toISOString(),
        };

        // Update recipe file directly (bypasses duplicate check)
        await updateRecipeFile(updatedRecipe, entry.file_path, storagePath);
      }

      return { converted: true, ingredientCount: convertedCount };
    }

    return { converted: false, ingredientCount: 0 };
  } catch (error) {
    logger.error(`[Recipe Unit Conversion API] Error converting recipe ${entry.id}:`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      converted: false,
      ingredientCount: 0,
      error: true,
    };
  }
}

/**
 * Process recipes in parallel batches
 */
export async function processRecipeBatches(
  allRecipes: RecipeEntry[],
  storage: { loadRecipe: (path: string) => Promise<ScrapedRecipe | null> },
  storagePath: string,
  dryRun: boolean,
): Promise<ProcessingResult> {
  const CONCURRENCY_LIMIT = 10; // Process 10 recipes concurrently
  const batches: RecipeEntry[][] = [];

  // Split recipes into batches
  for (let i = 0; i < allRecipes.length; i += CONCURRENCY_LIMIT) {
    batches.push(allRecipes.slice(i, i + CONCURRENCY_LIMIT));
  }

  logger.info(
    `[Recipe Unit Conversion API] Processing ${allRecipes.length} recipes in ${batches.length} parallel batches (${CONCURRENCY_LIMIT} concurrent per batch)`,
  );

  let convertedRecipes = 0;
  let totalIngredientsConverted = 0;
  const errors: Array<{ recipeId: string; error: string }> = [];

  // Process each batch in parallel
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchStartTime = Date.now();

    // Process all recipes in batch concurrently
    const batchPromises = batch.map(entry =>
      processRecipe(entry, storage, storagePath, dryRun, batchIndex, convertedRecipes).catch(
        error => {
          errors.push({
            recipeId: entry.id,
            error: error instanceof Error ? error.message : String(error),
          });
          return { converted: false, ingredientCount: 0, error: true };
        },
      ),
    );

    // Wait for all recipes in batch to complete
    const batchResults = await Promise.all(batchPromises);

    // Aggregate results
    for (let i = 0; i < batchResults.length; i++) {
      const result = batchResults[i];
      if (result.error && batch[i]) {
        errors.push({
          recipeId: batch[i].id,
          error: 'Processing failed',
        });
      } else if (result.converted) {
        convertedRecipes++;
        totalIngredientsConverted += result.ingredientCount;
      }
    }

    const batchTime = Date.now() - batchStartTime;
    logger.dev(
      `[Recipe Unit Conversion API] Batch ${batchIndex + 1}/${batches.length} completed: ${batchResults.filter(r => r.converted).length} recipes converted in ${batchTime}ms`,
    );
  }

  return {
    convertedRecipes,
    totalIngredientsConverted,
    errors,
  };
}
