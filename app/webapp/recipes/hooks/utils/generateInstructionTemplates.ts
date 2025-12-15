import { Recipe, RecipeIngredientWithDetails } from '../../types';
import { IngredientAnalysis } from './analyzeIngredients';
import { RecipeTypeInfo } from './determineRecipeType';
import { generateBurgerInstructions } from './generateInstructionTemplates/helpers/burgerInstructions';
import { generateSoupInstructions } from './generateInstructionTemplates/helpers/soupInstructions';
import { generateGeneralInstructions } from './generateInstructionTemplates/helpers/generalInstructions';

export function generateInstructions(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
  analysis: IngredientAnalysis,
  typeInfo: RecipeTypeInfo,
): string {
  return typeInfo.recipeType === 'burger'
    ? generateBurgerInstructions(recipe, ingredients, analysis, typeInfo.cookingMethod)
    : typeInfo.recipeType === 'soup'
      ? generateSoupInstructions(recipe, ingredients, analysis)
      : generateGeneralInstructions(recipe, ingredients, analysis);
}

export { generateBurgerInstructions, generateSoupInstructions, generateGeneralInstructions };
