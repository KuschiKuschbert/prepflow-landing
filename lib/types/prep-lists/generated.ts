import type { SauceDetail, MarinationDetail } from './prep-details';
import type { RecipePrepDetails } from './prep-details';
import type { AggregatedIngredient } from './prep-details';

export interface RecipeGroupedItem {
  recipeId: string;
  recipeName: string;
  dishId?: string;
  dishName?: string;
  instructions?: string;
  prepDetails?: RecipePrepDetails;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
    prepNotes?: string[];
  }>;
}

export interface PrepInstructionItem {
  recipeId: string;
  recipeName: string;
  instructions: string;
  dishId?: string;
  dishName?: string;
  sectionId?: string | null;
  sectionName?: string;
}

export interface PrepTechniquesSection {
  cutShapes: Array<{ ingredient: string; ingredientId?: string; shape: string; recipes: string[] }>;
  sauces: SauceDetail[];
  marinations: MarinationDetail[];
  preCookingSteps: Array<{
    ingredient: string;
    ingredientId?: string;
    step: string;
    recipes: string[];
  }>;
  specialTechniques: Array<{ description: string; details?: string; recipes: string[] }>;
}

export interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: AggregatedIngredient[];
  recipeGrouped: RecipeGroupedItem[];
  prepInstructions: PrepInstructionItem[];
  prepTechniques?: PrepTechniquesSection;
}

export interface GeneratedPrepListData {
  success: boolean;
  menuName: string;
  menuId: string;
  sections: SectionData[];
  unassignedItems?: RecipeGroupedItem[];
}
