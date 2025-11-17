-- Migration: Create par_levels table and add par_level, reorder_point, and notes columns
-- Run this in Supabase SQL Editor

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS par_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  par_level DECIMAL(10,3),
  reorder_point DECIMAL(10,3),
  unit VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns if they don't exist (for existing tables)
ALTER TABLE par_levels
ADD COLUMN IF NOT EXISTS par_level DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS reorder_point DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS ingredient_id UUID,
ADD COLUMN IF NOT EXISTS unit VARCHAR(50),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migrate data from par_quantity to par_level if par_quantity exists and par_level is null
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'par_levels' AND column_name = 'par_quantity'
  ) THEN
    UPDATE par_levels
    SET par_level = par_quantity
    WHERE par_level IS NULL AND par_quantity IS NOT NULL;
  END IF;
END $$;

-- Make par_quantity nullable (remove NOT NULL constraint) if it exists
-- This allows the old column to coexist with the new par_level column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'par_levels' AND column_name = 'par_quantity'
  ) THEN
    -- Check if there's a NOT NULL constraint and remove it
    ALTER TABLE par_levels
    ALTER COLUMN par_quantity DROP NOT NULL;
  END IF;
END $$;

-- Add index for faster queries on ingredient_id
CREATE INDEX IF NOT EXISTS idx_par_levels_ingredient_id ON par_levels(ingredient_id);

-- Ensure foreign key constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'par_levels_ingredient_id_fkey'
  ) THEN
    ALTER TABLE par_levels
    ADD CONSTRAINT par_levels_ingredient_id_fkey
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE;
  END IF;
END $$;
