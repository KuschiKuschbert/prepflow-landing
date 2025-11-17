-- Migration: Add pricing columns to menu_items table
-- Run this in Supabase SQL Editor

-- Add actual_selling_price column (user-set price override per menu item)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS actual_selling_price DECIMAL(10,2);

-- Add recommended_selling_price column (calculated/cached recommended price)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS recommended_selling_price DECIMAL(10,2);

-- Add index for faster queries on pricing
CREATE INDEX IF NOT EXISTS idx_menu_items_actual_selling_price ON menu_items(actual_selling_price);
CREATE INDEX IF NOT EXISTS idx_menu_items_recommended_selling_price ON menu_items(recommended_selling_price);

-- Add comment for documentation
COMMENT ON COLUMN menu_items.actual_selling_price IS 'User-set selling price override for this menu item. If NULL, use recommended_selling_price or dish.selling_price';
COMMENT ON COLUMN menu_items.recommended_selling_price IS 'Calculated recommended selling price based on COGS and target profit margin. Cached for performance.';
