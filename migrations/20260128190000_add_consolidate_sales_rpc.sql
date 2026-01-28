-- "Ultimate" Sales Consolidation Function
-- Implements Atomic Upsert pattern for high-integrity analytics.
-- DESIGN PHILOSOPHY:
-- 1. Idempotency: Can run multiple times without corrupting data.
-- 2. Accumulation: Sales numbers are ADDITIVE (Partial Day 1 + Partial Day 2 = Total Day).
-- 3. Liveness: Popularity snapshots are correctly updated to the latest known state.

CREATE OR REPLACE FUNCTION consolidate_daily_sales(
    p_dish_id UUID,
    p_number_sold NUMERIC,
    p_popularity_percentage NUMERIC,
    p_date DATE
)
RETURNS SETOF sales_data
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO sales_data (dish_id, date, number_sold, popularity_percentage)
    VALUES (p_dish_id, p_date, p_number_sold, p_popularity_percentage)
    ON CONFLICT (dish_id, date)
    DO UPDATE SET
        -- Accumulate sales counts (The "Consolidation" magic)
        number_sold = sales_data.number_sold + EXCLUDED.number_sold,
        -- Update popularity to the latest snapshot (Latest data is best data for rates)
        popularity_percentage = EXCLUDED.popularity_percentage
    RETURNING *;
END;
$$;
