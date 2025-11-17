/**
 * Recipe Instructions AI API Endpoint
 *
 * Generates AI-powered recipe instructions with fallback to rule-based logic
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { buildRecipeInstructionsPrompt } from '@/lib/ai/prompts/recipe-instructions';
import type { Recipe, RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';

import { logger } from '@/lib/logger';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipe, ingredients, countryCode } = body as {
      recipe: Recipe;
      ingredients: RecipeIngredientWithDetails[];
      countryCode?: string;
    };

    if (!recipe || !Array.isArray(ingredients)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

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
