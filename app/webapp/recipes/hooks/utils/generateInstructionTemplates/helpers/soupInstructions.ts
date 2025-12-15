/**
 * Generate soup instruction template.
 */
import type { Recipe, RecipeIngredientWithDetails } from '../../../types';
import type { IngredientAnalysis } from '../analyzeIngredients';

export function generateSoupInstructions(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
  analysis: IngredientAnalysis,
): string {
  const { hasProtein, hasVegetables, hasGrains } = analysis;
  const proteinName = ingredients.find(ri => ri.ingredients.ingredient_name.toLowerCase().includes('beef') || ri.ingredients.ingredient_name.toLowerCase().includes('chicken'))?.ingredients.ingredient_name || 'protein';
  const grainName = ingredients.find(ri => ri.ingredients.ingredient_name.toLowerCase().includes('rice') || ri.ingredients.ingredient_name.toLowerCase().includes('pasta'))?.ingredients.ingredient_name || 'grains';
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
