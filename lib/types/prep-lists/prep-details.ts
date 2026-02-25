export interface IngredientSource {
  type: 'dish' | 'recipe';
  id: string;
  name: string;
  quantity?: number;
}

export interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalQuantity: number;
  unit: string;
  sources: IngredientSource[];
  prepNotes?: string[];
}

export type PrepDetailType = 'cut_shape' | 'sauce' | 'marination' | 'pre_cooking' | 'technique';

export interface PrepDetail {
  type: PrepDetailType;
  ingredientId?: string;
  ingredientName?: string;
  description: string;
  details?: string;
}

export interface SauceDetail {
  name: string;
  ingredients: string[];
  instructions: string;
  recipeId?: string;
}

export interface MarinationDetail {
  ingredient: string;
  ingredientId?: string;
  method: string;
  duration?: string;
  recipeId?: string;
}

export interface RecipePrepDetails {
  recipeId: string;
  recipeName: string;
  prepDetails: PrepDetail[];
  sauces: SauceDetail[];
  marinations: MarinationDetail[];
  cutShapes: Array<{ ingredient: string; ingredientId?: string; shape: string; quantity?: string }>;
  preCookingSteps: Array<{ ingredient: string; ingredientId?: string; step: string }>;
  specialTechniques: Array<{ description: string; details?: string }>;
}
