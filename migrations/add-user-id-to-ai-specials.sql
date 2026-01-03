-- Migration: Add user_id column to ai_specials table
-- This migration adds the user_id column to associate AI specials with users
-- Run this in your Supabase SQL Editor

-- Add user_id column to ai_specials table if it doesn't exist
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_specials_user_id ON ai_specials(user_id);

-- Also add missing columns that the code expects (if using the ultra-safe schema)
-- These columns might already exist depending on which schema was used
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS ai_prompt TEXT;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'generated';

-- If special_name exists but name doesn't, copy data
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_specials' AND column_name = 'special_name')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_specials' AND column_name = 'name') THEN
    ALTER TABLE ai_specials ADD COLUMN name VARCHAR(255);
    UPDATE ai_specials SET name = special_name WHERE name IS NULL;
  END IF;
END $$;
