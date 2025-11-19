-- Migration: Rename recipes.name to recipes.recipe_name
-- Run this in Supabase SQL Editor
-- This standardizes naming to match dishes.dish_name pattern

-- Drop existing index on recipes.name if it exists
DROP INDEX IF EXISTS idx_recipes_name;
DROP INDEX IF EXISTS recipes_unique_name;

-- Rename the column
ALTER TABLE recipes
RENAME COLUMN name TO recipe_name;

-- Recreate indexes with new column name
CREATE INDEX IF NOT EXISTS idx_recipes_recipe_name ON recipes(recipe_name);

-- Recreate unique index for case-insensitive recipe_name
CREATE UNIQUE INDEX IF NOT EXISTS recipes_unique_recipe_name
  ON public.recipes (lower(recipe_name));

-- Add comment for documentation
COMMENT ON COLUMN recipes.recipe_name IS 'Recipe name. Standardized to match dishes.dish_name pattern.';

