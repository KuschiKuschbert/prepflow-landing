-- PrepFlow Complete Database Setup for Supabase
-- This script creates all tables and populates with 50 essential ingredients

-- =============================================
-- DROP EXISTING TABLES (if they exist)
-- =============================================
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS menu_dishes CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- CREATE TABLES
-- =============================================

-- Ingredients table
CREATE TABLE ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ingredient_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  pack_size VARCHAR(100),
  unit VARCHAR(50) NOT NULL,
  cost_per_unit DECIMAL(10,4) NOT NULL,
  cost_per_unit_as_purchased DECIMAL(10,4),
  cost_per_unit_incl_trim DECIMAL(10,4),
  trim_peel_waste_percentage DECIMAL(5,2) DEFAULT 0,
  yield_percentage DECIMAL(5,2) DEFAULT 100,
  supplier VARCHAR(255),
  storage VARCHAR(255),
  product_code VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  yield INTEGER NOT NULL DEFAULT 1,
  yield_unit VARCHAR(50) NOT NULL DEFAULT 'servings',
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe ingredients junction table
CREATE TABLE recipe_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,4) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id)
);

-- Menu dishes table
CREATE TABLE menu_dishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  overhead_cost DECIMAL(10,2) DEFAULT 0,
  target_profit_margin DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for future authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  business_name VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'trial',
  subscription_expires TIMESTAMP WITH TIME ZONE,
  stripe_customer_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP WITH TIME ZONE,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_ingredients_name ON ingredients(ingredient_name);
CREATE INDEX idx_recipes_name ON recipes(name);
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);
CREATE INDEX idx_menu_dishes_name ON menu_dishes(name);
CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_dishes_updated_at BEFORE UPDATE ON menu_dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT 50 ESSENTIAL INGREDIENTS
-- =============================================

