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
