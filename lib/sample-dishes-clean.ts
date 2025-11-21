/**
 * Clean Test Data - Dishes
 * 20-25 dishes with recipe links and optional standalone ingredients
 */

export interface DishRecipeLink {
  recipe_name: string;
  quantity: number; // Number of recipe servings
}

export interface DishIngredientLink {
  ingredient_name: string;
  quantity: number;
  unit: string;
}

export interface CleanSampleDish {
  dish_name: string;
  description: string;
  selling_price: number;
  recipes: DishRecipeLink[];
  ingredients?: DishIngredientLink[]; // Optional standalone ingredients
}

export const cleanSampleDishes: CleanSampleDish[] = [
  // Simple dishes - one recipe each
  {
    dish_name: 'Classic Beef Burger',
    description: 'Juicy beef patty with fresh vegetables and classic condiments',
    selling_price: 18.5,
    recipes: [{ recipe_name: 'Beef Burger', quantity: 1 }],
  },
  {
    dish_name: 'Caesar Salad',
    description: 'Classic Caesar salad with crisp romaine lettuce and parmesan',
    selling_price: 16.5,
    recipes: [{ recipe_name: 'Caesar Salad', quantity: 1 }],
  },
  {
    dish_name: 'Pasta Carbonara',
    description: 'Creamy pasta with crispy bacon and parmesan cheese',
    selling_price: 22.5,
    recipes: [{ recipe_name: 'Pasta Carbonara', quantity: 1 }],
  },
  {
    dish_name: 'Chicken Stir Fry',
    description: 'Tender chicken with fresh vegetables in savory sauce',
    selling_price: 19.5,
    recipes: [{ recipe_name: 'Chicken Stir Fry', quantity: 1 }],
  },
  {
    dish_name: 'Fish and Chips',
    description: 'Beer-battered fish with crispy chips and lemon',
    selling_price: 24.5,
    recipes: [{ recipe_name: 'Fish and Chips', quantity: 1 }],
  },
  {
    dish_name: 'Roast Chicken',
    description: 'Herb-roasted chicken with seasonal vegetables',
    selling_price: 28.5,
    recipes: [{ recipe_name: 'Roast Chicken', quantity: 1 }],
  },
  {
    dish_name: 'Vegetable Soup',
    description: 'Hearty vegetable soup with fresh herbs',
    selling_price: 14.5,
    recipes: [{ recipe_name: 'Vegetable Soup', quantity: 1 }],
  },
  {
    dish_name: 'Grilled Lamb Chops',
    description: 'Tender lamb chops with roasted vegetables',
    selling_price: 32.5,
    recipes: [{ recipe_name: 'Grilled Lamb Chops', quantity: 1 }],
  },

  // Enhanced dishes - recipe + standalone ingredients
  {
    dish_name: 'Beef Burger Deluxe',
    description: 'Beef burger with bacon, cheese, and special sauce',
    selling_price: 22.5,
    recipes: [{ recipe_name: 'Beef Burger', quantity: 1 }],
    ingredients: [
      { ingredient_name: 'Bacon', quantity: 50, unit: 'GM' },
      { ingredient_name: 'Cheese', quantity: 30, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Caesar Salad with Chicken',
    description: 'Caesar salad topped with grilled chicken breast',
    selling_price: 21.5,
    recipes: [
      { recipe_name: 'Caesar Salad', quantity: 1 },
      { recipe_name: 'Caesar Salad Dressing', quantity: 0.2 },
    ],
    ingredients: [{ ingredient_name: 'Chicken Breast', quantity: 150, unit: 'GM' }],
  },
  {
    dish_name: 'Fish and Chips Combo',
    description: 'Fish and chips with tartar sauce and mushy peas',
    selling_price: 26.5,
    recipes: [{ recipe_name: 'Fish and Chips', quantity: 1 }],
    ingredients: [
      { ingredient_name: 'Lemons', quantity: 1, unit: 'PC' },
      { ingredient_name: 'Mayonnaise', quantity: 30, unit: 'ML' },
    ],
  },
  {
    dish_name: 'Pasta Carbonara with Extra Bacon',
    description: 'Pasta carbonara with double bacon and extra parmesan',
    selling_price: 25.5,
    recipes: [{ recipe_name: 'Pasta Carbonara', quantity: 1 }],
    ingredients: [
      { ingredient_name: 'Bacon', quantity: 50, unit: 'GM' },
      { ingredient_name: 'Parmesan Cheese', quantity: 20, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Roast Chicken Dinner',
    description: 'Roast chicken with roasted vegetables and gravy',
    selling_price: 32.5,
    recipes: [{ recipe_name: 'Roast Chicken', quantity: 1 }],
    ingredients: [
      { ingredient_name: 'Potatoes', quantity: 200, unit: 'GM' },
      { ingredient_name: 'Carrots', quantity: 150, unit: 'GM' },
    ],
  },

  // Multi-recipe dishes
  {
    dish_name: 'Caesar Salad with Homemade Dressing',
    description: 'Caesar salad made with our signature homemade dressing',
    selling_price: 18.5,
    recipes: [
      { recipe_name: 'Caesar Salad', quantity: 1 },
      { recipe_name: 'Caesar Salad Dressing', quantity: 0.3 },
    ],
  },
  {
    dish_name: 'Pasta with Tomato Sauce',
    description: 'Pasta served with our homemade tomato sauce',
    selling_price: 20.5,
    recipes: [
      { recipe_name: 'Pasta Carbonara', quantity: 0.5 }, // Base pasta
      { recipe_name: 'Tomato Pasta Sauce', quantity: 0.2 },
    ],
  },

  // Variations
  {
    dish_name: 'Vegetarian Burger',
    description: 'Plant-based burger with fresh vegetables',
    selling_price: 17.5,
    recipes: [{ recipe_name: 'Beef Burger', quantity: 0.8 }], // Smaller portion
    ingredients: [
      { ingredient_name: 'Lettuce', quantity: 50, unit: 'GM' },
      { ingredient_name: 'Tomatoes', quantity: 50, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Chicken Stir Fry Extra Spicy',
    description: 'Chicken stir fry with extra vegetables and spicy sauce',
    selling_price: 21.5,
    recipes: [{ recipe_name: 'Chicken Stir Fry', quantity: 1 }],
    ingredients: [
      { ingredient_name: 'Capsicum', quantity: 100, unit: 'GM' },
      { ingredient_name: 'Garlic', quantity: 10, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Grilled Lamb Chops with Mint Sauce',
    description: 'Lamb chops served with mint sauce and roasted vegetables',
    selling_price: 35.5,
    recipes: [{ recipe_name: 'Grilled Lamb Chops', quantity: 1 }],
    ingredients: [
      { ingredient_name: 'Herbs Mixed', quantity: 5, unit: 'GM' },
      { ingredient_name: 'Potatoes', quantity: 150, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Vegetable Soup with Croutons',
    description: 'Vegetable soup topped with homemade croutons',
    selling_price: 16.5,
    recipes: [{ recipe_name: 'Vegetable Soup', quantity: 1 }],
    ingredients: [
      { ingredient_name: 'Bread', quantity: 1, unit: 'PC' },
      { ingredient_name: 'Herbs Mixed', quantity: 2, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Fish and Chips Family Size',
    description: 'Large portion of fish and chips perfect for sharing',
    selling_price: 32.5,
    recipes: [{ recipe_name: 'Fish and Chips', quantity: 1.5 }],
    ingredients: [
      { ingredient_name: 'Lemons', quantity: 2, unit: 'PC' },
      { ingredient_name: 'Potatoes', quantity: 200, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Roast Chicken Half',
    description: 'Half roast chicken with vegetables',
    selling_price: 18.5,
    recipes: [{ recipe_name: 'Roast Chicken', quantity: 0.5 }],
    ingredients: [
      { ingredient_name: 'Potatoes', quantity: 150, unit: 'GM' },
      { ingredient_name: 'Carrots', quantity: 100, unit: 'GM' },
    ],
  },
  {
    dish_name: 'Beef Burger Kids Meal',
    description: 'Smaller portion burger perfect for kids',
    selling_price: 12.5,
    recipes: [{ recipe_name: 'Beef Burger', quantity: 0.6 }],
    ingredients: [{ ingredient_name: 'Cheese', quantity: 20, unit: 'GM' }],
  },
  {
    dish_name: 'Caesar Salad Side',
    description: 'Small Caesar salad as a side dish',
    selling_price: 9.5,
    recipes: [{ recipe_name: 'Caesar Salad', quantity: 0.5 }],
  },
  {
    dish_name: 'Pasta Carbonara Lunch Special',
    description: 'Lunch-sized portion of pasta carbonara',
    selling_price: 18.5,
    recipes: [{ recipe_name: 'Pasta Carbonara', quantity: 0.8 }],
  },
];
