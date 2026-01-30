/**
 * Ingredient Normalization Map
 *
 * Maps specific ingredient names to their common base forms for better matching.
 * This allows "kosher sea salt" to match recipes calling for "salt".
 */

// Common ingredient aliases - maps specific names to base ingredient
export const INGREDIENT_ALIASES: Record<string, string[]> = {
  // Salts
  salt: [
    'kosher salt',
    'sea salt',
    'kosher sea salt',
    'table salt',
    'fine salt',
    'coarse salt',
    'fleur de sel',
    'himalayan salt',
    'pink salt',
    'rock salt',
  ],

  // Peppers
  pepper: [
    'black pepper',
    'white pepper',
    'ground pepper',
    'cracked pepper',
    'peppercorns',
    'freshly ground pepper',
  ],

  // Oils
  oil: ['vegetable oil', 'canola oil', 'sunflower oil', 'neutral oil', 'cooking oil'],
  'olive oil': ['extra virgin olive oil', 'evoo', 'light olive oil', 'pure olive oil'],

  // Butter & Fats
  butter: [
    'unsalted butter',
    'salted butter',
    'clarified butter',
    'melted butter',
    'softened butter',
  ],

  // Onions & Aromatics
  onion: ['brown onion', 'yellow onion', 'white onion', 'spanish onion'],
  garlic: ['garlic clove', 'garlic cloves', 'minced garlic', 'fresh garlic', 'crushed garlic'],

  // Sugars
  sugar: ['white sugar', 'granulated sugar', 'caster sugar', 'superfine sugar'],
  'brown sugar': ['light brown sugar', 'dark brown sugar', 'muscovado'],

  // Flour
  flour: ['plain flour', 'all-purpose flour', 'all purpose flour', 'ap flour', 'wheat flour'],

  // Eggs
  eggs: ['egg', 'large eggs', 'medium eggs', 'free range eggs', 'chicken eggs'],

  // Milk & Cream
  milk: ['whole milk', 'full cream milk', 'full fat milk', '2% milk', 'skim milk'],
  cream: ['heavy cream', 'thickened cream', 'whipping cream', 'double cream', 'single cream'],

  // Chicken
  chicken: ['chicken breast', 'chicken thigh', 'chicken drumstick', 'chicken leg', 'chicken wing'],
  'chicken breast': ['skinless chicken breast', 'boneless chicken breast', 'chicken fillet'],

  // Beef
  beef: ['beef mince', 'ground beef', 'beef steak', 'stewing beef'],
  'beef mince': ['ground beef', 'minced beef', 'hamburger meat'],

  // Herbs
  parsley: ['flat leaf parsley', 'curly parsley', 'italian parsley', 'fresh parsley'],
  basil: ['fresh basil', 'sweet basil', 'thai basil'],
  cilantro: ['coriander', 'fresh coriander', 'coriander leaves'],
  thyme: ['fresh thyme', 'thyme leaves'],
  rosemary: ['fresh rosemary', 'rosemary sprig'],

  // Tomatoes
  tomato: ['roma tomato', 'cherry tomato', 'grape tomato', 'plum tomato', 'vine tomato'],
  'canned tomatoes': ['diced tomatoes', 'crushed tomatoes', 'tomato puree', 'tinned tomatoes'],

  // Cheese
  cheese: ['cheddar', 'cheddar cheese', 'mozzarella', 'parmesan'],
  parmesan: ['parmigiano reggiano', 'grated parmesan', 'parmesan cheese'],

  // Vinegar
  vinegar: ['white vinegar', 'distilled vinegar'],

  // Stock/Broth
  stock: ['broth', 'chicken stock', 'beef stock', 'vegetable stock', 'chicken broth', 'beef broth'],
  'chicken stock': ['chicken broth', 'chicken bouillon'],

  // Starch & Grains
  rice: [
    'basmati rice',
    'jasmine rice',
    'brown rice',
    'sushi rice',
    'white rice',
    'long grain rice',
    'short grain rice',
  ],
  pasta: [
    'spaghetti',
    'penne',
    'fusilli',
    'rigatoni',
    'linguine',
    'macaroni',
    'fettuccine',
    'dried pasta',
    'fresh pasta',
  ],

  // Vegetables
  potato: [
    'baby potato',
    'new potato',
    'king edward potato',
    'maris piper',
    'russet potato',
    'sweet potato',
    'yam',
  ],
  ginger: ['fresh ginger', 'ginger root', 'grated ginger', 'minced ginger'],
  lemon: ['lemon juice', 'lemon zest', 'fresh lemon juice'],
  lime: ['lime juice', 'lime zest', 'fresh lime juice'],

  // Dairy
  yoghurt: [
    'greek yoghurt',
    'natural yoghurt',
    'plain yoghurt',
    'low fat yoghurt',
    'full fat yoghurt',
  ],
};

