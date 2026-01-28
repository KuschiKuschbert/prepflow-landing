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
