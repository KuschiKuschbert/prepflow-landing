-- Migration: Add selling_price to recipes table
-- Run this in Supabase SQL Editor

-- Add selling_price column (nullable - NULL means use calculated recommended price)
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS selling_price DECIMAL(10,2);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_recipes_selling_price ON recipes(selling_price);

-- Add comment for documentation
COMMENT ON COLUMN recipes.selling_price IS 'User-set actual selling price per serving. NULL means use calculated recommended price.';
