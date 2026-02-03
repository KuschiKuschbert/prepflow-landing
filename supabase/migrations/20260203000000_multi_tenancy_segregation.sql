-- Multi-Tenancy Migration Script (Resilient)
-- Purpose: Add user_id column to all ecosystem tables for segregation, skipping missing tables.

-- Helper block to safely add column
DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'ingredients',
        'suppliers',
        'supplier_price_lists',
        'order_lists',
        'par_levels',
        'menus',
        'prep_lists',
        'cleaning_tasks',
        'cleaning_areas',
        'equipment',
        'employees',
        'roster_shifts'
    ];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        -- Check if table exists
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            RAISE NOTICE 'Migrating table: %', t;

            -- Add user_id column
            EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id)', t);

            -- Enable RLS
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        ELSE
            RAISE NOTICE 'Skipping missing table: %', t;
        END IF;
    END LOOP;
END $$;
