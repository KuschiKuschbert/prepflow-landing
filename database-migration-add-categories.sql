-- Database Migration: Add Categories to Recipes and Dishes
-- Run this in your Supabase SQL Editor

-- Add category to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Uncategorized';

-- Add category to dishes table
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Uncategorized';

-- Create indexes for category filtering
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);

-- Update existing records to have default category
UPDATE recipes SET category = 'Uncategorized' WHERE category IS NULL;
UPDATE dishes SET category = 'Uncategorized' WHERE category IS NULL;
