'use client';
import { useCallback, useState } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { useCountry } from '@/contexts/CountryContext';
import { logger } from '@/lib/logger';
import { analyzeIngredients } from './utils/analyzeIngredients';
import { determineRecipeType } from './utils/determineRecipeType';
import { generateInstructions } from './utils/generateInstructionTemplates';
export function useAIInstructions() {
  const [aiInstructions, setAiInstructions] = useState<string>('');
  const [generatingInstructions, setGeneratingInstructions] = useState(false);
  const { selectedCountry } = useCountry();

  const generateAIInstructions = useCallback(
    async (recipe: Recipe, ingredients: RecipeIngredientWithDetails[]) => {
      logger.dev('🤖 DEBUG: Generating AI instructions for:', recipe.recipe_name);
      logger.dev('🤖 DEBUG: Ingredients:', ingredients);
      setGeneratingInstructions(true);

      try {
        // Try AI first
        try {
          const response = await fetch('/api/ai/recipe-instructions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipe,
              ingredients,
              countryCode: selectedCountry,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.instructions && data.source === 'ai') {
              setAiInstructions(data.instructions);
              setGeneratingInstructions(false);
              return;
            }
          }
        } catch (aiError) {
          logger.warn('AI recipe instructions failed, using fallback:', {
            error: aiError instanceof Error ? aiError.message : String(aiError),
          });
        }

        // Fallback to rule-based logic
        const analysis = analyzeIngredients(ingredients);
        logger.dev('🤖 DEBUG: Ingredient analysis:', analysis);
        const typeInfo = determineRecipeType(recipe);
        logger.dev('🤖 DEBUG: Recipe type:', typeInfo);
        const generatedInstructions = generateInstructions(recipe, ingredients, analysis, typeInfo);

        logger.dev('🤖 DEBUG: Generated instructions:', generatedInstructions);
        setAiInstructions(generatedInstructions);
        logger.dev('🤖 DEBUG: AI instructions state set');
      } catch (err) {
        logger.error('🤖 DEBUG: Error generating instructions:', err);
        throw new Error('Failed to generate cooking instructions');
      } finally {
        setGeneratingInstructions(false);
      }
    },
    [selectedCountry],
  );

  return {
    aiInstructions,
    generatingInstructions,
    generateAIInstructions,
  };
}
