import { supabaseAdmin } from '@/lib/supabase';

interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: any[];
  recipeGrouped: any[];
}

export async function processRecipe(
  recipeId: string,
  recipeName: string,
  dishId: string | null,
  dishName: string | null,
  sectionsData: Map<string | null, SectionData>,
  unassignedItems: any[],
  sectionsMap: Map<string, { id: string; name: string }>,
  recipeMultiplier: number = 1,
) {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Get recipe ingredients
  const { data: recipeIngredients } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('ingredient_id, quantity, unit, ingredients(id, ingredient_name)')
    .eq('recipe_id', recipeId);

  if (!recipeIngredients || recipeIngredients.length === 0) {
    return;
  }

  // Determine section
  let sectionId: string | null = null;
  let sectionName = 'Uncategorized';

  if (dishId) {
    const { data: dishSections } = await supabaseAdmin
      .from('dish_sections')
      .select('section_id, kitchen_sections(id, name)')
      .eq('dish_id', dishId)
      .limit(1);

    if (dishSections && dishSections.length > 0) {
      sectionId = dishSections[0].section_id;
      const section = (dishSections[0] as any).kitchen_sections;
      if (section) {
        sectionName = section.name;
      }
    }
  }

  const sectionKey = sectionId || null;

  // Prepare recipe grouped item
  const recipeGroupedItem = {
    recipeId,
    recipeName,
    dishId: dishId || undefined,
    dishName: dishName || undefined,
    ingredients: recipeIngredients.map((ri: any) => {
      const ingredient = ri.ingredients;
      return {
        ingredientId: ingredient.id,
        name: ingredient.ingredient_name || ingredient.name,
        quantity: Number(ri.quantity) * recipeMultiplier,
        unit: ri.unit,
      };
    }),
  };

  // Add to recipe grouped
  if (!sectionsData.has(sectionKey)) {
    sectionsData.set(sectionKey, {
      sectionId,
      sectionName,
      aggregatedIngredients: [],
      recipeGrouped: [],
    });
  }

  const section = sectionsData.get(sectionKey)!;
  section.recipeGrouped.push(recipeGroupedItem);

  // Add to aggregated ingredients
  for (const ri of recipeIngredients) {
    const ingredient = (ri as any).ingredients;
    if (ingredient) {
      const ingredientId = ingredient.id;
      const ingredientName = ingredient.ingredient_name || ingredient.name;
      const quantity = Number(ri.quantity) * recipeMultiplier;

      const existing = section.aggregatedIngredients.find(
        (agg: any) => agg.ingredientId === ingredientId && agg.unit === ri.unit,
      );

      if (existing) {
        existing.totalQuantity += quantity;
        existing.sources.push({
          type: 'recipe',
          id: recipeId,
          name: recipeName,
          quantity: recipeMultiplier,
        });
      } else {
        section.aggregatedIngredients.push({
          ingredientId,
          name: ingredientName,
          totalQuantity: quantity,
          unit: ri.unit,
          sources: [
            {
              type: 'recipe',
              id: recipeId,
              name: recipeName,
              quantity: recipeMultiplier,
            },
          ],
        });
      }
    }
  }
}
