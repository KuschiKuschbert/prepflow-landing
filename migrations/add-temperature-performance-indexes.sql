-- ============================================================
-- Temperature Logs Performance Indexes
-- Purpose: Support 5+ years of data at large venues efficiently
--          by adding composite indexes and a server-side
--          aggregation RPC function.
-- ============================================================

-- 0. Ensure equipment_id FK column exists (safe to run if already present)
ALTER TABLE temperature_logs
  ADD COLUMN IF NOT EXISTS equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE SET NULL;

-- 1. Composite index: location + date DESC (primary analytics query pattern)
CREATE INDEX IF NOT EXISTS idx_temperature_logs_location_date
  ON temperature_logs(location, log_date DESC, log_time DESC);

-- 2. Composite index: equipment_id + date DESC (for equipment-scoped drawer queries)
CREATE INDEX IF NOT EXISTS idx_temperature_logs_equipment_date
  ON temperature_logs(equipment_id, log_date DESC);

-- 3. Composite index: temperature_type + date DESC (for type-filtered list queries)
CREATE INDEX IF NOT EXISTS idx_temperature_logs_type_date
  ON temperature_logs(temperature_type, log_date DESC);

-- 4. Covering index for the paginated logs tab (most common read path):
--    Avoids table heap access for the common ORDER BY log_date, log_time with optional date filter
CREATE INDEX IF NOT EXISTS idx_temperature_logs_date_time_desc
  ON temperature_logs(log_date DESC, log_time DESC, id);

-- ============================================================
-- Backfill equipment_id on existing logs using location matching
-- This allows future queries to use the FK instead of string comparison.
-- Safe to run multiple times (only updates NULLs where a match is found).
-- ============================================================
UPDATE temperature_logs tl
SET equipment_id = te.id
FROM temperature_equipment te
WHERE tl.equipment_id IS NULL
  AND (tl.location = te.name OR tl.location = te.location);

