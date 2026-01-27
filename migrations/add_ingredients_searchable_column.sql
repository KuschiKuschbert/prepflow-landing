-- Industry-Standard Recipe Search Optimization
-- Adds a denormalized searchable ingredients column with GIN index
-- This enables sub-millisecond full-text search across all 24k+ recipes

-- Step 1: Add the searchable column
ALTER TABLE ai_specials
ADD COLUMN IF NOT EXISTS ingredients_searchable TSVECTOR;

-- Step 2: Create function to extract ingredient names from JSONB
CREATE OR REPLACE FUNCTION extract_ingredient_names(ingredients JSONB)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    result TEXT := '';
    ing JSONB;
    ing_name TEXT;
BEGIN
    IF ingredients IS NULL OR jsonb_typeof(ingredients) != 'array' THEN
        RETURN '';
    END IF;

    FOR ing IN SELECT * FROM jsonb_array_elements(ingredients)
    LOOP
        IF jsonb_typeof(ing) = 'string' THEN
            ing_name := ing#>>'{}';
        ELSIF jsonb_typeof(ing) = 'object' THEN
            ing_name := ing->>'name';
        ELSE
            ing_name := NULL;
        END IF;

        IF ing_name IS NOT NULL AND ing_name != '' THEN
            result := result || ' ' || ing_name;
        END IF;
    END LOOP;

    RETURN TRIM(result);
END;
$$;

-- Step 3: Populate the searchable column for ALL existing recipes
-- This converts ingredient names to tsvector for fast full-text search
UPDATE ai_specials
SET ingredients_searchable = to_tsvector('simple', COALESCE(extract_ingredient_names(ingredients), ''))
WHERE ingredients_searchable IS NULL;

-- Step 4: Create GIN index for ultra-fast full-text search
CREATE INDEX IF NOT EXISTS idx_ai_specials_ingredients_gin
ON ai_specials USING GIN (ingredients_searchable);

-- Step 5: Create trigger to auto-update on INSERT/UPDATE
CREATE OR REPLACE FUNCTION update_ingredients_searchable()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.ingredients_searchable := to_tsvector('simple', COALESCE(extract_ingredient_names(NEW.ingredients), ''));
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_ingredients_searchable ON ai_specials;
CREATE TRIGGER trg_update_ingredients_searchable
BEFORE INSERT OR UPDATE OF ingredients ON ai_specials
FOR EACH ROW
EXECUTE FUNCTION update_ingredients_searchable();

-- Step 6: Verify the index works (should be fast)
-- Test: SELECT COUNT(*) FROM ai_specials WHERE ingredients_searchable @@ to_tsquery('simple', 'butter');
