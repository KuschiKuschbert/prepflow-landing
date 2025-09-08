-- Complete Setup Script for PrepFlow with 12 Sample Recipes
-- This script sets up the complete database with ingredients and recipes

-- First, ensure we have all the required ingredients
-- Insert additional ingredients needed for recipes (if not already present)
INSERT INTO ingredients (
  ingredient_name, brand, pack_size, pack_size_unit, pack_price, unit, 
  cost_per_unit, trim_peel_waste_percentage, yield_percentage, supplier, 
  storage_location, product_code
) VALUES
-- Additional ingredients for recipes
('Beef Mince', 'Coles', '500', 'GM', 8.50, 'GM', 0.017, 5, 95, 'Coles', 'Cold Room A', 'BEEF002'),
('Burger Bun', 'Local Supplier', '6', 'PC', 3.50, 'PC', 0.583, 0, 100, 'Local Supplier', 'Dry Storage', 'BUN001'),
('Lettuce', 'Local Grower', '1', 'PC', 2.50, 'GM', 0.025, 10, 90, 'Local Grower', 'Cold Room B', 'LETTUCE001'),
('Tomato', 'Local Grower', '500', 'GM', 4.20, 'GM', 0.0084, 5, 95, 'Local Grower', 'Cold Room B', 'TOMATO002'),
('Onion', 'Local Grower', '2', 'KG', 3.50, 'GM', 0.00175, 10, 90, 'Local Grower', 'Dry Storage', 'ONION002'),
('Pickles', 'Masterfoods', '500', 'GM', 3.20, 'GM', 0.0064, 0, 100, 'Masterfoods', 'Dry Storage', 'PICKLES001'),

('Pizza Dough', 'Local Supplier', '500', 'GM', 4.50, 'GM', 0.009, 0, 100, 'Local Supplier', 'Cold Room A', 'DOUGH001'),
('Tomato Sauce', 'Coles', '400', 'GM', 2.20, 'GM', 0.0055, 0, 100, 'Coles', 'Dry Storage', 'SAUCE001'),
('Mozzarella Cheese', 'Woolworths', '250', 'GM', 5.50, 'GM', 0.022, 0, 100, 'Woolworths', 'Cold Room A', 'MOZZ001'),
('Fresh Basil', 'Local Grower', '30', 'GM', 2.50, 'GM', 0.083, 15, 85, 'Local Grower', 'Cold Room B', 'BASIL002'),

('Romaine Lettuce', 'Local Grower', '1', 'PC', 3.20, 'GM', 0.032, 8, 92, 'Local Grower', 'Cold Room B', 'ROMAINE001'),
('Caesar Dressing', 'Masterfoods', '250', 'ML', 4.50, 'ML', 0.018, 0, 100, 'Masterfoods', 'Cold Room A', 'CAESAR001'),
('Croutons', 'Local Supplier', '150', 'GM', 3.80, 'GM', 0.0253, 0, 100, 'Local Supplier', 'Dry Storage', 'CROUTONS001'),
('Parmesan Cheese', 'Woolworths', '200', 'GM', 8.50, 'GM', 0.0425, 0, 100, 'Woolworths', 'Cold Room A', 'PARM001'),

('Fish Fillet', 'Seafood Market', '500', 'GM', 18.50, 'GM', 0.037, 15, 85, 'Seafood Market', 'Cold Room A', 'FISH001'),
('Beer', 'Local Supplier', '375', 'ML', 2.50, 'ML', 0.0067, 0, 100, 'Local Supplier', 'Cold Room A', 'BEER001'),
('Peas', 'Coles', '500', 'GM', 2.50, 'GM', 0.005, 0, 100, 'Coles', 'Freezer', 'PEAS002'),
('Cooking Oil', 'Coles', '1', 'L', 4.50, 'ML', 0.0045, 0, 100, 'Coles', 'Dry Storage', 'OIL002'),

('Spaghetti', 'Woolworths', '500', 'GM', 2.20, 'GM', 0.0044, 0, 100, 'Woolworths', 'Dry Storage', 'SPAGHETTI001'),
('Pancetta', 'Local Butcher', '200', 'GM', 12.50, 'GM', 0.0625, 5, 95, 'Local Butcher', 'Cold Room A', 'PANCETTA001'),
('Black Pepper', 'Masterfoods', '50', 'GM', 3.50, 'GM', 0.07, 0, 100, 'Masterfoods', 'Dry Storage', 'PEPPER002'),