-- ============================================================
-- RPC Function: get_temperature_analytics
-- Aggregates temperature log data server-side, returning daily
-- summary rows per equipment location. Used by the Analytics tab
-- to avoid sending thousands of raw rows to the browser.
--
-- Parameters:
--   p_location  TEXT  - equipment location/name to query
--   p_date_from DATE  - start of date range (inclusive)
--   p_date_to   DATE  - end of date range (inclusive)
-- ============================================================
CREATE OR REPLACE FUNCTION get_temperature_analytics(
  p_location  TEXT,
  p_date_from DATE,
  p_date_to   DATE
)
RETURNS TABLE (
  log_date          DATE,
  avg_temp          NUMERIC,
  min_temp          NUMERIC,
  max_temp          NUMERIC,
  reading_count     BIGINT,
  out_of_range_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tl.log_date,
    ROUND(AVG(tl.temperature_celsius)::NUMERIC, 2)              AS avg_temp,
    MIN(tl.temperature_celsius)::NUMERIC                        AS min_temp,
    MAX(tl.temperature_celsius)::NUMERIC                        AS max_temp,
    COUNT(*)::BIGINT                                            AS reading_count,
    COUNT(*) FILTER (
      WHERE tl.temperature_celsius < COALESCE(te.min_temp_celsius, -999)
         OR tl.temperature_celsius > COALESCE(te.max_temp_celsius, 999)
    )::BIGINT                                                   AS out_of_range_count
  FROM temperature_logs tl
  LEFT JOIN temperature_equipment te
    ON tl.location = te.name
    OR tl.location = te.location
  WHERE tl.location = p_location
    AND tl.log_date BETWEEN p_date_from AND p_date_to
  GROUP BY tl.log_date
  ORDER BY tl.log_date ASC;
END;
$$;

-- ============================================================
-- RPC Function: get_temperature_analytics_equipment
-- Same as above but accepts equipment_id for direct FK lookup
-- (faster once equipment_id backfill is complete).
-- ============================================================
CREATE OR REPLACE FUNCTION get_temperature_analytics_equipment(
  p_equipment_id UUID,
  p_date_from    DATE,
  p_date_to      DATE
)
RETURNS TABLE (
  log_date          DATE,
  avg_temp          NUMERIC,
  min_temp          NUMERIC,
  max_temp          NUMERIC,
  reading_count     BIGINT,
  out_of_range_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_min_temp NUMERIC;
  v_max_temp NUMERIC;
BEGIN
  -- Fetch thresholds once
  SELECT te.min_temp_celsius, te.max_temp_celsius
  INTO v_min_temp, v_max_temp
  FROM temperature_equipment te
  WHERE te.id = p_equipment_id;

  RETURN QUERY
  SELECT
    tl.log_date,
    ROUND(AVG(tl.temperature_celsius)::NUMERIC, 2)              AS avg_temp,
    MIN(tl.temperature_celsius)::NUMERIC                        AS min_temp,
    MAX(tl.temperature_celsius)::NUMERIC                        AS max_temp,
    COUNT(*)::BIGINT                                            AS reading_count,
    COUNT(*) FILTER (
      WHERE tl.temperature_celsius < COALESCE(v_min_temp, -999)
         OR tl.temperature_celsius > COALESCE(v_max_temp, 999)
    )::BIGINT                                                   AS out_of_range_count
  FROM temperature_logs tl
  WHERE tl.equipment_id = p_equipment_id
    AND tl.log_date BETWEEN p_date_from AND p_date_to
  GROUP BY tl.log_date
  ORDER BY tl.log_date ASC;
END;
$$;

-- ============================================================
-- RPC Function: get_equipment_temperature_summary
-- Returns a single-row summary per equipment piece for the
-- Analytics tab status cards (no date grouping needed for cards).
-- ============================================================
CREATE OR REPLACE FUNCTION get_equipment_temperature_summary(
  p_location  TEXT,
  p_date_from DATE,
  p_date_to   DATE
)
RETURNS TABLE (
  avg_temp           NUMERIC,
  min_temp           NUMERIC,
  max_temp           NUMERIC,
  reading_count      BIGINT,
  out_of_range_count BIGINT,
  last_reading_temp  NUMERIC,
  last_reading_date  DATE,
  last_reading_time  TIME
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(AVG(tl.temperature_celsius)::NUMERIC, 2)              AS avg_temp,
    MIN(tl.temperature_celsius)::NUMERIC                        AS min_temp,
    MAX(tl.temperature_celsius)::NUMERIC                        AS max_temp,
    COUNT(*)::BIGINT                                            AS reading_count,
    COUNT(*) FILTER (
      WHERE tl.temperature_celsius < COALESCE(te.min_temp_celsius, -999)
         OR tl.temperature_celsius > COALESCE(te.max_temp_celsius, 999)
    )::BIGINT                                                   AS out_of_range_count,
    (
      SELECT tl2.temperature_celsius
      FROM temperature_logs tl2
      WHERE tl2.location = p_location
      ORDER BY tl2.log_date DESC, tl2.log_time DESC
      LIMIT 1
    )::NUMERIC                                                  AS last_reading_temp,
    (
      SELECT tl2.log_date
      FROM temperature_logs tl2
      WHERE tl2.location = p_location
      ORDER BY tl2.log_date DESC, tl2.log_time DESC
      LIMIT 1
    )                                                           AS last_reading_date,
    (
      SELECT tl2.log_time
      FROM temperature_logs tl2
      WHERE tl2.location = p_location
      ORDER BY tl2.log_date DESC, tl2.log_time DESC
      LIMIT 1
    )                                                           AS last_reading_time
  FROM temperature_logs tl
  LEFT JOIN temperature_equipment te
    ON tl.location = te.name
    OR tl.location = te.location
  WHERE tl.location = p_location
    AND tl.log_date BETWEEN p_date_from AND p_date_to;
END;
$$;
