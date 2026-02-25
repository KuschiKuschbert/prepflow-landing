-- Add category to dishes and recipes (if missing)
-- Run in Supabase SQL Editor
-- Idempotent: uses IF NOT EXISTS

ALTER TABLE dishes ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Uncategorized';
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Uncategorized';

CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);

UPDATE dishes SET category = 'Uncategorized' WHERE category IS NULL;
UPDATE recipes SET category = 'Uncategorized' WHERE category IS NULL;
