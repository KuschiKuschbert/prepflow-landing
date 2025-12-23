/**
 * Clean Test Data - Menus
 * 2-3 menus with menu items (dishes and recipes) with proper categories and positions
 */

export interface MenuItemDefinition {
  dish_name?: string; // Either dish_name OR recipe_name must be provided
  recipe_name?: string;
  category: string;
  position: number;
}

export interface CleanSampleMenu {
  menu_name: string;
  description: string;
  items: MenuItemDefinition[];
}

export const cleanSampleMenus: CleanSampleMenu[] = [
  {
    menu_name: 'Lunch Menu',
    description: 'Our popular lunch offerings - quick, fresh, and satisfying',
    items: [
      // Appetizers
      { recipe_name: 'Caesar Salad', category: 'Appetizers', position: 0 },
      { dish_name: 'Vegetable Soup', category: 'Appetizers', position: 1 },
      { dish_name: 'Caesar Salad Side', category: 'Appetizers', position: 2 },

      // Mains
      { dish_name: 'Classic Beef Burger', category: 'Mains', position: 0 },
      { dish_name: 'Beef Burger Deluxe', category: 'Mains', position: 1 },
      { dish_name: 'Chicken Stir Fry', category: 'Mains', position: 2 },
      { dish_name: 'Chicken Stir Fry Extra Spicy', category: 'Mains', position: 3 },
      { dish_name: 'Fish and Chips', category: 'Mains', position: 4 },
      { dish_name: 'Pasta Carbonara', category: 'Mains', position: 5 },
      { dish_name: 'Pasta Carbonara Lunch Special', category: 'Mains', position: 6 },
      { dish_name: 'Caesar Salad with Chicken', category: 'Mains', position: 7 },
    ],
  },
  {
    menu_name: 'Dinner Menu',
    description: 'Evening favorites - hearty meals for dinner service',
    items: [
      // Appetizers
      { recipe_name: 'Caesar Salad', category: 'Appetizers', position: 0 },
      { dish_name: 'Caesar Salad with Homemade Dressing', category: 'Appetizers', position: 1 },
      { dish_name: 'Vegetable Soup with Croutons', category: 'Appetizers', position: 2 },

      // Mains
      { dish_name: 'Roast Chicken', category: 'Mains', position: 0 },
      { dish_name: 'Roast Chicken Dinner', category: 'Mains', position: 1 },
      { dish_name: 'Roast Chicken Half', category: 'Mains', position: 2 },
      { dish_name: 'Grilled Lamb Chops', category: 'Mains', position: 3 },
      { dish_name: 'Grilled Lamb Chops with Mint Sauce', category: 'Mains', position: 4 },
      { dish_name: 'Pasta Carbonara', category: 'Mains', position: 5 },
      { dish_name: 'Pasta Carbonara with Extra Bacon', category: 'Mains', position: 6 },
      { dish_name: 'Pasta with Tomato Sauce', category: 'Mains', position: 7 },
      { dish_name: 'Fish and Chips Combo', category: 'Mains', position: 8 },
      { dish_name: 'Fish and Chips Family Size', category: 'Mains', position: 9 },
    ],
  },
  {
    menu_name: 'Weekend Specials',
    description: 'Special weekend offerings and family favorites',
    items: [
      // Appetizers
      { recipe_name: 'Caesar Salad', category: 'Appetizers', position: 0 },
      { dish_name: 'Vegetable Soup', category: 'Appetizers', position: 1 },

      // Mains
      { dish_name: 'Classic Beef Burger', category: 'Mains', position: 0 },
      { dish_name: 'Beef Burger Deluxe', category: 'Mains', position: 1 },
      { dish_name: 'Beef Burger Kids Meal', category: 'Mains', position: 2 },
      { dish_name: 'Vegetarian Burger', category: 'Mains', position: 3 },
      { dish_name: 'Roast Chicken', category: 'Mains', position: 4 },
      { dish_name: 'Roast Chicken Dinner', category: 'Mains', position: 5 },
      { dish_name: 'Grilled Lamb Chops', category: 'Mains', position: 6 },
      { dish_name: 'Fish and Chips', category: 'Mains', position: 7 },
      { dish_name: 'Fish and Chips Combo', category: 'Mains', position: 8 },
      { dish_name: 'Fish and Chips Family Size', category: 'Mains', position: 9 },
      { dish_name: 'Chicken Stir Fry', category: 'Mains', position: 10 },
      { dish_name: 'Pasta Carbonara', category: 'Mains', position: 11 },
    ],
  },
];




