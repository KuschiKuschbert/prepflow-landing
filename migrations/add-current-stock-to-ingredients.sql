-- Migration: Add current_stock and min_stock_level to ingredients table
-- Run this in Supabase SQL Editor

-- Add columns if they don't exist
ALTER TABLE ingredients
ADD COLUMN IF NOT EXISTS current_stock DECIMAL(10,3) DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_stock_level DECIMAL(10,3) DEFAULT 0;

-- Comments for documentation
COMMENT ON COLUMN ingredients.current_stock IS 'Current quantity of ingredient in stock';
COMMENT ON COLUMN ingredients.min_stock_level IS 'Minimum stock level before reorder is triggered';

-- Create index for faster filtering by stock
CREATE INDEX IF NOT EXISTS idx_ingredients_current_stock ON ingredients(current_stock);
