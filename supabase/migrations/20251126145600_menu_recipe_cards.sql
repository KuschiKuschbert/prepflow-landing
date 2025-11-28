-- Create menu_recipe_cards table to store generated recipe cards for locked menus
CREATE TABLE IF NOT EXISTS menu_recipe_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  card_content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(menu_item_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_menu_recipe_cards_menu_item_id ON menu_recipe_cards(menu_item_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_menu_recipe_cards_updated_at ON menu_recipe_cards;
CREATE TRIGGER update_menu_recipe_cards_updated_at
  BEFORE UPDATE ON menu_recipe_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
