/**
 * Recipe Instructions AI API Endpoint
 *
 * Generates AI-powered recipe instructions with fallback to rule-based logic
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { buildRecipeInstructionsPrompt } from '@/lib/ai/prompts/recipe-instructions';
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';

import { logger } from '@/lib/logger';
import { parseAndValidate } from '@/lib/api/parse-request-body';
import { z } from 'zod';

const recipeInstructionsSchema = z
  .object({
    recipe: z.any(), // Recipe is complex, validate structure if needed
    ingredients: z.array(z.any()).min(1, 'ingredients array is required'),
    countryCode: z.string().optional(),
  })
  .refine(data => data.recipe !== undefined && data.recipe !== null, {
    message: 'recipe is required',
    path: ['recipe'],
  });

/**
 * POST /api/ai/recipe-instructions
 * Generate AI-powered recipe instructions with fallback to rule-based logic
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {Recipe} request.body.recipe - Recipe object
 * @param {RecipeIngredientWithDetails[]} request.body.ingredients - Recipe ingredients
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @returns {Promise<NextResponse>} Recipe instructions response
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseAndValidate(
      request,
      recipeInstructionsSchema,
      '[AI Recipe Instructions]',
    );
    if (!parsed.ok) return parsed.response;

    const { recipe, ingredients, countryCode } = parsed.data as {
      recipe: Recipe;
      ingredients: RecipeIngredientWithDetails[];
      countryCode?: string;
    };

    // Try AI first
    try {
      const prompt = buildRecipeInstructionsPrompt(recipe, ingredients);
      const aiResponse = await generateAIResponse(
        [
          {
            role: 'user',
            content: prompt,
          },
        ],
        countryCode || 'AU',
        {
          temperature: 0.8, // Slightly more creative for recipe instructions
          maxTokens: 2000,
          useCache: true,
          cacheTTL: 24 * 60 * 60 * 1000, // 24 hour cache (recipes don't change often)
        },
      );

      if (aiResponse.content && !aiResponse.error) {
        return NextResponse.json({
          instructions: aiResponse.content,
          source: 'ai',
          cached: aiResponse.cached,
        });
      }
    } catch (aiError) {
      logger.warn('AI recipe instructions failed, using fallback:', {
        error: aiError instanceof Error ? aiError.message : String(aiError),
      });
    }

    // Fallback: Return empty string - component should handle fallback to rule-based
    return NextResponse.json({
      instructions: '',
      source: 'fallback',
    });
  } catch (error) {
    logger.error('Recipe instructions error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate recipe instructions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
