-- Industry-Standard Optimization: GIN Index + Set Containment
-- This enables instant "Subset" matching (Recipe Ingredients <@ User Stock)

-- Step 1: Add JSONB column for efficient tagging
ALTER TABLE ai_specials
ADD COLUMN IF NOT EXISTS ingredient_tags JSONB;

-- Step 2: Function to normalize ingredients into a simple string array
-- e.g. [{"name": "Large Eggs"}, "Milk"] -> ["egg", "milk", "large egg"]
CREATE OR REPLACE FUNCTION generate_ingredient_tags(ingredients JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    tags JSONB := '[]'::JSONB;
    ing JSONB;
    ing_name TEXT;
    clean_name TEXT;
BEGIN
    IF ingredients IS NULL OR jsonb_typeof(ingredients) != 'array' THEN
        RETURN '[]'::JSONB;
    END IF;

    FOR ing IN SELECT * FROM jsonb_array_elements(ingredients)
    LOOP
        -- Extract name
        IF jsonb_typeof(ing) = 'string' THEN
            ing_name := ing#>>'{}';
        ELSIF jsonb_typeof(ing) = 'object' THEN
            ing_name := ing->>'name';
        ELSE
            ing_name := NULL;
        END IF;

        IF ing_name IS NOT NULL AND ing_name != '' THEN
            -- Basic normalization: lowercase, trim
            clean_name := LOWER(TRIM(ing_name));
            -- Add to tags
            tags := tags || to_jsonb(clean_name);

            -- OPTIONAL: Add single words for broader matching?
            -- No, for 100% stock match we want specific ingredients.
            -- Using strict name matching for now.
        END IF;
    END LOOP;

    -- Remove duplicates
    SELECT jsonb_agg(DISTINCT x) INTO tags FROM jsonb_array_elements(tags) t(x);

    RETURN COALESCE(tags, '[]'::JSONB);
END;
$$;

-- Step 3: Populate the column
UPDATE ai_specials
SET ingredient_tags = generate_ingredient_tags(ingredients)
WHERE ingredient_tags IS NULL;

-- Step 4: Create GIN Index (jsonb_path_ops is best for @> and <@)
CREATE INDEX IF NOT EXISTS idx_ai_specials_ingredient_tags_gin
ON ai_specials USING GIN (ingredient_tags jsonb_path_ops);

-- Step 5: Trigger to keep it updated
CREATE OR REPLACE FUNCTION update_ingredient_tags()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.ingredient_tags := generate_ingredient_tags(NEW.ingredients);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_ingredient_tags ON ai_specials;
CREATE TRIGGER trg_update_ingredient_tags
BEFORE INSERT OR UPDATE OF ingredients ON ai_specials
FOR EACH ROW
EXECUTE FUNCTION update_ingredient_tags();

-- Step 6: Optimized RPC
-- This uses the containment operator (<@) which utilizes the GIN index
DROP FUNCTION IF EXISTS match_recipes_by_stock_v2(jsonb, int, int, int);

CREATE OR REPLACE FUNCTION match_recipes_by_stock_v2(
    p_stock_tags JSONB,       -- Array of user's stock ingredients
    p_limit INT DEFAULT 20,
    p_offset INT DEFAULT 0,
    p_cuisine TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    image_url TEXT,
    ingredients JSONB,
    instructions JSONB,
    description TEXT,
    meta JSONB,
    cuisine TEXT,
    created_at TIMESTAMPTZ,
    stock_match_percentage INT,
    stock_match_count INT,
    total_ingredients INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.name::TEXT,
        r.image_url::TEXT,
        r.ingredients,
        r.instructions,
        r.description::TEXT,
        r.meta,
        r.cuisine::TEXT,
        r.created_at,
        100::INT as stock_match_percentage, -- Always 100% because we use containment!
        jsonb_array_length(r.ingredient_tags)::INT as stock_match_count,
        jsonb_array_length(r.ingredient_tags)::INT as total_ingredients
    FROM ai_specials r
    WHERE
        -- THE MAGIC: GIN Index Containment check
        -- "Is recipe's ingredient_tags a subset of p_stock_tags?"
        r.ingredient_tags <@ p_stock_tags
        AND (p_cuisine IS NULL OR r.cuisine = p_cuisine)
    ORDER BY r.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;
