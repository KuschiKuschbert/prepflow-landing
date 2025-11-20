/**
 * Rule-based ingredient category detection.
 * Uses keyword matching to quickly categorize ingredients without AI.
 */

/**
 * Standard food-based ingredient categories.
 */
export const STANDARD_CATEGORIES = [
  'Dairy',
  'Meat',
  'Poultry',
  'Fish',
  'Fruits',
  'Vegetables',
  'Fruit & Veg',
  'Grains',
  'Legumes',
  'Nuts & Seeds',
  'Herbs & Spices',
  'Oils & Fats',
  'Condiments & Sauces',
  'Beverages',
  'Frozen',
  'Consumables',
  'Other',
] as const;

export type IngredientCategory = (typeof STANDARD_CATEGORIES)[number];

/**
 * Category keyword mappings for rule-based detection.
 * More specific categories should come first to avoid false matches.
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Poultry: [
    'chicken',
    'turkey',
    'duck',
    'goose',
    'quail',
    'pheasant',
    'cornish',
    'poultry',
    'wing',
    'thigh',
    'breast',
    'drumstick',
  ],
  Fish: [
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
    'snapper',
    'barramundi',
    'whiting',
    'flathead',
    'seafood',
    'prawn',
    'shrimp',
    'crab',
    'lobster',
    'oyster',
    'mussel',
    'scallop',
    'squid',
    'octopus',
  ],
  Meat: [
    'beef',
    'pork',
    'lamb',
    'veal',
    'mutton',
    'bacon',
    'ham',
    'sausage',
    'salami',
    'prosciutto',
    'chorizo',
    'steak',
    'mince',
    'ground',
  ],
  Dairy: [
    'milk',
    'cheese',
    'butter',
    'cream',
    'yogurt',
    'yoghurt',
    'sour cream',
    'mozzarella',
    'cheddar',
    'parmesan',
    'feta',
    'ricotta',
    'cottage cheese',
    'buttermilk',
    'ghee',
  ],
  Fruits: [
    'apple',
    'banana',
    'orange',
    'lemon',
    'lime',
    'grape',
    'strawberry',
    'blueberry',
    'raspberry',
    'blackberry',
    'mango',
    'pineapple',
    'watermelon',
    'melon',
    'peach',
    'pear',
    'plum',
    'cherry',
    'kiwi',
    'papaya',
    'passionfruit',
    'lychee',
  ],
  Vegetables: [
    'tomato',
    'lettuce',
    'onion',
    'carrot',
    'celery',
    'pepper',
    'bell pepper',
    'capsicum',
    'cucumber',
    'zucchini',
    'eggplant',
    'aubergine',
    'potato',
    'sweet potato',
    'pumpkin',
    'squash',
    'broccoli',
    'cauliflower',
    'cabbage',
    'spinach',
    'kale',
    'mushroom',
    'garlic',
    'ginger',
    'corn',
    'peas',
    'beans',
    'green beans',
    'asparagus',
    'artichoke',
  ],
  Grains: [
    'rice',
    'pasta',
    'noodle',
    'quinoa',
    'couscous',
    'barley',
    'wheat',
    'flour',
    'bread',
    'bun',
    'roll',
    'bagel',
    'cereal',
    'oats',
    'oatmeal',
    'bulgur',
    'farro',
    'millet',
  ],
  Legumes: [
    'lentil',
    'chickpea',
    'black bean',
    'kidney bean',
    'pinto bean',
    'navy bean',
    'cannellini',
    'lima bean',
    'soybean',
    'tofu',
    'tempeh',
    'edamame',
  ],
  'Nuts & Seeds': [
    'almond',
    'walnut',
    'pecan',
    'cashew',
    'pistachio',
    'hazelnut',
    'macadamia',
    'peanut',
    'pine nut',
    'sesame',
    'sunflower seed',
    'pumpkin seed',
    'chia',
    'flax',
  ],
  'Herbs & Spices': [
    'basil',
    'parsley',
    'cilantro',
    'coriander',
    'oregano',
    'thyme',
    'rosemary',
    'sage',
    'mint',
    'dill',
    'chive',
    'tarragon',
    'paprika',
    'cumin',
    'turmeric',
    'cinnamon',
    'nutmeg',
    'pepper',
    'salt',
    'garlic powder',
    'onion powder',
    'chili',
    'chilli',
    'curry',
  ],
  'Oils & Fats': [
    'oil',
    'olive oil',
    'vegetable oil',
    'canola oil',
    'sunflower oil',
    'coconut oil',
    'sesame oil',
    'avocado oil',
    'butter',
    'margarine',
    'lard',
    'shortening',
  ],
  'Condiments & Sauces': [
    'ketchup',
    'tomato sauce',
    'mustard',
    'mayonnaise',
    'mayo',
    'relish',
    'pickle',
    'vinegar',
    'soy sauce',
    'worcestershire',
    'hot sauce',
    'sriracha',
    'bbq sauce',
    'barbecue sauce',
    'hollandaise',
    'pesto',
    'salsa',
    'dressing',
    'marinade',
  ],
  Beverages: [
    'juice',
    'soda',
    'soft drink',
    'coffee',
    'tea',
    'water',
    'wine',
    'beer',
    'spirits',
    'lemonade',
    'iced tea',
  ],
  Frozen: ['frozen', 'ice', 'ice cream', 'gelato', 'sorbet'],
  Consumables: [
    'napkin',
    'toothpick',
    'straw',
    'cup',
    'plate',
    'container',
    'wrap',
    'foil',
    'plastic',
    'bag',
    'paper',
  ],
};

/**
 * Detect ingredient category from name using rule-based keyword matching.
 *
 * @param {string} ingredientName - Ingredient name
 * @param {string} [brand] - Optional brand name
 * @returns {IngredientCategory | null} Detected category or null if no match
 */
export function detectCategoryFromName(
  ingredientName: string,
  brand?: string,
): IngredientCategory | null {
  const searchText = `${ingredientName} ${brand || ''}`.toLowerCase();

  // Check each category (order matters - more specific first)
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category as IngredientCategory;
    }
  }

  return null; // No match found
}

/**
 * Unified category detection that combines rule-based and AI approaches.
 * Tries rule-based first (fast, free), then falls back to AI if enabled.
 *
 * @param {string} ingredientName - Ingredient name
 * @param {string} [brand] - Optional brand name
 * @param {string} [storageLocation] - Optional storage location
 * @param {boolean} [useAI=true] - Whether to use AI fallback
 * @returns {Promise<{ category: IngredientCategory | null; method: 'rule' | 'ai' | 'none' }>} Detection result
 */
export async function autoDetectCategory(
  ingredientName: string,
  brand?: string,
  storageLocation?: string,
  useAI: boolean = true,
): Promise<{ category: IngredientCategory | null; method: 'rule' | 'ai' | 'none' }> {
  // Try rule-based first (fast, free)
  const ruleBasedCategory = detectCategoryFromName(ingredientName, brand);
  if (ruleBasedCategory) {
    return { category: ruleBasedCategory, method: 'rule' };
  }

  // Fallback to AI if enabled
  if (useAI) {
    const { detectCategoryWithAI } = await import('./ai-category-detection');
    const aiResult = await detectCategoryWithAI(ingredientName, brand, storageLocation);
    if (aiResult.category && aiResult.category !== 'Other') {
      return { category: aiResult.category, method: 'ai' };
    }
  }

  return { category: null, method: 'none' };
}
