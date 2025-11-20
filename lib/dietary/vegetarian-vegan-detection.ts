/**
 * Vegetarian and Vegan Suitability Detection
 * Hybrid approach: Non-AI keyword matching (primary) with AI fallback
 */

import { logger } from '@/lib/logger';

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
 */
export function isNonVeganIngredient(ingredientName: string, allergens?: string[]): boolean {
  const lowerName = ingredientName.toLowerCase();

  // Check allergens first (most reliable)
  if (allergens && Array.isArray(allergens)) {
    if (allergens.includes('milk') || allergens.includes('eggs')) {
      return true;
    }
  }

  // Check against keywords
  return NON_VEGAN_KEYWORDS.some(keyword => lowerName.includes(keyword.toLowerCase()));
}

/**
 * Detect vegetarian/vegan suitability from ingredients (non-AI approach)
 */
export function detectVegetarianVeganFromIngredients(
  ingredients: Ingredient[],
): DietaryDetectionResult {
  if (!ingredients || ingredients.length === 0) {
    return {
      isVegetarian: true,
      isVegan: true,
      confidence: 'high',
      reason: 'No ingredients specified',
      method: 'non-ai',
    };
  }

  let hasNonVegetarian = false;
  let hasNonVegan = false;
  const reasons: string[] = [];

  ingredients.forEach(ingredient => {
    const name = ingredient.ingredient_name || '';
    const category = ingredient.category || '';
    const allergens = ingredient.allergens || [];

    // Check for non-vegetarian ingredients
    if (isNonVegetarianIngredient(name, category)) {
      hasNonVegetarian = true;
      reasons.push(`${name} contains meat/fish`);
    }

    // Check for non-vegan ingredients
    if (isNonVeganIngredient(name, allergens)) {
      hasNonVegan = true;
      if (!hasNonVegetarian) {
        // Only add reason if it's not already non-vegetarian
        reasons.push(`${name} contains animal products`);
      }
    }
  });

  const isVegetarian = !hasNonVegetarian;
  const isVegan = !hasNonVegan && isVegetarian;

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
    return detectVegetarianVeganFromIngredients(ingredients);
  }

  const client = getOpenAIClient();
  if (!client) {
    logger.warn(
      '[Dietary Detection] OpenAI client not available, falling back to non-AI detection',
    );
    return detectVegetarianVeganFromIngredients(ingredients);
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
    return detectVegetarianVeganFromIngredients(ingredients);
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
  // First try non-AI detection
  const nonAIResult = detectVegetarianVeganFromIngredients(ingredients);

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
