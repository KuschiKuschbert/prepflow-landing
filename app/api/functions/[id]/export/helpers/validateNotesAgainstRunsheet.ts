/**
 * Validate that event notes do not contradict runsheet meal allergen/dietary data.
 * When notes mention allergen or dietary requirements, all meal items must comply.
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { getAllergenDisplayName } from '@/lib/allergens/australian-allergens';
import { parseNotesForConstraints } from './parseNotesForConstraints';

type RunsheetItemWithDietary = {
  item_type: string;
  description: string;
  dishes?: {
    dish_name: string;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
  recipes?: {
    recipe_name: string;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
};

export interface ValidationConflict {
  requirement: string;
  offendingItems: string[];
}

export interface ValidationResult {
  valid: boolean;
  conflicts: ValidationConflict[];
}

/**
 * Validate notes against runsheet items.
 * Returns conflicts when notes require allergen/dietary compliance but items violate.
 *
 * @param notes - Event notes
 * @param items - Runsheet items with dishes/recipes
 */
export function validateNotesAgainstRunsheet(
  notes: string | null | undefined,
  items: RunsheetItemWithDietary[],
): ValidationResult {
  const constraints = parseNotesForConstraints(notes);

  const hasAllergenConstraints = constraints.allergenAvoid.length > 0;
  const hasDietaryConstraints = constraints.dietaryOnly.length > 0;

  if (!hasAllergenConstraints && !hasDietaryConstraints) {
    return { valid: true, conflicts: [] };
  }

  const conflicts: ValidationConflict[] = [];

  for (const code of constraints.allergenAvoid) {
    const offending: string[] = [];

    for (const item of items) {
      if (item.item_type !== 'meal') continue;

      const source = item.dishes ?? item.recipes;
      if (!source) continue;

      const allergens = source.allergens;
      if (!allergens || !Array.isArray(allergens)) continue;

      const consolidated = consolidateAllergens(allergens);
      if (consolidated.includes(code)) {
        const name = item.dishes?.dish_name ?? item.recipes?.recipe_name ?? item.description;
        offending.push(name);
      }
    }

    if (offending.length > 0) {
      conflicts.push({
        requirement: `No ${getAllergenDisplayName(code)} (notes mention ${getAllergenDisplayName(code)} restriction)`,
        offendingItems: offending,
      });
    }
  }

  for (const dietary of constraints.dietaryOnly) {
    const offending: string[] = [];

    for (const item of items) {
      if (item.item_type !== 'meal') continue;

      const source = item.dishes ?? item.recipes;
      if (!source) continue;

      const isViolation =
        dietary === 'vegan'
          ? source.is_vegan !== true
          : !(source.is_vegetarian === true || source.is_vegan === true);

      if (isViolation) {
        const name = item.dishes?.dish_name ?? item.recipes?.recipe_name ?? item.description;
        offending.push(name);
      }
    }

    if (offending.length > 0) {
      conflicts.push({
        requirement: `${dietary === 'vegan' ? 'Vegan' : 'Vegetarian'} only (notes require ${dietary} options)`,
        offendingItems: offending,
      });
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}
