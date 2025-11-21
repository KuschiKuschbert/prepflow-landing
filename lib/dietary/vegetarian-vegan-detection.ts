/**
 * Vegetarian and Vegan Suitability Detection
 * Hybrid approach: Non-AI keyword matching (primary) with AI fallback
 */

import { logger } from '@/lib/logger';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

export interface DietaryDetectionResult {
  isVegetarian: boolean;
  isVegan: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason?: string;
  method: 'non-ai' | 'ai';
}

interface Ingredient {
  ingredient_name: string;
  category?: string;
  allergens?: string[];
}

/**
 * Comprehensive list of non-vegetarian keywords
 */
const NON_VEGETARIAN_KEYWORDS = [
  // Meat
  'beef',
  'pork',
  'lamb',
  'veal',
  'mutton',
  'goat',
  'venison',
  'bison',
  'steak',
  'chop',
  'cutlet',
  'sausage',
  'bacon',
  'ham',
  'prosciutto',
  'chorizo',
  'pepperoni',
  'salami',
  'meat',
  'mince',
  'ground',
  // Poultry
  'chicken',
  'turkey',
  'duck',
  'goose',
  'quail',
  'poultry',
  'hen',
  'rooster',
  // Fish
  'fish',
  'salmon',
  'tuna',
  'cod',
  'bass',
  'trout',
  'mackerel',
  'sardine',
  'anchovy',
  'herring',
  'halibut',
  'snapper',
  'barramundi',
  // Seafood
  'seafood',
  'prawn',
  'shrimp',
  'crab',
  'lobster',
  'crayfish',
  'oyster',
  'mussel',
  'scallop',
  'clam',
  'squid',
  'octopus',
  'calamari',
  // Animal-derived
  'gelatin',
  'gelatine',
  'rennet',
  'lard',
  'suet',
  'tallow',
  'stock',
  'broth',
  'bone',
  'marrow',
];

/**
 * Comprehensive list of non-vegan keywords (includes dairy and eggs)
 */
const NON_VEGAN_KEYWORDS = [
  // Dairy
  'milk',
  'cream',
  'butter',
  'cheese',
  'yogurt',
  'yoghurt',
  'whey',
  'casein',
  'lactose',
  'dairy',
  'ghee',
  'buttermilk',
  'sour cream',
  'creme',
  'mascarpone',
  'ricotta',
  'mozzarella',
  'parmesan',
  'cheddar',
  // Eggs
  'egg',
  'eggs',
  'albumin',
  'albumen',
  'lecithin',
  'mayonnaise',
  'mayo',
  // Other animal products
  'honey',
  'beeswax',
  'royal jelly',
  'carmine',
  'cochineal',
  'shellac',
  'lac',
  'carminic acid',
  // Already covered in non-vegetarian
  ...NON_VEGETARIAN_KEYWORDS,
];

/**
 * Check if an ingredient is non-vegetarian
 */
export function isNonVegetarianIngredient(ingredientName: string, category?: string): boolean {
  const lowerName = ingredientName.toLowerCase();
  const lowerCategory = category?.toLowerCase() || '';

  // Check against keywords
  return NON_VEGETARIAN_KEYWORDS.some(
    keyword =>
      lowerName.includes(keyword.toLowerCase()) || lowerCategory.includes(keyword.toLowerCase()),
  );
}

/**
 * Check if an ingredient is non-vegan
 * Uses allergens array if available (milk, eggs)
 * Handles allergen consolidation and case-insensitive checking
 */
export function isNonVeganIngredient(ingredientName: string, allergens?: string[]): boolean {
  const lowerName = ingredientName.toLowerCase();

  // Check allergens first (most reliable)
  if (allergens && Array.isArray(allergens)) {
    // Consolidate allergens to handle old codes (e.g., 'dairy' → 'milk')
    const consolidated = consolidateAllergens(allergens);

    // Check for milk or eggs (case-insensitive, but codes should be lowercase)
    const lowerAllergens = consolidated.map(a => a.toLowerCase());
    if (lowerAllergens.includes('milk') || lowerAllergens.includes('eggs')) {
      return true;
    }
  }

  // Check against keywords
  return NON_VEGAN_KEYWORDS.some(keyword => lowerName.includes(keyword.toLowerCase()));
}

/**
 * Detect vegetarian/vegan suitability from ingredients (non-AI approach)
 * Also checks recipe/dish name for meat/fish keywords
 */
