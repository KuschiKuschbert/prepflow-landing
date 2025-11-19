-- Menu Lock Migration
-- Adds menu lock functionality to menus table

-- Add menu lock fields to menus table
ALTER TABLE menus
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS locked_by UUID DEFAULT NULL;

-- Create index for locked menus query
CREATE INDEX IF NOT EXISTS idx_menus_is_locked ON menus(is_locked) WHERE is_locked = TRUE;

