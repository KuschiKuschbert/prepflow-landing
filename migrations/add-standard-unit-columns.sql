-- Migration: Add standard_unit and original_unit columns to ingredients table
-- Run this in Supabase SQL Editor

ALTER TABLE ingredients
ADD COLUMN IF NOT EXISTS standard_unit VARCHAR(50),
ADD COLUMN IF NOT EXISTS original_unit VARCHAR(50);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_ingredients_standard_unit ON ingredients(standard_unit);
