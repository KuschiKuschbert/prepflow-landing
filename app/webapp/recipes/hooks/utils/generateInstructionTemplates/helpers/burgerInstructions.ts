/**
 * Generate burger instruction template.
 */
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import type { IngredientAnalysis } from '../../analyzeIngredients';

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
