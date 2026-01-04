-- Migration: Add Soft Delete capabilities
-- This script adds 'deleted_at' columns to menu-related tables to support robust 2-way sync.

-- 1. Add deleted_at to pos_menu_items
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pos_menu_items' AND column_name = 'deleted_at') THEN
        ALTER TABLE pos_menu_items ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
END $$;

-- 2. Add deleted_at to pos_modifier_options
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pos_modifier_options' AND column_name = 'deleted_at') THEN
        ALTER TABLE pos_modifier_options ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
END $$;

-- 3. (Optional) Create index on deleted_at for faster filtering
CREATE INDEX IF NOT EXISTS idx_pos_menu_items_deleted_at ON pos_menu_items (deleted_at);
CREATE INDEX IF NOT EXISTS idx_pos_modifier_options_deleted_at ON pos_modifier_options (deleted_at);

-- 4. Comment
COMMENT ON COLUMN pos_menu_items.deleted_at IS 'Timestamp when the item was soft-deleted. NULL means active.';
COMMENT ON COLUMN pos_modifier_options.deleted_at IS 'Timestamp when the modifier was soft-deleted. NULL means active.';
