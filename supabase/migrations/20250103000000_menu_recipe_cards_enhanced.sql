-- Enhanced menu_recipe_cards table with structured data for scaling
-- Add new fields to support normalized ingredients and method steps

ALTER TABLE menu_recipe_cards
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS base_yield INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS ingredients JSONB,
ADD COLUMN IF NOT EXISTS method_steps JSONB,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS parsed_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster lookups by menu_id (via menu_items join)
CREATE INDEX IF NOT EXISTS idx_menu_recipe_cards_menu_item_menu_id
ON menu_recipe_cards(menu_item_id);

-- Update existing cards to have base_yield = 1 if null
UPDATE menu_recipe_cards SET base_yield = 1 WHERE base_yield IS NULL;