('Beef Strips', 'Local Butcher', '500', 'GM', 15.00, 'GM', 0.03, 8, 92, 'Local Butcher', 'Cold Room A', 'BEEF003'),
('Bell Peppers', 'Local Grower', '500', 'GM', 5.50, 'GM', 0.011, 8, 92, 'Local Grower', 'Cold Room B', 'BELL001'),
('Broccoli', 'Local Grower', '500', 'GM', 4.20, 'GM', 0.0084, 10, 90, 'Local Grower', 'Cold Room B', 'BROCCOLI001'),
('Carrots', 'Local Grower', '1', 'KG', 2.80, 'GM', 0.0028, 8, 92, 'Local Grower', 'Cold Room B', 'CARROT002'),

('Dark Chocolate', 'Masterfoods', '200', 'GM', 6.50, 'GM', 0.0325, 0, 100, 'Masterfoods', 'Dry Storage', 'CHOCOLATE001'),
('Sugar', 'Woolworths', '1', 'KG', 2.20, 'GM', 0.0022, 0, 100, 'Woolworths', 'Dry Storage', 'SUGAR002'),
('Vanilla Ice Cream', 'Coles', '1', 'L', 5.50, 'GM', 0.0055, 0, 100, 'Coles', 'Freezer', 'ICECREAM001'),

('Tomatoes', 'Local Grower', '500', 'GM', 4.20, 'GM', 0.0084, 5, 95, 'Local Grower', 'Cold Room B', 'TOMATO003'),
('Cream', 'Woolworths', '300', 'ML', 3.20, 'ML', 0.0107, 0, 100, 'Woolworths', 'Cold Room A', 'CREAM002'),
('Basmati Rice', 'Coles', '1', 'KG', 3.50, 'GM', 0.0035, 0, 100, 'Coles', 'Dry Storage', 'RICE002'),

('Ground Beef', 'Local Butcher', '500', 'GM', 12.00, 'GM', 0.024, 5, 95, 'Local Butcher', 'Cold Room A', 'GROUND001'),
('Taco Shells', 'Coles', '12', 'PC', 4.50, 'PC', 0.375, 0, 100, 'Coles', 'Dry Storage', 'TACO001'),
('Cheddar Cheese', 'Coles', '250', 'GM', 6.50, 'GM', 0.026, 0, 100, 'Coles', 'Cold Room A', 'CHEDDAR001'),
('Sour Cream', 'Woolworths', '300', 'ML', 3.50, 'ML', 0.0117, 0, 100, 'Woolworths', 'Cold Room A', 'SOUR001'),

('Salmon Fillet', 'Seafood Market', '300', 'GM', 15.00, 'GM', 0.05, 10, 90, 'Seafood Market', 'Cold Room A', 'SALMON001'),
('Lemon', 'Local Grower', '1', 'KG', 4.50, 'PC', 0.45, 20, 80, 'Local Grower', 'Cold Room B', 'LEMON001'),
('Fresh Herbs', 'Local Grower', '50', 'GM', 4.50, 'GM', 0.09, 15, 85, 'Local Grower', 'Cold Room B', 'HERBS001'),

('Apples', 'Local Grower', '1', 'KG', 4.20, 'GM', 0.0042, 10, 90, 'Local Grower', 'Cold Room B', 'APPLE001'),
('Oats', 'Coles', '500', 'GM', 2.80, 'GM', 0.0056, 0, 100, 'Coles', 'Dry Storage', 'OATS001'),
('Cinnamon', 'Masterfoods', '50', 'GM', 3.50, 'GM', 0.07, 0, 100, 'Masterfoods', 'Dry Storage', 'CINNAMON001')

ON CONFLICT (product_code) DO NOTHING;

