-- Recipe Card Cross-Referencing Migration
-- Transform recipe cards from per-menu-item to recipe-based cross-referencing

-- Step 1: Add new columns for cross-referencing
ALTER TABLE menu_recipe_cards
ADD COLUMN IF NOT EXISTS recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS recipe_signature TEXT;

-- Step 2: Remove old unique constraint on menu_item_id
ALTER TABLE menu_recipe_cards
DROP CONSTRAINT IF EXISTS menu_recipe_cards_menu_item_id_key;

-- Step 3: Make menu_item_id nullable (will be removed later, but keep for migration period)
-- Note: We'll keep it for now to support migration, then remove it later

-- Step 4: Add new unique constraints for cross-referencing
-- Note: We use partial unique indexes with WHERE clauses to allow NULL values
-- For direct recipes: one card per recipe_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_recipe_cards_unique_recipe_id
ON menu_recipe_cards(recipe_id)
WHERE recipe_id IS NOT NULL;

-- For dishes: one card per (dish_id, recipe_signature) combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_recipe_cards_unique_dish_signature
ON menu_recipe_cards(dish_id, recipe_signature)
WHERE dish_id IS NOT NULL AND recipe_signature IS NOT NULL;

-- Note: Supabase upsert with onConflict works with unique indexes
-- We'll use the column names in onConflict: 'recipe_id' or 'dish_id,recipe_signature'

-- Step 5: Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_menu_recipe_cards_recipe_id
ON menu_recipe_cards(recipe_id)
WHERE recipe_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_menu_recipe_cards_dish_id
ON menu_recipe_cards(dish_id)
WHERE dish_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_menu_recipe_cards_recipe_signature
ON menu_recipe_cards(recipe_signature)
WHERE recipe_signature IS NOT NULL;

-- Step 6: Create junction table for many-to-many relationship
-- This allows multiple menu items to reference the same card
CREATE TABLE IF NOT EXISTS menu_item_recipe_card_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  recipe_card_id UUID NOT NULL REFERENCES menu_recipe_cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(menu_item_id, recipe_card_id)
);

-- Create indexes for junction table
CREATE INDEX IF NOT EXISTS idx_menu_item_recipe_card_links_menu_item_id
ON menu_item_recipe_card_links(menu_item_id);

CREATE INDEX IF NOT EXISTS idx_menu_item_recipe_card_links_recipe_card_id
ON menu_item_recipe_card_links(recipe_card_id);

-- Add comments for documentation
COMMENT ON COLUMN menu_recipe_cards.recipe_id IS 'For direct recipe menu items: the recipe_id this card represents';
COMMENT ON COLUMN menu_recipe_cards.dish_id IS 'For dish menu items: the dish_id this card represents';
COMMENT ON COLUMN menu_recipe_cards.recipe_signature IS 'Composite identifier for dishes with multiple recipes. Format: sorted recipe IDs joined with ":" (e.g., "recipe_id_1:recipe_id_2") or "dish:dish_id" for dishes without recipes';
COMMENT ON TABLE menu_item_recipe_card_links IS 'Junction table linking menu items to recipe cards. Allows multiple menu items to share the same card when they use the same recipe(s).';
