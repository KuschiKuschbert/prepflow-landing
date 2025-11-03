-- Uniqueness for ingredients: case-insensitive name + supplier, brand, pack_size, unit, cost_per_unit
create unique index if not exists ingredients_unique_composite
  on public.ingredients (
    lower(ingredient_name),
    coalesce(supplier, ''),
    coalesce(brand, ''),
    coalesce(pack_size, ''),
    coalesce(unit, ''),
    coalesce(cost_per_unit, 0)
  );

-- Uniqueness for recipes by case-insensitive name
create unique index if not exists recipes_unique_name
  on public.recipes (lower(name));

-- Indexes and Triggers for PrepFlow Database

-- Create indexes for better performance
CREATE INDEX idx_ingredients_name ON ingredients(ingredient_name);
CREATE INDEX idx_ingredients_supplier ON ingredients(supplier);
CREATE INDEX idx_ingredients_storage ON ingredients(storage_location);
CREATE INDEX idx_recipes_name ON recipes(name);
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);
CREATE INDEX idx_menu_dishes_recipe_id ON menu_dishes(recipe_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_dishes_updated_at BEFORE UPDATE ON menu_dishes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
