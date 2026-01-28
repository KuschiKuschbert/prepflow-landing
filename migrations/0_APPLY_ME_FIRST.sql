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
-- Step 3: Populate the column
-- MOVED TO BATCH SCRIPT (scripts/backfill-ingredient-tags.ts) to avoid timeout on 24k rows
-- UPDATE ai_specials
-- SET ingredient_tags = generate_ingredient_tags(ingredients)
-- WHERE ingredient_tags IS NULL;

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

-- RPC for Safe Backfilling (Batch Processing)
CREATE OR REPLACE FUNCTION backfill_ingredient_tags(p_limit INT DEFAULT 100)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INT;
BEGIN
    WITH updated_rows AS (
        UPDATE ai_specials
        SET ingredient_tags = generate_ingredient_tags(ingredients)
        WHERE id IN (
            SELECT id FROM ai_specials
            WHERE ingredient_tags IS NULL
            LIMIT p_limit
        )
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_count FROM updated_rows;

    RETURN v_count;
END;
$$;
-- Create a function to backfill FTS in small batches to avoid timeouts
CREATE OR REPLACE FUNCTION backfill_fts(p_limit INT DEFAULT 100)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INT;
BEGIN
    WITH updated_rows AS (
        UPDATE ai_specials
        SET fts = setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
                  setweight(to_tsvector('english', coalesce(instructions::text, '')), 'C') ||
                  setweight(to_tsvector('english', coalesce(ingredients::text, '')), 'D')
        WHERE id IN (
            SELECT id FROM ai_specials
            WHERE fts IS NULL
            LIMIT p_limit
        )
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_count FROM updated_rows;

    RETURN v_count;
END;
$$;
-- RPC for Partial Stock Matching (calculates percentage)
-- Allows searching the full 24k dataset for "best possible matches"
-- instead of just 100% matches.

-- Ensure fast Full Text Search (FTS) index exists
CREATE INDEX IF NOT EXISTS idx_ai_specials_fts ON ai_specials USING GIN(fts);

DROP FUNCTION IF EXISTS match_recipes_by_stock_partial(jsonb, int, int, int, text);

CREATE OR REPLACE FUNCTION match_recipes_by_stock_partial(
    p_stock_tags JSONB,       -- Array of user's stock ingredients (e.g. ["egg", "milk"])
    p_limit INT DEFAULT 20,
    p_offset INT DEFAULT 0,
    p_min_match INT DEFAULT 0,
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
    total_ingredients INT,
    full_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH stock_words AS (
        -- Break down stock tags into individual words to ensure "Chicken Breast" in stock matches "Chicken" in recipe
        -- by searching for "Chicken" OR "Breast"
        SELECT DISTINCT word
        FROM jsonb_array_elements_text(p_stock_tags) t,
             regexp_split_to_table(trim(t), '\s+') word
        WHERE length(word) > 2 -- Filter short words to avoid noise
    ),
    stock_query_gen AS (
        -- Construct a single "word1 OR word2 OR ..." string for websearch_to_tsquery
        -- which handles stop-words and operator syntax safely
        SELECT string_agg(word, ' OR ') as txt FROM stock_words
    ),
    filtered_candidates AS (
        -- PRE-FILTERING: Use GIN Index to find recipes containing ANY of the stock words.
        -- SAFETY CAP: Limit to 2000 candidates to prevent timeouts even if index matches many items.
        -- Prioritize recent recipes.
        SELECT r.*
        FROM ai_specials r, stock_query_gen sq
        WHERE
            (p_cuisine IS NULL OR r.cuisine = p_cuisine)
            AND sq.txt IS NOT NULL -- optimization: if no valid searchable words, return nothing immediately
            AND r.fts @@ websearch_to_tsquery('english', sq.txt)
        ORDER BY r.created_at DESC
        LIMIT 2000
    ),
    calculations AS (
        SELECT
            r.id,
            r.name,
            r.image_url,
            r.ingredients,
            r.instructions,
            r.description,
            r.meta,
            r.cuisine,
            r.created_at,
            COALESCE(r.ingredient_tags, '[]'::jsonb) as tags,
            -- Calculate Fuzzy Match Count
            (
                SELECT COUNT(*)
                FROM jsonb_array_elements_text(COALESCE(r.ingredient_tags, '[]'::jsonb)) as r_tag
                WHERE
                    -- Fuzzy Match: Check against full stock list
                    -- Use STRPOS (faster than ILIKE) on lowercased strings
                    EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements_text(p_stock_tags) s
                        WHERE STRPOS(LOWER(r_tag), LOWER(s)) > 0
                           OR STRPOS(LOWER(s), LOWER(r_tag)) > 0
                    )
            )::INT as match_count,

            -- Calculate "Significant" Total Count (Excluding Pantry Staples)
            (
                SELECT COUNT(*)
                FROM jsonb_array_elements_text(COALESCE(r.ingredient_tags, '[]'::jsonb)) as r_tag
                WHERE r_tag NOT ILIKE ALL (ARRAY['%salt%', '%pepper%', '%water%', '%oil%', '%sugar%'])
            )::INT as significant_total_count,

            -- Raw Total Count (for display)
            jsonb_array_length(COALESCE(r.ingredient_tags, '[]'::jsonb))::INT as raw_total_count
        FROM filtered_candidates r
    )
    SELECT
        c.id,
        c.name::TEXT,
        c.image_url::TEXT,
        c.ingredients,
        c.instructions,
        c.description::TEXT,
        c.meta,
        c.cuisine::TEXT,
        c.created_at,
        CASE
            WHEN c.significant_total_count = 0 THEN 100 -- If only pantry items, it's a match!
            -- Cap at 100
            WHEN (c.match_count::FLOAT / c.significant_total_count::FLOAT * 100) > 100 THEN 100
            ELSE (c.match_count::FLOAT / c.significant_total_count::FLOAT * 100)::INT
        END as stock_match_percentage,
        c.match_count as stock_match_count,
        c.raw_total_count as total_ingredients,
        COUNT(*) OVER()::BIGINT as full_count
    FROM calculations c
    WHERE
        (CASE
            WHEN c.significant_total_count = 0 THEN 100
            WHEN (c.match_count::FLOAT / c.significant_total_count::FLOAT * 100) > 100 THEN 100
            ELSE (c.match_count::FLOAT / c.significant_total_count::FLOAT * 100)::INT
        END) >= p_min_match
    ORDER BY stock_match_percentage DESC, c.match_count DESC, c.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;
