-- PrepFlow Kitchen Management Database Schema
-- Single-user MVP version (no user_id needed initially)

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ingredient_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  pack_size VARCHAR(100),
  unit VARCHAR(50) NOT NULL,
  cost_per_unit DECIMAL(10,4) NOT NULL,
  trim_waste_percentage DECIMAL(5,2) DEFAULT 0,
  yield_percentage DECIMAL(5,2) DEFAULT 100,
  supplier VARCHAR(255),
  storage VARCHAR(255),
  product_code VARCHAR(100),
  cost_per_unit_as_purchased DECIMAL(10,4),
  cost_per_unit_incl_trim DECIMAL(10,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
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
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,4) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id)
);

-- Menu dishes table
CREATE TABLE IF NOT EXISTS menu_dishes (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(ingredient_name);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_menu_dishes_name ON menu_dishes(name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_dishes_updated_at BEFORE UPDATE ON menu_dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO ingredients (name, brand, pack_size, unit, cost_per_unit, trim_waste_percentage, yield_percentage, supplier) VALUES
('Tomatoes', 'Fresh Farm', '1kg', 'kg', 4.50, 5, 95, 'Local Supplier'),
('Onions', 'Premium', '2kg', 'kg', 2.80, 10, 90, 'Local Supplier'),
('Garlic', 'Fresh', '500g', 'kg', 12.00, 5, 95, 'Local Supplier'),
('Olive Oil', 'Extra Virgin', '1L', 'L', 8.50, 0, 100, 'Import Supplier'),
('Salt', 'Sea Salt', '1kg', 'kg', 3.20, 0, 100, 'Bulk Supplier');

INSERT INTO recipes (name, description, yield, yield_unit, instructions, prep_time_minutes, cook_time_minutes) VALUES
('Tomato Sauce', 'Classic Italian tomato sauce', 4, 'servings', '1. Heat oil in pan\n2. Add onions and garlic\n3. Add tomatoes\n4. Simmer for 20 minutes', 10, 20),
('Pasta Carbonara', 'Traditional Italian pasta dish', 2, 'servings', '1. Cook pasta\n2. Prepare sauce\n3. Combine and serve', 15, 15);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE name = 'Tomatoes'), 0.5, 'kg'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE name = 'Onions'), 0.1, 'kg'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE name = 'Garlic'), 0.01, 'kg'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE name = 'Olive Oil'), 0.02, 'L'),
((SELECT id FROM recipes WHERE name = 'Tomato Sauce'), (SELECT id FROM ingredients WHERE name = 'Salt'), 0.005, 'kg');

INSERT INTO menu_dishes (name, recipe_id, selling_price, labor_cost, overhead_cost, target_profit_margin) VALUES
('Spaghetti with Tomato Sauce', (SELECT id FROM recipes WHERE name = 'Tomato Sauce'), 18.50, 2.00, 1.50, 65),
('Pasta Carbonara', (SELECT id FROM recipes WHERE name = 'Pasta Carbonara'), 22.00, 2.50, 2.00, 70);
