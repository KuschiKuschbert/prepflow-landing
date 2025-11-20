/**
 * AI-based allergen detection service
 * Uses OpenAI to analyze ingredient composition and detect allergens
 */

import { logger } from '@/lib/logger';
import { getOpenAIClient, isAIEnabled } from '@/lib/ai/openai-client';
import { supabaseAdmin } from '@/lib/supabase';
import {
  getAllAllergenCodes,
  AUSTRALIAN_ALLERGENS,
  consolidateAllergens,
} from './australian-allergens';

export interface AIAllergenDetectionResult {
  allergens: string[];
  composition?: string;
  confidence: 'high' | 'medium' | 'low';
  cached: boolean;
}

/**
 * Check ingredient composition cache
 */
async function getCachedComposition(
  ingredientName: string,
  brand?: string,
): Promise<AIAllergenDetectionResult | null> {
  if (!supabaseAdmin) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from('ingredient_composition_cache')
      .select('detected_allergens, composition, expires_at')
      .eq('ingredient_name', ingredientName)
      .eq('brand', brand || null)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if cache is expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      // Cache expired, delete it
      await supabaseAdmin
        .from('ingredient_composition_cache')
        .delete()
        .eq('ingredient_name', ingredientName)
        .eq('brand', brand || null);
      return null;
    }

    const cachedAllergens = (data.detected_allergens as string[]) || [];
    return {
      allergens: consolidateAllergens(cachedAllergens),
      composition: data.composition || undefined,
      confidence: 'high',
      cached: true,
    };
  } catch (err) {
    logger.error('[AI Allergen Detection] Error checking cache:', err);
    return null;
  }
}

/**
 * Cache ingredient composition and detected allergens
 */
async function cacheComposition(
  ingredientName: string,
  brand: string | null,
  allergens: string[],
  composition?: string,
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // 90 days TTL

    await supabaseAdmin.from('ingredient_composition_cache').upsert(
      {
        ingredient_name: ingredientName,
        brand: brand || null,
        detected_allergens: allergens,
        composition: composition || null,
        detected_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      {
        onConflict: 'ingredient_name,brand',
      },
    );
  } catch (err) {
    logger.error('[AI Allergen Detection] Error caching composition:', err);
  }
}

/**
 * Parse AI response to extract allergens and composition
 */
function parseAIResponse(aiResponse: string): {
  allergens: string[];
  composition?: string;
} {
  const allergenCodes = getAllAllergenCodes();
  const detected: string[] = [];
  const lowerResponse = aiResponse.toLowerCase();

  // Extract composition (look for "composition:" or "ingredients:")
  let composition: string | undefined;
  const compositionMatch = aiResponse.match(/(?:composition|ingredients?):\s*(.+?)(?:\n|$)/i);
  if (compositionMatch) {
    composition = compositionMatch[1].trim();
  }

  // Check for each allergen in response
  allergenCodes.forEach(code => {
    const allergen = AUSTRALIAN_ALLERGENS.find(a => a.code === code);
    if (!allergen) return;

    const keywords = [
      allergen.code,
      allergen.displayName.toLowerCase(),
      ...(allergen.commonNames || []),
    ];

    // Check if any keyword appears in response
    if (keywords.some(keyword => lowerResponse.includes(keyword.toLowerCase()))) {
      detected.push(code);
    }
  });

  // Also check for old allergen names and map them
  const oldAllergenMappings: Record<string, string> = {
    crustacea: 'shellfish',
    crustacean: 'shellfish',
    molluscs: 'shellfish',
    mollusc: 'shellfish',
    mollusk: 'shellfish',
    peanuts: 'nuts',
    peanut: 'nuts',
    'tree nuts': 'nuts',
    'tree nut': 'nuts',
    wheat: 'gluten',
  };

  Object.entries(oldAllergenMappings).forEach(([oldName, newCode]) => {
    if (lowerResponse.includes(oldName.toLowerCase()) && !detected.includes(newCode)) {
      detected.push(newCode);
    }
  });

  // Consolidate and deduplicate
  const consolidated = consolidateAllergens(detected);

  return { allergens: consolidated, composition };
}

/**
 * Detect allergens from ingredient using AI
 */
export async function detectAllergensFromIngredient(
  ingredientName: string,
  brand?: string,
): Promise<AIAllergenDetectionResult> {
  // Check cache first
  const cached = await getCachedComposition(ingredientName, brand);
  if (cached) {
    return cached;
  }

  // Check if AI is enabled
  if (!isAIEnabled()) {
    logger.dev('[AI Allergen Detection] AI not enabled, returning empty result');
    return {
      allergens: [],
      confidence: 'low',
      cached: false,
    };
  }

  const client = getOpenAIClient();
  if (!client) {
    logger.warn('[AI Allergen Detection] OpenAI client not available');
    return {
      allergens: [],
      confidence: 'low',
      cached: false,
    };
  }

  try {
    // Build prompt for AI
    const allergenList = AUSTRALIAN_ALLERGENS.map(a => a.displayName).join(', ');
    const prompt = `Analyze this ingredient and identify which Australian FSANZ allergens are present.

Ingredient: ${ingredientName}${brand ? ` (Brand: ${brand})` : ''}

The 14 major allergens are: ${allergenList}

Please provide:
1. The composition/ingredients list (if this is a processed ingredient)
2. Which allergens are present (if any)

Format your response as:
Composition: [list of ingredients if processed, or "single ingredient" if not]
Allergens: [comma-separated list of allergen names, or "none" if no allergens]

Be thorough and check for hidden allergens in processed ingredients.`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a food safety expert analyzing ingredients for allergen content according to Australian FSANZ standards. Be precise and thorough.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '';
    const { allergens, composition } = parseAIResponse(content);

    // Cache the result
    await cacheComposition(ingredientName, brand || null, allergens, composition);

    return {
      allergens,
      composition,
      confidence: allergens.length > 0 ? 'high' : 'medium',
      cached: false,
    };
  } catch (err) {
    logger.error('[AI Allergen Detection] Error detecting allergens:', err);
    return {
      allergens: [],
      confidence: 'low',
      cached: false,
    };
  }
}

/**
 * Enrich ingredient with allergens (merge manual + AI)
 * @deprecated Use enrichIngredientWithAllergensHybrid from hybrid-allergen-detection.ts instead
 * This function is kept for backward compatibility but now uses hybrid detection internally
 */
export async function enrichIngredientWithAllergens(ingredient: {
  ingredient_name: string;
  brand?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}): Promise<{
  allergens: string[];
  allergen_source: {
    manual: boolean;
    ai: boolean;
    ai_detected_at?: string;
  };
}> {
  // Use hybrid detection internally
  const { enrichIngredientWithAllergensHybrid } = await import('./hybrid-allergen-detection');
  const result = await enrichIngredientWithAllergensHybrid(ingredient);

  // Convert hybrid result to legacy format
  return {
    allergens: result.allergens,
    allergen_source: {
      manual: result.allergen_source.manual || false,
      ai: result.allergen_source.ai || false,
      ai_detected_at: result.allergen_source.ai_detected_at,
    },
  };
}
