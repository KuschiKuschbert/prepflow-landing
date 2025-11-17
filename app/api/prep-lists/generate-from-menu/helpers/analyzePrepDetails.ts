/**
 * Analyze recipe prep details using AI
 */

import { logger } from '@/lib/logger';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { buildPrepDetailsPrompt, parsePrepDetailsResponse } from '@/lib/ai/prompts/prep-details';
import type { Recipe, RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';
import type { RecipePrepDetails } from '@/app/webapp/prep-lists/types';

interface AnalyzePrepDetailsParams {
  recipe: Recipe;
  ingredients: RecipeIngredientWithDetails[];
  instructions?: string | null;
  countryCode?: string;
}

/**
 * Analyze recipe to extract prep details using AI
 */
export async function analyzePrepDetails({
  recipe,
  ingredients,
  instructions,
  countryCode = 'AU',
}: AnalyzePrepDetailsParams): Promise<RecipePrepDetails | null> {
  try {
    const prompt = buildPrepDetailsPrompt(recipe, ingredients, instructions);
    const aiResponse = await generateAIResponse(
      [
        {
          role: 'user',
          content: prompt,
        },
      ],
      countryCode,
      {
        temperature: 0.3, // Lower temperature for more consistent structured output
        maxTokens: 2000,
        useCache: true,
        cacheTTL: 7 * 24 * 60 * 60 * 1000, // 7 day cache
      },
    );

    if (!aiResponse.content || aiResponse.error) {
      logger.warn(`Failed to analyze prep details for recipe ${recipe.id}:`, {
        error: aiResponse.error,
      });
      return null;
    }

    const parsed = parsePrepDetailsResponse(aiResponse.content);

    // Map to RecipePrepDetails format
    const prepDetails: RecipePrepDetails = {
      recipeId: recipe.id,
      recipeName: recipe.recipe_name,
      prepDetails: [
        ...parsed.cutShapes.map(cs => ({
          type: 'cut_shape' as const,
          ingredientName: cs.ingredient,
          description: `${cs.ingredient} - ${cs.shape}${cs.quantity ? ` (${cs.quantity})` : ''}`,
        })),
        ...parsed.sauces.map(s => ({
          type: 'sauce' as const,
          description: s.name,
          details: s.instructions,
        })),
        ...parsed.marinations.map(m => ({
          type: 'marination' as const,
          ingredientName: m.ingredient,
          description: `${m.ingredient} - ${m.method}${m.duration ? ` (${m.duration})` : ''}`,
        })),
        ...parsed.preCookingSteps.map(pc => ({
          type: 'pre_cooking' as const,
          ingredientName: pc.ingredient,
          description: `${pc.ingredient} - ${pc.step}`,
        })),
        ...parsed.specialTechniques.map(st => ({
          type: 'technique' as const,
          description: st.description,
          details: st.details,
        })),
      ],
      sauces: parsed.sauces.map(s => ({
        name: s.name,
        ingredients: s.ingredients,
        instructions: s.instructions,
        recipeId: recipe.id,
      })),
      marinations: parsed.marinations.map(m => ({
        ingredient: m.ingredient,
        method: m.method,
        duration: m.duration,
        recipeId: recipe.id,
      })),
      cutShapes: parsed.cutShapes.map(cs => ({
        ingredient: cs.ingredient,
        shape: cs.shape,
        quantity: cs.quantity,
      })),
      preCookingSteps: parsed.preCookingSteps.map(pc => ({
        ingredient: pc.ingredient,
        step: pc.step,
      })),
      specialTechniques: parsed.specialTechniques.map(st => ({
        description: st.description,
        details: st.details,
      })),
    };

    return prepDetails;
  } catch (error) {
    logger.error(`Error analyzing prep details for recipe ${recipe.id}:`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Batch analyze multiple recipes (with parallel processing and concurrency limit)
 */
export async function batchAnalyzePrepDetails(
  recipes: Array<{
    recipe: Recipe;
    ingredients: RecipeIngredientWithDetails[];
    instructions?: string | null;
  }>,
  countryCode: string = 'AU',
): Promise<Map<string, RecipePrepDetails>> {
  const results = new Map<string, RecipePrepDetails>();

  if (recipes.length === 0) {
    return results;
  }

  // Process in parallel with concurrency limit to avoid rate limits
  // Limit to 3 concurrent AI requests to balance speed and rate limits
  const CONCURRENCY_LIMIT = 3;
  const batches: Array<typeof recipes> = [];

  for (let i = 0; i < recipes.length; i += CONCURRENCY_LIMIT) {
    batches.push(recipes.slice(i, i + CONCURRENCY_LIMIT));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async ({ recipe, ingredients, instructions }) => {
      try {
        const prepDetails = await analyzePrepDetails({
          recipe,
          ingredients,
          instructions,
          countryCode,
        });
        return { recipeId: recipe.id, prepDetails };
      } catch (error) {
        logger.warn(`Failed to analyze prep details for recipe ${recipe.id}:`, {
          error: error instanceof Error ? error.message : String(error),
        });
        return { recipeId: recipe.id, prepDetails: null };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    for (const { recipeId, prepDetails } of batchResults) {
      if (prepDetails) {
        results.set(recipeId, prepDetails);
      }
    }

    // Small delay between batches to avoid rate limiting
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}
