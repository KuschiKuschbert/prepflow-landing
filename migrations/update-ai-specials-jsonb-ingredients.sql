-- Migration: Add JSONB ingredients column to ai_specials
-- This migration adds a proper JSONB column for structured ingredient data
-- and updates the full-text search index to include it

-- Step 1: Add the ingredients column as JSONB if it doesn't exist
-- Check if the column exists and its type, then add/alter accordingly
DO $$
BEGIN
    -- Check if ingredients column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'ai_specials' AND column_name = 'ingredients'
    ) THEN
        -- Column exists, check if it's JSONB
        IF (
            SELECT data_type FROM information_schema.columns
            WHERE table_name = 'ai_specials' AND column_name = 'ingredients'
        ) != 'jsonb' THEN
            -- It's not JSONB, need to convert
            -- First rename old column
            ALTER TABLE ai_specials RENAME COLUMN ingredients TO ingredients_old;
            -- Add new JSONB column
            ALTER TABLE ai_specials ADD COLUMN ingredients JSONB DEFAULT '[]'::jsonb;
            -- Note: Data migration will be handled by the TypeScript script
            RAISE NOTICE 'Converted ingredients column from TEXT[] to JSONB';
        END IF;
    ELSE
        -- Column doesn't exist, create it
        ALTER TABLE ai_specials ADD COLUMN ingredients JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added new ingredients JSONB column';
    END IF;
END $$;

-- Step 2: Add other potentially missing columns for full recipe data
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS instructions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS yield INTEGER;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS yield_unit VARCHAR(50);
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS cook_time_minutes INTEGER;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS cuisine VARCHAR(100);
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS source VARCHAR(100);
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

-- Step 3: Create/update the FTS index to include ingredient names
-- Drop existing FTS column and trigger if they exist
DROP TRIGGER IF EXISTS ai_specials_fts_update ON ai_specials;
DROP INDEX IF EXISTS ai_specials_fts_idx;

-- Add FTS column if it doesn't exist
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS fts tsvector;

-- Create function to generate FTS vector from recipe data
CREATE OR REPLACE FUNCTION ai_specials_generate_fts()
RETURNS trigger AS $$
DECLARE
    ingredient_names TEXT;
BEGIN
    -- Extract ingredient names from JSONB array
    SELECT string_agg(ing->>'name', ' ')
    INTO ingredient_names
    FROM jsonb_array_elements(COALESCE(NEW.ingredients, '[]'::jsonb)) AS ing;

    -- Generate FTS vector from name, description, and ingredient names
    NEW.fts := to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(ingredient_names, '') || ' ' ||
        COALESCE(NEW.category, '') || ' ' ||
        COALESCE(NEW.cuisine, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic FTS updates
CREATE TRIGGER ai_specials_fts_update
    BEFORE INSERT OR UPDATE ON ai_specials
    FOR EACH ROW
    EXECUTE FUNCTION ai_specials_generate_fts();

-- Create GIN index for fast full-text search
CREATE INDEX ai_specials_fts_idx ON ai_specials USING GIN(fts);

-- Step 4: Update existing rows to regenerate FTS
-- This will trigger the FTS function for all existing rows
UPDATE ai_specials SET updated_at = NOW() WHERE fts IS NULL OR fts = '';

COMMENT ON COLUMN ai_specials.ingredients IS 'JSONB array of ingredients: [{name, quantity, unit, original_text}]';
COMMENT ON COLUMN ai_specials.fts IS 'Full-text search vector including name, description, and ingredient names';
