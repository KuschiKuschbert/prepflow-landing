/**
 * Generate general instruction template.
 */
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import type { IngredientAnalysis } from '../../analyzeIngredients';

export function generateGeneralInstructions(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
  analysis: IngredientAnalysis,
): string {
  const { hasProtein, hasVegetables, hasDairy } = analysis;
  const proteinName =
    ingredients.find(
      ri =>
        (ri.ingredients.ingredient_name || '').toLowerCase().includes('beef') ||
        (ri.ingredients.ingredient_name || '').toLowerCase().includes('chicken') ||
        (ri.ingredients.ingredient_name || '').toLowerCase().includes('mince'),
    )?.ingredients.ingredient_name || 'main protein';
  const dairyName =
    ingredients.find(
      ri =>
        (ri.ingredients.ingredient_name || '').toLowerCase().includes('cheese') ||
        (ri.ingredients.ingredient_name || '').toLowerCase().includes('milk'),
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
