-- Add plating_methods_images JSON column to recipes and dishes tables
-- This column stores additional plating method images beyond the existing 4 columns
-- Structure: { "landscape": "url", "futuristic": "url", ... }

-- Add column to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS plating_methods_images JSONB DEFAULT '{}'::jsonb;

-- Add column to dishes table
ALTER TABLE dishes
ADD COLUMN IF NOT EXISTS plating_methods_images JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the column structure
COMMENT ON COLUMN recipes.plating_methods_images IS 'JSON object storing image URLs for additional plating methods beyond classic/modern/rustic/minimalist. Keys are plating method names (landscape, futuristic, hide_and_seek, super_bowl, bathing, deconstructed, stacking, brush_stroke, free_form).';
COMMENT ON COLUMN dishes.plating_methods_images IS 'JSON object storing image URLs for additional plating methods beyond classic/modern/rustic/minimalist. Keys are plating method names (landscape, futuristic, hide_and_seek, super_bowl, bathing, deconstructed, stacking, brush_stroke, free_form).';

-- Create indexes for JSONB queries (optional, but can help with performance)
CREATE INDEX IF NOT EXISTS idx_recipes_plating_methods_images ON recipes USING GIN (plating_methods_images);
CREATE INDEX IF NOT EXISTS idx_dishes_plating_methods_images ON dishes USING GIN (plating_methods_images);