export function detectVegetarianVeganFromIngredients(
  ingredients: Ingredient[],
  recipeOrDishName?: string,
): DietaryDetectionResult {
  let hasNonVegetarian = false;
  let hasNonVegan = false;
  const reasons: string[] = [];

  // First, check the recipe/dish name for non-vegetarian keywords
  // This catches cases where ingredients might not have clear meat names
  if (recipeOrDishName) {
    const nameIsNonVeg = isNonVegetarianIngredient(recipeOrDishName);
    if (nameIsNonVeg) {
      hasNonVegetarian = true;
      reasons.push(`Recipe/dish name "${recipeOrDishName}" contains meat/fish keywords`);
    }
  }

  if (!ingredients || ingredients.length === 0) {
    // No ingredients - return based on name check or default to vegetarian/vegan
    return {
      isVegetarian: !hasNonVegetarian,
      isVegan: !hasNonVegan && !hasNonVegetarian,
      confidence: hasNonVegetarian ? 'high' : 'medium',
      reason: hasNonVegetarian ? reasons.join('; ') : 'No ingredients specified',
      method: 'non-ai',
    };
  }

  // Check ingredients for non-vegetarian/vegan items
  ingredients.forEach(ingredient => {
    const name = ingredient.ingredient_name || '';
    const category = ingredient.category || '';
    const allergens = ingredient.allergens || [];

    // Check for non-vegetarian ingredients
    const isNonVeg = isNonVegetarianIngredient(name, category);
    if (isNonVeg) {
      hasNonVegetarian = true;
      reasons.push(`${name} contains meat/fish`);
    }

    // Check for non-vegan ingredients
    const isNonVeganIng = isNonVeganIngredient(name, allergens);
    if (isNonVeganIng) {
      hasNonVegan = true;
      if (!hasNonVegetarian) {
        // Only add reason if it's not already non-vegetarian
        reasons.push(`${name} contains animal products`);
      }
    }
  });

  const isVegetarian = !hasNonVegetarian;
  const isVegan = !hasNonVegan && isVegetarian;

  // Log detection results for debugging
  logger.dev('[Dietary Detection] Detection result:', {
    recipeOrDishName,
    ingredientCount: ingredients.length,
    ingredientNames: ingredients.map(i => i.ingredient_name),
    hasNonVegetarian,
    hasNonVegan,
    isVegetarian,
    isVegan,
    reasons,
  });

  // Determine confidence based on ingredient clarity
  let confidence: 'high' | 'medium' | 'low' = 'high';
  if (reasons.length === 0 && ingredients.length > 0) {
    // No clear non-vegetarian/vegan ingredients found, but ingredients exist
    // Could be ambiguous ingredients
    confidence = 'medium';
  }

  return {
    isVegetarian,
    isVegan,
    confidence,
    reason: reasons.length > 0 ? reasons.join('; ') : undefined,
    method: 'non-ai',
  };
}

/**
 * Detect vegetarian/vegan suitability using AI (fallback)
 * Uses OpenAI API to analyze the recipe
 */
export async function detectVegetarianVeganWithAI(
  recipeName: string,
  ingredients: Ingredient[],
  description?: string,
): Promise<DietaryDetectionResult> {
  const { getOpenAIClient, isAIEnabled, getDefaultModel } = await import('@/lib/ai/openai-client');

  if (!isAIEnabled()) {
    logger.warn('[Dietary Detection] AI not enabled, falling back to non-AI detection');
    return detectVegetarianVeganFromIngredients(ingredients, recipeName);
  }

  const client = getOpenAIClient();
  if (!client) {
    logger.warn(
      '[Dietary Detection] OpenAI client not available, falling back to non-AI detection',
    );
    return detectVegetarianVeganFromIngredients(ingredients, recipeName);
  }

  try {
    const ingredientNames = ingredients.map(i => i.ingredient_name).join(', ');
    const allergenInfo = ingredients
      .filter(i => i.allergens && i.allergens.length > 0)
      .map(i => `${i.ingredient_name}: ${i.allergens?.join(', ')}`)
      .join('; ');

    const prompt = `Analyze the following recipe to determine if it is suitable for vegetarians and vegans.

Recipe Name: ${recipeName}
${description ? `Description: ${description}` : ''}
Ingredients: ${ingredientNames}
${allergenInfo ? `Known Allergens: ${allergenInfo}` : ''}

Please determine:
1. Is this recipe suitable for vegetarians? (vegetarians don't eat meat, fish, or poultry, but may eat dairy and eggs)
2. Is this recipe suitable for vegans? (vegans don't eat any animal products including meat, fish, poultry, dairy, eggs, honey, etc.)

Respond in JSON format:
{
  "isVegetarian": boolean,
  "isVegan": boolean,
  "confidence": "high" | "medium" | "low",
  "reason": "brief explanation"
}`;

    const completion = await client.chat.completions.create({
      model: getDefaultModel(),
      messages: [
        {
          role: 'system',
          content:
            'You are a dietary analysis expert. Analyze recipes and determine their suitability for vegetarians and vegans. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(responseText);
    return {
      isVegetarian: parsed.isVegetarian === true,
      isVegan: parsed.isVegan === true,
      confidence: parsed.confidence || 'medium',
      reason: parsed.reason,
      method: 'ai',
    };
  } catch (err) {
    logger.error('[Dietary Detection] AI detection failed:', err);
    // Fallback to non-AI detection
    return detectVegetarianVeganFromIngredients(ingredients, recipeName);
  }
}

/**
 * Hybrid detection function
 * Tries non-AI first, falls back to AI if confidence is low/medium or user requests it
 */
export async function detectDietarySuitability(
  recipeIdOrDishId: string,
  ingredients: Ingredient[],
  recipeName?: string,
  description?: string,
  useAI?: boolean,
): Promise<DietaryDetectionResult> {
  // First try non-AI detection (includes name check)
  const nonAIResult = detectVegetarianVeganFromIngredients(ingredients, recipeName);

  // If confidence is high and user didn't request AI, return non-AI result
  if (nonAIResult.confidence === 'high' && !useAI) {
    return nonAIResult;
  }

  // If confidence is low/medium or user requested AI, try AI detection
  if (
    (nonAIResult.confidence === 'low' || nonAIResult.confidence === 'medium' || useAI) &&
    recipeName
  ) {
    try {
      const aiResult = await detectVegetarianVeganWithAI(recipeName, ingredients, description);
      // AI takes precedence if used
      return aiResult;
    } catch (err) {
      logger.error('[Dietary Detection] AI detection failed, using non-AI result:', err);
      // Fallback to non-AI result if AI fails
      return nonAIResult;
    }
  }

  return nonAIResult;
}
