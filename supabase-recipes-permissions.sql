-- Sample Recipes and Permissions for PrepFlow Database

-- Insert sample recipes
INSERT INTO recipes (name, description, yield, yield_unit, instructions, total_cost, cost_per_serving) VALUES
('Beef Burger', 'Classic beef burger with fresh ingredients', 4, 'serving', '1. Mix beef mince with seasonings\n2. Form into patties\n3. Cook on grill\n4. Assemble with bun and toppings', 12.50, 3.13),
('Chicken Caesar Salad', 'Fresh chicken caesar salad', 2, 'serving', '1. Grill chicken breast\n2. Prepare lettuce\n3. Make caesar dressing\n4. Toss and serve', 8.75, 4.38),
('Vegetable Stir Fry', 'Quick and healthy vegetable stir fry', 3, 'serving', '1. Heat oil in wok\n2. Add vegetables\n3. Stir fry until tender\n4. Season and serve', 6.25, 2.08);

-- Insert recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
-- Beef Burger ingredients
((SELECT id FROM recipes WHERE name = 'Beef Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Beef Mince Premium'), 500, 'GM'),
((SELECT id FROM recipes WHERE name = 'Beef Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Onions Brown'), 100, 'GM'),
((SELECT id FROM recipes WHERE name = 'Beef Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Carrots'), 50, 'GM'),
((SELECT id FROM recipes WHERE name = 'Beef Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Bread Sourdough'), 200, 'GM'),

-- Chicken Caesar Salad ingredients
((SELECT id FROM recipes WHERE name = 'Chicken Caesar Salad'), (SELECT id FROM ingredients WHERE ingredient_name = 'Chicken Breast'), 300, 'GM'),
((SELECT id FROM recipes WHERE name = 'Chicken Caesar Salad'), (SELECT id FROM ingredients WHERE ingredient_name = 'Cream Thick'), 100, 'ML'),
((SELECT id FROM recipes WHERE name = 'Chicken Caesar Salad'), (SELECT id FROM ingredients WHERE ingredient_name = 'Cheese Cheddar'), 50, 'GM'),

-- Vegetable Stir Fry ingredients
((SELECT id FROM recipes WHERE name = 'Vegetable Stir Fry'), (SELECT id FROM ingredients WHERE ingredient_name = 'Capsicum Red'), 200, 'GM'),
((SELECT id FROM recipes WHERE name = 'Vegetable Stir Fry'), (SELECT id FROM ingredients WHERE ingredient_name = 'Carrots'), 150, 'GM'),
((SELECT id FROM recipes WHERE name = 'Vegetable Stir Fry'), (SELECT id FROM ingredients WHERE ingredient_name = 'Onions Brown'), 100, 'GM'),
((SELECT id FROM recipes WHERE name = 'Vegetable Stir Fry'), (SELECT id FROM ingredients WHERE ingredient_name = 'Olive Oil Extra Virgin'), 30, 'ML');

-- Insert sample menu dishes
INSERT INTO menu_dishes (recipe_id, name, selling_price, profit_margin, popularity_score) VALUES
((SELECT id FROM recipes WHERE name = 'Beef Burger'), 'Classic Beef Burger', 18.50, 82.9, 95),
((SELECT id FROM recipes WHERE name = 'Chicken Caesar Salad'), 'Chicken Caesar Salad', 16.00, 72.5, 88),
((SELECT id FROM recipes WHERE name = 'Vegetable Stir Fry'), 'Vegetable Stir Fry', 12.00, 82.7, 75);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
SELECT 'PrepFlow database setup completed successfully!' as status;
