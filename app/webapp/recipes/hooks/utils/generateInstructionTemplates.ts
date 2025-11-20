import { Recipe, RecipeIngredientWithDetails } from '../../types';
import { IngredientAnalysis } from './analyzeIngredients';
import { RecipeTypeInfo } from './determineRecipeType';

export function generateBurgerInstructions(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
  analysis: IngredientAnalysis,
  cookingMethod: string,
): string {
  const { hasProtein, hasVegetables, hasDairy } = analysis;
  const proteinName =
    ingredients.find(
      ri =>
        ri.ingredients.ingredient_name.toLowerCase().includes('beef') ||
        ri.ingredients.ingredient_name.toLowerCase().includes('mince'),
    )?.ingredients.ingredient_name || 'main protein';
  const cheeseName =
    ingredients.find(ri => ri.ingredients.ingredient_name.toLowerCase().includes('cheese'))
      ?.ingredients.ingredient_name || 'cheese';
  const cookingSurface =
    cookingMethod === 'grill/pan' ? 'grill or large skillet' : 'cooking surface';
  return `**Burger Preparation:**
**Mise en Place:**
1. Gather all ingredients and equipment
2. Prepare work station with cutting board, knives, and mixing bowls
3. Preheat ${cookingSurface} to medium-high heat
**Ingredient Prep:**
${hasProtein ? `1. Prepare protein: ${proteinName} - season and form into patties` : ''}${hasVegetables ? `\n${hasProtein ? '2' : '1'}. Prep vegetables: Wash, peel, and chop all vegetables as needed` : ''}${hasDairy ? `\n${hasProtein && hasVegetables ? '3' : hasProtein || hasVegetables ? '2' : '1'}. Prepare dairy: ${cheeseName} - slice or grate as needed` : ''}
**Cooking Method:**
1. Heat cooking surface to medium-high (375°F/190°C)
2. ${hasProtein ? 'Cook protein patties for 4-5 minutes per side for medium doneness' : 'Cook main ingredients'}
3. ${hasVegetables ? 'Sauté vegetables until tender-crisp' : 'Cook vegetables as needed'}
4. ${hasDairy ? 'Add cheese in final 1-2 minutes of cooking' : 'Add finishing ingredients'}
**Assembly & Service:**
1. Toast buns if desired
2. Layer ingredients: protein, vegetables, condiments
3. Serve immediately while hot
4. Yield: ${recipe.yield} ${recipe.yield_unit}
**Professional Tips:**
- Maintain consistent heat for even cooking
- Don't press patties while cooking
- Let meat rest 2-3 minutes before serving
- Keep ingredients warm during assembly`;
}

export function generateSoupInstructions(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
  analysis: IngredientAnalysis,
): string {
  const { hasProtein, hasVegetables, hasGrains } = analysis;
  const proteinName =
    ingredients.find(
      ri =>
        ri.ingredients.ingredient_name.toLowerCase().includes('beef') ||
        ri.ingredients.ingredient_name.toLowerCase().includes('chicken'),
    )?.ingredients.ingredient_name || 'protein';
  const grainName =
    ingredients.find(
      ri =>
        ri.ingredients.ingredient_name.toLowerCase().includes('rice') ||
        ri.ingredients.ingredient_name.toLowerCase().includes('pasta'),
    )?.ingredients.ingredient_name || 'grains';
  return `**Soup Preparation:**
**Mise en Place:**
1. Gather all ingredients and large pot
2. Prepare cutting board and sharp knives
3. Have stock or broth ready at room temperature
**Ingredient Prep:**
${hasProtein ? `1. Prepare protein: Cut ${proteinName} into bite-sized pieces` : ''}${hasVegetables ? `\n${hasProtein ? '2' : '1'}. Prep vegetables: Dice aromatics (onions, carrots, celery) uniformly` : ''}${hasGrains ? `\n${hasProtein && hasVegetables ? '3' : hasProtein || hasVegetables ? '2' : '1'}. Prepare grains: ${grainName} - rinse if needed` : ''}
**Cooking Method:**
1. Heat large pot over medium heat
2. ${hasProtein ? 'Sear protein until browned, remove and set aside' : 'Start with aromatics'}
3. ${hasVegetables ? 'Sauté vegetables until softened (5-7 minutes)' : 'Cook base ingredients'}
4. Add liquid and bring to boil, then reduce to simmer
5. ${hasProtein ? 'Return protein to pot' : 'Add main ingredients'}
6. Simmer until all ingredients are tender (20-30 minutes)
**Final Steps:**
1. Taste and adjust seasoning
2. Skim any excess fat from surface
3. Serve hot with garnishes
4. Yield: ${recipe.yield} ${recipe.yield_unit}
**Professional Tips:**
- Build layers of flavor (sauté aromatics first)
- Simmer gently to avoid breaking ingredients
- Taste frequently and adjust seasoning
- Cool quickly if storing`;
}

export function generateGeneralInstructions(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
  analysis: IngredientAnalysis,
): string {
  const { hasProtein, hasVegetables, hasDairy } = analysis;
  const proteinName =
    ingredients.find(
      ri =>
        ri.ingredients.ingredient_name.toLowerCase().includes('beef') ||
        ri.ingredients.ingredient_name.toLowerCase().includes('chicken') ||
        ri.ingredients.ingredient_name.toLowerCase().includes('mince'),
    )?.ingredients.ingredient_name || 'main protein';
  const dairyName =
    ingredients.find(
      ri =>
        ri.ingredients.ingredient_name.toLowerCase().includes('cheese') ||
        ri.ingredients.ingredient_name.toLowerCase().includes('milk'),
    )?.ingredients.ingredient_name || 'dairy products';
  return `**${recipe.recipe_name} Preparation:**
**Mise en Place:**
1. Gather all ingredients and equipment
2. Prepare work station with cutting board and knives
3. Preheat cooking equipment as needed
**Ingredient Prep:**
${hasProtein ? `1. Prepare protein: ${proteinName} - cut, season, or prepare as needed` : ''}${hasVegetables ? `\n${hasProtein ? '2' : '1'}. Prep vegetables: Wash, peel, and cut vegetables uniformly` : ''}${hasDairy ? `\n${hasProtein && hasVegetables ? '3' : hasProtein || hasVegetables ? '2' : '1'}. Prepare dairy: ${dairyName} - prepare as needed` : ''}
**Cooking Method:**
1. Heat cooking surface to appropriate temperature
2. ${hasProtein ? 'Cook protein first, then remove and set aside' : 'Start with base ingredients'}
3. ${hasVegetables ? 'Cook vegetables until desired doneness' : 'Cook main ingredients'}
4. ${hasProtein ? 'Return protein to pan' : 'Combine all ingredients'}
5. Season and finish cooking
**Final Steps:**
1. Taste and adjust seasoning
2. Plate attractively for ${recipe.yield} ${recipe.yield_unit}
3. Serve immediately while hot
**Professional Tips:**
- Maintain consistent heat throughout cooking
- Use proper knife skills for uniform cuts
- Keep work area clean and organized
- Taste frequently and adjust seasoning`;
}

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
