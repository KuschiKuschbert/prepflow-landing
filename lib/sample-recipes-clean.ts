/**
 * Clean Test Data - Recipes
 * ~10 recipes with complete ingredient lists
 */

export const cleanSampleRecipes = [
  {
    name: 'Beef Burger',
    yield: 4,
    yield_unit: 'servings',
    instructions:
      '1. Form beef mince into 4 patties. 2. Season with salt and pepper. 3. Grill for 5 minutes each side. 4. Toast burger buns. 5. Assemble with lettuce, tomato, and cheese.',
  },
  {
    name: 'Caesar Salad',
    yield: 6,
    yield_unit: 'servings',
    instructions:
      '1. Wash and dry lettuce. 2. Make Caesar dressing with mayo, garlic, and parmesan. 3. Toss lettuce with dressing. 4. Top with croutons and parmesan cheese.',
  },
  {
    name: 'Pasta Carbonara',
    yield: 4,
    yield_unit: 'servings',
    instructions:
      '1. Cook pasta until al dente. 2. Fry bacon until crispy. 3. Mix eggs, parmesan, and black pepper. 4. Combine pasta, bacon, and egg mixture off heat. 5. Serve immediately.',
  },
  {
    name: 'Chicken Stir Fry',
    yield: 4,
    yield_unit: 'servings',
    instructions:
      '1. Slice chicken breast into strips. 2. Cut vegetables (capsicum, carrot, onion). 3. Heat oil in wok. 4. Stir fry chicken for 5 minutes. 5. Add vegetables and cook 3 minutes. 6. Add sauce and serve.',
  },
  {
    name: 'Fish and Chips',
    yield: 4,
    yield_unit: 'servings',
    instructions:
      '1. Batter fish fillets. 2. Deep fry until golden. 3. Cut and fry potatoes for chips. 4. Season with salt. 5. Serve with lemon and tartar sauce.',
  },
  {
    name: 'Roast Chicken',
    yield: 6,
    yield_unit: 'servings',
    instructions:
      '1. Season whole chicken with salt, pepper, and herbs. 2. Roast at 180°C for 1.5 hours. 3. Rest for 15 minutes. 4. Carve and serve with vegetables.',
  },
  {
    name: 'Vegetable Soup',
    yield: 8,
    yield_unit: 'servings',
    instructions:
      '1. Dice vegetables (carrots, celery, onion, potatoes). 2. Sauté in oil until soft. 3. Add chicken stock and bring to boil. 4. Simmer for 30 minutes. 5. Season and serve.',
  },
  {
    name: 'Grilled Lamb Chops',
    yield: 4,
    yield_unit: 'servings',
    instructions:
      '1. Season lamb chops with herbs and garlic. 2. Grill for 4 minutes each side. 3. Rest for 5 minutes. 4. Serve with roasted vegetables.',
  },
  {
    name: 'Caesar Salad Dressing',
    yield: 500,
    yield_unit: 'ML',
    instructions:
      '1. Mix mayonnaise, crushed garlic, and parmesan. 2. Add lemon juice and black pepper. 3. Whisk until smooth. 4. Store in fridge.',
  },
  {
    name: 'Tomato Pasta Sauce',
    yield: 1000,
    yield_unit: 'ML',
    instructions:
      '1. Sauté onions and garlic. 2. Add diced tomatoes and tomato paste. 3. Simmer for 30 minutes. 4. Season with salt, pepper, and herbs. 5. Blend if smooth sauce desired.',
  },
];

// Recipe ingredients mapping (ingredient names from cleanSampleIngredients)
// This will be used to link recipes to ingredients in the populate endpoint
export const recipeIngredientMappings: Record<
  string,
  Array<{ ingredient_name: string; quantity: number; unit: string }>