-- MEAT & PROTEIN (8 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Beef Mince Premium', 'Coles', '500', 'GM', 0.012, 0.012, 0.012, 2.00, 98.00, 'Coles', 'COLDROOM', ''),
('Chicken Breast Skinless', 'Lilydale', '1000', 'GM', 0.008, 0.008, 0.008, 5.00, 95.00, 'Woolworths', 'COLDROOM', ''),
('Pork Belly', 'Local Butcher', '2000', 'GM', 0.015, 0.015, 0.015, 8.00, 92.00, 'Local Butcher', 'COLDROOM', ''),
('Lamb Shoulder', 'Local Butcher', '3000', 'GM', 0.018, 0.018, 0.018, 10.00, 90.00, 'Local Butcher', 'COLDROOM', ''),
('Salmon Fillet', 'Tassal', '1000', 'GM', 0.025, 0.025, 0.025, 3.00, 97.00, 'Seafood Direct', 'COLDROOM', ''),
('Prawns Raw', 'Banana Prawns', '1000', 'GM', 0.022, 0.022, 0.022, 15.00, 85.00, 'Seafood Direct', 'FROZEN', ''),
('Eggs Free Range', 'Farm Fresh', '30', 'PC', 0.45, 0.45, 0.45, 0.00, 100.00, 'Local Farm', 'COLDROOM', ''),
('Bacon Middle', 'Local Butcher', '1000', 'GM', 0.018, 0.018, 0.018, 5.00, 95.00, 'Local Butcher', 'COLDROOM', '');

-- VEGETABLES (12 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Onions Brown', 'Local Grower', '2000', 'GM', 0.002, 0.002, 0.002, 12.00, 88.00, 'Local Grower', 'DRYSTORE', ''),
('Garlic', 'Local Grower', '500', 'GM', 0.008, 0.008, 0.008, 20.00, 80.00, 'Local Grower', 'DRYSTORE', ''),
('Carrots', 'Local Grower', '2000', 'GM', 0.003, 0.003, 0.003, 8.00, 92.00, 'Local Grower', 'COLDROOM', ''),
('Celery', 'Local Grower', '1000', 'GM', 0.004, 0.004, 0.004, 10.00, 90.00, 'Local Grower', 'COLDROOM', ''),
('Tomatoes Roma', 'Local Grower', '2000', 'GM', 0.005, 0.005, 0.005, 5.00, 95.00, 'Local Grower', 'COLDROOM', ''),
('Potatoes Sebago', 'Local Grower', '5000', 'GM', 0.002, 0.002, 0.002, 15.00, 85.00, 'Local Grower', 'DRYSTORE', ''),
('Mushrooms Button', 'Local Grower', '500', 'GM', 0.012, 0.012, 0.012, 2.00, 98.00, 'Local Grower', 'COLDROOM', ''),
('Spinach Baby', 'Local Grower', '200', 'GM', 0.025, 0.025, 0.025, 5.00, 95.00, 'Local Grower', 'COLDROOM', ''),
('Lettuce Cos', 'Local Grower', '1', 'PC', 2.50, 2.50, 2.50, 8.00, 92.00, 'Local Grower', 'COLDROOM', ''),
('Capsicum Red', 'Local Grower', '1000', 'GM', 0.008, 0.008, 0.008, 5.00, 95.00, 'Local Grower', 'COLDROOM', ''),
('Zucchini', 'Local Grower', '1000', 'GM', 0.006, 0.006, 0.006, 3.00, 97.00, 'Local Grower', 'COLDROOM', ''),
('Pickles', 'MasterFoods', '1000', 'GM', 0.006, 0.006, 0.006, 0.00, 100.00, 'Coles', 'COLDROOM', '');

-- HERBS & SPICES (8 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Basil Fresh', 'Local Grower', '50', 'GM', 0.080, 0.080, 0.080, 5.00, 95.00, 'Local Grower', 'COLDROOM', ''),
('Parsley Flat', 'Local Grower', '50', 'GM', 0.060, 0.060, 0.060, 5.00, 95.00, 'Local Grower', 'COLDROOM', ''),
('Thyme Fresh', 'Local Grower', '25', 'GM', 0.120, 0.120, 0.120, 10.00, 90.00, 'Local Grower', 'COLDROOM', ''),
('Rosemary Fresh', 'Local Grower', '25', 'GM', 0.100, 0.100, 0.100, 8.00, 92.00, 'Local Grower', 'COLDROOM', ''),
('Black Pepper Ground', 'MasterFoods', '100', 'GM', 0.045, 0.045, 0.045, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Salt Sea', 'Murray River', '500', 'GM', 0.008, 0.008, 0.008, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Paprika Sweet', 'MasterFoods', '100', 'GM', 0.035, 0.035, 0.035, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Cumin Ground', 'MasterFoods', '100', 'GM', 0.040, 0.040, 0.040, 0.00, 100.00, 'Coles', 'DRYSTORE', '');

-- DAIRY (6 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Milk Full Cream', 'Dairy Farmers', '1000', 'ML', 0.001, 0.001, 0.001, 0.00, 100.00, 'Coles', 'COLDROOM', ''),
('Butter Unsalted', 'Western Star', '500', 'GM', 0.006, 0.006, 0.006, 0.00, 100.00, 'Coles', 'COLDROOM', ''),
('Cream Thickened', 'Dairy Farmers', '300', 'ML', 0.003, 0.003, 0.003, 0.00, 100.00, 'Coles', 'COLDROOM', ''),
('Cheese Cheddar', 'Coon', '500', 'GM', 0.012, 0.012, 0.012, 2.00, 98.00, 'Coles', 'COLDROOM', ''),
('Parmesan Grated', 'Perfect Italiano', '200', 'GM', 0.025, 0.025, 0.025, 0.00, 100.00, 'Coles', 'COLDROOM', ''),
('Yoghurt Greek', 'Chobani', '1000', 'GM', 0.008, 0.008, 0.008, 0.00, 100.00, 'Coles', 'COLDROOM', '');

-- OILS & VINEGARS (5 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Olive Oil Extra Virgin', 'Cobram Estate', '1000', 'ML', 0.008, 0.008, 0.008, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Canola Oil', 'Crisco', '2000', 'ML', 0.003, 0.003, 0.003, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Balsamic Vinegar', 'Colavita', '500', 'ML', 0.012, 0.012, 0.012, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('White Wine Vinegar', 'MasterFoods', '500', 'ML', 0.006, 0.006, 0.006, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Sesame Oil', 'MasterFoods', '250', 'ML', 0.020, 0.020, 0.020, 0.00, 100.00, 'Coles', 'DRYSTORE', '');

-- GRAINS & FLOUR (4 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Flour Plain', 'White Wings', '2000', 'GM', 0.002, 0.002, 0.002, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Rice Basmati', 'SunRice', '2000', 'GM', 0.004, 0.004, 0.004, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Pasta Spaghetti', 'Barilla', '500', 'GM', 0.006, 0.006, 0.006, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Bread Sourdough', 'Local Bakery', '1', 'PC', 4.50, 4.50, 4.50, 5.00, 95.00, 'Local Bakery', 'COLDROOM', '');

-- CONDIMENTS & SAUCES (4 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Tomato Sauce', 'MasterFoods', '500', 'ML', 0.004, 0.004, 0.004, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Worcestershire Sauce', 'Lea & Perrins', '500', 'ML', 0.008, 0.008, 0.008, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Soy Sauce', 'Kikkoman', '500', 'ML', 0.006, 0.006, 0.006, 0.00, 100.00, 'Coles', 'DRYSTORE', ''),
('Aioli', 'MasterFoods', '250', 'ML', 0.009, 0.009, 0.009, 0.00, 100.00, 'Coles', 'COLDROOM', '');

-- SPECIALTY ITEMS (3 items)
INSERT INTO ingredients (ingredient_name, brand, pack_size, unit, cost_per_unit, cost_per_unit_as_purchased, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, supplier, storage, product_code) VALUES
('Brioche Bun', 'Local Bakery', '1', 'PC', 1.519, 1.519, 1.519, 0.00, 100.00, 'Local Bakery', 'COLDROOM', ''),
('Chips Stay Crisp', 'McCain', '2000', 'GM', 0.007, 0.007, 0.007, 0.00, 100.00, 'Coles', 'FROZEN', ''),
('Burger Patties Angel Bay', 'Angel Bay', '1', 'PC', 2.717, 2.717, 2.717, 0.00, 100.00, 'Coles', 'FROZEN', '');

-- =============================================
-- INSERT SAMPLE RECIPES
-- =============================================
INSERT INTO recipes (name, description, yield, yield_unit, instructions, prep_time_minutes, cook_time_minutes) VALUES
('Tomato Sauce', 'Classic Italian tomato sauce', 4, 'servings', '1. Heat oil in pan\n2. Add onions and garlic\n3. Add tomatoes\n4. Simmer for 20 minutes', 10, 20),
('Pasta Carbonara', 'Traditional Italian pasta dish', 2, 'servings', '1. Cook pasta\n2. Prepare sauce\n3. Combine and serve', 15, 15),
('Double Cheese Burger', 'Classic burger with double patties', 1, 'serving', '1. Cook burger patties\n2. Toast brioche bun\n3. Add cheese and bacon\n4. Assemble burger', 10, 15);

-- =============================================
-- INSERT SAMPLE RECIPE INGREDIENTS
-- =============================================
-- Tomato Sauce ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE ingredient_name = 'Tomatoes Roma'), 0.5, 'GM'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE ingredient_name = 'Onions Brown'), 0.1, 'GM'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE ingredient_name = 'Garlic'), 0.01, 'GM'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE ingredient_name = 'Olive Oil Extra Virgin'), 0.02, 'ML'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE ingredient_name = 'Salt Sea'), 0.005, 'GM');

