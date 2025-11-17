-- Add unique constraint to sales_data table for (dish_id, date)
-- Run this in your Supabase SQL Editor

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sales_data_dish_id_date_unique'
  ) THEN
    ALTER TABLE sales_data
    ADD CONSTRAINT sales_data_dish_id_date_unique
    UNIQUE (dish_id, date);
  END IF;
END $$;

-- Verify the constraint was created
SELECT
  conname AS constraint_name,
  contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'sales_data'::regclass
AND conname = 'sales_data_dish_id_date_unique';


