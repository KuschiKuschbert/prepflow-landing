-- Migration: Add Cleaning Grid System
-- Adds new columns to cleaning_tasks and creates cleaning_task_completions table
-- Date: 2025-01-XX

-- Add new columns to cleaning_tasks table
DO $$ 
BEGIN
    -- Add task_name if it doesn't exist (it might already exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'task_name') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN task_name VARCHAR(255);
        -- Backfill task_name from area if it exists
        UPDATE cleaning_tasks ct
        SET task_name = ca.area_name
        FROM cleaning_areas ca
        WHERE ct.area_id = ca.id AND ct.task_name IS NULL;
    END IF;

    -- Add frequency_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'frequency_type') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN frequency_type VARCHAR(50);
        -- Migrate existing frequency to frequency_type
        UPDATE cleaning_tasks 
        SET frequency_type = LOWER(REPLACE(frequency, ' ', '_'))
        WHERE frequency IS NOT NULL AND frequency_type IS NULL;
    END IF;

    -- Add equipment_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'equipment_id') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE SET NULL;
    END IF;

    -- Add section_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'section_id') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN section_id UUID;
        -- Add foreign key constraint if kitchen_sections table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'kitchen_sections') THEN
            ALTER TABLE cleaning_tasks ADD CONSTRAINT cleaning_tasks_section_id_fkey 
                FOREIGN KEY (section_id) REFERENCES kitchen_sections(id) ON DELETE SET NULL;
        END IF;
    END IF;

    -- Add is_standard_task column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'is_standard_task') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN is_standard_task BOOLEAN DEFAULT false;
    END IF;

    -- Add standard_task_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'standard_task_type') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN standard_task_type VARCHAR(50);
    END IF;

    -- Make assigned_date nullable (tasks repeat automatically)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'cleaning_tasks' AND column_name = 'assigned_date' 
               AND is_nullable = 'NO') THEN
        ALTER TABLE cleaning_tasks ALTER COLUMN assigned_date DROP NOT NULL;
    END IF;
END $$;

-- Create cleaning_task_completions table
CREATE TABLE IF NOT EXISTS cleaning_task_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES cleaning_tasks(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, completion_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cleaning_task_completions_task_id ON cleaning_task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_task_completions_completion_date ON cleaning_task_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_cleaning_task_completions_task_date ON cleaning_task_completions(task_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_frequency_type ON cleaning_tasks(frequency_type);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_equipment_id ON cleaning_tasks(equipment_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_section_id ON cleaning_tasks(section_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_standard_task ON cleaning_tasks(is_standard_task, standard_task_type);

-- Add comments for documentation
COMMENT ON COLUMN cleaning_tasks.task_name IS 'Name of the cleaning task';
COMMENT ON COLUMN cleaning_tasks.frequency_type IS 'Frequency: daily, bi-daily, weekly, monthly, 3-monthly';
COMMENT ON COLUMN cleaning_tasks.equipment_id IS 'Optional link to temperature equipment';
COMMENT ON COLUMN cleaning_tasks.section_id IS 'Optional link to kitchen section';
COMMENT ON COLUMN cleaning_tasks.is_standard_task IS 'Whether this is a pre-populated standard task';
COMMENT ON COLUMN cleaning_tasks.standard_task_type IS 'Type of standard task: floor, fridge_seals, oven, bench, grill, flat_top, cooker, equipment, section';
COMMENT ON TABLE cleaning_task_completions IS 'Tracks completion of cleaning tasks for specific dates';




