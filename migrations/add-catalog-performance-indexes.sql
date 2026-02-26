-- ============================================================================
-- Long-Term Data Scale Performance: Catalog Indexes
-- ============================================================================
-- Apply this via Supabase Dashboard → SQL Editor.
-- All indexes are created with IF NOT EXISTS to be safe to re-run.
-- ============================================================================

-- RECIPES: primary list query (by user, sorted by name)
CREATE INDEX IF NOT EXISTS idx_recipes_user_name
  ON recipes(user_id, recipe_name);

-- RECIPES: category filter + name sort (catalog endpoint filter by category)
CREATE INDEX IF NOT EXISTS idx_recipes_user_category_name
  ON recipes(user_id, category, recipe_name);

-- DISHES: primary list query (by user, sorted by name)
CREATE INDEX IF NOT EXISTS idx_dishes_user_name
  ON dishes(user_id, dish_name);

-- DISHES: category filter + name sort (catalog endpoint filter by category)
CREATE INDEX IF NOT EXISTS idx_dishes_user_category_name
  ON dishes(user_id, category, dish_name);

-- INGREDIENTS: primary list query (sorted by ingredient_name)
-- Note: ingredients table may use user_id or be shared; adjust if needed.
CREATE INDEX IF NOT EXISTS idx_ingredients_user_name
  ON ingredients(user_id, ingredient_name);

-- INGREDIENTS: category filter + name sort
CREATE INDEX IF NOT EXISTS idx_ingredients_user_category_name
  ON ingredients(user_id, category, ingredient_name);

-- RECIPE_INGREDIENTS: FK join (most expensive query — used when building cost calculations)
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe
  ON recipe_ingredients(recipe_id);

-- RECIPE_INGREDIENTS: reverse join — find all recipes using an ingredient
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient
  ON recipe_ingredients(ingredient_id);

-- COMPLIANCE_RECORDS: list sorted by expiry_date (primary display order)
CREATE INDEX IF NOT EXISTS idx_compliance_records_user_expiry
  ON compliance_records(user_id, expiry_date DESC);

-- COMPLIANCE_RECORDS: filter by type + expiry
CREATE INDEX IF NOT EXISTS idx_compliance_records_type_expiry
  ON compliance_records(compliance_type_id, expiry_date DESC);

-- COMPLIANCE_RECORDS: filter by status + expiry
CREATE INDEX IF NOT EXISTS idx_compliance_records_status_expiry
  ON compliance_records(status, expiry_date DESC);
