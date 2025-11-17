/**
 * Shared utilities for aggregating prep techniques
 * Used by both API routes and frontend components
 */

import type { SectionData, PrepTechniquesSection, RecipePrepDetails } from '../types';

/**
 * Aggregate prep techniques from recipes in a section
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

/**
 * Add prep notes to aggregated ingredients based on prep details
 */
export function addPrepNotesToIngredients(section: SectionData): void {
  // Create a map of ingredient prep notes from recipes
  const ingredientPrepNotes = new Map<string, Set<string>>();

  for (const recipe of section.recipeGrouped) {
    if (!recipe.prepDetails) continue;

    // Map cut shapes to ingredients
    for (const cutShape of recipe.prepDetails.cutShapes) {
      const ingredientKey = cutShape.ingredientId || cutShape.ingredient.toLowerCase();
      if (!ingredientPrepNotes.has(ingredientKey)) {
        ingredientPrepNotes.set(ingredientKey, new Set());
      }
      ingredientPrepNotes.get(ingredientKey)!.add(cutShape.shape);
    }

    // Map marinations to ingredients
    for (const marination of recipe.prepDetails.marinations) {
      const ingredientKey = marination.ingredientId || marination.ingredient.toLowerCase();
      if (!ingredientPrepNotes.has(ingredientKey)) {
        ingredientPrepNotes.set(ingredientKey, new Set());
      }
      ingredientPrepNotes.get(ingredientKey)!.add(`Marinated: ${marination.method}`);
    }

    // Map pre-cooking steps to ingredients
    for (const preCooking of recipe.prepDetails.preCookingSteps) {
      const ingredientKey = preCooking.ingredientId || preCooking.ingredient.toLowerCase();
      if (!ingredientPrepNotes.has(ingredientKey)) {
        ingredientPrepNotes.set(ingredientKey, new Set());
      }
      ingredientPrepNotes.get(ingredientKey)!.add(preCooking.step);
    }
  }

  // Add prep notes to aggregated ingredients
  for (const ingredient of section.aggregatedIngredients) {
    const notes: string[] = [];

    // Try to match by ingredient ID first, then by name
    const ingredientKey = ingredient.ingredientId || ingredient.name.toLowerCase();
    const prepNotesSet =
      ingredientPrepNotes.get(ingredientKey) ||
      ingredientPrepNotes.get(ingredient.name.toLowerCase());

    if (prepNotesSet) {
      notes.push(...Array.from(prepNotesSet));
    }

    if (notes.length > 0) {
      ingredient.prepNotes = notes;
    }
  }

  // Also add prep notes to recipe grouped ingredients
  for (const recipe of section.recipeGrouped) {
    if (!recipe.prepDetails) continue;

    for (const ingredient of recipe.ingredients) {
      const notes: string[] = [];

      // Add cut shapes
      const cutShapes = recipe.prepDetails.cutShapes.filter(
        cs =>
          (cs.ingredientId && cs.ingredientId === ingredient.ingredientId) ||
          cs.ingredient.toLowerCase() === ingredient.name.toLowerCase(),
      );
      cutShapes.forEach(cs => notes.push(cs.shape));

      // Add marination
      const marinations = recipe.prepDetails.marinations.filter(
        m =>
          (m.ingredientId && m.ingredientId === ingredient.ingredientId) ||
          m.ingredient.toLowerCase() === ingredient.name.toLowerCase(),
      );
      marinations.forEach(m => notes.push(`Marinated: ${m.method}`));

      // Add pre-cooking steps
      const preCookingSteps = recipe.prepDetails.preCookingSteps.filter(
        pc =>
          (pc.ingredientId && pc.ingredientId === ingredient.ingredientId) ||
          pc.ingredient.toLowerCase() === ingredient.name.toLowerCase(),
      );
      preCookingSteps.forEach(pc => notes.push(pc.step));

      if (notes.length > 0) {
        ingredient.prepNotes = notes;
      }
    }
  }
}
