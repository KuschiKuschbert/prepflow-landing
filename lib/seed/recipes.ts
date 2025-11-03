export type IngredientLine = {
  ingredientName: string;
  quantity: number;
  unit: 'GM' | 'ML' | 'PC';
};

export type CanonicalRecipe = {
  key: string; // stable key for deterministic IDs
  name: string;
  description: string;
  yield: number;
  yieldUnit: string;
  instructions: string;
  lines: IngredientLine[];
  sellingPrice: number; // for menu_dishes
};

// Source of truth: small deterministic catalog that renders correctly
export const CANONICAL_RECIPES: CanonicalRecipe[] = [
  {
    key: 'classic-beef-burger',
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty with lettuce, tomato, and onion.',
    yield: 1,
    yieldUnit: 'serving',
    instructions:
      'Form patty, grill to 71°C, toast bun, assemble with lettuce, tomato, onion, pickles.',
    sellingPrice: 15.0,
    lines: [
      { ingredientName: 'Beef Mince', quantity: 150, unit: 'GM' },
      { ingredientName: 'Burger Bun', quantity: 1, unit: 'PC' },
      { ingredientName: 'Lettuce', quantity: 20, unit: 'GM' },
      { ingredientName: 'Tomato', quantity: 30, unit: 'GM' },
      { ingredientName: 'Onion', quantity: 15, unit: 'GM' },
      { ingredientName: 'Pickles', quantity: 10, unit: 'GM' },
    ],
  },
  {
    key: 'margherita-pizza',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato sauce, mozzarella, basil.',
    yield: 1,
    yieldUnit: 'serving',
    instructions: 'Roll dough, add sauce and cheese, bake until golden, finish with basil.',
    sellingPrice: 18.0,
    lines: [
      { ingredientName: 'Pizza Dough', quantity: 220, unit: 'GM' },
      { ingredientName: 'Tomato Sauce', quantity: 90, unit: 'GM' },
      { ingredientName: 'Mozzarella Cheese', quantity: 120, unit: 'GM' },
      { ingredientName: 'Fresh Basil', quantity: 5, unit: 'GM' },
      { ingredientName: 'Olive Oil', quantity: 10, unit: 'ML' },
    ],
  },
  {
    key: 'chicken-caesar-salad',
    name: 'Chicken Caesar Salad',
    description: 'Romaine lettuce, chicken, Caesar dressing, croutons, parmesan.',
    yield: 1,
    yieldUnit: 'serving',
    instructions: 'Grill chicken, toss lettuce with dressing, add croutons and parmesan.',
    sellingPrice: 17.5,
    lines: [
      { ingredientName: 'Romaine Lettuce', quantity: 120, unit: 'GM' },
      { ingredientName: 'Chicken Breast', quantity: 180, unit: 'GM' },
      { ingredientName: 'Caesar Dressing', quantity: 40, unit: 'ML' },
      { ingredientName: 'Croutons', quantity: 20, unit: 'GM' },
      { ingredientName: 'Parmesan Cheese', quantity: 15, unit: 'GM' },
    ],
  },
  {
    key: 'fish-and-chips',
    name: 'Fish and Chips',
    description: 'Beer-battered fish with chips and peas.',
    yield: 1,
    yieldUnit: 'serving',
    instructions: 'Batter fish, deep fry; fry chips; warm peas. Serve hot.',
    sellingPrice: 22.0,
    lines: [
      { ingredientName: 'Fish Fillet', quantity: 200, unit: 'GM' },
      { ingredientName: 'Beer', quantity: 120, unit: 'ML' },
      { ingredientName: 'Flour', quantity: 60, unit: 'GM' },
      { ingredientName: 'Potatoes', quantity: 280, unit: 'GM' },
      { ingredientName: 'Peas', quantity: 80, unit: 'GM' },
      { ingredientName: 'Cooking Oil', quantity: 200, unit: 'ML' },
    ],
  },
  {
    key: 'spaghetti-carbonara',
    name: 'Spaghetti Carbonara',
    description: 'Spaghetti with pancetta, eggs, and cheese.',
    yield: 1,
    yieldUnit: 'serving',
    instructions: 'Cook pasta, crisp pancetta, temper eggs with cheese, toss off heat.',
    sellingPrice: 19.0,
    lines: [
      { ingredientName: 'Spaghetti', quantity: 110, unit: 'GM' },
      { ingredientName: 'Pancetta', quantity: 80, unit: 'GM' },
      { ingredientName: 'Eggs', quantity: 2, unit: 'PC' },
      { ingredientName: 'Parmesan Cheese', quantity: 35, unit: 'GM' },
      { ingredientName: 'Black Pepper', quantity: 2, unit: 'GM' },
    ],
  },
];
