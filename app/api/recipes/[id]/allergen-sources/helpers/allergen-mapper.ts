import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

export interface AllergenSource {
  ingredient_id: string;
  ingredient_name: string;
  brand?: string;
  quantity?: number;
  unit?: string;
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

export type AllergenMap = Record<string, AllergenSource[]>;

export interface RawRecipeIngredientJoin {
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    brand?: string;
    allergens?: string[];
    allergen_source?: {
      manual?: boolean;
      ai?: boolean;
    };
  } | null;
}

export function buildAllergenMap(recipeIngredients: unknown[]): {
  allergenSources: AllergenMap;
  allAllergens: Set<string>;
} {
  const allergenSources: AllergenMap = {};
  const allAllergens = new Set<string>();

  recipeIngredients.forEach(ri => {
    const rawRi = ri as RawRecipeIngredientJoin;
    const ingredient = rawRi.ingredients;

    if (!ingredient) return;

    const allergens = (ingredient.allergens as string[]) || [];
    const consolidatedAllergens = consolidateAllergens(allergens);

    consolidatedAllergens.forEach(allergen => {
      if (typeof allergen === 'string' && allergen.length > 0) {
        allAllergens.add(allergen);

        if (!allergenSources[allergen]) {
          allergenSources[allergen] = [];
        }

        allergenSources[allergen].push({
          ingredient_id: ingredient.id,
          ingredient_name: ingredient.ingredient_name,
          brand: ingredient.brand || undefined,
          quantity: rawRi.quantity || undefined,
          unit: rawRi.unit || undefined,
          allergen_source: ingredient.allergen_source || undefined,
        });
      }
    });
  });

  return { allergenSources, allAllergens };
}

export function formatAllergenResponse(
  recipeId: string,
  recipeName: string,
  allergenSources: AllergenMap,
  allAllergens: Set<string>,
) {
  const allergenSourcesArray = Object.entries(allergenSources).map(([allergen_code, sources]) => ({
    allergen_code,
    sources,
    source_count: sources.length,
  }));

  return {
    recipe_id: recipeId,
    recipe_name: recipeName,
    allergen_sources: allergenSourcesArray,
    total_allergens: Array.from(allAllergens).sort(),
  };
}