-- Insert 12 complete recipes
INSERT INTO recipes (id, name, description, yield_quantity, yield_unit, instructions, total_cost, cost_per_serving, created_at, updated_at) VALUES
-- 1. Classic Beef Burger
('550e8400-e29b-41d4-a716-446655440001', 'Classic Beef Burger', 'Juicy beef patty with fresh vegetables and classic condiments', 1, 'serving', '1. Form beef mince into patty and season with salt and pepper
2. Heat grill pan over medium-high heat
3. Cook patty for 4-5 minutes per side until internal temperature reaches 71°C
4. Toast burger bun lightly
5. Assemble: bottom bun, lettuce, tomato, patty, onion, pickles, top bun
6. Serve immediately with fries', 8.50, 8.50, NOW(), NOW()),

-- 2. Margherita Pizza
('550e8400-e29b-41d4-a716-446655440002', 'Margherita Pizza', 'Traditional Italian pizza with fresh mozzarella and basil', 1, 'serving', '1. Preheat oven to 250°C
2. Roll out pizza dough to 30cm diameter
3. Spread tomato sauce evenly over dough
4. Tear mozzarella into chunks and distribute
5. Drizzle with olive oil and season with salt
6. Bake for 12-15 minutes until crust is golden
7. Remove from oven and top with fresh basil leaves
8. Slice and serve hot', 6.25, 6.25, NOW(), NOW()),

-- 3. Chicken Caesar Salad
('550e8400-e29b-41d4-a716-446655440003', 'Chicken Caesar Salad', 'Classic Caesar salad with grilled chicken breast', 1, 'serving', '1. Season chicken breast with salt, pepper, and garlic powder
2. Grill chicken for 6-7 minutes per side until cooked through
3. Let chicken rest for 5 minutes, then slice
4. Toss romaine lettuce with Caesar dressing
5. Add croutons and grated parmesan
6. Top with sliced chicken breast
7. Garnish with additional parmesan and black pepper', 7.80, 7.80, NOW(), NOW()),

-- 4. Fish and Chips
('550e8400-e29b-41d4-a716-446655440004', 'Fish and Chips', 'Beer-battered fish with crispy chips and mushy peas', 1, 'serving', '1. Cut potatoes into thick chips and parboil for 5 minutes
2. Heat oil to 180°C for deep frying
3. Make beer batter: mix flour, beer, and salt until smooth
4. Dip fish fillets in batter and fry for 4-5 minutes until golden
5. Fry chips for 3-4 minutes until crispy
6. Make mushy peas: cook peas with butter and mint
7. Serve fish and chips with mushy peas and tartar sauce', 12.40, 12.40, NOW(), NOW()),

-- 5. Spaghetti Carbonara
('550e8400-e29b-41d4-a716-446655440005', 'Spaghetti Carbonara', 'Creamy Italian pasta with pancetta and parmesan', 1, 'serving', '1. Cook spaghetti according to package directions
2. Cut pancetta into small cubes and fry until crispy
3. Beat eggs with grated parmesan and black pepper
4. Drain pasta, reserving 1 cup of pasta water
5. Return pasta to pot with pancetta and pasta water
6. Remove from heat and quickly stir in egg mixture
7. Toss until creamy sauce coats pasta
8. Serve immediately with extra parmesan', 9.20, 9.20, NOW(), NOW()),

-- 6. Beef Stir Fry
('550e8400-e29b-41d4-a716-446655440006', 'Beef Stir Fry', 'Quick and healthy beef with mixed vegetables', 1, 'serving', '1. Slice beef into thin strips and marinate in soy sauce
2. Heat wok or large pan over high heat
3. Add oil and stir-fry beef for 2-3 minutes until browned
4. Remove beef and set aside
5. Add vegetables and stir-fry for 3-4 minutes
6. Return beef to pan with sauce
7. Toss everything together for 1 minute
8. Serve over steamed rice', 11.60, 11.60, NOW(), NOW()),

-- 7. Chocolate Lava Cake
('550e8400-e29b-41d4-a716-446655440007', 'Chocolate Lava Cake', 'Decadent chocolate cake with molten center', 1, 'serving', '1. Preheat oven to 220°C
2. Butter and flour ramekins
3. Melt chocolate and butter together
4. Beat eggs and sugar until pale and thick
5. Fold in chocolate mixture and flour
6. Pour batter into ramekins
7. Bake for 12-14 minutes until edges are set but center is molten
8. Let rest for 1 minute, then invert onto plate
9. Serve with vanilla ice cream and berries', 4.80, 4.80, NOW(), NOW()),

-- 8. Chicken Tikka Masala
('550e8400-e29b-41d4-a716-446655440008', 'Chicken Tikka Masala', 'Creamy Indian curry with tender chicken', 1, 'serving', '1. Marinate chicken in yogurt and spices for 30 minutes
2. Cook chicken in tandoor or grill until charred
3. Make masala sauce: sauté onions, garlic, and ginger
4. Add tomatoes, cream, and spices
5. Simmer sauce for 20 minutes until thick
6. Add cooked chicken and simmer for 10 minutes
7. Garnish with fresh cilantro
8. Serve with basmati rice and naan bread', 13.20, 13.20, NOW(), NOW()),

-- 9. Caesar Salad (Vegetarian)
('550e8400-e29b-41d4-a716-446655440009', 'Caesar Salad (Vegetarian)', 'Classic Caesar salad without chicken', 1, 'serving', '1. Wash and dry romaine lettuce thoroughly
2. Tear lettuce into bite-sized pieces
3. Make Caesar dressing: whisk together ingredients
4. Toss lettuce with dressing until well coated
5. Add croutons and grated parmesan
6. Toss gently to combine
7. Serve immediately with extra parmesan on top', 5.40, 5.40, NOW(), NOW()),

-- 10. Beef Tacos
('550e8400-e29b-41d4-a716-446655440010', 'Beef Tacos', 'Spicy ground beef tacos with fresh toppings', 3, 'serving', '1. Heat oil in large pan over medium-high heat
2. Add ground beef and cook until browned
3. Add taco seasoning and water, simmer for 5 minutes
4. Warm tortillas in dry pan for 30 seconds each side
5. Fill tortillas with beef mixture
6. Top with lettuce, tomato, cheese, and sour cream
7. Serve with lime wedges and hot sauce', 7.50, 2.50, NOW(), NOW()),

-- 11. Salmon Fillet
('550e8400-e29b-41d4-a716-446655440011', 'Pan-Seared Salmon Fillet', 'Perfectly cooked salmon with herb butter', 1, 'serving', '1. Season salmon fillet with salt and pepper
2. Heat oil in non-stick pan over medium-high heat
3. Place salmon skin-side up and cook for 4-5 minutes
4. Flip and cook for 3-4 minutes until flaky
5. Make herb butter: mix butter with herbs and lemon
6. Remove salmon from pan and top with herb butter
7. Serve with roasted vegetables and rice', 15.80, 15.80, NOW(), NOW()),

-- 12. Apple Crumble
('550e8400-e29b-41d4-a716-446655440012', 'Apple Crumble', 'Warm apple dessert with crispy topping', 1, 'serving', '1. Preheat oven to 180°C
2. Peel and slice apples, toss with sugar and cinnamon
3. Place apples in baking dish
4. Make crumble: rub butter into flour and sugar
5. Add oats and mix until crumbly
6. Sprinkle crumble over apples
7. Bake for 30-35 minutes until golden and bubbling
8. Serve warm with vanilla ice cream or custard', 3.60, 3.60, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- Insert recipe ingredients for all 12 dishes
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, created_at) VALUES
-- Classic Beef Burger ingredients
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE ingredient_name = 'Beef Mince' LIMIT 1), 150, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE ingredient_name = 'Burger Bun' LIMIT 1), 1, 'PC', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE ingredient_name = 'Lettuce' LIMIT 1), 20, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE ingredient_name = 'Tomato' LIMIT 1), 30, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE ingredient_name = 'Onion' LIMIT 1), 15, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE ingredient_name = 'Pickles' LIMIT 1), 10, 'GM', NOW()),

-- Margherita Pizza ingredients
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE ingredient_name = 'Pizza Dough' LIMIT 1), 200, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE ingredient_name = 'Tomato Sauce' LIMIT 1), 80, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE ingredient_name = 'Mozzarella Cheese' LIMIT 1), 120, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE ingredient_name = 'Olive Oil Extra Virgin' LIMIT 1), 10, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE ingredient_name = 'Fresh Basil' LIMIT 1), 5, 'GM', NOW()),