> = {
  'Beef Burger': [
    { ingredient_name: 'Beef Mince Premium', quantity: 500, unit: 'GM' },
    { ingredient_name: 'Bread', quantity: 4, unit: 'PC' },
    { ingredient_name: 'Lettuce', quantity: 100, unit: 'GM' },
    { ingredient_name: 'Tomatoes', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Cheese', quantity: 100, unit: 'GM' },
  ],
  'Caesar Salad': [
    { ingredient_name: 'Lettuce', quantity: 300, unit: 'GM' },
    { ingredient_name: 'Parmesan Cheese', quantity: 50, unit: 'GM' },
    { ingredient_name: 'Bread', quantity: 2, unit: 'PC' },
    { ingredient_name: 'Black Pepper', quantity: 5, unit: 'GM' },
  ],
  'Pasta Carbonara': [
    { ingredient_name: 'Pasta', quantity: 400, unit: 'GM' },
    { ingredient_name: 'Bacon', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Eggs', quantity: 4, unit: 'PC' },
    { ingredient_name: 'Parmesan Cheese', quantity: 100, unit: 'GM' },
    { ingredient_name: 'Black Pepper', quantity: 5, unit: 'GM' },
  ],
  'Chicken Stir Fry': [
    { ingredient_name: 'Chicken Breast', quantity: 500, unit: 'GM' },
    { ingredient_name: 'Capsicum', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Carrots', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Onions', quantity: 100, unit: 'GM' },
    { ingredient_name: 'Garlic', quantity: 20, unit: 'GM' },
    { ingredient_name: 'Olive Oil', quantity: 30, unit: 'ML' },
  ],
  'Fish and Chips': [
    { ingredient_name: 'Fish Fillets', quantity: 600, unit: 'GM' },
    { ingredient_name: 'Potatoes', quantity: 1000, unit: 'GM' },
    { ingredient_name: 'Flour', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Lemons', quantity: 2, unit: 'PC' },
  ],
  'Roast Chicken': [
    { ingredient_name: 'Chicken Breast', quantity: 1500, unit: 'GM' },
    { ingredient_name: 'Potatoes', quantity: 800, unit: 'GM' },
    { ingredient_name: 'Carrots', quantity: 400, unit: 'GM' },
    { ingredient_name: 'Onions', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Herbs Mixed', quantity: 10, unit: 'GM' },
  ],
  'Vegetable Soup': [
    { ingredient_name: 'Carrots', quantity: 300, unit: 'GM' },
    { ingredient_name: 'Celery', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Onions', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Potatoes', quantity: 400, unit: 'GM' },
    { ingredient_name: 'Chicken Stock', quantity: 1000, unit: 'ML' },
    { ingredient_name: 'Herbs Mixed', quantity: 5, unit: 'GM' },
  ],
  'Grilled Lamb Chops': [
    { ingredient_name: 'Lamb Chops', quantity: 800, unit: 'GM' },
    { ingredient_name: 'Potatoes', quantity: 600, unit: 'GM' },
    { ingredient_name: 'Carrots', quantity: 400, unit: 'GM' },
    { ingredient_name: 'Herbs Mixed', quantity: 10, unit: 'GM' },
    { ingredient_name: 'Garlic', quantity: 20, unit: 'GM' },
  ],
  'Caesar Salad Dressing': [
    { ingredient_name: 'Eggs', quantity: 2, unit: 'PC' },
    { ingredient_name: 'Parmesan Cheese', quantity: 50, unit: 'GM' },
    { ingredient_name: 'Garlic', quantity: 10, unit: 'GM' },
    { ingredient_name: 'Olive Oil', quantity: 200, unit: 'ML' },
    { ingredient_name: 'Lemons', quantity: 1, unit: 'PC' },
    { ingredient_name: 'Black Pepper', quantity: 5, unit: 'GM' },
  ],
  'Tomato Pasta Sauce': [
    { ingredient_name: 'Tomatoes', quantity: 800, unit: 'GM' },
    { ingredient_name: 'Tomato Paste', quantity: 50, unit: 'GM' },
    { ingredient_name: 'Onions', quantity: 200, unit: 'GM' },
    { ingredient_name: 'Garlic', quantity: 20, unit: 'GM' },
    { ingredient_name: 'Olive Oil', quantity: 30, unit: 'ML' },
    { ingredient_name: 'Herbs Mixed', quantity: 10, unit: 'GM' },
  ],
};
