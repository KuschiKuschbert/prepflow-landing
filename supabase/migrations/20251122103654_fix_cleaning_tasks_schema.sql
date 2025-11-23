-- Migration: Fix Cleaning Tasks Schema
-- Adds missing description column and ensures foreign key relationship exists
-- Date: 2025-11-22

-- Ensure cleaning_areas table exists with correct structure
CREATE TABLE IF NOT EXISTS cleaning_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_name VARCHAR(255) NOT NULL,
  description TEXT,
  cleaning_frequency VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure cleaning_tasks table exists (create if it doesn't)
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID,
  assigned_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to cleaning_tasks table
DO $$ 
BEGIN
    -- Add task_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'task_name') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN task_name VARCHAR(255);
    END IF;

    -- Add frequency_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'frequency_type') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN frequency_type VARCHAR(50);
    END IF;

    -- Add description column (THIS IS MISSING!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'description') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN description TEXT;
    END IF;

    -- Add equipment_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'equipment_id') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN equipment_id UUID;
        -- Add foreign key if temperature_equipment table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'temperature_equipment') THEN
            ALTER TABLE cleaning_tasks ADD CONSTRAINT cleaning_tasks_equipment_id_fkey 
                FOREIGN KEY (equipment_id) REFERENCES temperature_equipment(id) ON DELETE SET NULL;
        END IF;
    END IF;

    -- Add section_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'section_id') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN section_id UUID;
        -- Add foreign key if kitchen_sections table exists
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

-- Ensure foreign key relationship exists between cleaning_tasks and cleaning_areas
DO $$
BEGIN
    -- Check if foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'cleaning_tasks_area_id_fkey' 
        AND table_name = 'cleaning_tasks'
    ) THEN
        -- Add foreign key constraint
        ALTER TABLE cleaning_tasks 
        ADD CONSTRAINT cleaning_tasks_area_id_fkey 
        FOREIGN KEY (area_id) REFERENCES cleaning_areas(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create cleaning_task_completions table if it doesn't exist
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
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_area_id ON cleaning_tasks(area_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_frequency_type ON cleaning_tasks(frequency_type);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_equipment_id ON cleaning_tasks(equipment_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_section_id ON cleaning_tasks(section_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_standard_task ON cleaning_tasks(is_standard_task, standard_task_type);

-- Add comments for documentation
COMMENT ON COLUMN cleaning_tasks.task_name IS 'Name of the cleaning task';
COMMENT ON COLUMN cleaning_tasks.frequency_type IS 'Frequency: daily, bi-daily, weekly, monthly, 3-monthly, monday-sunday, every-X-days';
COMMENT ON COLUMN cleaning_tasks.description IS 'Optional description of the cleaning task';
COMMENT ON COLUMN cleaning_tasks.equipment_id IS 'Optional link to temperature equipment';
COMMENT ON COLUMN cleaning_tasks.section_id IS 'Optional link to kitchen section';
COMMENT ON COLUMN cleaning_tasks.is_standard_task IS 'Whether this is a pre-populated standard task';
COMMENT ON COLUMN cleaning_tasks.standard_task_type IS 'Type of standard task: floor, fridge_seals, oven, bench, grill, flat_top, cooker, equipment, section';
COMMENT ON TABLE cleaning_task_completions IS 'Tracks completion of cleaning tasks for specific dates';

-- Migration: Fix Cleaning Tasks Schema
-- Adds missing description column and ensures foreign key relationship exists
-- Date: 2025-11-22

-- Ensure cleaning_areas table exists with correct structure
CREATE TABLE IF NOT EXISTS cleaning_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_name VARCHAR(255) NOT NULL,
  description TEXT,
  cleaning_frequency VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure cleaning_tasks table exists (create if it doesn't)
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID,
  assigned_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to cleaning_tasks table
DO $$ 
BEGIN
    -- Add task_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'task_name') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN task_name VARCHAR(255);
    END IF;

    -- Add frequency_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'frequency_type') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN frequency_type VARCHAR(50);
    END IF;

    -- Add description column (THIS IS MISSING!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'description') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN description TEXT;
    END IF;

    -- Add equipment_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'equipment_id') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN equipment_id UUID;
        -- Add foreign key if temperature_equipment table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'temperature_equipment') THEN
            ALTER TABLE cleaning_tasks ADD CONSTRAINT cleaning_tasks_equipment_id_fkey 
                FOREIGN KEY (equipment_id) REFERENCES temperature_equipment(id) ON DELETE SET NULL;
        END IF;
    END IF;

    -- Add section_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_tasks' AND column_name = 'section_id') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN section_id UUID;
        -- Add foreign key if kitchen_sections table exists
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

-- Ensure foreign key relationship exists between cleaning_tasks and cleaning_areas
DO $$
BEGIN
    -- Check if foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'cleaning_tasks_area_id_fkey' 
        AND table_name = 'cleaning_tasks'
    ) THEN
        -- Add foreign key constraint
        ALTER TABLE cleaning_tasks 
        ADD CONSTRAINT cleaning_tasks_area_id_fkey 
        FOREIGN KEY (area_id) REFERENCES cleaning_areas(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create cleaning_task_completions table if it doesn't exist
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
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_area_id ON cleaning_tasks(area_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_frequency_type ON cleaning_tasks(frequency_type);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_equipment_id ON cleaning_tasks(equipment_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_section_id ON cleaning_tasks(section_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_standard_task ON cleaning_tasks(is_standard_task, standard_task_type);

-- Add comments for documentation
COMMENT ON COLUMN cleaning_tasks.task_name IS 'Name of the cleaning task';
COMMENT ON COLUMN cleaning_tasks.frequency_type IS 'Frequency: daily, bi-daily, weekly, monthly, 3-monthly, monday-sunday, every-X-days';
COMMENT ON COLUMN cleaning_tasks.description IS 'Optional description of the cleaning task';
COMMENT ON COLUMN cleaning_tasks.equipment_id IS 'Optional link to temperature equipment';
COMMENT ON COLUMN cleaning_tasks.section_id IS 'Optional link to kitchen section';
COMMENT ON COLUMN cleaning_tasks.is_standard_task IS 'Whether this is a pre-populated standard task';
COMMENT ON COLUMN cleaning_tasks.standard_task_type IS 'Type of standard task: floor, fridge_seals, oven, bench, grill, flat_top, cooker, equipment, section';
COMMENT ON TABLE cleaning_task_completions IS 'Tracks completion of cleaning tasks for specific dates';

