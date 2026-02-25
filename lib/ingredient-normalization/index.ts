/**
 * Ingredient Normalization - maps specific names to base forms for matching.
 */
import { INGREDIENT_ALIASES } from './aliases';

const reverseAliasMap: Map<string, string> = new Map();
for (const [base, aliases] of Object.entries(INGREDIENT_ALIASES)) {
  for (const alias of aliases) reverseAliasMap.set(alias.toLowerCase(), base.toLowerCase());
  reverseAliasMap.set(base.toLowerCase(), base.toLowerCase());
}

export { INGREDIENT_ALIASES };
export function normalizeIngredient(ingredientName: string): string {
  const lower = ingredientName.toLowerCase().trim();
  if (reverseAliasMap.has(lower)) return reverseAliasMap.get(lower)!;
  for (const [alias, base] of reverseAliasMap.entries()) {
    if (lower.includes(alias)) return base;
  }
  return lower;
}

const REMOVE_WORDS = [
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
  'canned',
];

export function extractCoreIngredient(ingredientName: string): string {
  let result = ingredientName.toLowerCase().trim();
  for (const word of REMOVE_WORDS) {
    result = result.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  }
  result = result.replace(/\d+/g, '');
  return result.replace(/\s+/g, ' ').trim();
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  const al = a.length,
    bl = b.length;
  for (let i = 0; i <= al; i++) matrix[i] = [i];
  for (let j = 0; j <= bl; j++) matrix[0][j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[al][bl];
}

export function ingredientsMatch(stockIngredient: string, recipeIngredient: string): boolean {
  const normalizedStock = normalizeIngredient(stockIngredient);
  const normalizedRecipe = normalizeIngredient(recipeIngredient);
  if (normalizedStock === normalizedRecipe) return true;
  const coreStock = extractCoreIngredient(stockIngredient);
  const coreRecipe = extractCoreIngredient(recipeIngredient);
  if (coreStock.length < 3 || coreRecipe.length < 3) return coreStock === coreRecipe;
  if (coreStock.includes(coreRecipe) || coreRecipe.includes(coreStock)) return true;
  const distance = levenshtein(coreStock, coreRecipe);
  const maxLen = Math.max(coreStock.length, coreRecipe.length);
  if (maxLen <= 6 && distance <= 1) return true;
  if (maxLen > 6 && distance <= 2) return true;
  return normalizedRecipe.includes(normalizedStock) || normalizedStock.includes(normalizedRecipe);
}
