/**
 * Australian FSANZ Allergen Standards
 * Defines the 14 major allergens required by Food Standards Australia New Zealand
 */

export interface Allergen {
  code: string;
  displayName: string;
  description: string;
  commonNames?: string[];
  icon?: string; // Lucide React icon name
}

/**
 * Mapping from old allergen codes to new consolidated codes
 */
export const OLD_CODE_TO_NEW_CODE: Record<string, string> = {
  crustacea: 'shellfish',
  molluscs: 'shellfish',
  peanuts: 'nuts',
  tree_nuts: 'nuts',
  wheat: 'gluten',
};

/**
 * Consolidated allergen list according to food safety best practices
 * Combines related allergens: shellfish (crustacea + molluscs), nuts (peanuts + tree_nuts), gluten (includes wheat)
 */
export const AUSTRALIAN_ALLERGENS: Allergen[] = [
  {
    code: 'nuts',
    displayName: 'Nuts',
    description: 'Peanuts and tree nuts (almonds, cashews, walnuts, etc.)',
    commonNames: [
      'peanut',
      'groundnut',
      'arachis',
      'monkey nut',
      'almond',
      'cashew',
      'walnut',
      'pecan',
      'hazelnut',
      'pistachio',
      'brazil nut',
      'macadamia',
      'pine nut',
    ],
    icon: 'Nut',
  },
  {
    code: 'milk',
    displayName: 'Milk',
    description: 'Milk and milk products (dairy)',
    commonNames: ['milk', 'dairy', 'cream', 'butter', 'cheese', 'yogurt', 'lactose'],
    icon: 'Milk',
  },
  {
    code: 'eggs',
    displayName: 'Eggs',
    description: 'Eggs and egg products',
    commonNames: ['egg', 'albumin', 'lecithin'],
    icon: 'Egg',
  },
  {
    code: 'soy',
    displayName: 'Soy',
    description: 'Soybeans and soy products',
    commonNames: ['soy', 'soya', 'soybean', 'tofu', 'tempeh', 'miso'],
    icon: 'Bean',
  },
  {
    code: 'gluten',
    displayName: 'Gluten',
    description: 'Gluten-containing cereals (wheat, rye, barley, oats)',
    commonNames: ['gluten', 'wheat', 'flour', 'semolina', 'durum', 'bulgur', 'rye', 'barley', 'oats', 'triticale'],
    icon: 'Wheat',
  },
  {
    code: 'fish',
    displayName: 'Fish',
    description: 'Fish and fish products',
    commonNames: ['fish', 'anchovy', 'tuna', 'salmon', 'cod', 'bass'],
    icon: 'Fish',
  },
  {
    code: 'shellfish',
    displayName: 'Shellfish',
    description: 'Shellfish (crustaceans and molluscs: prawns, crabs, lobsters, oysters, mussels, etc.)',
    commonNames: [
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
    ],
    icon: 'Fish',
  },
  {
    code: 'sesame',
    displayName: 'Sesame',
    description: 'Sesame seeds and sesame products',
    commonNames: ['sesame', 'tahini', 'sesame seed', 'benne'],
    icon: 'CircleDot',
  },
  {
    code: 'lupin',
    displayName: 'Lupin',
    description: 'Lupin and lupin products',
    commonNames: ['lupin', 'lupine', 'lupini'],
    icon: 'Flower',
  },
  {
    code: 'sulphites',
    displayName: 'Sulphites',
    description: 'Sulphites (sulfur dioxide and sulphites)',
    commonNames: ['sulphite', 'sulfite', 'sulfur dioxide', 'sodium sulphite'],
    icon: 'AlertTriangle',
  },
  {
    code: 'mustard',
    displayName: 'Mustard',
    description: 'Mustard seeds and mustard products',
    commonNames: ['mustard', 'mustard seed', 'mustard powder'],
    icon: 'Circle',
  },
];

/**
 * Map of allergen codes to allergen objects for quick lookup
 */
export const ALLERGEN_MAP: Record<string, Allergen> = AUSTRALIAN_ALLERGENS.reduce(
  (acc, allergen) => {
    acc[allergen.code] = allergen;
    return acc;
  },
  {} as Record<string, Allergen>,
);

/**
 * Get allergen display name from code
 */
export function getAllergenDisplayName(code: string): string {
  return ALLERGEN_MAP[code]?.displayName || code;
}

/**
 * Get allergen object from code
 */
export function getAllergen(code: string): Allergen | undefined {
  return ALLERGEN_MAP[code];
}

/**
 * Get all allergen codes
 */
export function getAllAllergenCodes(): string[] {
  return AUSTRALIAN_ALLERGENS.map(a => a.code);
}

/**
 * Check if a string contains allergen keywords
 * Used for AI detection matching
 */
export function containsAllergenKeywords(text: string, allergenCode: string): boolean {
  const allergen = ALLERGEN_MAP[allergenCode];
  if (!allergen) return false;

  const lowerText = text.toLowerCase();
  const keywords = [allergen.code, allergen.displayName.toLowerCase(), ...(allergen.commonNames || [])];

  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Map old allergen codes to new consolidated codes
 */
export function mapToConsolidatedCode(code: string): string {
  return OLD_CODE_TO_NEW_CODE[code] || code;
}

/**
 * Consolidate allergen array by mapping old codes to new and deduplicating
 */
export function consolidateAllergens(allergens: string[]): string[] {
  const mapped = allergens.map(mapToConsolidatedCode);
  return [...new Set(mapped)];
}

/**
 * Detect allergens from text using keyword matching
 * Returns array of consolidated allergen codes found in text
 * Also detects old codes and maps them to consolidated codes
 */
export function detectAllergensFromText(text: string): string[] {
  const detected: string[] = [];
  const lowerText = text.toLowerCase();

  // Check against consolidated allergens
  AUSTRALIAN_ALLERGENS.forEach(allergen => {
    const keywords = [
      allergen.code,
      allergen.displayName.toLowerCase(),
      ...(allergen.commonNames || []),
    ];

    if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
      detected.push(allergen.code);
    }
  });

  // Also check for old codes and map them
  const oldCodes = ['crustacea', 'molluscs', 'peanuts', 'tree_nuts', 'wheat'];
  oldCodes.forEach(oldCode => {
    const oldAllergen = {
      crustacea: { keywords: ['crustacea', 'crustacean', 'prawn', 'shrimp', 'crab', 'lobster', 'crayfish'] },
      molluscs: { keywords: ['mollusc', 'mollusk', 'oyster', 'mussel', 'scallop', 'clam', 'squid', 'octopus'] },
      peanuts: { keywords: ['peanut', 'groundnut', 'arachis', 'monkey nut'] },
      tree_nuts: { keywords: ['tree nut', 'almond', 'cashew', 'walnut', 'pecan', 'hazelnut', 'pistachio', 'brazil nut', 'macadamia', 'pine nut'] },
      wheat: { keywords: ['wheat', 'flour', 'semolina', 'durum', 'bulgur'] },
    }[oldCode];

    if (oldAllergen?.keywords.some(keyword => lowerText.includes(keyword))) {
      const newCode = mapToConsolidatedCode(oldCode);
      if (!detected.includes(newCode)) {
        detected.push(newCode);
      }
    }
  });

  return consolidateAllergens(detected);
}
