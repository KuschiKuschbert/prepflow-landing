import { RecipePrepDetails } from '@/lib/types/prep-lists';
import { Recipe } from '@/lib/types/recipes';
import { parsePrepDetailsResponse } from '@/lib/ai/prompts/prep-details';

/**
 * Maps the AI response content to the RecipePrepDetails structure.
 */
export function mapAIResponseToPrepDetails(content: string, recipe: Recipe): RecipePrepDetails {
  const parsed = parsePrepDetailsResponse(content);

  return {
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
}
