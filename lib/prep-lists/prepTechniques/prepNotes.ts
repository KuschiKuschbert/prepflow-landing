import type { SectionData } from '@/lib/types/prep-lists';

/**
 * Add prep notes to aggregated ingredients based on prep details.
 *
 * @param {SectionData} section - Section data to add prep notes to
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