-- Chicken Caesar Salad ingredients
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE ingredient_name = 'Chicken Breast' LIMIT 1), 180, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE ingredient_name = 'Romaine Lettuce' LIMIT 1), 100, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE ingredient_name = 'Caesar Dressing' LIMIT 1), 30, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE ingredient_name = 'Croutons' LIMIT 1), 20, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE ingredient_name = 'Parmesan Cheese' LIMIT 1), 15, 'GM', NOW()),

-- Fish and Chips ingredients
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE ingredient_name = 'Fish Fillet' LIMIT 1), 200, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE ingredient_name = 'Potatoes' LIMIT 1), 300, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE ingredient_name = 'Flour Plain' LIMIT 1), 50, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE ingredient_name = 'Beer' LIMIT 1), 100, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE ingredient_name = 'Peas' LIMIT 1), 80, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE ingredient_name = 'Cooking Oil' LIMIT 1), 200, 'ML', NOW()),

-- Spaghetti Carbonara ingredients
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE ingredient_name = 'Spaghetti' LIMIT 1), 100, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE ingredient_name = 'Pancetta' LIMIT 1), 80, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE ingredient_name = 'Eggs Free Range' LIMIT 1), 2, 'PC', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE ingredient_name = 'Parmesan Cheese' LIMIT 1), 40, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE ingredient_name = 'Black Pepper' LIMIT 1), 2, 'GM', NOW()),

