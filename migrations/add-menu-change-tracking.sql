-- Menu Change Tracking Migration
-- Tracks changes to dishes/recipes/ingredients while menus are locked

-- Create menu_change_tracking table
CREATE TABLE IF NOT EXISTS menu_change_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('dish', 'recipe', 'ingredient')),
  entity_id UUID NOT NULL,
  entity_name VARCHAR(255) NOT NULL,
  change_type VARCHAR(50) NOT NULL,
  change_details JSONB DEFAULT '{}'::jsonb,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by VARCHAR(255),
  handled BOOLEAN DEFAULT FALSE,
  handled_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_menu_change_tracking_menu_id 
  ON menu_change_tracking(menu_id) 
  WHERE handled = FALSE;

CREATE INDEX IF NOT EXISTS idx_menu_change_tracking_entity 
  ON menu_change_tracking(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_menu_change_tracking_handled 
  ON menu_change_tracking(handled, changed_at);

-- Add comment to table
COMMENT ON TABLE menu_change_tracking IS 'Tracks changes to dishes/recipes/ingredients used by locked menus';







