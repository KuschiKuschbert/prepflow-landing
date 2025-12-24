/**
 * Prep Details AI API Endpoint
 *
 * Analyzes recipes to extract detailed prep information (cut shapes, sauces, marination, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { buildPrepDetailsPrompt, parsePrepDetailsResponse } from '@/lib/ai/prompts/prep-details';
import type { Recipe, RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';
import type { RecipePrepDetails } from '@/app/webapp/prep-lists/types';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { z } from 'zod';

const prepDetailsSchema = z
  .object({
    recipe: z.any(), // Recipe is complex, validate structure if needed
    ingredients: z.array(z.any()).min(1, 'ingredients array is required'),
    instructions: z.string().nullable().optional(),
    countryCode: z.string().optional(),
  })
  .refine(data => data.recipe !== undefined && data.recipe !== null, {
    message: 'recipe is required',
    path: ['recipe'],
  });

/**
 * POST /api/ai/prep-details
 * Analyze recipes to extract detailed prep information (cut shapes, sauces, marination, etc.)
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {Recipe} request.body.recipe - Recipe object
 * @param {RecipeIngredientWithDetails[]} request.body.ingredients - Recipe ingredients
 * @param {string | null} [request.body.instructions] - Recipe instructions
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @returns {Promise<NextResponse>} Prep details response
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[AI Prep Details] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = prepDetailsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { recipe, ingredients, instructions, countryCode } = validationResult.data as {
      recipe: Recipe;
      ingredients: RecipeIngredientWithDetails[];
      instructions?: string | null;
      countryCode?: string;
    };

    // Try AI first
    try {
      const prompt = buildPrepDetailsPrompt(recipe, ingredients, instructions);
      const aiResponse = await generateAIResponse(
        [
          {
            role: 'user',
            content: prompt,
          },
        ],
        countryCode || 'AU',
        {
          temperature: 0.3, // Lower temperature for more consistent structured output
          maxTokens: 2000,
          useCache: true,
          cacheTTL: 7 * 24 * 60 * 60 * 1000, // 7 day cache (prep details don't change often)
        },
      );

      if (aiResponse.content && !aiResponse.error) {
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

        return NextResponse.json({
          prepDetails,
          source: 'ai',
          cached: aiResponse.cached,
        });
      }
    } catch (aiError) {
      logger.warn('AI prep details failed:', {
        error: aiError instanceof Error ? aiError.message : String(aiError),
      });
    }

    // Fallback: Return empty prep details
    return NextResponse.json({
      prepDetails: {
        recipeId: recipe.id,
        recipeName: recipe.recipe_name,
        prepDetails: [],
        sauces: [],
        marinations: [],
        cutShapes: [],
        preCookingSteps: [],
        specialTechniques: [],
      },
      source: 'fallback',
    });
  } catch (error) {
    logger.error('Prep details error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze prep details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
