import {
  AUSTRALIAN_ALLERGENS,
  consolidateAllergens,
  getAllAllergenCodes,
} from '../australian-allergens';

/**
 * Parse AI response to extract allergens and composition
 */
export function parseAIResponse(aiResponse: string): {
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