-- Double Cheese Burger ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Burger Patties Angel Bay'), 2.00, 'PC'),
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Cheese Cheddar'), 2.00, 'PC'),
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Bacon Middle'), 60.00, 'GM'),
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Brioche Bun'), 1.00, 'PC'),
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Chips Stay Crisp'), 120.00, 'GM'),
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Aioli'), 30.00, 'ML'),
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Tomato Sauce'), 30.00, 'ML'),
((SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), (SELECT id FROM ingredients WHERE ingredient_name = 'Pickles'), 15.00, 'GM');

-- =============================================
-- INSERT SAMPLE MENU DISHES
-- =============================================
INSERT INTO menu_dishes (name, recipe_id, selling_price, labor_cost, overhead_cost, target_profit_margin) VALUES
('Spaghetti with Tomato Sauce', (SELECT id FROM recipes WHERE name = 'Tomato Sauce'), 18.50, 2.00, 1.50, 65),
('Pasta Carbonara', (SELECT id FROM recipes WHERE name = 'Pasta Carbonara'), 22.00, 2.50, 2.00, 70),
('Double Cheese Burger', (SELECT id FROM recipes WHERE name = 'Double Cheese Burger'), 24.95, 3.00, 2.50, 72);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Check that everything was created successfully
SELECT 'Ingredients count: ' || COUNT(*) FROM ingredients;
SELECT 'Recipes count: ' || COUNT(*) FROM recipes;
SELECT 'Recipe ingredients count: ' || COUNT(*) FROM recipe_ingredients;
SELECT 'Menu dishes count: ' || COUNT(*) FROM menu_dishes;

-- Show sample data
SELECT 'Sample ingredients:' as info;
SELECT ingredient_name, cost_per_unit, unit FROM ingredients LIMIT 5;

SELECT 'Sample recipes:' as info;
SELECT name, yield, yield_unit FROM recipes;

-- =============================================
-- SETUP COMPLETE!
-- =============================================
-- Your PrepFlow database is now ready with:
-- ✅ 50 essential ingredients
-- ✅ 3 sample recipes
-- ✅ Sample recipe ingredients
-- ✅ 3 sample menu dishes
-- ✅ All necessary tables and indexes
-- ✅ Triggers for updated_at timestamps
