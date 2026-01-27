-- ULTRA-FAST RPC: Uses GIN index, skips per-ingredient counting
-- The client-side already has fuzzy matching, so RPC just filters candidates quickly
DROP FUNCTION IF EXISTS match_recipes_by_stock(integer,integer,integer,text,text);

CREATE OR REPLACE FUNCTION match_recipes_by_stock(
    p_min_match INT DEFAULT 0,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0,
    p_search_query TEXT DEFAULT NULL,
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
DECLARE
    v_stock_terms TEXT[];
    v_tsquery TSQUERY;
    v_stock_term TEXT;
BEGIN
    -- Get stock ingredient names
    SELECT ARRAY_AGG(LOWER(ingredient_name))
    INTO v_stock_terms
    FROM ingredients
    WHERE current_stock > 0;

    IF v_stock_terms IS NULL OR array_length(v_stock_terms, 1) = 0 THEN
        RETURN;
    END IF;

    -- Build a tsquery by converting each term individually
    v_tsquery := NULL;
    FOREACH v_stock_term IN ARRAY v_stock_terms
    LOOP
        IF v_tsquery IS NULL THEN
            v_tsquery := plainto_tsquery('simple', v_stock_term);
        ELSE
            v_tsquery := v_tsquery || plainto_tsquery('simple', v_stock_term);
        END IF;
    END LOOP;

    -- FAST: Just return recipes that match ANY stock ingredient
    -- Let client-side handle exact counting with fuzzy matching
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
        0::INT as stock_match_percentage,  -- Client will calculate
        0::INT as stock_match_count,        -- Client will calculate
        jsonb_array_length(r.ingredients)::INT as total_ingredients
    FROM ai_specials r
    WHERE
        r.ingredients_searchable @@ v_tsquery
        AND (p_search_query IS NULL OR
             r.fts @@ websearch_to_tsquery('english', p_search_query) OR
             r.name ILIKE '%' || p_search_query || '%')
        AND (p_cuisine IS NULL OR r.cuisine = p_cuisine)
    ORDER BY random()
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;