-- Beef Stir Fry ingredients
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE ingredient_name = 'Beef Strips' LIMIT 1), 150, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE ingredient_name = 'Bell Peppers' LIMIT 1), 100, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE ingredient_name = 'Broccoli' LIMIT 1), 80, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE ingredient_name = 'Carrots' LIMIT 1), 60, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE ingredient_name = 'Soy Sauce' LIMIT 1), 20, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE ingredient_name = 'Garlic' LIMIT 1), 5, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE ingredient_name = 'Ginger Fresh' LIMIT 1), 5, 'GM', NOW()),

-- Chocolate Lava Cake ingredients
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE ingredient_name = 'Dark Chocolate' LIMIT 1), 100, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE ingredient_name = 'Butter Unsalted' LIMIT 1), 80, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE ingredient_name = 'Eggs Free Range' LIMIT 1), 2, 'PC', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE ingredient_name = 'Sugar' LIMIT 1), 50, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE ingredient_name = 'Flour Plain' LIMIT 1), 30, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE ingredient_name = 'Vanilla Ice Cream' LIMIT 1), 60, 'GM', NOW()),

-- Chicken Tikka Masala ingredients
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Chicken Breast' LIMIT 1), 200, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Yoghurt Natural' LIMIT 1), 100, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Tomatoes' LIMIT 1), 200, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Cream' LIMIT 1), 100, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Onion' LIMIT 1), 100, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Garlic' LIMIT 1), 10, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Ginger Fresh' LIMIT 1), 10, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE ingredient_name = 'Basmati Rice' LIMIT 1), 100, 'GM', NOW()),

-- Caesar Salad (Vegetarian) ingredients
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE ingredient_name = 'Romaine Lettuce' LIMIT 1), 120, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE ingredient_name = 'Caesar Dressing' LIMIT 1), 40, 'ML', NOW()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE ingredient_name = 'Croutons' LIMIT 1), 25, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE ingredient_name = 'Parmesan Cheese' LIMIT 1), 20, 'GM', NOW()),

-- Beef Tacos ingredients
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE ingredient_name = 'Ground Beef' LIMIT 1), 200, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE ingredient_name = 'Taco Shells' LIMIT 1), 3, 'PC', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE ingredient_name = 'Lettuce' LIMIT 1), 50, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE ingredient_name = 'Tomato' LIMIT 1), 60, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE ingredient_name = 'Cheddar Cheese' LIMIT 1), 40, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE ingredient_name = 'Sour Cream' LIMIT 1), 30, 'ML', NOW()),

-- Pan-Seared Salmon Fillet ingredients
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE ingredient_name = 'Salmon Fillet' LIMIT 1), 200, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE ingredient_name = 'Butter Unsalted' LIMIT 1), 20, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE ingredient_name = 'Lemon' LIMIT 1), 1, 'PC', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE ingredient_name = 'Fresh Herbs' LIMIT 1), 5, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE ingredient_name = 'Cooking Oil' LIMIT 1), 15, 'ML', NOW()),

-- Apple Crumble ingredients
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE ingredient_name = 'Apples' LIMIT 1), 200, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE ingredient_name = 'Sugar' LIMIT 1), 60, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE ingredient_name = 'Flour Plain' LIMIT 1), 80, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE ingredient_name = 'Butter Unsalted' LIMIT 1), 60, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE ingredient_name = 'Oats' LIMIT 1), 40, 'GM', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE ingredient_name = 'Cinnamon' LIMIT 1), 2, 'GM', NOW())

ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
