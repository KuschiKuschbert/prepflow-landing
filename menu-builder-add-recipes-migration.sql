-- Migration: Add recipe_id support to menu_items table
-- Run this in your Supabase SQL Editor to allow recipes to be added to menus

-- Add recipe_id column to menu_items (nullable, since items can be either dish or recipe)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE;

-- Add constraint to ensure either dish_id or recipe_id is provided (but not both)
ALTER TABLE menu_items
DROP CONSTRAINT IF EXISTS menu_items_dish_or_recipe_check;

ALTER TABLE menu_items
ADD CONSTRAINT menu_items_dish_or_recipe_check
CHECK (
  (dish_id IS NOT NULL AND recipe_id IS NULL) OR
  (dish_id IS NULL AND recipe_id IS NOT NULL)
);

-- Make dish_id nullable (since recipes don't need it)
ALTER TABLE menu_items
ALTER COLUMN dish_id DROP NOT NULL;

-- Add index for recipe_id lookups
CREATE INDEX IF NOT EXISTS idx_menu_items_recipe_id ON menu_items(recipe_id);



