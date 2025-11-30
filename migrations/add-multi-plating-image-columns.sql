-- Add multi-plating image columns to recipes and dishes tables
-- This migration adds support for 4 distinct plating methods:
-- - image_url (classic/primary) - already exists
-- - image_url_alternative (rustic) - already exists
-- - image_url_modern (new) - modern plating style
-- - image_url_minimalist (new) - minimalist plating style

-- Add new columns for modern and minimalist plating images to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS image_url_modern VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url_minimalist VARCHAR(255);

-- Add new columns for modern and minimalist plating images to dishes table
ALTER TABLE dishes
ADD COLUMN IF NOT EXISTS image_url_modern VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url_minimalist VARCHAR(255);

-- Add comments to document the plating methods for recipes table
COMMENT ON COLUMN recipes.image_url IS 'Classic plating style image URL (primary view)';
COMMENT ON COLUMN recipes.image_url_alternative IS 'Rustic plating style image URL (alternative view)';
COMMENT ON COLUMN recipes.image_url_modern IS 'Modern plating style image URL';
COMMENT ON COLUMN recipes.image_url_minimalist IS 'Minimalist plating style image URL';

-- Add comments to document the plating methods for dishes table
COMMENT ON COLUMN dishes.image_url IS 'Classic plating style image URL (primary view)';
COMMENT ON COLUMN dishes.image_url_alternative IS 'Rustic plating style image URL (alternative view)';
COMMENT ON COLUMN dishes.image_url_modern IS 'Modern plating style image URL';
COMMENT ON COLUMN dishes.image_url_minimalist IS 'Minimalist plating style image URL';

