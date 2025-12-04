-- Add data_hash column to menu_recipe_cards table for change detection
-- This allows reusing existing recipe cards when underlying data hasn't changed

-- Add data_hash column
ALTER TABLE menu_recipe_cards
ADD COLUMN IF NOT EXISTS data_hash TEXT;

-- Create index for faster hash lookups
CREATE INDEX IF NOT EXISTS idx_menu_recipe_cards_data_hash
ON menu_recipe_cards(data_hash);

-- Add comment explaining the column
COMMENT ON COLUMN menu_recipe_cards.data_hash IS 'SHA256 hash of normalized ingredients, instructions, description, and yield. Used to detect changes and reuse existing cards.';







