/**
 * Parse event notes for allergen/dietary requirements.
 * Detects mentions of allergy restrictions or dietary requirements that imply
 * the runsheet meals must comply.
 */

import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';

export interface NotesConstraints {
  allergenAvoid: string[];
  dietaryOnly: ('vegetarian' | 'vegan')[];
}

const ALLERGEN_PHRASES: { pattern: RegExp; code: string }[] = [
  {
    pattern:
      /\b(?:nut|peanut|tree\s*nut|almond|cashew|walnut)s?\s*(?:allergy|free|avoid)|no\s*nuts?/i,
    code: 'nuts',
  },
  { pattern: /\b(?:gluten|wheat)\s*(?:free|avoid|allergy)|no\s*gluten/i, code: 'gluten' },
  {
    pattern: /\b(?:dairy|milk|lactose)\s*(?:free|avoid|allergy)|no\s*dairy|no\s*milk/i,
    code: 'milk',
  },
  { pattern: /\b(?:egg)s?\s*(?:free|avoid|allergy)|no\s*eggs?/i, code: 'eggs' },
  { pattern: /\b(?:soy|soya)\s*(?:free|avoid|allergy)|no\s*soy/i, code: 'soy' },
  { pattern: /\b(?:fish|shellfish|seafood)\s*(?:free|avoid|allergy)|no\s*fish/i, code: 'fish' },
  { pattern: /\bshellfish\s*(?:free|avoid|allergy)/i, code: 'shellfish' },
  { pattern: /\bsesame\s*(?:free|avoid|allergy)/i, code: 'sesame' },
  { pattern: /\blupin\s*(?:free|avoid|allergy)/i, code: 'lupin' },
  { pattern: /\bsulphites?\s*(?:free|avoid|allergy)/i, code: 'sulphites' },
  { pattern: /\bmustard\s*(?:free|avoid|allergy)/i, code: 'mustard' },
];

const VEGETARIAN_PATTERNS = [
  /\bvegetarian\s*only\b/i,
  /\ball\s*vegetarian\b/i,
  /\bvegetarian\s*required\b/i,
  /\bmust\s*be\s*vegetarian\b/i,
  /\bveg\s*only\b/i,
];

const VEGAN_PATTERNS = [
  /\bvegan\s*only\b/i,
  /\ball\s*vegan\b/i,
  /\bvegan\s*required\b/i,
  /\bmust\s*be\s*vegan\b/i,
  /\bplant[- ]?based\s*only\b/i,
];

const ALLERGENS_FOR_PROXIMITY = AUSTRALIAN_ALLERGENS.filter(
  a => !ALLERGEN_PHRASES.some(p => p.code === a.code),
);

/**
 * Parse event notes for allergen and dietary constraints.
 * Returns requirements that imply runsheet meals must comply.
 *
 * @param notes - Event notes (free text)
 * @returns Parsed constraints
 */
export function parseNotesForConstraints(notes: string | null | undefined): NotesConstraints {
  const result: NotesConstraints = { allergenAvoid: [], dietaryOnly: [] };

  if (!notes || !notes.trim()) return result;

  const text = notes.trim();
  const hasRestriction = /\b(?:allergy|allergic|avoid|free|no\s+\w+)\b/i.test(text);

  for (const { pattern, code } of ALLERGEN_PHRASES) {
    if (pattern.test(text) && !result.allergenAvoid.includes(code)) {
      result.allergenAvoid.push(code);
    }
  }

  if (hasRestriction) {
    for (const a of ALLERGENS_FOR_PROXIMITY) {
      if (result.allergenAvoid.includes(a.code)) continue;
      const keywords = [a.code, a.displayName.toLowerCase(), ...(a.commonNames || []).slice(0, 2)];
      if (keywords.some(k => text.toLowerCase().includes(k))) {
        result.allergenAvoid.push(a.code);
      }
    }
  }

  if (VEGAN_PATTERNS.some(p => p.test(text))) {
    result.dietaryOnly.push('vegan');
  } else if (VEGETARIAN_PATTERNS.some(p => p.test(text))) {
    result.dietaryOnly.push('vegetarian');
  }

  return result;
}
