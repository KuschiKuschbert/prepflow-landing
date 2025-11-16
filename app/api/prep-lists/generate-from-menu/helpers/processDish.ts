import { supabaseAdmin } from '@/lib/supabase';
import { processRecipe } from './processRecipe';

interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: any[];
  recipeGrouped: any[];
}

export async function processDish(
  dishId: string,
  dishName: string,
  sectionsData: Map<string | null, SectionData>,
  unassignedItems: any[],
  sectionsMap: Map<string, { id: string; name: string }>,
) {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Get kitchen section for dish
  const { data: dishSections } = await supabaseAdmin
    .from('dish_sections')
    .select('section_id, kitchen_sections(id, name)')
    .eq('dish_id', dishId)
    .limit(1);

  let sectionId: string | null = null;
  let sectionName = 'Uncategorized';

  if (dishSections && dishSections.length > 0) {
    sectionId = dishSections[0].section_id;
    const section = (dishSections[0] as any).kitchen_sections;
    if (section) {
      sectionName = section.name;
    }
  }

  // Get dish recipes
  const { data: dishRecipes } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id, quantity, recipes(id, name)')
    .eq('dish_id', dishId);

  // Get dish ingredients (standalone ingredients not in recipes)
  const { data: dishIngredients } = await supabaseAdmin
    .from('dish_ingredients')
    .select('ingredient_id, quantity, unit, ingredients(id, ingredient_name)')
    .eq('dish_id', dishId);

  // Process dish recipes
  if (dishRecipes && dishRecipes.length > 0) {
    for (const dr of dishRecipes) {
      const recipe = (dr as any).recipes;
      if (recipe) {
        await processRecipe(
          recipe.id,
          recipe.name,
          dishId,
          dishName,
          sectionsData,
          unassignedItems,
          sectionsMap,
          dr.quantity || 1,
        );
      }
    }
  }

  // Process standalone dish ingredients
  if (dishIngredients && dishIngredients.length > 0) {
    const sectionKey = sectionId || null;
    if (!sectionsData.has(sectionKey)) {
      sectionsData.set(sectionKey, {
        sectionId,
        sectionName,
        aggregatedIngredients: [],
        recipeGrouped: [],
      });
    }

    const section = sectionsData.get(sectionKey)!;

    for (const di of dishIngredients) {
      const ingredient = (di as any).ingredients;
      if (ingredient) {
        const ingredientId = ingredient.id;
        const ingredientName = ingredient.ingredient_name || ingredient.name;

        const existing = section.aggregatedIngredients.find(
          (agg: any) => agg.ingredientId === ingredientId && agg.unit === di.unit,
        );

        if (existing) {
          existing.totalQuantity += Number(di.quantity);
          existing.sources.push({
            type: 'dish',
            id: dishId,
            name: dishName,
          });
        } else {
          section.aggregatedIngredients.push({
            ingredientId,
            name: ingredientName,
            totalQuantity: Number(di.quantity),
            unit: di.unit,
            sources: [
              {
                type: 'dish',
                id: dishId,
                name: dishName,
              },
            ],
          });
        }
      }
    }
  }
}
