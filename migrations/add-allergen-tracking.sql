-- Allergen Tracking System Migration
-- Adds allergen tracking fields to ingredients table and creates composition cache table

-- Add allergen fields to ingredients table
ALTER TABLE ingredients
ADD COLUMN IF NOT EXISTS allergens JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS allergen_source JSONB DEFAULT '{"manual": false, "ai": false}'::jsonb;

-- Create GIN index for efficient allergen querying
CREATE INDEX IF NOT EXISTS idx_ingredients_allergens ON ingredients USING GIN (allergens);

-- Create ingredient composition cache table
CREATE TABLE IF NOT EXISTS ingredient_composition_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  composition TEXT,
  detected_allergens JSONB DEFAULT '[]'::jsonb,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ingredient_name, brand)
);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_composition_cache_expires_at ON ingredient_composition_cache(expires_at);

-- Add allergen caching to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS allergens JSONB DEFAULT NULL;

-- Create GIN index for efficient allergen querying on recipes
CREATE INDEX IF NOT EXISTS idx_recipes_allergens ON recipes USING GIN (allergens);

-- Add allergen caching to dishes table (if dishes table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dishes') THEN
    ALTER TABLE dishes
    ADD COLUMN IF NOT EXISTS allergens JSONB DEFAULT NULL;

    CREATE INDEX IF NOT EXISTS idx_dishes_allergens ON dishes USING GIN (allergens);
  END IF;
END $$;

