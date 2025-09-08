-- PrepFlow Sample Recipes - 12 Complete Restaurant Dishes
-- This script creates realistic recipes with full ingredient lists

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
8. Serve warm with vanilla ice cream or custard', 3.60, 3.60, NOW(), NOW());

-- Insert recipe ingredients for all 12 dishes
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, created_at) VALUES
-- Classic Beef Burger ingredients
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE name = 'Beef Mince' LIMIT 1), 150, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE name = 'Burger Bun' LIMIT 1), 1, 'piece', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE name = 'Lettuce' LIMIT 1), 20, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE name = 'Tomato' LIMIT 1), 30, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 15, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM ingredients WHERE name = 'Pickles' LIMIT 1), 10, 'g', NOW()),

-- Margherita Pizza ingredients
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE name = 'Pizza Dough' LIMIT 1), 200, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE name = 'Tomato Sauce' LIMIT 1), 80, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE name = 'Mozzarella Cheese' LIMIT 1), 120, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE name = 'Olive Oil' LIMIT 1), 10, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM ingredients WHERE name = 'Fresh Basil' LIMIT 1), 5, 'g', NOW()),

-- Chicken Caesar Salad ingredients
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE name = 'Chicken Breast' LIMIT 1), 180, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE name = 'Romaine Lettuce' LIMIT 1), 100, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE name = 'Caesar Dressing' LIMIT 1), 30, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE name = 'Croutons' LIMIT 1), 20, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM ingredients WHERE name = 'Parmesan Cheese' LIMIT 1), 15, 'g', NOW()),

-- Fish and Chips ingredients
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE name = 'Fish Fillet' LIMIT 1), 200, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE name = 'Potatoes' LIMIT 1), 300, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE name = 'Flour' LIMIT 1), 50, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE name = 'Beer' LIMIT 1), 100, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE name = 'Peas' LIMIT 1), 80, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM ingredients WHERE name = 'Cooking Oil' LIMIT 1), 200, 'ml', NOW()),

-- Spaghetti Carbonara ingredients
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE name = 'Spaghetti' LIMIT 1), 100, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE name = 'Pancetta' LIMIT 1), 80, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE name = 'Eggs' LIMIT 1), 2, 'piece', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE name = 'Parmesan Cheese' LIMIT 1), 40, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM ingredients WHERE name = 'Black Pepper' LIMIT 1), 2, 'g', NOW()),

-- Beef Stir Fry ingredients
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE name = 'Beef Strips' LIMIT 1), 150, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE name = 'Bell Peppers' LIMIT 1), 100, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE name = 'Broccoli' LIMIT 1), 80, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE name = 'Carrots' LIMIT 1), 60, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE name = 'Soy Sauce' LIMIT 1), 20, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE name = 'Garlic' LIMIT 1), 5, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM ingredients WHERE name = 'Ginger' LIMIT 1), 5, 'g', NOW()),

-- Chocolate Lava Cake ingredients
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE name = 'Dark Chocolate' LIMIT 1), 100, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE name = 'Butter' LIMIT 1), 80, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE name = 'Eggs' LIMIT 1), 2, 'piece', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE name = 'Sugar' LIMIT 1), 50, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE name = 'Flour' LIMIT 1), 30, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM ingredients WHERE name = 'Vanilla Ice Cream' LIMIT 1), 60, 'g', NOW()),

-- Chicken Tikka Masala ingredients
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Chicken Breast' LIMIT 1), 200, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Yogurt' LIMIT 1), 100, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Tomatoes' LIMIT 1), 200, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Cream' LIMIT 1), 100, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Garlic' LIMIT 1), 10, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Ginger' LIMIT 1), 10, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM ingredients WHERE name = 'Basmati Rice' LIMIT 1), 100, 'g', NOW()),

-- Caesar Salad (Vegetarian) ingredients
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE name = 'Romaine Lettuce' LIMIT 1), 120, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE name = 'Caesar Dressing' LIMIT 1), 40, 'ml', NOW()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE name = 'Croutons' LIMIT 1), 25, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM ingredients WHERE name = 'Parmesan Cheese' LIMIT 1), 20, 'g', NOW()),

-- Beef Tacos ingredients
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE name = 'Ground Beef' LIMIT 1), 200, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE name = 'Taco Shells' LIMIT 1), 3, 'piece', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE name = 'Lettuce' LIMIT 1), 50, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE name = 'Tomato' LIMIT 1), 60, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE name = 'Cheddar Cheese' LIMIT 1), 40, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM ingredients WHERE name = 'Sour Cream' LIMIT 1), 30, 'ml', NOW()),

-- Pan-Seared Salmon Fillet ingredients
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE name = 'Salmon Fillet' LIMIT 1), 200, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE name = 'Butter' LIMIT 1), 20, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE name = 'Lemon' LIMIT 1), 1, 'piece', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE name = 'Fresh Herbs' LIMIT 1), 5, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM ingredients WHERE name = 'Cooking Oil' LIMIT 1), 15, 'ml', NOW()),

-- Apple Crumble ingredients
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE name = 'Apples' LIMIT 1), 200, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE name = 'Sugar' LIMIT 1), 60, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE name = 'Flour' LIMIT 1), 80, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE name = 'Butter' LIMIT 1), 60, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE name = 'Oats' LIMIT 1), 40, 'g', NOW()),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM ingredients WHERE name = 'Cinnamon' LIMIT 1), 2, 'g', NOW());
