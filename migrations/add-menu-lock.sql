-- Menu Lock Migration
-- Adds menu lock functionality to menus table

-- Add menu lock fields to menus table
ALTER TABLE menus
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS locked_by VARCHAR(255) DEFAULT NULL; -- Store email address, not UUID

-- If locked_by was previously created as UUID, alter it to VARCHAR
DO $$
BEGIN
  -- Check if column exists and is UUID type, then alter it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'menus' 
    AND column_name = 'locked_by' 
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE menus ALTER COLUMN locked_by TYPE VARCHAR(255) USING NULL;
  END IF;
END $$;

-- Create index for locked menus query
CREATE INDEX IF NOT EXISTS idx_menus_is_locked ON menus(is_locked) WHERE is_locked = TRUE;

