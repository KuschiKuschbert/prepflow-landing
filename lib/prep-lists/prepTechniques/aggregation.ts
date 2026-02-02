import type { SectionData, PrepTechniquesSection } from '@/lib/types/prep-lists';

/**
 * Aggregate prep techniques from recipes in a section.
 *
 * @param {SectionData} section - Section data containing recipes
 * @returns {PrepTechniquesSection} Aggregated prep techniques
 */
export function aggregatePrepTechniques(section: SectionData): PrepTechniquesSection {
  const cutShapesMap = new Map<
    string,
    { ingredient: string; ingredientId?: string; shape: string; recipes: string[] }
  >();
  const sauces: PrepTechniquesSection['sauces'] = [];
  const marinations: PrepTechniquesSection['marinations'] = [];
  const preCookingStepsMap = new Map<
    string,
    { ingredient: string; ingredientId?: string; step: string; recipes: string[] }
  >();
  const specialTechniquesMap = new Map<
    string,
    { description: string; details?: string; recipes: string[] }
  >();

  // Process all recipes in the section
  for (const recipe of section.recipeGrouped) {
    if (!recipe.prepDetails) continue;

    const prepDetails = recipe.prepDetails;

    // Aggregate cut shapes
    for (const cutShape of prepDetails.cutShapes) {
      const key = `${cutShape.ingredient.toLowerCase()}_${cutShape.shape.toLowerCase()}`;
      if (cutShapesMap.has(key)) {
        const existing = cutShapesMap.get(key)!;
        if (!existing.recipes.includes(recipe.recipeName)) {
          existing.recipes.push(recipe.recipeName);
        }
      } else {
        cutShapesMap.set(key, {
          ingredient: cutShape.ingredient,
          ingredientId: cutShape.ingredientId,
          shape: cutShape.shape,
          recipes: [recipe.recipeName],
        });
      }
    }

    // Aggregate sauces
    for (const sauce of prepDetails.sauces) {
      sauces.push(sauce);
    }

    // Aggregate marinations
    for (const marination of prepDetails.marinations) {
      marinations.push(marination);
    }

    // Aggregate pre-cooking steps
    for (const preCooking of prepDetails.preCookingSteps) {
      const key = `${preCooking.ingredient.toLowerCase()}_${preCooking.step.toLowerCase()}`;
      if (preCookingStepsMap.has(key)) {
        const existing = preCookingStepsMap.get(key)!;
        if (!existing.recipes.includes(recipe.recipeName)) {
          existing.recipes.push(recipe.recipeName);
        }
      } else {
        preCookingStepsMap.set(key, {
          ingredient: preCooking.ingredient,
          ingredientId: preCooking.ingredientId,
          step: preCooking.step,
          recipes: [recipe.recipeName],
        });
      }
    }

    // Aggregate special techniques
    for (const technique of prepDetails.specialTechniques) {
      const key = technique.description.toLowerCase();
      if (specialTechniquesMap.has(key)) {
        const existing = specialTechniquesMap.get(key)!;
        if (!existing.recipes.includes(recipe.recipeName)) {
          existing.recipes.push(recipe.recipeName);
        }
      } else {
        specialTechniquesMap.set(key, {
          description: technique.description,
          details: technique.details,
          recipes: [recipe.recipeName],
        });
      }
    }
  }

  return {
    cutShapes: Array.from(cutShapesMap.values()),
    sauces,
    marinations,
    preCookingSteps: Array.from(preCookingStepsMap.values()),
    specialTechniques: Array.from(specialTechniquesMap.values()),
  };
}