// Reverse map for quick lookup: alias -> base ingredient
const reverseAliasMap: Map<string, string> = new Map();

// Build the reverse map
for (const [base, aliases] of Object.entries(INGREDIENT_ALIASES)) {
  for (const alias of aliases) {
    reverseAliasMap.set(alias.toLowerCase(), base.toLowerCase());
  }
  // Also map base to itself for consistency
  reverseAliasMap.set(base.toLowerCase(), base.toLowerCase());
}

/**
 * Normalize an ingredient name to its base form.
 * E.g., "kosher sea salt" -> "salt", "extra virgin olive oil" -> "olive oil"
 *
 * @param ingredientName - The ingredient name to normalize
 * @returns The normalized base ingredient name
 */
export function normalizeIngredient(ingredientName: string): string {
  const lower = ingredientName.toLowerCase().trim();

  // Direct lookup
  if (reverseAliasMap.has(lower)) {
    return reverseAliasMap.get(lower)!;
  }

  // Partial match - check if any alias is contained within the name
  for (const [alias, base] of reverseAliasMap.entries()) {
    if (lower.includes(alias)) {
      return base;
    }
  }

  // No match, return as-is
  return lower;
}

/**
 * Extract the core ingredient term for fuzzy matching.
 * Removes common descriptor words.
 */
export function extractCoreIngredient(ingredientName: string): string {
  const lower = ingredientName.toLowerCase().trim();

  // Words to remove (descriptors, quantities, etc.)
  const removeWords = [
    'fresh',
    'dried',
    'frozen',
    'raw',
    'cooked',
    'chopped',
    'diced',
    'minced',
    'sliced',
    'crushed',
    'grated',
    'large',
    'medium',
    'small',
    'extra',
    'organic',
    'free range',
    'grass fed',
    'for frying',
    'for cooking',
    'to taste',
    'whole',
    'white',
    'brown',
    'red',
    'green',
    'yellow',
    'black',
    'blue',
    'sweet',
    'hot',
    'dry',
    'fresh',
    'canned',
  ];

  let result = lower;
  for (const word of removeWords) {
    result = result.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  }

  // Remove numbers
  result = result.replace(/\d+/g, '');

  // Clean up extra spaces
  return result.replace(/\s+/g, ' ').trim();
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshtein(a: string, b: string): number {
  const matrix = [];
  const al = a.length,
    bl = b.length;

  for (let i = 0; i <= al; i++) matrix[i] = [i];
  for (let j = 0; j <= bl; j++) matrix[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }
  return matrix[al][bl];
}

/**
 * Check if two ingredients match (with fuzzy/normalized matching)
 */
export function ingredientsMatch(stockIngredient: string, recipeIngredient: string): boolean {
  const normalizedStock = normalizeIngredient(stockIngredient);
  const normalizedRecipe = normalizeIngredient(recipeIngredient);

  // Exact match after normalization
  if (normalizedStock === normalizedRecipe) {
    return true;
  }

  // Core ingredient containment
  const coreStock = extractCoreIngredient(stockIngredient);
  const coreRecipe = extractCoreIngredient(recipeIngredient);

  // Skip fuzzy logic for very short words to avoid false positives (e.g. "oil" matching "il")
  if (coreStock.length < 3 || coreRecipe.length < 3) {
    return coreStock === coreRecipe;
  }

  if (coreStock.includes(coreRecipe) || coreRecipe.includes(coreStock)) {
    return true;
  }

  // Fuzzy Match for typos (e.g. "suar" vs "sugar")
  // Allow 1 edit for short words (4-6 chars), 2 edits for longer
  const distance = levenshtein(coreStock, coreRecipe);
  const maxLen = Math.max(coreStock.length, coreRecipe.length);

  if (maxLen <= 6 && distance <= 1) return true;
  if (maxLen > 6 && distance <= 2) return true;

  // Fall back to substring match on normalized forms
  return normalizedRecipe.includes(normalizedStock) || normalizedStock.includes(normalizedRecipe);
}
