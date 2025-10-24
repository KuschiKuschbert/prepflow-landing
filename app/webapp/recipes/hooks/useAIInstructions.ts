'use client';

import { useCallback, useState } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';

export function useAIInstructions() {
  const [aiInstructions, setAiInstructions] = useState<string>('');
  const [generatingInstructions, setGeneratingInstructions] = useState(false);

  const generateAIInstructions = useCallback(
    async (recipe: Recipe, ingredients: RecipeIngredientWithDetails[]) => {
      console.log('🤖 DEBUG: Generating AI instructions for:', recipe.name);
      console.log('🤖 DEBUG: Ingredients:', ingredients);
      setGeneratingInstructions(true);

      try {
        // Analyze ingredients to determine cooking method
        const ingredientNames = ingredients.map(ri => ri.ingredients.ingredient_name.toLowerCase());
        console.log('🤖 DEBUG: Ingredient names:', ingredientNames);

        const hasProtein = ingredientNames.some(
          name =>
            name.includes('beef') ||
            name.includes('chicken') ||
            name.includes('pork') ||
            name.includes('fish') ||
            name.includes('lamb') ||
            name.includes('mince'),
        );
        const hasVegetables = ingredientNames.some(
          name =>
            name.includes('carrot') ||
            name.includes('onion') ||
            name.includes('garlic') ||
            name.includes('tomato') ||
            name.includes('pepper') ||
            name.includes('celery'),
        );
        const hasDairy = ingredientNames.some(
          name =>
            name.includes('cheese') ||
            name.includes('milk') ||
            name.includes('cream') ||
            name.includes('butter') ||
            name.includes('yogurt'),
        );
        const hasGrains = ingredientNames.some(
          name =>
            name.includes('rice') ||
            name.includes('pasta') ||
            name.includes('bread') ||
            name.includes('flour') ||
            name.includes('quinoa'),
        );

        // Determine recipe type and cooking method
        let recipeType = 'general';
        let cookingMethod = 'stovetop';
        let primaryTechnique = 'sautéing';

        if (
          recipe.name.toLowerCase().includes('burger') ||
          recipe.name.toLowerCase().includes('patty')
        ) {
          recipeType = 'burger';
          cookingMethod = 'grill/pan';
          primaryTechnique = 'grilling/pan-frying';
        } else if (
          recipe.name.toLowerCase().includes('soup') ||
          recipe.name.toLowerCase().includes('stew')
        ) {
          recipeType = 'soup';
          cookingMethod = 'stovetop';
          primaryTechnique = 'simmering';
        } else if (recipe.name.toLowerCase().includes('salad')) {
          recipeType = 'salad';
          cookingMethod = 'cold prep';
          primaryTechnique = 'mixing';
        } else if (
          recipe.name.toLowerCase().includes('pasta') ||
          recipe.name.toLowerCase().includes('noodle')
        ) {
          recipeType = 'pasta';
          cookingMethod = 'stovetop';
          primaryTechnique = 'boiling/sautéing';
        }

        // Generate specific instructions based on recipe analysis
        let generatedInstructions = '';

        if (recipeType === 'burger') {
          generatedInstructions = `**Burger Preparation:**

**Mise en Place:**
1. Gather all ingredients and equipment
2. Prepare work station with cutting board, knives, and mixing bowls
3. Preheat ${cookingMethod === 'grill/pan' ? 'grill or large skillet' : 'cooking surface'} to medium-high heat

**Ingredient Prep:**
${
  hasProtein
    ? `1. Prepare protein: ${
        ingredients.find(
          ri =>
            ri.ingredients.ingredient_name.toLowerCase().includes('beef') ||
            ri.ingredients.ingredient_name.toLowerCase().includes('mince'),
        )?.ingredients.ingredient_name || 'main protein'
      } - season and form into patties`
    : ''
}
${hasVegetables ? `2. Prep vegetables: Wash, peel, and chop all vegetables as needed` : ''}
${
  hasDairy
    ? `3. Prepare dairy: ${
        ingredients.find(ri => ri.ingredients.ingredient_name.toLowerCase().includes('cheese'))
          ?.ingredients.ingredient_name || 'cheese'
      } - slice or grate as needed`
    : ''
}

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
        } else if (recipeType === 'soup') {
          generatedInstructions = `**Soup Preparation:**

**Mise en Place:**
1. Gather all ingredients and large pot
2. Prepare cutting board and sharp knives
3. Have stock or broth ready at room temperature

**Ingredient Prep:**
${
  hasProtein
    ? `1. Prepare protein: Cut ${
        ingredients.find(
          ri =>
            ri.ingredients.ingredient_name.toLowerCase().includes('beef') ||
            ri.ingredients.ingredient_name.toLowerCase().includes('chicken'),
        )?.ingredients.ingredient_name || 'protein'
      } into bite-sized pieces`
    : ''
}
${hasVegetables ? `2. Prep vegetables: Dice aromatics (onions, carrots, celery) uniformly` : ''}
${
  hasGrains
    ? `3. Prepare grains: ${
        ingredients.find(
          ri =>
            ri.ingredients.ingredient_name.toLowerCase().includes('rice') ||
            ri.ingredients.ingredient_name.toLowerCase().includes('pasta'),
        )?.ingredients.ingredient_name || 'grains'
      } - rinse if needed`
    : ''
}

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
        } else {
          // General recipe instructions
          generatedInstructions = `**${recipe.name} Preparation:**

**Mise en Place:**
1. Gather all ingredients and equipment
2. Prepare work station with cutting board and knives
3. Preheat cooking equipment as needed

**Ingredient Prep:**
${
  hasProtein
    ? `1. Prepare protein: ${
        ingredients.find(
          ri =>
            ri.ingredients.ingredient_name.toLowerCase().includes('beef') ||
            ri.ingredients.ingredient_name.toLowerCase().includes('chicken') ||
            ri.ingredients.ingredient_name.toLowerCase().includes('mince'),
        )?.ingredients.ingredient_name || 'main protein'
      } - cut, season, or prepare as needed`
    : ''
}
${hasVegetables ? `2. Prep vegetables: Wash, peel, and cut vegetables uniformly` : ''}
${
  hasDairy
    ? `3. Prepare dairy: ${
        ingredients.find(
          ri =>
            ri.ingredients.ingredient_name.toLowerCase().includes('cheese') ||
            ri.ingredients.ingredient_name.toLowerCase().includes('milk'),
        )?.ingredients.ingredient_name || 'dairy products'
      } - prepare as needed`
    : ''
}

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

        console.log('🤖 DEBUG: Generated instructions:', generatedInstructions);
        setAiInstructions(generatedInstructions);
        console.log('🤖 DEBUG: AI instructions state set');
      } catch (err) {
        console.error('🤖 DEBUG: Error generating instructions:', err);
        throw new Error('Failed to generate cooking instructions');
      } finally {
        setGeneratingInstructions(false);
      }
    },
    [],
  );

  return {
    aiInstructions,
    generatingInstructions,
    generateAIInstructions,
  };
}
