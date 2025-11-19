-- Dietary Suitability Migration
-- Adds vegetarian/vegan tracking fields to recipes and dishes tables

-- Add dietary fields to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dietary_confidence VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dietary_method VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dietary_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create indexes for dietary filtering on recipes
CREATE INDEX IF NOT EXISTS idx_recipes_vegetarian ON recipes(is_vegetarian) WHERE is_vegetarian = TRUE;
CREATE INDEX IF NOT EXISTS idx_recipes_vegan ON recipes(is_vegan) WHERE is_vegan = TRUE;

-- Add dietary fields to dishes table (if dishes table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dishes') THEN
    ALTER TABLE dishes
    ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS dietary_confidence VARCHAR(20) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS dietary_method VARCHAR(20) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS dietary_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

    CREATE INDEX IF NOT EXISTS idx_dishes_vegetarian ON dishes(is_vegetarian) WHERE is_vegetarian = TRUE;
    CREATE INDEX IF NOT EXISTS idx_dishes_vegan ON dishes(is_vegan) WHERE is_vegan = TRUE;
  END IF;
END $$;

